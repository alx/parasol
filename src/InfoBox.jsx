import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Drawer from 'material-ui/Drawer';

@observer
export default class SigmaComponent extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    return (
      <Drawer open={false} >
        <p>InfoBox</p>
      </Drawer>
    );
  }
};
