import React, { Component } from 'react';
import { observer } from 'mobx-react';

import SigmaComponent from '../Components/SigmaComponent';

import {Card, CardActions, CardMedia, CardTitle } from 'material-ui/Card';

import RaisedButton from 'material-ui/RaisedButton';
import ActionFullscreen from 'material-ui/svg-icons/navigation/fullscreen';

@observer
export default class ParasolCard extends Component {

  constructor(props) {
    super(props);
    this.showFullscreen = this.showFullscreen.bind(this);
  }

  showFullscreen() {
    this.props.appState.showFullscreen();
  }

  render() {

    const appState = this.props.appState;
    const network = appState.networks[appState.selectedNetworkIndex];

    if(!network)
      return null;

    let subtitle = '';
    if(network.has('graph')) {
      subtitle = "nodes: " + network.get('graph').nodes.length
                      + " - " +
                      "edges: " + network.get('graph').edges.length;
    } else if(network.has('status') && network.get('status') != 'complete') {
      subtitle = network.get('status');
    }

    let cardActions = null;
    if(appState.ui.cardActions &&
      appState.ui.cardActions.length > 0) {
      cardActions = (<CardActions>
        {appState.ui.cardActions.map( (action, index) => {
          switch(action.type) {
            case 'fullscreen':
              return (<RaisedButton
                key={'action' + index}
                label="Fullscreen"
                icon={<ActionFullscreen />}
                onClick={this.showFullscreen}
              />);
            case 'link':
              return (<RaisedButton
                key={'action' + index}
                label={action.label}
                href={action.href}
              />);
            default:
              return null;
          }
        })}
      </CardActions>);
    }

    return (<div>
      <Card>
        <CardMedia
          style={{height: 200}}
          overlay={
            <CardTitle
              title={network.get('name')}
              subtitle={subtitle}
            />
          }
        >
          <SigmaComponent appState={appState}/>
        </CardMedia>
        {cardActions}
      </Card>
    </div>);
  }
}
