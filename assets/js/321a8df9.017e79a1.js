"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[585],{1243:(e,r,t)=>{t.d(r,{Z:()=>i});t(7294);var n=t(6010);const o="section_Ytos";var s=t(6670),a=t(5893);const i=(0,s.Pi)((e=>(0,a.jsx)("div",{className:(0,n.Z)("hero","shadow--lw",o),children:(0,a.jsxs)("div",{className:(0,n.Z)("container"),children:[e.title&&(0,a.jsx)("h1",{className:(0,n.Z)("hero__title"),children:e.title}),e.subtitle&&(0,a.jsx)("p",{className:(0,n.Z)("hero__subtitle"),children:e.subtitle}),(0,a.jsx)("div",{children:e.children})]})})))},6925:(e,r,t)=>{t.r(r),t.d(r,{default:()=>M});var n={};t.r(n),t.d(n,{exclude:()=>$,extract:()=>S,parse:()=>w,parseUrl:()=>O,pick:()=>E,stringify:()=>I,stringifyUrl:()=>C});var o=t(7294),s=t(6670),a=t(1314),i=t(7316),c=t(6550);const l="%[a-f0-9]{2}",u=new RegExp("("+l+")|([^%]+?)","gi"),d=new RegExp("("+l+")+","gi");function p(e,r){try{return[decodeURIComponent(e.join(""))]}catch{}if(1===e.length)return e;r=r||1;const t=e.slice(0,r),n=e.slice(r);return Array.prototype.concat.call([],p(t),p(n))}function f(e){try{return decodeURIComponent(e)}catch{let r=e.match(u)||[];for(let t=1;t<r.length;t++)r=(e=p(r,t).join("")).match(u)||[];return e}}function m(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return decodeURIComponent(e)}catch{return function(e){const r={"%FE%FF":"\ufffd\ufffd","%FF%FE":"\ufffd\ufffd"};let t=d.exec(e);for(;t;){try{r[t[0]]=decodeURIComponent(t[0])}catch{const e=f(t[0]);e!==t[0]&&(r[t[0]]=e)}t=d.exec(e)}r["%C2"]="\ufffd";const n=Object.keys(r);for(const o of n)e=e.replace(new RegExp(o,"g"),r[o]);return e}(e)}}function y(e,r){if("string"!=typeof e||"string"!=typeof r)throw new TypeError("Expected the arguments to be of type `string`");if(""===e||""===r)return[];const t=e.indexOf(r);return-1===t?[]:[e.slice(0,t),e.slice(t+r.length)]}function h(e,r){const t={};if(Array.isArray(r))for(const n of r){const r=Object.getOwnPropertyDescriptor(e,n);r?.enumerable&&Object.defineProperty(t,n,r)}else for(const n of Reflect.ownKeys(e)){const o=Object.getOwnPropertyDescriptor(e,n);if(o.enumerable){r(n,e[n],e)&&Object.defineProperty(t,n,o)}}return t}const g=e=>null==e,j=e=>encodeURIComponent(e).replace(/[!'()*]/g,(e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`)),v=Symbol("encodeFragmentIdentifier");function b(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function x(e,r){return r.encode?r.strict?j(e):encodeURIComponent(e):e}function Z(e,r){return r.decode?m(e):e}function k(e){return Array.isArray(e)?e.sort():"object"==typeof e?k(Object.keys(e)).sort(((e,r)=>Number(e)-Number(r))).map((r=>e[r])):e}function N(e){const r=e.indexOf("#");return-1!==r&&(e=e.slice(0,r)),e}function F(e,r){return r.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!r.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function S(e){const r=(e=N(e)).indexOf("?");return-1===r?"":e.slice(r+1)}function w(e,r){b((r={decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1,...r}).arrayFormatSeparator);const t=function(e){let r;switch(e.arrayFormat){case"index":return(e,t,n)=>{r=/\[(\d*)]$/.exec(e),e=e.replace(/\[\d*]$/,""),r?(void 0===n[e]&&(n[e]={}),n[e][r[1]]=t):n[e]=t};case"bracket":return(e,t,n)=>{r=/(\[])$/.exec(e),e=e.replace(/\[]$/,""),r?void 0!==n[e]?n[e]=[...n[e],t]:n[e]=[t]:n[e]=t};case"colon-list-separator":return(e,t,n)=>{r=/(:list)$/.exec(e),e=e.replace(/:list$/,""),r?void 0!==n[e]?n[e]=[...n[e],t]:n[e]=[t]:n[e]=t};case"comma":case"separator":return(r,t,n)=>{const o="string"==typeof t&&t.includes(e.arrayFormatSeparator),s="string"==typeof t&&!o&&Z(t,e).includes(e.arrayFormatSeparator);t=s?Z(t,e):t;const a=o||s?t.split(e.arrayFormatSeparator).map((r=>Z(r,e))):null===t?t:Z(t,e);n[r]=a};case"bracket-separator":return(r,t,n)=>{const o=/(\[])$/.test(r);if(r=r.replace(/\[]$/,""),!o)return void(n[r]=t?Z(t,e):t);const s=null===t?[]:t.split(e.arrayFormatSeparator).map((r=>Z(r,e)));void 0!==n[r]?n[r]=[...n[r],...s]:n[r]=s};default:return(e,r,t)=>{void 0!==t[e]?t[e]=[...[t[e]].flat(),r]:t[e]=r}}}(r),n=Object.create(null);if("string"!=typeof e)return n;if(!(e=e.trim().replace(/^[?#&]/,"")))return n;for(const o of e.split("&")){if(""===o)continue;const e=r.decode?o.replace(/\+/g," "):o;let[s,a]=y(e,"=");void 0===s&&(s=e),a=void 0===a?null:["comma","separator","bracket-separator"].includes(r.arrayFormat)?a:Z(a,r),t(Z(s,r),a,n)}for(const[o,s]of Object.entries(n))if("object"==typeof s&&null!==s)for(const[e,t]of Object.entries(s))s[e]=F(t,r);else n[o]=F(s,r);return!1===r.sort?n:(!0===r.sort?Object.keys(n).sort():Object.keys(n).sort(r.sort)).reduce(((e,r)=>{const t=n[r];return Boolean(t)&&"object"==typeof t&&!Array.isArray(t)?e[r]=k(t):e[r]=t,e}),Object.create(null))}function I(e,r){if(!e)return"";b((r={encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:",",...r}).arrayFormatSeparator);const t=t=>r.skipNull&&g(e[t])||r.skipEmptyString&&""===e[t],n=function(e){switch(e.arrayFormat){case"index":return r=>(t,n)=>{const o=t.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?t:null===n?[...t,[x(r,e),"[",o,"]"].join("")]:[...t,[x(r,e),"[",x(o,e),"]=",x(n,e)].join("")]};case"bracket":return r=>(t,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?t:null===n?[...t,[x(r,e),"[]"].join("")]:[...t,[x(r,e),"[]=",x(n,e)].join("")];case"colon-list-separator":return r=>(t,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?t:null===n?[...t,[x(r,e),":list="].join("")]:[...t,[x(r,e),":list=",x(n,e)].join("")];case"comma":case"separator":case"bracket-separator":{const r="bracket-separator"===e.arrayFormat?"[]=":"=";return t=>(n,o)=>void 0===o||e.skipNull&&null===o||e.skipEmptyString&&""===o?n:(o=null===o?"":o,0===n.length?[[x(t,e),r,x(o,e)].join("")]:[[n,x(o,e)].join(e.arrayFormatSeparator)])}default:return r=>(t,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?t:null===n?[...t,x(r,e)]:[...t,[x(r,e),"=",x(n,e)].join("")]}}(r),o={};for(const[a,i]of Object.entries(e))t(a)||(o[a]=i);const s=Object.keys(o);return!1!==r.sort&&s.sort(r.sort),s.map((t=>{const o=e[t];return void 0===o?"":null===o?x(t,r):Array.isArray(o)?0===o.length&&"bracket-separator"===r.arrayFormat?x(t,r)+"[]":o.reduce(n(t),[]).join("&"):x(t,r)+"="+x(o,r)})).filter((e=>e.length>0)).join("&")}function O(e,r){r={decode:!0,...r};let[t,n]=y(e,"#");return void 0===t&&(t=e),{url:t?.split("?")?.[0]??"",query:w(S(e),r),...r&&r.parseFragmentIdentifier&&n?{fragmentIdentifier:Z(n,r)}:{}}}function C(e,r){r={encode:!0,strict:!0,[v]:!0,...r};const t=N(e.url).split("?")[0]||"";let n=I({...w(S(e.url),{sort:!1}),...e.query},r);n&&(n=`?${n}`);let o=function(e){let r="";const t=e.indexOf("#");return-1!==t&&(r=e.slice(t)),r}(e.url);if(e.fragmentIdentifier){const n=new URL(t);n.hash=e.fragmentIdentifier,o=r[v]?n.hash:`#${e.fragmentIdentifier}`}return`${t}${n}${o}`}function E(e,r,t){t={parseFragmentIdentifier:!0,[v]:!1,...t};const{url:n,query:o,fragmentIdentifier:s}=O(e,t);return C({url:n,query:h(o,r),fragmentIdentifier:s},t)}function $(e,r,t){return E(e,Array.isArray(r)?e=>!r.includes(e):(e,t)=>!r(e,t),t)}const _=n;var R=t(6010),A=t(2210),U=t(5317),P=t(9346),T=t(5999),B=t(6470),L=t(8949),q=t(3517),D=t(9372),V=t(6363),H=t(5893);const J=(0,s.Pi)((e=>{const{event:r}=e,t=(0,a.oR)("eventStore");return(0,H.jsxs)("div",{className:(0,R.Z)(A.Z.eventCard,"card"),children:[!e.inModal&&(0,H.jsx)("div",{className:(0,R.Z)(A.Z.header,"card__header"),children:(0,H.jsx)("h3",{children:r.description})}),(0,H.jsx)("div",{className:(0,R.Z)("card__body"),children:(0,H.jsx)(B.Z,{...e})}),(0,H.jsx)("div",{className:(0,R.Z)("card__body"),children:r.versionsLoaded?(0,H.jsx)("div",{className:(0,R.Z)(A.Z.versions),children:r.versions.map(((e,t)=>{const n=t+1===r.versions.length;return(0,H.jsxs)(o.Fragment,{children:[(0,H.jsx)("div",{className:(0,R.Z)(A.Z.versionItem,t%2==0?A.Z.right:A.Z.left),children:(0,H.jsx)(D.Z,{text:e.createdAt.toISOString().slice(0,16).replace("T"," "),color:"blue"})}),(0,H.jsxs)("div",{className:(0,R.Z)(A.Z.versionItem,A.Z.dot,n&&A.Z.last),children:[(0,H.jsx)(V.JO,{path:U.U3w,color:"blue"}),(0,H.jsx)("div",{className:(0,R.Z)(A.Z.line)})]}),(0,H.jsx)("div",{className:(0,R.Z)(A.Z.versionItem,A.Z.versionCard,"card",t%2==0?A.Z.left:A.Z.right),children:(0,H.jsx)("div",{className:(0,R.Z)("card__body"),children:(0,H.jsx)(q.Z,{event:e})})})]},t)}))}):(0,H.jsx)(P.ZP,{text:(0,T.I)({message:"Versionen laden",id:"event.button.loadVersions",description:"for a single event: button to load version history"}),icon:U.BBX,onClick:(0,L.aD)((()=>{r.loadVersions()})),apiState:t.apiStateFor(`load-versions-${r.id}`)})})]})}));var K=t(1243);const M=(0,s.Pi)((e=>{const r=(0,c.TH)(),t=(0,a.oR)("eventStore"),n=_.parse(r.search),o=t.byIds(n.id),s=o.length>1?"Termine":"Termin";return(0,H.jsx)(i.Z,{children:(0,H.jsx)(K.Z,{title:s,children:o.map(((e,r)=>(0,H.jsx)(J,{event:e},r)))})})}))}}]);