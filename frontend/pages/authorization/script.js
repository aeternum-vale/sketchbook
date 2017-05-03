"use strict";

import './style.less';

let joinPropsCheck = {
  'username': {
    re: {
      value: /^[A-Z0-9_-]+$/i,
      msg: 'must only contain alphanumeric symbols'
    },
    min: 4,
    max: 30
  },

  'email': {
    name: 'e-mail',
    re: {
      value: /^(\w+[-\.]??)+@[\w.-]+\w\.\w{2,5}$/i,
      msg: 'incorrect e-mail'
    },
    min: 6,
    max: 100
  },

  'password': {
    re: {
      value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
      msg: 'your password is too weak'
    },
    min: 6,
    max: 32
  },

  'password-again': {
    name: "this",
    extra: true
  }
};

let loginRef = document.getElementById('login-ref');
let joinRef = document.getElementById('join-ref');
let joinForm = document.forms.join;
let loginForm = document.forms.login;
let content = document.getElementsByClassName("window__content")[0];
let auth = document.getElementsByClassName("authorization")[0];

let getJoinErrorTextBox = fieldName =>
  joinForm[fieldName].parentElement.querySelector('.textbox__error');

function setJoin() {
  for (let key in joinPropsCheck)
    getJoinErrorTextBox(key).textContent = '';

  loginForm.closest('.window').classList.add('window_invisible');
  joinForm.closest('.window').classList.remove('window_invisible');
}

function setLogin() {
  joinForm.closest('.window').classList.add('window_invisible');
  loginForm.closest('.window').classList.remove('window_invisible');
}

window.onpopstate = function(e) {
  //console.log("location: " + location.href + ", state: " + JSON.stringify(event.state));
  if (e.state)
    if (e.state.type === 'join')
      setJoin();
    else
      setLogin();
};

loginRef.onclick = function(e) {
  e.preventDefault();
  history.pushState({
    type: 'login'
  }, "login", "?login");
  setLogin();
}

joinRef.onclick = function(e) {
  e.preventDefault();
  history.pushState({
    type: 'join'
  }, "join", "?join");
  setJoin();
}

loginForm.onsubmit = function(e) {
  e.preventDefault();
}


joinForm.onsubmit = function(e) {



  e.preventDefault();

  let err = false;
  let body = '';

  for (let key in joinPropsCheck) {
    let errorTextBox = getJoinErrorTextBox(key);
    let fieldValue = joinForm[key].value;
    let fieldCaption = joinPropsCheck[key].name || key;

    errorTextBox.textContent = '';

    if (fieldValue.length === 0) {
      errorTextBox.textContent = `${fieldCaption} field can't be empty`;
      err = true;
    } else
    if (joinPropsCheck[key].min && fieldValue.length < joinPropsCheck[key].min) {
      errorTextBox.textContent =
        `${fieldCaption} must be greater than ${joinPropsCheck[key].min - 1} symbols`;
      err = true;
    } else
    if (joinPropsCheck[key].max && fieldValue.length > joinPropsCheck[key].max) {
      errorTextBox.textContent =
        `${fieldCaption} must be lower than ${joinPropsCheck[key].max + 1} symbols`;
      err = true;
    } else
    if (joinPropsCheck[key].re && !joinPropsCheck[key].re.value.test(fieldValue)) {
      errorTextBox.textContent = joinPropsCheck[key].re.msg;
      err = true;
    }

    if (!joinPropsCheck[key].extra)
      body += (body === '' ? '' : '&') + key + '=' + fieldValue;
  }

  if (joinForm['password'].value !== joinForm['password-again'].value) {
    getJoinErrorTextBox('password-again').textContent = "passwords don't match";
    err = true;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", '/join', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

  xhr.onreadystatechange = function() {
    if (this.readyState != 4) return;
    // по окончании запроса доступны:
    // status, statusText
    // responseText, responseXML (при content-type: text/xml)
    if (this.status != 200) {
      alert('ошибка: ' + (this.status ? this.statusText :
        'запрос не удался'));
      return;
    }

    let response = JSON.parse(this.responseText);
    if (response.success)
      window.location = response.url;

  };

  if (!err)
    xhr.send(body);
};


auth.addEventListener('focus', function(e) {
  if (e.target.classList && e.target.classList.contains('textbox__field')) {
    let tb = e.target.closest('.textbox');
    if (tb)
      tb.classList.add('textbox_focus');
  }
}, true);

auth.addEventListener('blur', function(e) {
  if (e.target.classList && e.target.classList.contains('textbox__field')) {
    let tb = e.target.closest('.textbox');
    if (tb)
      tb.classList.remove('textbox_focus');
  }
}, true);

if ((history.state && history.state.type === 'join') || window.location.search === '?join') {
  history.pushState({
    type: 'join'
  }, "join", "?join");
  setJoin();
} else
  history.replaceState({
    type: 'login'
  }, "login", "?login");