"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[203],{1997:(e,t,n)=>{n.d(t,{Z:()=>z});var a=n(1314),l=n(6010),r=n(1217),s=n(7294);const c="container_UHDD",o="navbar_diMJ",i="button_jVKi",m="scrollContainer_A12N",d="fullscreen_y9b4",u="table_vwM1",E="editMode_fWke";var v=n(4655);const p={datePicker:"datePicker_t_wz",gbsl:"gbsl_NEvy",fms:"fms_DQ2z",wms:"wms_Jav2",eventRow:"eventRow_JClS",kw:"kw_oYUj",weekday:"weekday_oD07",description:"description_ymu7",location:"location_WWN0",descriptionLong:"descriptionLong_UX1h",classes:"classes_ygPH",departmentNames:"departmentNames_zFY4",editMode:"editMode_V7Fu",expanded:"expanded_WZ86"},h=(0,r.Pi)((e=>{const[t,n]=s.useState(!1),r=(0,a.o)("viewStore"),{eventTable:c}=r,{event:o}=e;return s.createElement("tr",{"data-id":o.id,onClick:()=>{t||n(!0)},onBlur:()=>{n(!1)},className:(0,l.W)(p.eventRow,t&&p.expanded,e.editMode&&p.editMode)},s.createElement("td",{className:(0,l.W)(p.kw)},o.kw),s.createElement("td",{className:(0,l.W)(p.weekday)},o.weekday),s.createElement("td",{style:{maxWidth:c.maxWidthDescription},className:(0,l.W)(p.description)},o.description),s.createElement("td",{className:(0,l.W)(p.startDate)},o.fStartDate),s.createElement("td",{className:(0,l.W)(p.startTime)},o.fStartTime),s.createElement("td",{className:(0,l.W)(p.endDate)},o.fEndDate),s.createElement("td",{className:(0,l.W)(p.endTime)},o.fEndTime),s.createElement("td",{className:(0,l.W)(p.location),style:{maxWidth:c.maxWidthLocation}},o.location),s.createElement("td",{className:(0,l.W)(p.departmentNames)},o.departmentNames.map(((e,t)=>s.createElement("span",{key:t,className:(0,l.W)("badge","badge--primary",p.badge,p[e.toLowerCase()])},e)))),s.createElement("td",{className:(0,l.W)(p.classes)},o.classes.map(((e,t)=>s.createElement("span",{key:t,className:(0,l.W)("badge","badge--secondary")},e)))),s.createElement("td",{className:(0,l.W)(p.descriptionLong),style:{maxWidth:c.maxWidthDescriptionLong}},o.descriptionLong),o.isEditable&&s.createElement("td",null,s.createElement(v.Z,{onClick:()=>o.setEditing(!0)})))}));var f=n(8949),g=n(8517),S=n(6871),N=n(2624),Z=n(1687);const y="container_u2Ul",b="select_SnI8";var C=n(9740);const k=(0,r.Pi)((e=>{const t=(0,a.o)("eventStore"),n=(0,a.o)("untisStore"),r=t.find(e.eventId);return s.createElement("div",{className:(0,l.Z)(y)},s.createElement(C.ZP,{menuPortalTarget:document.body,styles:{menuPortal:e=>({...e,zIndex:9999}),valueContainer:e=>({...e,flexBasis:"12em"})},className:(0,l.Z)(b),classNamePrefix:"select",value:r.classes.map((e=>{var t;return{label:e,value:(null==(t=n.findClassByName(e))?void 0:t.id)||"-"}})),options:n.sortedClasses.slice().map((e=>({value:e.id,label:`${e.name}`}))),onChange:(0,f.aD)((e=>{e&&r.classes.replace(e.map((e=>e.label)))})),isMulti:!0,isSearchable:!0,isClearable:!0}))}));var w=n(6330);const W=e=>s.createElement("div",null,s.createElement("input",{type:"datetime-local",value:(0,w.g7)(e.date).toISOString().substring(0,16),onChange:t=>{const n=new Date(t.currentTarget.value);e.onChange((0,w.g7)(n))}})),x="container_aNPG",_="select_EFlv",D=(0,r.Pi)((e=>{const t=(0,a.o)("eventStore"),n=(0,a.o)("departmentStore"),r=t.find(e.eventId);return s.createElement("div",{className:(0,l.Z)(x)},s.createElement(C.ZP,{menuPortalTarget:document.body,styles:{menuPortal:e=>({...e,zIndex:9999}),valueContainer:e=>({...e,flexBasis:"12em"})},className:(0,l.Z)(_),classNamePrefix:"select",value:r.departmentIds.map((e=>({label:n.find(e).name,value:e}))),options:n.departments.slice().map((e=>({value:e.id,label:`${e.name}`}))),onChange:(0,f.aD)((e=>{e&&r.departmentIds.replace(e.map((e=>e.value)))})),isMulti:!0,isSearchable:!0,isClearable:!0}))})),I=e=>{const t=e.maxChars||80,{text:n}=e,a=Math.ceil(n.length/t);return s.createElement("div",null,s.createElement("textarea",{value:e.text,wrap:"soft",rows:Math.max(2,a),onChange:t=>{e.onChange(t.currentTarget.value.replace(/\n\r?/g," ").replace(/\s+/g," "))}}))};var L=n(1923);const P=(0,r.Pi)((e=>{const{event:t}=e,n=(0,a.o)("viewStore"),{eventTable:r}=n,c=s.useRef(null);return s.useEffect((()=>{c.current&&c.current.scrollIntoView({behavior:"smooth",block:"center"})}),[c]),s.createElement("tr",{"data-id":t.id,className:(0,l.W)(p.eventRow,p.editMode)},s.createElement("td",{className:(0,l.W)(p.kw)},t.kw),s.createElement("td",{className:(0,l.W)(p.weekday)},t.weekday),s.createElement("td",{style:{maxWidth:r.maxWidthDescription},className:(0,l.W)(p.description)},s.createElement(I,{maxChars:20,text:t.description,onChange:e=>t.update({description:e})})),s.createElement("td",{className:(0,l.W)(p.startDate),colSpan:2},s.createElement(W,{date:t.start,onChange:e=>t.update({start:e.toISOString()})})),s.createElement("td",{className:(0,l.W)(p.endDate),colSpan:2},s.createElement(W,{date:t.end,onChange:e=>t.update({end:e.toISOString()})})),s.createElement("td",{className:(0,l.W)(p.location),style:{maxWidth:r.maxWidthLocation}},s.createElement(L.Z,{text:t.location,onChange:e=>t.update({location:e})})),s.createElement("td",{className:(0,l.W)(p.departmentNames)},s.createElement(D,{eventId:t.id})),s.createElement("td",{className:(0,l.W)(p.classes)},s.createElement(k,{eventId:t.id})),s.createElement("td",{className:(0,l.W)(p.descriptionLong),style:{maxWidth:r.maxWidthDescriptionLong}},s.createElement(I,{maxChars:30,text:t.descriptionLong,onChange:e=>t.update({descriptionLong:e})})),s.createElement("td",null,s.createElement("div",{ref:c},s.createElement(N.Z,{onClick:()=>t.reset()}),t.isDirty&&s.createElement(Z.Z,{onClick:()=>t.save()}),s.createElement(S.Z,{onClick:()=>t.destroy(),apiState:t.apiStateFor(`delete-${t.id}`)}))))})),z=(0,r.Pi)((e=>{var t;const n=(0,a.o)("viewStore"),r=s.useRef(null);s.useEffect((()=>{const t=n.fullscreen;return e.showFullscreenButton&&n.setShowFullscreenButton(!0),()=>n.setShowFullscreenButton(t)}),[]),s.useEffect((()=>{const e=()=>{if(r.current){n.eventTable.setClientWidth(r.current.clientWidth);const e=parseFloat(getComputedStyle(r.current).fontSize);n.eventTable.setBaseFontSize(e)}};return r.current&&(window.addEventListener("resize",e),e()),()=>window.removeEventListener("resize",e)}),[r,n]),s.useEffect((()=>(0,f.U5)((()=>n.fullscreen),(e=>{var t;e?null==(t=r.current)||t.requestFullscreen():document.fullscreenElement&&document.exitFullscreen();console.log("fullscreen",n.fullscreen)}))),[]),s.useEffect((()=>{const e=()=>{!!document.fullscreenElement!==n.fullscreen&&n.setFullscreen(!!document.fullscreenElement)};return document.addEventListener("fullscreenchange",e),()=>document.removeEventListener("fullscreenchange",e)}),[]);const v=null==(t=(0,a.o)("userStore").current)?void 0:t.id,p=e.events.some((e=>e.editing));return s.createElement("div",{className:(0,l.Z)(c),ref:r},n.fullscreen&&s.createElement("div",{className:(0,l.Z)(o)},s.createElement("div",{className:(0,l.Z)(i)},s.createElement(g.Z,null))),s.createElement("div",{className:(0,l.Z)(m,n.fullscreen&&d)},s.createElement("table",{className:(0,l.Z)(u)},s.createElement("thead",null,s.createElement("tr",{className:(0,l.Z)(p&&E)},s.createElement("th",null,"KW"),s.createElement("th",null,"Tag"),s.createElement("th",null,"Stichwort"),s.createElement("th",null,"Start"),s.createElement("th",null,"Zeit"),s.createElement("th",null,"Ende"),s.createElement("th",null,"Zeit"),s.createElement("th",null,"Ort"),s.createElement("th",null,"Schulen"),s.createElement("th",null,"Klassen"),s.createElement("th",null,"Beschreibung"))),s.createElement("tbody",null,e.events.map((e=>e.editing?s.createElement(P,{key:e.id,event:e,locked:e.authorId!==v}):s.createElement(h,{key:e.id,event:e,locked:e.authorId!==v,editMode:p})))))))}))},6871:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(7294),l=n(6010),r=n(8542),s=n(6363),c=n(9346);const o=e=>{const t=a.useRef(null),[n,o]=a.useState(!1),i=()=>{o(!1),document.removeEventListener("click",i)};a.useEffect((()=>()=>{document.removeEventListener("click",i)}),[]),a.useEffect((()=>{n&&t.current&&t.current.scrollIntoView({behavior:"smooth",block:"center"})}),[n,t]);const m=n?a.createElement(c.Z,{className:(0,l.Z)(r.Z.confirm,"button","button--danger"),onClick:t=>{t.stopPropagation(),t.preventDefault(),e.onClick()},text:"Ja, L\xf6schen!"}):null;return a.createElement("span",{className:(0,l.Z)(r.Z.delete,n&&r.Z.expanded,e.className),ref:t},"left"===(e.flyoutSide??"left")&&m,a.createElement(c.Z,{className:(0,l.Z)(e.className,r.Z.delete,"right"===e.flyoutSide&&r.Z.right),title:"L\xf6schen",onClick:e=>{o(!n),document.addEventListener("click",i),e.stopPropagation(),e.preventDefault()},text:e.text,apiState:e.apiState,apiIconSize:e.apiIconSize,iconSide:e.iconSide,noOutline:e.noOutline,href:e.href,icon:a.createElement(s.pJ,{size:s.yd})}),"right"===e.flyoutSide&&m)}},2624:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(7294),l=n(6010),r=n(8542),s=n(6363),c=n(9346);const o=e=>a.createElement(c.Z,{className:(0,l.Z)(r.Z.discard,"button--secondary","button--sm"),title:"\xc4nderungen verwerfen",onClick:e.onClick,icon:a.createElement(s.wq,{size:s.yd})})},4655:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(7294),l=n(6010),r=n(8542),s=n(6363),c=n(9346);const o=e=>a.createElement(c.Z,{className:(0,l.Z)(r.Z.edit,"button--warning"),title:"Bearbeiten",onClick:e.onClick,icon:a.createElement(s.dY,{size:s.yd})})},1687:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(7294),l=n(6010),r=n(8542),s=n(6363),c=n(9346);const o=e=>a.createElement(c.Z,{className:(0,l.Z)(r.Z.save),title:"Speichern",onClick:e.onClick,icon:a.createElement(s.N,{size:s.yd})})},3962:(e,t,n)=>{n.d(t,{Z:()=>E});var a=n(7462),l=n(7294),r=n(6010),s=n(2389),c=n(6043);const o="details_XTtI",i="isBrowser_Z1r4",m="collapsibleContent_dVni";function d(e){return!!e&&("SUMMARY"===e.tagName||d(e.parentElement))}function u(e,t){return!!e&&(e===t||u(e.parentElement,t))}const E=e=>{let{summary:t,children:n,...E}=e;const v=(0,s.Z)(),p=(0,l.useRef)(null),{collapsed:h,setCollapsed:f}=(0,c.u)({initialState:!E.open}),[g,S]=(0,l.useState)(E.open),N=l.isValidElement(t)?t:l.createElement("summary",null,t??"Details");return l.createElement("details",(0,a.Z)({},E,{ref:p,open:g,"data-collapsed":h,className:(0,r.Z)("alert","alert--info",o,v&&i,E.className),onMouseDown:e=>{d(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const t=e.target;d(t)&&u(t,p.current)&&(e.preventDefault(),h?(f(!1),S(!0)):f(!0))}}),N,l.createElement(c.z,{lazy:!0,collapsed:h,disableSSRStyle:!0,onCollapseTransitionEnd:e=>{f(e),S(!e)}},l.createElement("div",{className:m},n)))}},1923:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(7294);const l=e=>a.createElement("div",null,a.createElement("input",{type:"text",value:e.text,onChange:t=>{e.onChange(t.currentTarget.value)}}))},6662:(e,t,n)=>{n.r(t),n.d(t,{default:()=>g});var a=n(7294),l=n(1217),r=n(6910),s=n(6010),c=n(1314),o=n(6330),i=n(9346),m=n(8849),d=n.n(m),u=n(5317),E=n(6363);const v=(0,l.Pi)((e=>{const t=(0,c.o)("eventStore");return a.createElement("div",null,a.createElement(i.Z,{text:"Neues Event",icon:a.createElement(d(),{path:u.jxF,size:E.NO}),iconSide:"left",className:(0,s.Z)("button--primary"),onClick:()=>{const e=(0,o.g7)(new Date),n=new Date(e);n.setHours(n.getHours()+1),t.create({start:e.toISOString(),end:n.toISOString()})}}))}));var p=n(1997),h=n(3962),f=n(6871);const g=(0,l.Pi)((()=>{var e;const t=(0,c.o)("eventStore"),n=(0,c.o)("userStore"),l=(0,c.o)("jobStore"),s=null==(e=n.current)?void 0:e.id;return a.createElement(r.Z,null,a.createElement("div",null,a.createElement(v,null),a.createElement(p.Z,{events:t.byUser(s).filter((e=>!e.jobId)),showFullscreenButton:!1}),l.models.map(((e,t)=>{var n;return a.createElement(h.Z,{key:t,summary:a.createElement("summary",null,null==(n=e.user)?void 0:n.email," - ",e.filename||"|"," - ",e.state," - ",e.events.length)},a.createElement("div",null,a.createElement(f.Z,{onClick:()=>{l.destroy(e)},text:"L\xf6schen",flyoutSide:"right",iconSide:"right",apiState:l.apiStateFor(`destroy-${e.id}`)}),a.createElement(p.Z,{events:e.events,showFullscreenButton:!1})))}))))}))}}]);