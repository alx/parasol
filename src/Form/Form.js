import React, { Component } from 'react';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import formState from './formState';

@observer
export default class Form extends Component {

  render() {

    return (
      <div>
        <form>
          <TextField {...formState.$('email').bind()} />
          <TextField {...formState.$('emailConfirm').bind()} />
          <button type="submit" onClick={formState.onSubmit} disabled={!formState.isValid}>Submit</button>
        </form>
      </div>
    );
  }
};
