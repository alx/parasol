import React from 'react';

import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import AddIcon from 'material-ui/svg-icons/content/add';
import RoundIcon from 'material-ui/svg-icons/image/brightness-1';

import Upload from 'material-ui-upload/Upload';

export default class NetworkInput extends React.Component {

  onFileLoad = (e) => console.log(e.target.result);

  constructor(props) {
    super(props)

    this.state = {
      dialogOpen: false,
      selectedInputIndex: 0
    }

    this.createNetwork = this.createNetwork.bind(this);
    this._openInputDialog = this._openInputDialog.bind(this);
    this._closeInputDialog = this._closeInputDialog.bind(this);
    this._selectInputIndex = this._selectInputIndex.bind(this);
  }

  _selectInputIndex(index) {
    this.setState({selectedInputIndex: index});
  }

  createNetwork(e) {
    if (e.keyCode==13){
      this.props.appState.createNetwork({url: e.target.value});
      e.target.value = "";
    }
  }

  _openInputDialog() {
    this.setState({dialogOpen: true});
  }

  _closeInputDialog() {
    this.setState({dialogOpen: false});
  }

  render() {

    let inputForm = (<div>
      <TextField
        hintText="JSON url"
        floatingLabelText="Add network"
        floatingLabelFixed={true}
        onKeyDown={this.createNetwork}
      />
      <RaisedButton primary={true} label="Add JSON url"/>
    </div>)

    if(this.state.selectedInputIndex == 1) {

      inputForm = (<div>
        <Upload onFileLoad={this.onFileLoad}/>
      </div>);

    }

    return (<div>
      <FlatButton
        label="Add Network"
        primary={true}
        icon={<AddIcon />}
        fullWidth={true}
        onTouchTap={this._openInputDialog}
      />
      <Dialog
        title="Add new network"
        modal={false}
        open={this.state.dialogOpen}
        onRequestClose={this._closeInputDialog}
      >

        { inputForm }

        <BottomNavigation selectedIndex={this.state.selectedInputIndex}>
          <BottomNavigationItem
            label="JSON Url"
            icon={<RoundIcon />}
            onTouchTap={() => this._selectInputIndex(0)}
          />
          <BottomNavigationItem
            label="DeepDetect T-SNE"
            icon={<RoundIcon />}
            onTouchTap={() => this._selectInputIndex(1)}
          />
        </BottomNavigation>

      </Dialog>
    </div>)

  }

}
