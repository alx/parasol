import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

import ToggleIcon from './LeftDrawer/ToggleIcon';
import ParasolAppBar from './LeftDrawer/ParasolAppBar';
import NetworkInput from './LeftDrawer/NetworkInput';
import NetworkList from './LeftDrawer/NetworkList';
import ForceLinkSettings from './LeftDrawer/ForceLinkSettings';
import FilterSettings from './LeftDrawer/FilterSettings';
import Legend from './LeftDrawer/Legend';

import Upload from 'material-ui-upload/Upload';
import FlatButton from 'material-ui/FlatButton';

import { DeepDetect } from 'deepdetect-js';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

@observer
export default class LeftDrawer extends Component {

  constructor(props) {
    super(props)

    this._push = this._push.bind(this);
  }

  _push() {
    const deepdetect = new DeepDetect('http://localhost:8080/');
    deepdetect.services.create({
      name: 'test',
      data: {
        mllib:"caffe",
        description:"example classification service",
        type:"supervised",
        parameters:{
          input:{
            connector:"csv"
          },
          mllib:{
            template:"mlp",
            nclasses:9,
            layers:[512,512,512],
            activation:"prelu"
          }
        },
        model:{
          repository:"/home/me/models/example"
        }
      }
    }).then(function (response) {

      deepdetect.train.launch({
        service:"test",
        async:false,
        parameters:{
          input:{
            id:"",
            separator:",",
            label:"label"
          },
          mllib:{
            iterations:500
          },
          output:{}
        },
        data:["/home/beniz/projects/deepdetect/datasets/mnist_csv/mnist_test.csv"]
      }).then(function (response) {
      });

    });
  }

  render() {

    const appState = this.props.appState;

    return (
      <div>

        <ToggleIcon appState={appState} />

        <Drawer open={appState.ui.leftDrawer}>

          <ParasolAppBar appState={appState} />

          <Upload onFileLoad={this.onFileLoad}/>

      <FlatButton
        label="push"
        onTouchTap={this._push}
      />

          <NetworkInput appState={appState} />
          <NetworkList appState={appState} />

          <Divider/>

          <ForceLinkSettings appState={appState} />

          <Divider/>

          <Legend network={appState.selectedNetwork} colors={appState.ui.colors.nodes} />

        </Drawer>
      </div>
    );
  }
};
