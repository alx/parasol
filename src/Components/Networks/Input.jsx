import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import AddIcon from 'material-ui/svg-icons/content/add';

import axios from 'axios';

export default class NetworkControls extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      dialogOpen: false,
      loadingStatus: false,
      networks: []
    }

    this._openInputDialog = this._openInputDialog.bind(this);
    this._closeInputDialog = this._closeInputDialog.bind(this);
    this._addSelectedNetworks = this._addSelectedNetworks.bind(this);
    this._onRowSelection = this._onRowSelection.bind(this);
  }

  _addSelectedNetworks() {

    const self = this;

    this.setState({loadingStatus: true, dialogOpen: false});

    this.state.networks.filter(network => network.selected).forEach(network => {

      this.props.appState.initNetwork(network, () => {
        self.setState({dialogOpen: false, loadingStatus: false});
      });

    });

  }

  _onRowSelection(rowIndexes) {

    switch(rowIndexes) {
      case 'all':
        this.setState({
          networks: this.state.networks.map( network => {
            return Object.assign(network, {selected: true});
          })
        })
        break;
      case 'none':
        this.setState({
          networks: this.state.networks.map( network => {
            return Object.assign(network, {selected: false});
          })
        })
        break;
      default:
        this.setState({
          networks: this.state.networks.map( (network, index) => {
            return Object.assign(network, {selected: (rowIndexes.indexOf(index) != -1)});
          })
        });
    }

  }

  _openInputDialog() {

    const self = this;

    axios.get(this.props.appState.network_loader.path)
      .then(function (response) {
        console.log(response.data);
        self.setState({networks: response.data, dialogOpen: true});
      });

  }

  _closeInputDialog() {
    this.setState({dialogOpen: false});
  }

  render() {

    const loader = this.props.appState.network_loader;

    if(loader.path.length == 0)
      return null;

    return (<div>
      <FlatButton
        label={loader.name ? loader.name : 'Add Network'}
        primary={true}
        icon={<AddIcon />}
        fullWidth={true}
        onClick={this._openInputDialog}
      />
      <Dialog
        title={loader.name}
        modal={false}
        open={this.state.dialogOpen}
        onRequestClose={this._closeInputDialog}
      >
        <Table
          height={'300px'}
          selectable={true}
          multiSelectable={true}
          onRowSelection={this._onRowSelection}
        >
          <TableHeader
            displaySelectAll={true}
            adjustForCheckbox={true}
            enableSelectAll={true}
          >
            <TableRow>
              <TableHeaderColumn tooltip="Graph name">Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="File URL">Url</TableHeaderColumn>
              <TableHeaderColumn tooltip="Loading method">Loader</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={true}
            showRowHover={true}
            stripedRows={false}
          >
          {this.state.networks.map( (network, index) => {
            return (<TableRow key={index} selected={network.selected}>
              <TableRowColumn>{network.name}</TableRowColumn>
              <TableRowColumn>{network.url}</TableRowColumn>
              <TableRowColumn>{network.options.loader.name}</TableRowColumn>
            </TableRow>);
          })}
          </TableBody>
        </Table>
        <FloatingActionButton onClick={this._addSelectedNetworks}>
          <AddIcon />
        </FloatingActionButton>
      </Dialog>
    </div>)

  }

}
