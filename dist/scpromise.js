/**
 * scpromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 */

/**
 * almond 0.2.6 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

/**
 * scpromise Copyright (c) 2014 Miguel Castillo.
 * Licensed under MIT
 *
 * Simple Compliant Promise
 * https://github.com/MiguelCastillo/scpromise
 */

(function(e,t){typeof require=="function"&&typeof exports=="object"&&typeof module=="object"?module.exports=t():typeof define=="function"&&define.amd?define(t):e.scpromise=t()})(this,function(){var e,t,n;return function(r){function d(e,t){return h.call(e,t)}function v(e,t){var n,r,i,s,o,u,a,f,c,h,p=t&&t.split("/"),d=l.map,v=d&&d["*"]||{};if(e&&e.charAt(0)===".")if(t){p=p.slice(0,p.length-1),e=p.concat(e.split("/"));for(f=0;f<e.length;f+=1){h=e[f];if(h===".")e.splice(f,1),f-=1;else if(h===".."){if(f===1&&(e[2]===".."||e[0]===".."))break;f>0&&(e.splice(f-1,2),f-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((p||v)&&d){n=e.split("/");for(f=n.length;f>0;f-=1){r=n.slice(0,f).join("/");if(p)for(c=p.length;c>0;c-=1){i=d[p.slice(0,c).join("/")];if(i){i=i[r];if(i){s=i,o=f;break}}}if(s)break;!u&&v&&v[r]&&(u=v[r],a=f)}!s&&u&&(s=u,o=a),s&&(n.splice(0,o,s),e=n.join("/"))}return e}function m(e,t){return function(){return s.apply(r,p.call(arguments,0).concat([e,t]))}}function g(e){return function(t){return v(t,e)}}function y(e){return function(t){a[e]=t}}function b(e){if(d(f,e)){var t=f[e];delete f[e],c[e]=!0,i.apply(r,t)}if(!d(a,e)&&!d(c,e))throw new Error("No "+e);return a[e]}function w(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function E(e){return function(){return l&&l.config&&l.config[e]||{}}}var i,s,o,u,a={},f={},l={},c={},h=Object.prototype.hasOwnProperty,p=[].slice;o=function(e,t){var n,r=w(e),i=r[0];return e=r[1],i&&(i=v(i,t),n=b(i)),i?n&&n.normalize?e=n.normalize(e,g(t)):e=v(e,t):(e=v(e,t),r=w(e),i=r[0],e=r[1],i&&(n=b(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},u={require:function(e){return m(e)},exports:function(e){var t=a[e];return typeof t!="undefined"?t:a[e]={}},module:function(e){return{id:e,uri:"",exports:a[e],config:E(e)}}},i=function(e,t,n,i){var s,l,h,p,v,g=[],w;i=i||e;if(typeof n=="function"){t=!t.length&&n.length?["require","exports","module"]:t;for(v=0;v<t.length;v+=1){p=o(t[v],i),l=p.f;if(l==="require")g[v]=u.require(e);else if(l==="exports")g[v]=u.exports(e),w=!0;else if(l==="module")s=g[v]=u.module(e);else if(d(a,l)||d(f,l)||d(c,l))g[v]=b(l);else{if(!p.p)throw new Error(e+" missing "+l);p.p.load(p.n,m(i,!0),y(l),{}),g[v]=a[l]}}h=n.apply(a[e],g);if(e)if(s&&s.exports!==r&&s.exports!==a[e])a[e]=s.exports;else if(h!==r||!w)a[e]=h}else e&&(a[e]=n)},e=t=s=function(e,t,n,a,f){return typeof e=="string"?u[e]?u[e](t):b(o(e,t).f):(e.splice||(l=e,t.splice?(e=t,t=n,n=null):e=r),t=t||function(){},typeof n=="function"&&(n=a,a=f),a?i(r,e,t,n):setTimeout(function(){i(r,e,t,n)},4),s)},s.config=function(e){return l=e,l.deps&&s(l.deps,l.callback),s},e._defined=a,n=function(e,t,n){t.splice||(n=t,t=[]),!d(a,e)&&!d(f,e)&&(f[e]=[e,t,n])},n.amd={jQuery:!0}}(),n("libs/js/almond",function(){}),n("scpromise/extender",[],function(){function e(){var e=Array.prototype.slice.call(arguments),t=e.shift();for(var n in e){n=e[n];for(var r in n)t[r]=n[r]}return t}return e.mixin=e,e}),n("scpromise/async",[],function(){function e(){function i(){return function(){try{t.apply(n,e[0])}catch(r){setTimeout(s(r),1)}}}function s(e){return function(){r(e)}}function o(e){r=e}var e=Array.prototype.slice.call(arguments),t=e.shift(),n=this,r=function(){};return setTimeout(i(),1),{fail:o}}return e}),n("scpromise/promise",["scpromise/extender","scpromise/async"],function(e,t){function s(e){return typeof e=="function"}function o(e){return typeof e=="object"}function u(e){return e===n.resolved}function a(e){return e===n.rejected}function f(e){return e===n.pending}function l(c){function m(e,t){var n=l();return c.done(C(n,r.resolve,e)),c.fail(C(n,r.reject,t)),n}function g(e){return a(h)||x(i.resolved,e),c}function y(e){return u(h)||x(i.rejected,e),c}function b(){return f(h)&&(p=this,N(n.resolved,arguments)),c}function w(){return f(h)&&(p=this,N(n.rejected,arguments)),c}function E(e){return x(i.always,e),c}function S(){return h}function x(e,n){f(h)?d[e].push(n):t.apply(p,[n,v]).fail(c.reject)}function T(e){var t,n;for(t=0,n=e.length;t<n;t++)e[t].apply(p,v);e.splice(0,e.length)}function N(e,r){h=e,v=r,t(function(){T(d[e===n.resolved?i.resolved:i.rejected]),T(d[i.always])}).fail(c.reject)}function C(e,t,n){return function(){try{var i=s(n)&&n.apply(this,arguments)||undefined;i=i!==undefined&&[i]||arguments,k(e,i,t)}catch(o){e.reject(o)}}}function k(e,t,n){var i=t[0];if(i===e)throw new TypeError;i!==null&&(s(i)||o(i))&&s(i.then)?i.then.call(i,C(e,r.resolve),C(e,r.reject)):e[n].apply(this,t)}c=c||{};var h=n.pending,p=this,d={always:[],resolved:[],rejected:[]},v;return e.mixin(c,{always:E,done:g,fail:y,resolve:b,reject:w,then:m,state:S})}var n={pending:0,resolved:1,rejected:2},r={resolve:"resolve",reject:"reject"},i={always:"always",resolved:"resolved",rejected:"rejected"};return l.states=n,l.async=t,l}),n("scpromise/when",["scpromise/promise"],function(e){function t(){function a(){o&&o--,o||n.resolve.apply(r,u===1?t[0]:t)}function f(e){return function(){t[e]=arguments,r=this,a()}}function l(){n.reject.apply(this,arguments)}function c(){try{u=o=t.length;for(i=0;i<u;i++)s=t[i],s&&typeof s.then=="function"?s.then(f(i),l):(t[i]=s,a())}catch(e){l(e)}}var t=Array.prototype.slice.call(arguments),n=e(),r=this,i,s,o,u;return t.length?(setTimeout(c,1),n):n.resolve(null)}return t}),n("scpromise/deferred",["scpromise/promise"],function(e){function t(){var t=e();return{promise:t,resolve:t.resolve,reject:t.reject}}return t}),n("scpromise/core",["scpromise/promise","scpromise/when","scpromise/deferred"],function(e,t,n){return e.when=t,e.deferred=n,e}),t("scpromise/core")});