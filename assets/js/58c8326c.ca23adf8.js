"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[712],{7499:(e,t,l)=>{l.d(t,{Z:()=>o});var a=l(7294),n=l(6670),r=l(6093),s=l(1921),c=l(614);const o=(0,n.Pi)((e=>{const{job:t}=e;return a.createElement("div",null,a.createElement("div",null,a.createElement(r.Z,null,a.createElement("dt",null,"Id"),a.createElement("dd",null,t.id),a.createElement("dt",null,"State"),a.createElement("dd",null,t.state),t.type===s.O.IMPORT&&a.createElement(a.Fragment,null,a.createElement("dt",null,"Filename"),a.createElement("dd",null,t.filename),a.createElement("dt",null,"Events"),a.createElement("dd",null,t.events.length)),t.type===s.O.SYNC_UNTIS&&a.createElement(a.Fragment,null,a.createElement("dt",null,"Sync Date"),a.createElement("dd",null,t.fSyncDate)),a.createElement("dt",null,"Created At"),a.createElement("dd",null,t.createdAt.toLocaleString()),a.createElement("dt",null,"Updated At"),a.createElement("dd",null,t.updatedAt.toLocaleString()))),t.fLog.length>0&&a.createElement(c.Z,{language:"json",title:"log.json"},t.fLog))}))},2375:(e,t,l)=>{l.d(t,{K:()=>f,S:()=>h});var a=l(7294),n=l(6010),r=l(4928),s=l(6670),c=l(1314),o=l(1921),i=l(7462),m=l(2323),d=l(6363),u=l(9372);const E=e=>a.createElement(u.Z,(0,i.Z)({title:"Erfolgreich"},(0,u.g)(e),{className:(0,n.Z)(m.Z.save,e.className),icon:a.createElement(d.fB,{size:e.size??d.yd,disabled:e.disabled})})),p=e=>a.createElement(u.Z,(0,i.Z)({title:"Fehler"},(0,u.g)(e),{className:(0,n.Z)(m.Z.save,e.className),icon:a.createElement(d.jj,{size:e.size??d.yd,disabled:e.disabled})})),Z=e=>a.createElement(u.Z,(0,i.Z)({title:"Laden"},(0,u.g)(e),{className:(0,n.Z)(m.Z.load,e.className),icon:a.createElement(d.gb,{size:e.size??d.yd,disabled:e.disabled})})),y=e=>{const t=e.text&&("string"==typeof e.text?e.text:e.text[e.state]),l=e.title&&("string"==typeof e.title?e.title:e.title[e.state]);switch(e.state){case"success":return a.createElement(E,(0,i.Z)({},e,{text:t,title:l}));case"error":return a.createElement(p,(0,i.Z)({},e,{text:t,title:l}));case"loading":return a.createElement(Z,(0,i.Z)({},e,{text:t,title:l}))}};var N=l(9346),S=l(6871);const b={[o.Z.PENDING]:"loading",[o.Z.DONE]:"success",[o.Z.ERROR]:"error",[o.Z.REVERTED]:"loading"},g={[o.O.SYNC_UNTIS]:"Sync Untis",[o.O.IMPORT]:"Import",[o.O.CLONE]:"Klonen"},v={[o.O.SYNC_UNTIS]:"orange",[o.O.IMPORT]:"blue",[o.O.CLONE]:"lightBlue"},f=(0,s.Pi)((e=>{const{job:t}=e;return a.createElement("summary",{className:(0,n.Z)(r.Z.summary)},a.createElement(y,{state:b[t.state],size:d.yd}),a.createElement(u.Z,{text:g[t.type],color:v[t.type]}),a.createElement(u.Z,{text:t.createdAt.toLocaleDateString()}),a.createElement("div",{className:(0,n.Z)(r.Z.spacer)}),t.type===o.O.IMPORT&&a.createElement(u.Z,{text:`${t.events.length}`,color:"blue"}),a.createElement("div",{className:(0,n.Z)(r.Z.spacer)}),a.createElement(S.Z,{onClick:()=>{t.destroy()},apiState:t.apiState(`destroy-${t.id}`),disabled:t.state===o.Z.PENDING}))})),h=(0,s.Pi)((e=>{const t=(0,c.oR)("semesterStore"),l=(0,c.oR)("jobStore"),{job:s}=e,i=(l.bySemester(s.semesterId)||[]).some((e=>e.state===o.Z.PENDING));return a.createElement("summary",{className:(0,n.Z)(r.Z.summary)},a.createElement(y,{state:b[s.state],size:d.yd,disabled:!s.isInSync}),a.createElement(u.Z,{text:g[s.type],color:v[s.type],disabled:!s.isInSync}),a.createElement(u.Z,{text:`Sync: ${s.createdAt.toLocaleDateString()}`}),a.createElement("div",{className:(0,n.Z)(r.Z.spacer)}),a.createElement(u.Z,{color:"blue",className:(0,n.Z)(r.Z.semester)},s.semester?.name," ",a.createElement("span",{className:(0,n.Z)(r.Z.small)},s.fSyncDate)),a.createElement("div",{className:(0,n.Z)(r.Z.spacer)}),s.isLatest&&a.createElement(N.Z,{disabled:l.hasPendingSyncJobs,onClick:e=>(e.preventDefault(),e.stopPropagation(),s.semester&&t.syncUntis(s.semester),!1),text:"Sync Untis",icon:a.createElement(d.fo,{spin:i}),color:s.isInSync?"primary":"black"}))}))},2467:(e,t,l)=>{l.d(t,{Z:()=>u});var a=l(7294),n=l(6010),r=l(4928),s=l(6670),c=l(3962),o=l(2375),i=l(7499),m=l(1921);const d=(0,s.Pi)((e=>{const{job:t}=e;switch(t.type){case m.O.IMPORT:return a.createElement(o.K,{job:t});case m.O.SYNC_UNTIS:return a.createElement(o.S,{job:t})}return null})),u=(0,s.Pi)((e=>{const{job:t}=e;return a.createElement(c.Z,{className:(0,n.Z)(r.Z.details),summary:a.createElement(d,{job:t})},a.createElement(i.Z,{job:t}))}))},6871:(e,t,l)=>{l.d(t,{Z:()=>i});var a=l(7462),n=l(7294),r=l(6010),s=l(8542),c=l(6363),o=l(9346);const i=e=>{const t=n.useRef(null),[l,i]=n.useState(!1),m=()=>{i(!1),document.removeEventListener("click",m)};n.useEffect((()=>()=>{document.removeEventListener("click",m)}),[]),n.useEffect((()=>{l&&t.current&&t.current.scrollIntoView({behavior:"smooth",block:"center"})}),[l,t]);const d=l?n.createElement(o.Z,{className:(0,r.Z)(s.Z.confirm),color:"red",onClick:t=>{t.stopPropagation(),t.preventDefault(),e.onClick()},text:"Ja"}):null;return n.createElement("span",{className:(0,r.Z)(s.Z.delete,l&&s.Z.expanded,e.className),ref:t},"left"===(e.flyoutSide??"left")&&d,n.createElement(o.Z,(0,a.Z)({title:"L\xf6schen"},(0,o.g)(e),{className:(0,r.Z)(e.className,s.Z.delete,"right"===e.flyoutSide&&s.Z.right,e.className),onClick:e=>{i(!l),document.addEventListener("click",m),e.stopPropagation(),e.preventDefault()},color:"red",icon:n.createElement(c.pJ,{size:e.size??c.yd})})),"right"===e.flyoutSide&&d)}},3962:(e,t,l)=>{l.d(t,{Z:()=>E});var a=l(7462),n=l(7294),r=l(6010),s=l(2389),c=l(6043);const o="details_XTtI",i="isBrowser_Z1r4",m="collapsibleContent_dVni";function d(e){return!!e&&("SUMMARY"===e.tagName||d(e.parentElement))}function u(e,t){return!!e&&(e===t||u(e.parentElement,t))}const E=e=>{let{summary:t,children:l,...E}=e;const p=(0,s.Z)(),Z=(0,n.useRef)(null),{collapsed:y,setCollapsed:N}=(0,c.u)({initialState:!E.open}),[S,b]=(0,n.useState)(E.open),g=n.isValidElement(t)?t:n.createElement("summary",null,t??"Details");return n.createElement("details",(0,a.Z)({},E,{ref:Z,open:S,"data-collapsed":y,className:(0,r.Z)("alert","alert--info",o,p&&i,E.className),onMouseDown:e=>{d(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const t=e.target;d(t)&&u(t,Z.current)&&(e.preventDefault(),y?(N(!1),b(!0)):N(!0))}}),g,n.createElement(c.z,{lazy:!0,collapsed:y,disableSSRStyle:!0,onCollapseTransitionEnd:e=>{N(e),b(!e)}},n.createElement("div",{className:m},l)))}},1243:(e,t,l)=>{l.d(t,{Z:()=>s});var a=l(7294),n=l(6010);const r="section_Ytos";const s=(0,l(6670).Pi)((e=>a.createElement("div",{className:(0,n.Z)("hero","shadow--lw",r)},a.createElement("div",{className:(0,n.Z)("container")},e.title&&a.createElement("h1",{className:(0,n.Z)("hero__title")},e.title),e.subtitle&&a.createElement("p",{className:(0,n.Z)("hero__subtitle")},e.subtitle),a.createElement("div",null,e.children)))))},2579:(e,t,l)=>{l.r(t),l.d(t,{default:()=>Z});var a=l(2976),n=l(7294),r=l(6010);const s="dropArea__uqL";var c=l(6670),o=l(1314),i=l(9346),m=l(5317),d=l(6363);const u=(0,c.Pi)((()=>{const[e,t]=(0,n.useState)(null),[l,a]=(0,n.useState)(1),c=(0,o.oR)("jobStore");return n.createElement("label",{className:(0,r.Z)(s),htmlFor:"excel-import"},n.createElement("input",{className:(0,r.Z)("button","button--secondary"),key:l,type:"file",id:"excel-import",name:"terminplan",accept:".xlsx",style:{marginBottom:"12px"},multiple:!1,onChange:e=>t(e.currentTarget.files[0])}),n.createElement(i.Z,{text:"Upload",title:"Importiere Excel-Datei",disabled:!e,color:"primary",onClick:n=>{if(n.preventDefault(),n.stopPropagation(),!e)throw"No file was selected";return c.importExcel(e),t(null),a(l+1),!1},icon:n.createElement(d.JO,{path:m.weJ,size:d.yd})}))}));var E=l(1243),p=l(2467);const Z=(0,c.Pi)((()=>{(0,o.oR)("semesterStore"),(0,o.oR)("viewStore");const e=(0,o.oR)("jobStore");return n.createElement(a.Z,null,n.createElement(E.Z,{title:n.createElement("span",null,"Excel Import ",n.createElement(d.JO,{path:m.Wee,size:2,color:"green"})),subtitle:"Importiere Daten aus Excel-Dateien."},n.createElement(u,null),n.createElement("div",null,e.importJobs.map(((e,t)=>n.createElement(p.Z,{key:e.id,job:e}))))))}))},4928:(e,t,l)=>{l.d(t,{Z:()=>a});const a={details:"details_UDt6",summary:"summary_j7r8",spacer:"spacer_g4So",semester:"semester_h5JF",small:"small_kbSp"}}}]);