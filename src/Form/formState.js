import MobxReactForm from 'mobx-react-form';
import { isEmail, shouldBeEqualTo} from './validators';
import bindings from './bindings';

const fields = {
  email: {
    label: 'Email',
    related: ['emailConfirm'],
    bindings: 'MaterialTextField',
  },
  emailConfirm: {
    label: 'Confirm Email',
    validate: [isEmail, shouldBeEqualTo('email')],
    bindings: 'MaterialTextField',
  },
};

class LoginForm extends MobxReactForm {

  bindings() {
    return bindings;
  }

  onSuccess(form) {
    alert('Form is valid! Send the request here.');
    // get field values
    console.log('Form Values!', form.values());
  }

  onError(form) {
    // get all form errors
    console.log('All form errors', form.errors());
    // invalidate the form with a custom error message
    form.invalidate('This is a generic error message!');
  }
}

const form = new LoginForm({ fields });

export default form;
