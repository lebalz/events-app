"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[585],{1243:(e,r,t)=>{t.d(r,{Z:()=>c});var n=t(7294),o=t(6010);const a="section_Ytos";const c=(0,t(6670).Pi)((e=>n.createElement("div",{className:(0,o.Z)("hero","shadow--lw",a)},n.createElement("div",{className:(0,o.Z)("container")},e.title&&n.createElement("h1",{className:(0,o.Z)("hero__title")},e.title),e.subtitle&&n.createElement("p",{className:(0,o.Z)("hero__subtitle")},e.subtitle),n.createElement("div",null,e.children)))))},5625:(e,r,t)=>{t.r(r),t.d(r,{default:()=>_});var n={};t.r(n),t.d(n,{exclude:()=>R,extract:()=>N,parse:()=>S,parseUrl:()=>I,pick:()=>$,stringify:()=>x,stringifyUrl:()=>C});var o=t(7294),a=t(6670),c=t(1314),s=t(2379),i=t(6550);const l="%[a-f0-9]{2}",u=new RegExp("("+l+")|([^%]+?)","gi"),p=new RegExp("("+l+")+","gi");function f(e,r){try{return[decodeURIComponent(e.join(""))]}catch{}if(1===e.length)return e;r=r||1;const t=e.slice(0,r),n=e.slice(r);return Array.prototype.concat.call([],f(t),f(n))}function d(e){try{return decodeURIComponent(e)}catch{let r=e.match(u)||[];for(let t=1;t<r.length;t++)r=(e=f(r,t).join("")).match(u)||[];return e}}function m(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return decodeURIComponent(e)}catch{return function(e){const r={"%FE%FF":"\ufffd\ufffd","%FF%FE":"\ufffd\ufffd"};let t=p.exec(e);for(;t;){try{r[t[0]]=decodeURIComponent(t[0])}catch{const e=d(t[0]);e!==t[0]&&(r[t[0]]=e)}t=p.exec(e)}r["%C2"]="\ufffd";const n=Object.keys(r);for(const o of n)e=e.replace(new RegExp(o,"g"),r[o]);return e}(e)}}function y(e,r){if("string"!=typeof e||"string"!=typeof r)throw new TypeError("Expected the arguments to be of type `string`");if(""===e||""===r)return[];const t=e.indexOf(r);return-1===t?[]:[e.slice(0,t),e.slice(t+r.length)]}function g(e,r){const t={};if(Array.isArray(r))for(const n of r){const r=Object.getOwnPropertyDescriptor(e,n);r?.enumerable&&Object.defineProperty(t,n,r)}else for(const n of Reflect.ownKeys(e)){const o=Object.getOwnPropertyDescriptor(e,n);if(o.enumerable){r(n,e[n],e)&&Object.defineProperty(t,n,o)}}return t}const b=e=>null==e,h=e=>encodeURIComponent(e).replace(/[!'()*]/g,(e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`)),j=Symbol("encodeFragmentIdentifier");function k(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function v(e,r){return r.encode?r.strict?h(e):encodeURIComponent(e):e}function F(e,r){return r.decode?m(e):e}function E(e){return Array.isArray(e)?e.sort():"object"==typeof e?E(Object.keys(e)).sort(((e,r)=>Number(e)-Number(r))).map((r=>e[r])):e}function w(e){const r=e.indexOf("#");return-1!==r&&(e=e.slice(0,r)),e}function O(e,r){return r.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!r.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function N(e){const r=(e=w(e)).indexOf("?");return-1===r?"":e.slice(r+1)}function S(e,r){k((r={decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1,...r}).arrayFormatSeparator);const t=function(e){let r;switch(e.arrayFormat){case"index":return(e,t,n)=>{r=/\[(\d*)]$/.exec(e),e=e.replace(/\[\d*]$/,""),r?(void 0===n[e]&&(n[e]={}),n[e][r[1]]=t):n[e]=t};case"bracket":return(e,t,n)=>{r=/(\[])$/.exec(e),e=e.replace(/\[]$/,""),r?void 0!==n[e]?n[e]=[...n[e],t]:n[e]=[t]:n[e]=t};case"colon-list-separator":return(e,t,n)=>{r=/(:list)$/.exec(e),e=e.replace(/:list$/,""),r?void 0!==n[e]?n[e]=[...n[e],t]:n[e]=[t]:n[e]=t};case"comma":case"separator":return(r,t,n)=>{const o="string"==typeof t&&t.includes(e.arrayFormatSeparator),a="string"==typeof t&&!o&&F(t,e).includes(e.arrayFormatSeparator);t=a?F(t,e):t;const c=o||a?t.split(e.arrayFormatSeparator).map((r=>F(r,e))):null===t?t:F(t,e);n[r]=c};case"bracket-separator":return(r,t,n)=>{const o=/(\[])$/.test(r);if(r=r.replace(/\[]$/,""),!o)return void(n[r]=t?F(t,e):t);const a=null===t?[]:t.split(e.arrayFormatSeparator).map((r=>F(r,e)));void 0!==n[r]?n[r]=[...n[r],...a]:n[r]=a};default:return(e,r,t)=>{void 0!==t[e]?t[e]=[...[t[e]].flat(),r]:t[e]=r}}}(r),n=Object.create(null);if("string"!=typeof e)return n;if(!(e=e.trim().replace(/^[?#&]/,"")))return n;for(const o of e.split("&")){if(""===o)continue;const e=r.decode?o.replace(/\+/g," "):o;let[a,c]=y(e,"=");void 0===a&&(a=e),c=void 0===c?null:["comma","separator","bracket-separator"].includes(r.arrayFormat)?c:F(c,r),t(F(a,r),c,n)}for(const[o,a]of Object.entries(n))if("object"==typeof a&&null!==a)for(const[e,t]of Object.entries(a))a[e]=O(t,r);else n[o]=O(a,r);return!1===r.sort?n:(!0===r.sort?Object.keys(n).sort():Object.keys(n).sort(r.sort)).reduce(((e,r)=>{const t=n[r];return Boolean(t)&&"object"==typeof t&&!Array.isArray(t)?e[r]=E(t):e[r]=t,e}),Object.create(null))}function x(e,r){if(!e)return"";k((r={encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:",",...r}).arrayFormatSeparator);const t=t=>r.skipNull&&b(e[t])||r.skipEmptyString&&""===e[t],n=function(e){switch(e.arrayFormat){case"index":return r=>(t,n)=>{const o=t.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?t:null===n?[...t,[v(r,e),"[",o,"]"].join("")]:[...t,[v(r,e),"[",v(o,e),"]=",v(n,e)].join("")]};case"bracket":return r=>(t,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?t:null===n?[...t,[v(r,e),"[]"].join("")]:[...t,[v(r,e),"[]=",v(n,e)].join("")];case"colon-list-separator":return r=>(t,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?t:null===n?[...t,[v(r,e),":list="].join("")]:[...t,[v(r,e),":list=",v(n,e)].join("")];case"comma":case"separator":case"bracket-separator":{const r="bracket-separator"===e.arrayFormat?"[]=":"=";return t=>(n,o)=>void 0===o||e.skipNull&&null===o||e.skipEmptyString&&""===o?n:(o=null===o?"":o,0===n.length?[[v(t,e),r,v(o,e)].join("")]:[[n,v(o,e)].join(e.arrayFormatSeparator)])}default:return r=>(t,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?t:null===n?[...t,v(r,e)]:[...t,[v(r,e),"=",v(n,e)].join("")]}}(r),o={};for(const[c,s]of Object.entries(e))t(c)||(o[c]=s);const a=Object.keys(o);return!1!==r.sort&&a.sort(r.sort),a.map((t=>{const o=e[t];return void 0===o?"":null===o?v(t,r):Array.isArray(o)?0===o.length&&"bracket-separator"===r.arrayFormat?v(t,r)+"[]":o.reduce(n(t),[]).join("&"):v(t,r)+"="+v(o,r)})).filter((e=>e.length>0)).join("&")}function I(e,r){r={decode:!0,...r};let[t,n]=y(e,"#");return void 0===t&&(t=e),{url:t?.split("?")?.[0]??"",query:S(N(e),r),...r&&r.parseFragmentIdentifier&&n?{fragmentIdentifier:F(n,r)}:{}}}function C(e,r){r={encode:!0,strict:!0,[j]:!0,...r};const t=w(e.url).split("?")[0]||"";let n=x({...S(N(e.url),{sort:!1}),...e.query},r);n&&(n=`?${n}`);let o=function(e){let r="";const t=e.indexOf("#");return-1!==t&&(r=e.slice(t)),r}(e.url);if(e.fragmentIdentifier){const n=new URL(t);n.hash=e.fragmentIdentifier,o=r[j]?n.hash:`#${e.fragmentIdentifier}`}return`${t}${n}${o}`}function $(e,r,t){t={parseFragmentIdentifier:!0,[j]:!1,...t};const{url:n,query:o,fragmentIdentifier:a}=I(e,t);return C({url:n,query:g(o,r),fragmentIdentifier:a},t)}function R(e,r,t){return $(e,Array.isArray(r)?e=>!r.includes(e):(e,t)=>!r(e,t),t)}const A=n;var U=t(7398),Z=t(1243);const _=(0,a.Pi)((e=>{const r=(0,i.TH)(),t=(0,c.oR)("eventStore"),n=A.parse(r.search),a=t.byIds(n.id),l=a.length>1?"Termine":"Termin";return o.createElement(s.Z,null,o.createElement(Z.Z,{title:l},a.map(((e,r)=>o.createElement(U.Z,{event:e,key:r})))))}))}}]);