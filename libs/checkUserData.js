let props = {
  'username': {
    re: {
      value: /^[A-Z0-9-]+$/i,
      message: 'must only contain alphanumeric symbols'
    },
    min: 4,
    max: 30
  },

  'email': {
    name: 'e-mail',
    re: {
      value: /^(\w+[-\.]??)+@[\w.-]+\w\.\w{2,5}$/i,
      message: 'incorrect e-mail'
    },
    min: 6,
    max: 100
  },

  'password': {
    re: {
      value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
      message: 'password is too weak'
    },
    min: 6,
    max: 32
  },

  'password-again': {
    name: 'this'
  }
};


function checkUserData(values) {

  let getErrorObject = (property, message) => {
    return {
      property,
      message
    };
  };

  let result = {
    success: false,
    errors: []
  };

  for (let key in values) {

    let propValue = values[key];
    let fieldCaption = props[key].name || key;

    if (propValue.length === 0) {
      result.errors.push(getErrorObject(key, `${fieldCaption} field can't be empty`));
      continue;
    }

    if (props[key].min && propValue.length < props[key].min) {
      result.errors.push(getErrorObject(key, `${fieldCaption} must be greater than ${props[key].min - 1} symbols`));
      continue;
    }

    if (props[key].max && propValue.length > props[key].max) {
      result.errors.push(getErrorObject(key, `${fieldCaption} must be lower than ${props[key].max + 1} symbols`));
      continue;
    }

    if (props[key].re && !props[key].re.value.test(propValue))
      result.errors.push(getErrorObject(key, props[key].re.message));

  }

  if (values['password-again'] && !result.errors['password-again'] && values['password'] !== values['password-again'])
    result.errors.push(getErrorObject('password-again', "passwords don't match"));

  if (result.errors.length)
    return result;
  else
    return {
      success: true
    };

}
module.exports = checkUserData;