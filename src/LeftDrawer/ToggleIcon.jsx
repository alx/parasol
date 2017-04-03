import React from 'react';

import IconButton from 'material-ui/IconButton';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import { typography } from 'material-ui/styles';
import { cyan500 } from 'material-ui/styles/colors';

export default class ToggleIcon extends React.Component {

  constructor(props) {
    super(props)
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer() {
    this.props.appState.toggleLeftDrawer();
  }

  render() {

    const styles = {
      drawerToggle: {
        position: 'absolute',
        top: 10,
        width: 40,
        height: 40,
        padding: 5,
        marginTop: 4,
      },
      drawerToggleIcon: {
        color: typography.textFullWhite,
        background:  cyan500,
      }
    }

    return <IconButton
        onTouchTap={this.toggleDrawer}
        style={styles.drawerToggle}
        iconStyle={styles.drawerToggleIcon}
    >
      <ChevronRight/>
    </IconButton>

  }

}
