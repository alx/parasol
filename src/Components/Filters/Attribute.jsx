import React from 'react';
import { observer } from 'mobx-react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

@observer
export default class FilterAttribute extends React.Component {

  constructor(props) {
    super(props)

    this._handleChange = this._handleChange.bind(this);
  }

  _handleChange = (event, index, values) => {
    const appState = this.props.appState;
    appState.setFilterAttribute(this.props.attrKey, values);
  }

  render() {

    const appState = this.props.appState;
    const network = appState.selectedNetwork;
    const filteredValues = appState.ui.filters.attributes.find(attr => {
      return attr.key == this.props.attrKey;
    });

    if(!network || !network.has('graph'))
      return null

    const possibleValues = network.get(this.props.attrKey);
    const valueFormatter = this.props.valueFormatter;

    let menuItems = []
    
    if(possibleValues && possibleValues.length > 0) {
      menuItems = possibleValues.map( (value, index) => (
        <MenuItem
          key={value}
          insetChildren={true}
          checked={filteredValues ? filteredValues.values.indexOf(value) > -1 : false}
          primaryText={valueFormatter ? valueFormatter(value) : value}
          value={value}
        />
      ));
    }

    return (<SelectField
        {...this.props}
        value={filteredValues ? filteredValues.values : []}
        onChange={this._handleChange}
      >
        {menuItems}
    </SelectField>);

  }
}
