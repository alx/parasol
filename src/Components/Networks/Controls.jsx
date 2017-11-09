import React from 'react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import IconAdd from 'material-ui/svg-icons/content/add';
import IconSave from 'material-ui/svg-icons/content/save';
import IconPeople from 'material-ui/svg-icons/social/people';

import CircularProgress from 'material-ui/CircularProgress';

import axios from 'axios';

export default class NetworkControls extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      addNetworkDialogOpen: false,
      saveConfigurationDialogOpen: false,
      socialDialogOpen: false,
      submittingConfiguration: false,
      loadingStatus: false,
      networks: [],
      authors: [],
      followers: [],
    }

    this._openAddNetworkDialog = this._openAddNetworkDialog.bind(this);
    this._closeAddNetworkDialog = this._closeAddNetworkDialog.bind(this);

    this._openSaveConfigurationDialog = this._openSaveConfigurationDialog.bind(this);
    this._closeSaveConfigurationDialog = this._closeSaveConfigurationDialog.bind(this);

    this._openSocialDialog = this._openSocialDialog.bind(this);
    this._closeSocialDialog = this._closeSocialDialog.bind(this);

    this._followUser = this._followUser.bind(this);
    this._unfollowUser = this._unfollowUser.bind(this);

    this._addSelectedNetworks = this._addSelectedNetworks.bind(this);
    this._saveConfiguration = this._saveConfiguration.bind(this);

    this._onRowNetworkSelection = this._onRowNetworkSelection.bind(this);
    this._onRowShareSelection = this._onRowShareSelection.bind(this);

    axios.get('/users.json').then(json => {
      this.setState({
        authors: Object.assign(json.data.doctor, {selected: false}),
        followers: Object.assign(json.data.patients, {selected: false}),
      });
    });
  }

  _addSelectedNetworks() {

    const self = this;

    this.setState({loadingStatus: true, addNetworkDialogOpen: false});

    this.state.networks.filter(network => network.selected).forEach(network => {

      this.props.appState.initNetwork(network, () => {
        self.setState({addNetworkDialogOpen: false, loadingStatus: false});
      });

    });

  }

  _saveConfiguration() {
    this.setState({submittingConfiguration: true});
    axios.post('/graphs', {
      graph: {
        name: this.titleInput.getValue(),
        comment: this.commentInput.getValue(),
        graph_tojson: JSON.stringify({
          appState: {
            graph: this.props.appState.graph,
            ui: this.props.appState.ui,
          }
        })
      },
      authenticity_token: document.querySelector('meta[name="csrf-token"]').content
    }).then((response) => {
      this.props.appState.loadSubgraphs();
      this.setState({
        submittingConfiguration: false,
        saveConfigurationDialogOpen: false,
      });
    });
  }

  _onRowNetworkSelection(rowIndexes) {

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
  _onRowShareSelection(rowIndexes) {

    switch(rowIndexes) {
      case 'all':
        this.setState({
          authors: this.state.authors.map( author => {
            return Object.assign(author, {selected: true});
          })
        })
        break;
      case 'none':
        this.setState({
          authors: this.state.authors.map( author => {
            return Object.assign(author, {selected: false});
          })
        })
        break;
      default:
        this.setState({
          authors: this.state.authors.map( (author, index) => {
            return Object.assign(author, {selected: (rowIndexes.indexOf(index) != -1)});
          })
        });
    }

  }

  _followUser(userId) {
    axios.get(`/users/${userId}/follow`);
  }

  _unfollowUser(userId) {
    axios.delete(`/users/${userId}/follow`);
  }

  _openAddNetworkDialog() {

    const self = this;

    axios.get(this.props.appState.network_loader.path)
      .then(function (response) {
        console.log(response.data);
        self.setState({networks: response.data, addNetworkDialogOpen: true});
      });

  }

  _closeAddNetworkDialog() {
    this.setState({addNetworkDialogOpen: false});
  }

  _openSaveConfigurationDialog() {
    this.setState({saveConfigurationDialogOpen: true});
  }

  _closeSaveConfigurationDialog() {
    this.setState({saveConfigurationDialogOpen: false});
  }

  _openSocialDialog() {
    this.setState({socialDialogOpen: true});
  }

  _closeSocialDialog() {
    this.setState({socialDialogOpen: false});
  }

  render() {

    const loader = this.props.appState.network_loader;

    /*
        // Sharing table for saveConfigurationDialog
        <br />
        <p>Partager avec:</p>
        <Table
          selectable={true}
          multiSelectable={true}
          onRowSelection={this._onRowShareSelection}
        >
          <TableHeader
            displaySelectAll={true}
            adjustForCheckbox={true}
            enableSelectAll={true}
          >
            <TableRow>
              <TableHeaderColumn tooltip="Nom du médecin">Médecin</TableHeaderColumn>
              <TableHeaderColumn>Email</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={true}
            showRowHover={true}
            stripedRows={false}
          >
          {this.state.authors.map( (author, index) => {
            return (<TableRow key={index} selected={author.selected}>
              <TableRowColumn>{author.user.username}</TableRowColumn>
              <TableRowColumn>{author.user.email}</TableRowColumn>
            </TableRow>);
          })}
          </TableBody>
        </Table>
    */

    if(loader.path.length == 0)
      return null;

    let buttons = [];

    // buttons.push(<FloatingActionButton
    //   key='NetworkControlsAddNetwork'
    //   mini={true}
    //   onTouchTap={this._openAddNetworkDialog}
    //   style={{margin: 5}}
    // >
    //   <IconAdd />
    // </FloatingActionButton>);

    buttons.push(<FloatingActionButton
      key='NetworkControlsSave'
      mini={true}
      onTouchTap={this._openSaveConfigurationDialog}
      style={{margin: 5}}
    >
      <IconSave />
    </FloatingActionButton>);

    buttons.push(<FloatingActionButton
      key='NetworkControlsSocial'
      mini={true}
      secondary={true}
      onTouchTap={this._openSocialDialog}
      style={{margin: 5}}
    >
      <IconPeople />
    </FloatingActionButton>);

    return (<div>
      {buttons}
      <Dialog
        title="Réseau social"
        modal={false}
        open={this.state.socialDialogOpen}
        onRequestClose={this._closeSocialDialog}
        autoScrollBodyContent={true}
        actions={<FlatButton
          onTouchTap={this._closeSocialDialog}
          label="Fermer"
          primary={true}
        />}
      >
        <h3>Médecins</h3>
        <ul>
          {this.state.authors.map( (author, index) => {
            return (<li key={`author-${index}`}>
              {author.user.email}
              <RaisedButton
                label="Follow"
                onClick={this._followUser.bind(this, author.user.id)}
              />
            </li>);
          })}
        </ul>
        <h3>Patients et médecins qui me suivent</h3>
        <ul>
          {this.state.followers.map( (follower, index) => {
            return (<li key={`follower-${index}`}>
              {follower.user.email}
              <RaisedButton
                label="Follow"
                onClick={this._followUser.bind(this, follower.user.id)}
              />
            </li>);
          })}
        </ul>
      </Dialog>
      <Dialog
        title="Sauvegarder la configuration"
        modal={false}
        open={this.state.saveConfigurationDialogOpen}
        onRequestClose={this._closeSaveConfigurationDialog}
        autoScrollBodyContent={true}
        actions={<FlatButton
          onTouchTap={this._saveConfiguration}
          label="Sauvegarder"
          primary={true}
          disabled={this.state.submittingConfiguration}
          icon={this.state.submittingConfiguration ? <CircularProgress size={15} thickness={1.5}/> : <IconSave/>}
        />}
      >
        <TextField
          ref={(input) => { this.titleInput = input; }}
          floatingLabelText="Titre"
          fullWidth={true}
        /><br />
        <TextField
          ref={(input) => { this.commentInput = input; }}
          floatingLabelText="Commentaires"
          multiLine={true}
          rows={2}
          fullWidth={true}
        />
      </Dialog>
      <Dialog
        title={loader.name}
        modal={false}
        open={this.state.addNetworkDialogOpen}
        onRequestClose={this._closeAddNetworkDialog}
        autoScrollBodyContent={true}
        actions={<FlatButton
          onTouchTap={this._addSelectedNetworks}
          label="Ajouter"
          primary={true}
          icon={<IconAdd/>}
        />}
      >
        <Table
          height={'300px'}
          selectable={true}
          multiSelectable={true}
          onRowSelection={this._onRowNetworkSelection}
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
      </Dialog>
    </div>)

  }

}
