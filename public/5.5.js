webpackJsonp([5],{39:function(t,s,e){"use strict";var o=e(31),r=function(t){o.apply(this,arguments),this.counterElem=t.counterElem,this.subscribersAmount=0,this.counterElem&&(this.subscribersAmount=+this.counterElem.textContent),this.url="/subscribe"};r.prototype=Object.create(o.prototype),r.prototype.constructor=r,r.prototype.setAmount=function(t){this.subscribersAmount=t,this.counterElem&&(this.counterElem.textContent=t)},r.prototype.set=function(t){this.setAmount(t.subscribersAmount),o.prototype.set.call(this,t)},r.prototype.toggle=function(){this.active?this.set({active:!1,subscribersAmount:this.subscribersAmount-1}):this.set({active:!0,subscribersAmount:this.subscribersAmount+1})},t.exports=r}});