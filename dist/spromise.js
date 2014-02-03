/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 *
 * https://github.com/MiguelCastillo/spromise
 */

/**
 * almond 0.2.6 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

/**
 * spromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */

(function(e,t){typeof require=="function"&&typeof exports=="object"&&typeof module=="object"?module.exports=t():typeof define=="function"&&define.amd?define(t):e.spromise=t()})(this,function(){var e,t,n;return function(r){function d(e,t){return h.call(e,t)}function v(e,t){var n,r,i,s,o,u,a,f,c,h,p=t&&t.split("/"),d=l.map,v=d&&d["*"]||{};if(e&&e.charAt(0)===".")if(t){p=p.slice(0,p.length-1),e=p.concat(e.split("/"));for(f=0;f<e.length;f+=1){h=e[f];if(h===".")e.splice(f,1),f-=1;else if(h===".."){if(f===1&&(e[2]===".."||e[0]===".."))break;f>0&&(e.splice(f-1,2),f-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((p||v)&&d){n=e.split("/");for(f=n.length;f>0;f-=1){r=n.slice(0,f).join("/");if(p)for(c=p.length;c>0;c-=1){i=d[p.slice(0,c).join("/")];if(i){i=i[r];if(i){s=i,o=f;break}}}if(s)break;!u&&v&&v[r]&&(u=v[r],a=f)}!s&&u&&(s=u,o=a),s&&(n.splice(0,o,s),e=n.join("/"))}return e}function m(e,t){return function(){return s.apply(r,p.call(arguments,0).concat([e,t]))}}function g(e){return function(t){return v(t,e)}}function y(e){return function(t){a[e]=t}}function b(e){if(d(f,e)){var t=f[e];delete f[e],c[e]=!0,i.apply(r,t)}if(!d(a,e)&&!d(c,e))throw new Error("No "+e);return a[e]}function w(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function E(e){return function(){return l&&l.config&&l.config[e]||{}}}var i,s,o,u,a={},f={},l={},c={},h=Object.prototype.hasOwnProperty,p=[].slice;o=function(e,t){var n,r=w(e),i=r[0];return e=r[1],i&&(i=v(i,t),n=b(i)),i?n&&n.normalize?e=n.normalize(e,g(t)):e=v(e,t):(e=v(e,t),r=w(e),i=r[0],e=r[1],i&&(n=b(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},u={require:function(e){return m(e)},exports:function(e){var t=a[e];return typeof t!="undefined"?t:a[e]={}},module:function(e){return{id:e,uri:"",exports:a[e],config:E(e)}}},i=function(e,t,n,i){var s,l,h,p,v,g=[],w;i=i||e;if(typeof n=="function"){t=!t.length&&n.length?["require","exports","module"]:t;for(v=0;v<t.length;v+=1){p=o(t[v],i),l=p.f;if(l==="require")g[v]=u.require(e);else if(l==="exports")g[v]=u.exports(e),w=!0;else if(l==="module")s=g[v]=u.module(e);else if(d(a,l)||d(f,l)||d(c,l))g[v]=b(l);else{if(!p.p)throw new Error(e+" missing "+l);p.p.load(p.n,m(i,!0),y(l),{}),g[v]=a[l]}}h=n.apply(a[e],g);if(e)if(s&&s.exports!==r&&s.exports!==a[e])a[e]=s.exports;else if(h!==r||!w)a[e]=h}else e&&(a[e]=n)},e=t=s=function(e,t,n,a,f){return typeof e=="string"?u[e]?u[e](t):b(o(e,t).f):(e.splice||(l=e,t.splice?(e=t,t=n,n=null):e=r),t=t||function(){},typeof n=="function"&&(n=a,a=f),a?i(r,e,t,n):setTimeout(function(){i(r,e,t,n)},4),s)},s.config=function(e){return l=e,l.deps&&s(l.deps,l.callback),s},e._defined=a,n=function(e,t,n){t.splice||(n=t,t=[]),!d(a,e)&&!d(f,e)&&(f[e]=[e,t,n])},n.amd={jQuery:!0}}(),n("libs/js/almond",function(){}),n("src/async",[],function(){function n(){function a(t){return function(){try{var n=t.apply(i,e[0]);o&&o(n)}catch(r){u&&u(r)}}}var e=Array.prototype.slice.call(arguments),n=e.shift(),r=!0,i=this,s={},o,u;return typeof n=="boolean"&&(r=n,n=e.shift()),s.fail=function(t){return u=t,s},s.success=function(t){return o=t,s},s.run=function(r){return t(a(r||n)),s},r?s.run():s}var e=this,t;return e.setImmediate?t=e.setImmediate:e.process&&typeof e.process.nextTick=="function"?t=e.process.nextTick:t=function(e){setTimeout(e,0)},n}),n("src/promise",["src/async"],function(e){function i(e,r){function o(e,t){return i.link(e,t)}function u(n){return i.queue(t.resolved,n),e}function a(n){return i.queue(t.rejected,n),e}function f(t){return i.queue(n.always,t),e}function l(){return i.transition(t.resolved,this,arguments),e}function c(){return i.transition(t.rejected,this,arguments),e}function h(){return i._state}e=e||{};var i=new s(e,r||{});return e.always=f,e.done=u,e.fail=a,e.resolve=l,e.reject=c,e.then=o,e.state=h,e}function s(e,t){this.promise=e,this.state=t.state,this.value=t.value,this.context=t.context}function o(e){this.promise=e,this.count=0}var t={pending:0,resolved:1,rejected:2},n={always:0,resolved:1,rejected:2},r={resolve:"resolve",reject:"reject"};return i.defer=function(e,t){return new i(e,t)},s.prototype.queue=function(t,n){this.state?this.state===t&&e.call(this.context,n,this.value):(this.deferred||(this.deferred=[])).push({type:t,cb:n})},s.prototype.notify=function(t){var r=this.deferred,i=this.context,s=this.value,o=e.apply(i,[!1,void 0,s]),u=0,a=r.length,f;do f=r[u++],(f.type===t||f.type===n.always)&&o.run(f.cb);while(u<a);this.deferred=null},s.prototype.transition=function(e,t,n){this.state||(this.state=e,this.context=t,this.value=n,this.deferred&&this.notify(e))},s.prototype.link=function(e,n){var s,u;return e=typeof e=="function"?e:null,n=typeof n=="function"?n:null,!e&&this.state===t.resolved||!n&&this.state===t.rejected?u=new i({},this):(u=new i,s=new o(u),this.queue(t.resolved,s.chain(r.resolve,e||n)),this.queue(t.rejected,s.chain(r.reject,n||e))),u},o.prototype.chain=function(e,t){var n=this;return function(){if(n.count++)return;n.context=this;var i;try{t&&(i=t.apply(this,arguments)),i=i!==void 0&&[i]||arguments,n.resolution(e,i)}catch(s){n.promise.reject(s)}}},o.prototype.resolution=function(e,t){var n=t[0],i=n&&n.then,s=typeof n;if(n===this.promise)throw new TypeError;if((s==="function"||s==="object"&&n!==null)&&typeof i=="function"){var u=new o(this.promise);try{i.call(n,u.chain(r.resolve),u.chain(r.reject))}catch(a){u.count||this.promise.reject(a)}}else this.promise[e].apply(this.context,t)},i.states=t,i}),n("src/when",["src/promise","src/async"],function(e,t){function n(){function f(){u&&u--,u||r.resolve.apply(i,a===1?n[0]:n)}function l(e){return function(){n[e]=arguments,f()}}function c(){r.reject.apply(this,arguments)}function h(){try{a=u=n.length;for(s=0;s<a;s++)o=n[s],o&&typeof o.then=="function"?o.then(l(s),c):(n[s]=o,f())}catch(e){c(e)}}var n=Array.prototype.slice.call(arguments),r=e(),i=this,s,o,u,a;return n.length?(t(h),r):r.resolve(null)}return n}),n("src/spromise",["src/promise","src/async","src/when"],function(e,t,n){return e.when=n,e.async=t,e}),t("src/spromise")});