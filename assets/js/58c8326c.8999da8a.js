"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[712],{9372:(e,t,n)=>{n.d(t,{Z:()=>d,g:()=>o});var l=n(7294),a=n(6010),c=n(2323),r=n(6363),s=n(5736);const o=e=>({text:e.text,iconSide:e.iconSide,noOutline:e.noOutline,disabled:e.disabled,color:e.color,size:e.size}),i=e=>{const t=(e.children||e.text)&&e.icon;if(!e.icon)return null;let n=e.icon;return"string"==typeof n&&(n=l.createElement(r.JO,{path:n,size:e.size})),l.createElement("span",{className:(0,a.Z)(t&&c.Z.inlineIcon,c.Z.icon)},n)},m=e=>{const t=(e.children||e.text)&&e.icon,n=e.iconSide??"right";return l.createElement(l.Fragment,null,e.icon&&"left"===n&&l.createElement(i,e),l.createElement("span",{className:(0,a.Z)(t&&c.Z.border)},e.text&&l.createElement("span",null,e.text),e.children&&e.children),e.icon&&"right"===n&&l.createElement(i,e))},d=e=>{const t=e.text&&!(e.children||e.icon),n=e.icon&&!(e.children||e.text),r=(0,a.Z)(c.Z.badge,n&&c.Z.soloIcon,e.icon&&!n&&("left"===e.iconSide?c.Z.iconLeft:c.Z.iconRight),t&&c.Z.soloText,"badge",(0,s.pv)(e.color,"secondary"),e.className,e.disabled&&c.Z.disabled);return l.createElement("span",{className:(0,a.Z)(r),title:e.title},l.createElement(m,e))}},6871:(e,t,n)=>{n.d(t,{Z:()=>i});var l=n(7462),a=n(7294),c=n(6010),r=n(8542),s=n(6363),o=n(9346);const i=e=>{const t=a.useRef(null),[n,i]=a.useState(!1),m=()=>{i(!1),document.removeEventListener("click",m)};a.useEffect((()=>()=>{document.removeEventListener("click",m)}),[]),a.useEffect((()=>{n&&t.current&&t.current.scrollIntoView({behavior:"smooth",block:"center"})}),[n,t]);const d=n?a.createElement(o.Z,{className:(0,c.Z)(r.Z.confirm),color:"red",onClick:t=>{t.stopPropagation(),t.preventDefault(),e.onClick()},text:"Ja"}):null;return a.createElement("span",{className:(0,c.Z)(r.Z.delete,n&&r.Z.expanded,e.className),ref:t},"left"===(e.flyoutSide??"left")&&d,a.createElement(o.Z,(0,l.Z)({title:"L\xf6schen"},(0,o.g)(e),{className:(0,c.Z)(e.className,r.Z.delete,"right"===e.flyoutSide&&r.Z.right,e.className),onClick:e=>{i(!n),document.addEventListener("click",m),e.stopPropagation(),e.preventDefault()},icon:a.createElement(s.pJ,{size:e.size??s.yd})})),"right"===e.flyoutSide&&d)}},6093:(e,t,n)=>{n.d(t,{Z:()=>r});var l=n(7294),a=n(6010);const c="definitionList_H1Qd";const r=(0,n(1217).Pi)((e=>l.createElement("dl",{className:(0,a.Z)(c)},e.children)))},3962:(e,t,n)=>{n.d(t,{Z:()=>E});var l=n(7462),a=n(7294),c=n(6010),r=n(2389),s=n(6043);const o="details_XTtI",i="isBrowser_Z1r4",m="collapsibleContent_dVni";function d(e){return!!e&&("SUMMARY"===e.tagName||d(e.parentElement))}function u(e,t){return!!e&&(e===t||u(e.parentElement,t))}const E=e=>{let{summary:t,children:n,...E}=e;const p=(0,r.Z)(),Z=(0,a.useRef)(null),{collapsed:b,setCollapsed:g}=(0,s.u)({initialState:!E.open}),[y,f]=(0,a.useState)(E.open),h=a.isValidElement(t)?t:a.createElement("summary",null,t??"Details");return a.createElement("details",(0,l.Z)({},E,{ref:Z,open:y,"data-collapsed":b,className:(0,c.Z)("alert","alert--info",o,p&&i,E.className),onMouseDown:e=>{d(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const t=e.target;d(t)&&u(t,Z.current)&&(e.preventDefault(),b?(g(!1),f(!0)):g(!0))}}),h,a.createElement(s.z,{lazy:!0,collapsed:b,disableSSRStyle:!0,onCollapseTransitionEnd:e=>{g(e),f(!e)}},a.createElement("div",{className:m},n)))}},1243:(e,t,n)=>{n.d(t,{Z:()=>r});var l=n(7294),a=n(6010);const c="section_Ytos";const r=(0,n(1217).Pi)((e=>l.createElement("div",{className:(0,a.Z)("hero","shadow--lw",c)},l.createElement("div",{className:(0,a.Z)("container")},e.title&&l.createElement("h1",{className:(0,a.Z)("hero__title")},e.title),e.subtitle&&l.createElement("p",{className:(0,a.Z)("hero__subtitle")},e.subtitle),l.createElement("div",null,e.children)))))},8238:(e,t,n)=>{n.r(t),n.d(t,{default:()=>J});var l=n(6910),a=n(7294);const c="details_Jpqp";var r=n(6010);const s="dropArea__uqL";var o=n(1217),i=n(1314),m=n(9346),d=n(5317),u=n(6363);const E=(0,o.Pi)((()=>{const[e,t]=(0,a.useState)(null),[n,l]=(0,a.useState)(1),c=(0,i.oR)("jobStore");return a.createElement("label",{className:(0,r.Z)(s),htmlFor:"excel-import"},a.createElement("input",{className:(0,r.Z)("button","button--secondary"),key:n,type:"file",id:"excel-import",name:"terminplan",accept:".xlsx",style:{marginBottom:"12px"},multiple:!1,onChange:e=>t(e.currentTarget.files[0])}),a.createElement(m.Z,{text:"Upload",title:"Importiere Excel-Datei",disabled:!e,color:"primary",onClick:a=>{if(a.preventDefault(),a.stopPropagation(),!e)throw"No file was selected";return c.importExcel(e),t(null),l(n+1),!1},icon:a.createElement(u.JO,{path:d.weJ,size:u.yd})}))}));var p=n(3962),Z=n(1243);const b="details_UDt6",g="summary_j7r8",y="spacer_g4So";var f=n(1921),h=n(7462),N=n(2323),v=n(9372);const S=e=>a.createElement(v.Z,(0,h.Z)({title:"Erfolgreich"},(0,v.g)(e),{className:(0,r.Z)(N.Z.save,e.className),icon:a.createElement(u.fB,{size:e.size??u.yd,disabled:e.disabled})})),x=e=>a.createElement(v.Z,(0,h.Z)({title:"Fehler"},(0,v.g)(e),{className:(0,r.Z)(N.Z.save,e.className),icon:a.createElement(u.jj,{size:e.size??u.yd,disabled:e.disabled})})),_=e=>a.createElement(v.Z,(0,h.Z)({title:"Laden"},(0,v.g)(e),{className:(0,r.Z)(N.Z.load,e.className),icon:a.createElement(u.gb,{size:e.size??u.yd,disabled:e.disabled})})),O=e=>{const t=e.text&&("string"==typeof e.text?e.text:e.text[e.state]),n=e.title&&("string"==typeof e.title?e.title:e.title[e.state]);switch(e.state){case"success":return a.createElement(S,(0,h.Z)({},e,{text:t,title:n}));case"error":return a.createElement(x,(0,h.Z)({},e,{text:t,title:n}));case"loading":return a.createElement(_,(0,h.Z)({},e,{text:t,title:n}))}};var I=n(6871);const P={[f.Z.PENDING]:"loading",[f.Z.DONE]:"success",[f.Z.ERROR]:"error",[f.Z.REVERTED]:"loading"},R={[f.O.SYNC_UNTIS]:"Sync Untis",[f.O.IMPORT]:"Import",[f.O.CLONE]:"Klonen"},C={[f.O.SYNC_UNTIS]:"orange",[f.O.IMPORT]:"blue",[f.O.CLONE]:"lightBlue"},k=(0,o.Pi)((e=>{const t=(0,i.oR)("untisStore"),n=(0,i.oR)("jobStore"),{job:l}=e;return a.createElement("summary",{className:(0,r.Z)(g)},a.createElement(O,{state:P[l.state],size:u.yd}),a.createElement(v.Z,{text:R[l.type],color:C[l.type]}),a.createElement(v.Z,{text:l.createdAt.toLocaleDateString()}),a.createElement("div",{className:(0,r.Z)(y)}),l.type===f.O.IMPORT&&a.createElement(v.Z,{text:`${l.events.length}`,color:"blue"}),a.createElement("div",{className:(0,r.Z)(y)}),l.type===f.O.IMPORT&&a.createElement(I.Z,{onClick:()=>{l.destroy()},apiState:l.apiState(`destroy-${l.id}`),disabled:l.state===f.Z.PENDING}),l.type===f.O.SYNC_UNTIS&&l.id===n.syncJobs[0].id&&a.createElement(m.Z,{disabled:n.hasPendingSyncJobs,onClick:e=>(e.preventDefault(),e.stopPropagation(),t.sync(),!1),text:"Sync Untis",icon:a.createElement(u.fo,{spin:n.hasPendingSyncJobs}),color:"primary"}))}));var j=n(6093),D=n(814);const L=(0,o.Pi)((e=>{const{job:t}=e;return a.createElement("div",null,a.createElement("div",null,a.createElement(j.Z,null,a.createElement("dt",null,"Id"),a.createElement("dd",null,t.id),a.createElement("dt",null,"State"),a.createElement("dd",null,t.state),t.type===f.O.IMPORT&&a.createElement(a.Fragment,null,a.createElement("dt",null,"Filename"),a.createElement("dd",null,t.filename),a.createElement("dt",null,"Events"),a.createElement("dd",null,t.events.length)),a.createElement("dt",null,"Created At"),a.createElement("dd",null,t.createdAt.toLocaleString()),a.createElement("dt",null,"Updated At"),a.createElement("dd",null,t.updatedAt.toLocaleString()))),t.fLog.length>0&&a.createElement(D.Z,{language:"json",title:"log.json"},t.fLog))})),z=(0,o.Pi)((e=>{const{job:t}=e;return a.createElement(p.Z,{className:(0,r.Z)(b),summary:a.createElement(k,{job:t})},a.createElement(L,{job:t}))})),J=(0,o.Pi)((()=>{const e=(0,i.oR)("untisStore"),t=(0,i.oR)("jobStore");return a.createElement(l.Z,null,a.createElement(Z.Z,{title:"Sync Untis",subtitle:"Synchronisiere die Stundenpl\xe4ne, Klassen und Lehrpersonen von WebUntis."},t.syncJobs.length>0?a.createElement(p.Z,{className:(0,r.Z)(c),summary:a.createElement(k,{job:t.syncJobs[0]})},a.createElement("div",null,a.createElement(L,{job:t.syncJobs[0]}),t.syncJobs.slice(1).map(((e,t)=>a.createElement(z,{key:t,job:e}))))):a.createElement(m.Z,{onClick:t=>{t.preventDefault(),t.stopPropagation(),e.sync()},text:"Sync Untis",icon:a.createElement(u.fo,{spin:t.hasPendingSyncJobs}),className:"button--primary"})),a.createElement(Z.Z,{title:a.createElement("span",null,"Excel Import ",a.createElement(u.JO,{path:d.Wee,size:2,color:"green"})),subtitle:"Importiere Daten aus Excel-Dateien."},a.createElement(E,null),a.createElement("div",null,t.importJobs.map(((e,t)=>a.createElement(z,{key:e.id,job:e}))))))}))},2323:(e,t,n)=>{n.d(t,{Z:()=>l});const l={badge:"badge_AKes",soloIcon:"soloIcon_opdt",soloText:"soloText_iKfE",iconRight:"iconRight_csRp",inlineIcon:"inlineIcon_aeGj",border:"border_Klou",icon:"icon_MxrW",iconLeft:"iconLeft_s_Zi",disabled:"disabled_bco4"}}}]);