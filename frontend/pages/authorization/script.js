"use strict";

import './style.less';

let AuthWidget = require(BLOCKS + 'auth-widget');

let authWidget = new AuthWidget({
   elem: document.getElementById('auth-widget')
});

window.onpopstate = e => {
   if (e.state)
      if (e.state.type === 'join')
         authWidget.setJoin();
      else
         authWidget.setLogin();
};

authWidget.on('change', e => {
   if (e.detail.loginWindowActive)

      history.pushState({
      type: 'login'
   }, "login", "?login");
   else
      history.pushState({
         type: 'join'
      }, "join", "?join");

});

authWidget.on('submit', e => {
   window.location = e.detail.url || '/';
});

if ((history.state && history.state.type === 'join') || window.location.search === '?join') {
   history.pushState({
      type: 'join'
   }, "join", "?join");
   authWidget.setJoin();
} else
   history.replaceState({
      type: 'login'
   }, "login", "?login");