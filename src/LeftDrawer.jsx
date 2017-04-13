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

  }

  _push() {

    const deepdetect = new DeepDetect('http://91.224.148.180:18083');

    const service_name = 'parasol-test';

    const service_params = {
      name: service_name,
      data: {
        mllib:"tsne",
        description:"clustering",
        type:"unsupervised",
        parameters:{
          input:{connector:"csv"},
          mllib:{},
          output:{}
        },
        model:{
          repository:"/tmp"
        }
      }
    };

    const train_params = {
      'async':true,
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
      data:["http://deepdetect.com/dd/datasets/mnist_csv/mnist_test.csv"]
    };

    deepdetect.services.create(service_params).then(function (response) {

      deepdetect.train.launch(service_name, train_params).then(function (response) {

        deepdetect.services.delete(service_params);
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
