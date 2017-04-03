import React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
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
      logoTitle: {
        fontSize: 24,
        color: typography.textFullWhite,
        fontWeight: typography.fontWeightLight,
        marginLeft: 50,
      },
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

    return <AppBar
      titleStyle={styles.logoTitle}
      title="Parasol"
      iconElementLeft={<IconButton
        onTouchTap={this.toggleDrawer}
        style={styles.drawerToggle}
      >
        <ChevronLeft
          color={typography.textFullWhite}
          style={styles.drawerToggleIcon}
        />
      </IconButton>}
    />

  }

}
