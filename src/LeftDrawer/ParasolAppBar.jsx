import React from 'react';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import Subheader from 'material-ui/Subheader';

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
        marginLeft: 50,
      },
      title: {
        fontSize: 24,
        color: typography.textFullWhite,
        fontWeight: typography.fontWeightLight,
      },
      subtitle: {
        WebkitMarginBefore: '0.67em',
        color: '#e9e9e9',
      },
      githubLink: {
        color: '#e9e9e9',
        textDecoration: 'none',
        fontSize: 12,
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

    const githubText = __COMMIT_HASH__ || 'github';
    const githubLink = githubText == 'github' ? 'https://github.com/alx/parasol' : 'https://github.com/alx/parasol/tree/' + githubText;

    return <AppBar
      titleStyle={styles.logoTitle}
      iconElementLeft={<IconButton
        onTouchTap={this.toggleDrawer}
        style={styles.drawerToggle}
      >
        <ChevronLeft
          color={typography.textFullWhite}
          style={styles.drawerToggleIcon}
        />
      </IconButton>}
    >
      <h1 style={styles.title}>Parasol</h1>
      <Subheader style={styles.subtitle}>
        - <a style={styles.githubLink} href={githubLink} target='_blank' rel='noopener noreferrer'>{githubText}</a>
      </Subheader>
    </AppBar>

  }

}
