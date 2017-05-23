"use strict";

import './style.less';

let checkUserData = require(BASE + 'libs/checkUserData');


let loginRef = document.getElementById('login-ref');
let joinRef = document.getElementById('join-ref');
let joinForm = document.forms.join;
let loginForm = document.forms.login;
let content = document.getElementsByClassName("window__content")[0];
let auth = document.getElementsByClassName("authorization")[0];

let fields = [{
   name: 'username'
}, {
   name: 'email'
}, {
   name: 'password'
}, {
   name: 'password-again',
   extra: true
}];

let getJoinErrorTextBox = fieldName =>
   joinForm[fieldName].parentElement.querySelector('.textbox__error');

function setJoin() {

   fields.forEach(item => {
      getJoinErrorTextBox(item.name).textContent = '';
   });

   loginForm.closest('.window').classList.add('window_invisible');
   joinForm.closest('.window').classList.remove('window_invisible');
}

function setLogin() {
   joinForm.closest('.window').classList.add('window_invisible');
   loginForm.closest('.window').classList.remove('window_invisible');
}

window.onpopstate = function(e) {
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

   let body = `username=${
      encodeURIComponent(loginForm['username'].value)}&password=${
         encodeURIComponent(loginForm['password'].value)}`;

   let xhr = new XMLHttpRequest();
   xhr.open("POST", '/login', true);
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

   xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;
      if (this.status != 200) {
         alert("Error sending request");
         return;
      }

      let response = JSON.parse(this.responseText);
      if (response.success)
         if (response.url)
            window.location = response.url;
         else {
            if (response.message)
               alert(response.message);
            else
               alert('Server error. Please retry later.')
         }

   };

   xhr.send(body);
}


joinForm.onsubmit = function(e) {

   let setPropertyError = (property, message) => {
      getJoinErrorTextBox(property).textContent = message;
   }


   e.preventDefault();

   let options = {};
   fields.forEach(item => {
      options[item.name] = joinForm[item.name].value;
      getJoinErrorTextBox(item.name).textContent = '';
   });

   let result = checkUserData(options);
   let body = '';

   if (!result.success)
      for (let i = 0; i < result.errors.length; i++)
         setPropertyError(result.errors[i].property, result.errors[i].message);
   else
      fields.forEach(item => {
         if (!item.extra)
            body += (body === '' ? '' : '&') + item.name + '=' + encodeURIComponent(joinForm[item.name].value);
      });

   let xhr = new XMLHttpRequest();
   xhr.open("POST", '/join', true);
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

   xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;
      // по окончании запроса доступны:
      // status, statusText
      // responseText, responseXML (при content-type: text/xml)
      if (this.status != 200) {
         alert("Error sending request.");
         return;
      }

      let response = JSON.parse(this.responseText);
      if (response.success)
         window.location = response.url;
      else {
         if (response.property)
            setPropertyError(response.property, response.message);
         else
            alert('Server error. Please retry later.')
      }

   };

   if (result.success)
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