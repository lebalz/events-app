"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[585],{9372:(e,t,r)=>{r.d(t,{Z:()=>u,g:()=>s});var n=r(7294),o=r(6010),a=r(2323),c=r(6363),l=r(5736);const s=e=>({text:e.text,iconSide:e.iconSide,noOutline:e.noOutline,disabled:e.disabled,color:e.color,size:e.size}),i=e=>{const t=(e.children||e.text)&&e.icon;if(!e.icon)return null;let r=e.icon;return"string"==typeof r&&(r=n.createElement(c.JO,{path:r,size:e.size})),n.createElement("span",{className:(0,o.Z)(t&&a.Z.inlineIcon,a.Z.icon)},r)},d=e=>{const t=(e.children||e.text)&&e.icon,r=e.iconSide??"right";return n.createElement(n.Fragment,null,e.icon&&"left"===r&&n.createElement(i,e),n.createElement("span",{className:(0,o.Z)(t&&a.Z.border)},e.text&&n.createElement("span",null,e.text),e.children&&e.children),e.icon&&"right"===r&&n.createElement(i,e))},u=e=>{const t=e.text&&!(e.children||e.icon),r=e.icon&&!(e.children||e.text),c=(0,l.pv)(e.color,e.color?void 0:"secondary"),s={};e.color&&!c&&(s["--ifm-badge-background-color"]=e.color,s["--ifm-badge-border-color"]=e.color,s["--ifm-badge-color"]="white");const i=(0,o.Z)(a.Z.badge,r&&a.Z.soloIcon,e.icon&&!r&&("left"===e.iconSide?a.Z.iconLeft:a.Z.iconRight),t&&a.Z.soloText,"badge",c,e.className,e.disabled&&a.Z.disabled);return n.createElement("span",{className:(0,o.Z)(i),style:s,title:e.title},n.createElement(d,e))}},6093:(e,t,r)=>{r.d(t,{Z:()=>c});var n=r(7294),o=r(6010);const a="definitionList_H1Qd";const c=(0,r(1217).Pi)((e=>n.createElement("dl",{className:(0,o.Z)(a)},e.children)))},1243:(e,t,r)=>{r.d(t,{Z:()=>c});var n=r(7294),o=r(6010);const a="section_Ytos";const c=(0,r(1217).Pi)((e=>n.createElement("div",{className:(0,o.Z)("hero","shadow--lw",a)},n.createElement("div",{className:(0,o.Z)("container")},e.title&&n.createElement("h1",{className:(0,o.Z)("hero__title")},e.title),e.subtitle&&n.createElement("p",{className:(0,o.Z)("hero__subtitle")},e.subtitle),n.createElement("div",null,e.children)))))},2061:(e,t,r)=>{r.r(t),r.d(t,{default:()=>Q});var n={};r.r(n),r.d(n,{exclude:()=>w,extract:()=>N,parse:()=>_,parseUrl:()=>F,pick:()=>O,stringify:()=>j,stringifyUrl:()=>S});var o=r(7294),a=r(1217),c=r(1314),l=r(6910),s=r(6775);const i="%[a-f0-9]{2}",d=new RegExp("("+i+")|([^%]+?)","gi"),u=new RegExp("("+i+")+","gi");function m(e,t){try{return[decodeURIComponent(e.join(""))]}catch{}if(1===e.length)return e;t=t||1;const r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],m(r),m(n))}function p(e){try{return decodeURIComponent(e)}catch{let t=e.match(d)||[];for(let r=1;r<t.length;r++)t=(e=m(t,r).join("")).match(d)||[];return e}}function f(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return decodeURIComponent(e)}catch{return function(e){const t={"%FE%FF":"\ufffd\ufffd","%FF%FE":"\ufffd\ufffd"};let r=u.exec(e);for(;r;){try{t[r[0]]=decodeURIComponent(r[0])}catch{const e=p(r[0]);e!==r[0]&&(t[r[0]]=e)}r=u.exec(e)}t["%C2"]="\ufffd";const n=Object.keys(t);for(const o of n)e=e.replace(new RegExp(o,"g"),t[o]);return e}(e)}}function y(e,t){if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===e||""===t)return[];const r=e.indexOf(t);return-1===r?[]:[e.slice(0,r),e.slice(r+t.length)]}function g(e,t){const r={};if(Array.isArray(t))for(const n of t){const t=Object.getOwnPropertyDescriptor(e,n);t?.enumerable&&Object.defineProperty(r,n,t)}else for(const n of Reflect.ownKeys(e)){const o=Object.getOwnPropertyDescriptor(e,n);if(o.enumerable){t(n,e[n],e)&&Object.defineProperty(r,n,o)}}return r}const E=Symbol("encodeFragmentIdentifier");function b(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function h(e,t){return t.encode?t.strict?encodeURIComponent(e).replace(/[!'()*]/g,(e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`)):encodeURIComponent(e):e}function k(e,t){return t.decode?f(e):e}function v(e){return Array.isArray(e)?e.sort():"object"==typeof e?v(Object.keys(e)).sort(((e,t)=>Number(e)-Number(t))).map((t=>e[t])):e}function Z(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function x(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function N(e){const t=(e=Z(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function _(e,t){b((t={decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1,...t}).arrayFormatSeparator);const r=function(e){let t;switch(e.arrayFormat){case"index":return(e,r,n)=>{t=/\[(\d*)]$/.exec(e),e=e.replace(/\[\d*]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return(e,r,n)=>{t=/(\[])$/.exec(e),e=e.replace(/\[]$/,""),t?void 0!==n[e]?n[e]=[...n[e],r]:n[e]=[r]:n[e]=r};case"colon-list-separator":return(e,r,n)=>{t=/(:list)$/.exec(e),e=e.replace(/:list$/,""),t?void 0!==n[e]?n[e]=[...n[e],r]:n[e]=[r]:n[e]=r};case"comma":case"separator":return(t,r,n)=>{const o="string"==typeof r&&r.includes(e.arrayFormatSeparator),a="string"==typeof r&&!o&&k(r,e).includes(e.arrayFormatSeparator);r=a?k(r,e):r;const c=o||a?r.split(e.arrayFormatSeparator).map((t=>k(t,e))):null===r?r:k(r,e);n[t]=c};case"bracket-separator":return(t,r,n)=>{const o=/(\[])$/.test(t);if(t=t.replace(/\[]$/,""),!o)return void(n[t]=r?k(r,e):r);const a=null===r?[]:r.split(e.arrayFormatSeparator).map((t=>k(t,e)));void 0!==n[t]?n[t]=[...n[t],...a]:n[t]=a};default:return(e,t,r)=>{void 0!==r[e]?r[e]=[...[r[e]].flat(),t]:r[e]=t}}}(t),n=Object.create(null);if("string"!=typeof e)return n;if(!(e=e.trim().replace(/^[?#&]/,"")))return n;for(const o of e.split("&")){if(""===o)continue;const e=t.decode?o.replace(/\+/g," "):o;let[a,c]=y(e,"=");void 0===a&&(a=e),c=void 0===c?null:["comma","separator","bracket-separator"].includes(t.arrayFormat)?c:k(c,t),r(k(a,t),c,n)}for(const[o,a]of Object.entries(n))if("object"==typeof a&&null!==a)for(const[e,r]of Object.entries(a))a[e]=x(r,t);else n[o]=x(a,t);return!1===t.sort?n:(!0===t.sort?Object.keys(n).sort():Object.keys(n).sort(t.sort)).reduce(((e,t)=>{const r=n[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=v(r):e[t]=r,e}),Object.create(null))}function j(e,t){if(!e)return"";b((t={encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:",",...t}).arrayFormatSeparator);const r=r=>t.skipNull&&null==e[r]||t.skipEmptyString&&""===e[r],n=function(e){switch(e.arrayFormat){case"index":return t=>(r,n)=>{const o=r.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[h(t,e),"[",o,"]"].join("")]:[...r,[h(t,e),"[",h(o,e),"]=",h(n,e)].join("")]};case"bracket":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[h(t,e),"[]"].join("")]:[...r,[h(t,e),"[]=",h(n,e)].join("")];case"colon-list-separator":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[h(t,e),":list="].join("")]:[...r,[h(t,e),":list=",h(n,e)].join("")];case"comma":case"separator":case"bracket-separator":{const t="bracket-separator"===e.arrayFormat?"[]=":"=";return r=>(n,o)=>void 0===o||e.skipNull&&null===o||e.skipEmptyString&&""===o?n:(o=null===o?"":o,0===n.length?[[h(r,e),t,h(o,e)].join("")]:[[n,h(o,e)].join(e.arrayFormatSeparator)])}default:return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,h(t,e)]:[...r,[h(t,e),"=",h(n,e)].join("")]}}(t),o={};for(const[c,l]of Object.entries(e))r(c)||(o[c]=l);const a=Object.keys(o);return!1!==t.sort&&a.sort(t.sort),a.map((r=>{const o=e[r];return void 0===o?"":null===o?h(r,t):Array.isArray(o)?0===o.length&&"bracket-separator"===t.arrayFormat?h(r,t)+"[]":o.reduce(n(r),[]).join("&"):h(r,t)+"="+h(o,t)})).filter((e=>e.length>0)).join("&")}function F(e,t){t={decode:!0,...t};let[r,n]=y(e,"#");return void 0===r&&(r=e),{url:r?.split("?")?.[0]??"",query:_(N(e),t),...t&&t.parseFragmentIdentifier&&n?{fragmentIdentifier:k(n,t)}:{}}}function S(e,t){t={encode:!0,strict:!0,[E]:!0,...t};const r=Z(e.url).split("?")[0]||"";let n=j({..._(N(e.url),{sort:!1}),...e.query},t);n&&(n=`?${n}`);let o=function(e){let t="";const r=e.indexOf("#");return-1!==r&&(t=e.slice(r)),t}(e.url);if(e.fragmentIdentifier){const n=new URL(r);n.hash=e.fragmentIdentifier,o=t[E]?n.hash:`#${e.fragmentIdentifier}`}return`${r}${n}${o}`}function O(e,t,r){r={parseFragmentIdentifier:!0,[E]:!1,...r};const{url:n,query:o,fragmentIdentifier:a}=F(e,r);return S({url:n,query:g(o,t),fragmentIdentifier:a},r)}function w(e,t,r){return O(e,Array.isArray(t)?e=>!t.includes(e):(e,r)=>!t(e,r),r)}const I=n;var R=r(6010);const $={event:"event_ixa9"};var C=r(6093),L=r(9372),A=r(5317),T=r(6363),U=r(9346);const P="card_IH_T",B="lesson_HPd5",H="subject_yQcp",K="teacher_WQHa",q="day_G814",z="duration_Lqp8",D=(0,a.Pi)((e=>{const{lesson:t}=e,r=(0,c.oR)("userStore"),{current:n}=r;return o.createElement("div",{className:(0,R.Z)("card",P)},o.createElement("div",{className:(0,R.Z)("card__body",B)},o.createElement(L.Z,{text:t.subject,className:(0,R.Z)(H)}),t.teachers.map(((e,t)=>o.createElement(L.Z,{key:e.id,text:e.name,className:(0,R.Z)(K),color:e.name===n.shortName?"primary":void 0}))),o.createElement(L.Z,{text:`${t.fStart} - ${t.fEnd}`,icon:o.createElement(T.SU,{hour:t.start.getHours(),color:"blue"}),iconSide:"left",className:(0,R.Z)(z)}),o.createElement(L.Z,{text:t.day,className:(0,R.Z)(q)})))})),W=(0,a.Pi)((e=>{const{event:t}=e,r=(0,c.oR)("socketStore");return o.createElement("div",{className:(0,R.Z)($.event,"card")},o.createElement("div",{className:(0,R.Z)("card__header")},o.createElement("h3",null,t.description)),o.createElement("div",{className:(0,R.Z)("card__body")},o.createElement(C.Z,null,o.createElement("dt",null,"Titel"),o.createElement("dd",null,t.description),t.descriptionLong&&o.createElement(o.Fragment,null,o.createElement("dt",null,"Beschreibung"),o.createElement("dd",null,t.descriptionLong)),o.createElement("dt",null,"KW"),o.createElement("dd",null,t.kw),o.createElement("dt",null,"Wochentag"),o.createElement("dd",null,t.day),o.createElement("dt",null,"Datum"),o.createElement("dd",null,t.fStartDate," ",t.fStartTime),o.createElement("dd",null,o.createElement(T.JO,{path:A.kLV}),t.fEndDate," ",t.fEndTime),o.createElement("dt",null,"Ort"),o.createElement("dd",null,t.location),t.classes.length>0&&o.createElement(o.Fragment,null,o.createElement("dt",null,"Klassen"),o.createElement("dd",null,t.classes.map(((e,t)=>o.createElement(L.Z,{key:`cl-${t}`,text:e}))))),t.departments.length>0&&o.createElement(o.Fragment,null,o.createElement("dt",null,"Gruppen"),o.createElement("dd",null,t.departments.map(((e,t)=>o.createElement(L.Z,{key:`gr-${t}`,text:e.name}))))),t.affectedLessonsByClass.length>0&&o.createElement(o.Fragment,null,o.createElement("dt",null,"Betroffene Lektionen"),t.affectedLessonsByClass.map(((e,t)=>o.createElement(o.Fragment,{key:`kl-${t}`},o.createElement("dt",null,e.class),o.createElement("dd",{className:(0,R.Z)($.lessons)},e.lessons.map(((e,t)=>o.createElement(D,{lesson:e,key:e.id})))))))))),o.createElement("div",{className:(0,R.Z)("card__footer")},o.createElement(U.Z,{text:"Alle betroffenen Lektionen anzeigen",icon:A.e_F,onClick:()=>{r.checkEvent(t.id)}})))}));var G=r(1243);const Q=(0,a.Pi)((e=>{const t=(0,s.TH)(),r=(0,c.oR)("eventStore"),n=I.parse(t.search),a=r.byIds(n.id),i=a.length>1?"Termine":"Termin";return o.createElement(l.Z,null,o.createElement(G.Z,{title:i},a.map(((e,t)=>o.createElement(W,{event:e,key:t})))))}))},2323:(e,t,r)=>{r.d(t,{Z:()=>n});const n={badge:"badge_AKes",soloIcon:"soloIcon_opdt",soloText:"soloText_iKfE",iconRight:"iconRight_csRp",inlineIcon:"inlineIcon_aeGj",border:"border_Klou",icon:"icon_MxrW",iconLeft:"iconLeft_s_Zi",disabled:"disabled_bco4"}}}]);