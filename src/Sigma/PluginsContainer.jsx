import React from 'react';

class SigmaPluginsContainer extends React.PureComponent {

  constructor(props) {
    super(props);
    if (this.props.sigma) this.props.sigma.refresh();
  }

  componentDidMount() {
    if (this.props.sigma) this.props.sigma.refresh();
  }

  embedProps(elements, extraProps) {
    return React.Children.map(elements, (element) => React.cloneElement(element, extraProps))
  }

  render() {
    return React.createElement(
      'div',
      null,
      this.embedProps(this.props.children, { sigma: this.props.sigma })
    );
  }

}

SigmaPluginsContainer.propTypes = {
  children: require('react').PropTypes.any,
  sigma: require('react').PropTypes.any
};
export default SigmaPluginsContainer;
