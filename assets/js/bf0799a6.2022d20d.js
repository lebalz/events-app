(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[955],{9023:(e,t,a)=>{"use strict";a.d(t,{Z:()=>u});var s=a(7294),n=a(7524),l=a(6670),r=a(1314),c=a(6330),i=a(9346),o=a(5317),d=a(6363),m=a(5999);const u=(0,l.Pi)((e=>{const t=(0,r.oR)("eventStore"),a=(0,r.oR)("viewStore"),l=(0,n.i)();return s.createElement(i.Z,{text:(0,m.I)({message:"Neues Event",description:"AddButton text",id:"event.AddButton.text"}),icon:s.createElement(d.JO,{path:o.jxF,size:d.NO}),iconSide:"left",color:"primary",apiState:t.apiStateFor("create"),onClick:()=>{const e=(0,c.g7)(new Date),s=new Date(e);s.setHours(s.getHours()+1),t.create({start:e.toISOString(),end:s.toISOString()}).then((e=>{"mobile"===l&&a.setEventModalId(e.id)}))}})}))},6821:(e,t,a)=>{"use strict";a.d(t,{Z:()=>j});var s=a(7294),n=a(6010);const l="bulk_BjmH",r="stateActions_Zpyz",c="success_BGHQ",i="revoke_V7Y_",o="blue_xNLm";var d=a(6670),m=a(1314),u=a(9372),v=a(6871),E=a(8949),p=a(7476),h=a(9346),g=a(5317),Z=a(6363),f=a(8106),b=a(3157);const j=(0,d.Pi)((e=>{const{events:t}=e,a=(0,m.oR)("userStore"),d=(0,m.oR)("eventStore"),j=(0,m.oR)("userEventGroupStore"),{current:y}=a;if(t.length<1)return null;const k=t[0]?.state,N=t.every((e=>e.state===k)),S=t.every((e=>e.isValid)),_=t.every((e=>e.authorId===y.id));return s.createElement("div",{className:(0,n.Z)(l)},s.createElement(u.Z,{text:`${t.length}`,color:"blue"}),N&&s.createElement("div",{className:(0,n.Z)(r)},k===p.he.Draft&&S&&s.createElement(h.Z,{text:"Request Review",icon:s.createElement(Z.JO,{path:g.UPM,color:"blue"}),className:(0,n.Z)(o),iconSide:"left",onClick:()=>{d.requestState(t.map((e=>e.id)),p.he.Review)}}),k===p.he.Review&&s.createElement(s.Fragment,null,s.createElement(h.Z,{text:"Bearbeiten",icon:s.createElement(Z.JO,{path:g.DZz,color:"blue"}),className:(0,n.Z)(o),iconSide:"left",onClick:()=>{d.requestState(t.map((e=>e.id)),p.he.Draft)}}),a.current?.role===f.uU.ADMIN&&s.createElement(s.Fragment,null,s.createElement(h.Z,{text:"Publish",icon:s.createElement(Z.JO,{path:g.wo$,color:"green"}),iconSide:"left",className:(0,n.Z)(c),onClick:()=>{d.requestState(t.map((e=>e.id)),p.he.Published)}}),s.createElement(h.Z,{text:"Refuse",icon:s.createElement(Z.JO,{path:g.Tsh,color:"orange"}),iconSide:"left",className:(0,n.Z)(i),onClick:()=>{d.requestState(t.map((e=>e.id)),p.he.Refused)}})))),_&&s.createElement(s.Fragment,null,s.createElement(h.Z,{text:"Neue Gruppe",icon:g.fr_,iconSide:"left",onClick:(0,E.aD)((()=>{const e=t.map((e=>e.id));j.create({event_ids:e,name:"Neue Gruppe"})}))}),s.createElement(b.ZP,{isMulti:!1,isSearchable:!0,isClearable:!0,onChange:e=>{t.forEach((t=>{t.update({userGroupId:e?.value??null}),t.save()}))},options:j.userEventGroups.map((e=>({value:e.id,label:e.name}))),value:t.every((e=>e.userGroupId===t[0].userGroupId))?{value:t[0]?.userGroupId,label:t[0]?.userGroup?.name}:void 0})),_&&s.createElement(v.Z,{onClick:(0,E.aD)((()=>{t.forEach((e=>e.destroy()))}))}))}))},8710:(e,t,a)=>{"use strict";a.d(t,{uO:()=>J,ZP:()=>Y});var s=a(7462),n=a(7294),l=a(6010);const r={fullscreenContainer:"fullscreenContainer_XzvQ",editable:"editable_QIou",scroll:"scroll_fHIY",grid:"grid_zwcG",cell:"cell__bO4",content:"content__qbl",collapsed:"collapsed_MEvm",odd:"odd_GbvC",header:"header_VdAS",active:"active_dFee",sortable:"sortable_OBlB",state:"state_xsxE",actions:"actions_dKMT",fixed:"fixed_ZNcP",group:"group_psvT",day:"day_eb3c",expand:"expand_f2nL"};var c=a(6670),i=a(8414),o=a(1891);const d=(0,c.Pi)((e=>{const{event:t}=e;return n.createElement("div",{style:{gridColumn:"isValid"},className:(0,l.Z)("isValid",o.Z.isValid,e.className,"grid-isValid")},e.event.isValid?"":"\u274c")}));var m=a(7989);const u=(0,c.Pi)((e=>{const{event:t}=e;return n.createElement("div",{"data-id":t.id,style:{gridColumn:"select"},className:(0,l.Z)("grid-select",o.Z.select,e.className),onClick:e=>{e.stopPropagation()}},n.createElement(m.Z,{checked:t.selected,onChange:(a,s)=>{e.onSelect(t,a,s)}}))}));var v=a(4701),E=a(9346),p=a(5317),h=a(6363),g=a(2624),Z=a(1687),f=a(6871),b=a(4655),j=a(1314),y=a(7524);const k=(0,c.Pi)((e=>{const{event:t}=e,a=(0,j.oR)("viewStore"),s=(0,y.i)();return n.createElement("div",{style:{gridColumn:"actions"},className:(0,l.Z)(e.className,o.Z.actions,"grid-actions")},n.createElement("div",{className:(0,l.Z)(o.Z.flex)},n.createElement(E.Z,{title:"\xdcbersicht \xd6ffnen",icon:n.createElement(h.JO,{path:p.l1h,color:"blue",size:h.yd}),onClick:()=>a.setEventModalId(t.id)}),t.isEditable&&!t.isEditing&&n.createElement(b.Z,{onClick:()=>{t.setEditing(!0),"mobile"===s&&a.setEventModalId(t.id)}}),t.isEditing&&n.createElement(n.Fragment,null,n.createElement(g.Z,{onClick:()=>t.reset()}),n.createElement(Z.Z,{disabled:!t.isDirty,onClick:()=>t.save(),apiState:t.apiStateFor(`save-${t.id}`)}),n.createElement(f.Z,{onClick:()=>t.destroy(),apiState:t.apiStateFor(`destroy-${t.id}`)}))),n.createElement("div",{className:(0,l.Z)(o.Z.expand)},e.expandeable&&t.isExpanded&&!t.isEditing&&n.createElement(E.Z,{icon:p.vnu,onClick:e=>{e.stopPropagation(),t.setExpanded(!1)},size:h.yd})))}));var N=a(9372);const S=(0,c.Pi)((e=>{const{event:t}=e;return n.createElement("div",{style:{gridColumn:"author"},className:(0,l.Z)("author",o.Z.author,e.className,"grid-author")},n.createElement(N.Z,{text:(e.event.author?.shortName||e.event.author?.email)??"-"}))}));var _=a(5981),C=a(3182),x=a(7746),w=a(5842);const G=(0,c.Pi)((e=>{const{event:t}=e;return n.createElement("div",{style:{gridColumn:"userGroup"},className:(0,l.Z)(e.className,o.Z.userGroup)},n.createElement("div",{className:(0,l.Z)(o.Z.tags)},t.hasUserGroup&&n.createElement(N.Z,{text:t.userGroup?.name,color:"blue"})))}));var z=a(8991),I=a(3259),P=a(3335);const R={state:i.Z,isValid:d,select:u,kw:v.Z,actions:k,author:S,day:_.Z,description:C.Z,start:x.Hz,end:x.pi,location:w.Z,userGroup:G,departmens:z.Z,classes:I.Z,descriptionLong:P.Z},L=(0,c.Pi)((e=>n.createElement(n.Fragment,null,e.columns.map(((t,a)=>{const[c,i]=t,o=R[c];return n.createElement("div",{className:(0,l.Z)(r.cell,r[c],i.className,e.index%2==1&&r.odd),style:{gridColumn:`${a+1} / span ${i.colSpan||1}`,maxWidth:i.maxWidth,width:i.width,position:i.fixed?"sticky":void 0,left:i.fixed?.left,right:i.fixed?.right},onClick:()=>e.event.setExpanded(!0),key:a},n.createElement(o,(0,s.Z)({event:e.event,className:(0,l.Z)(r.content,!e.event.isExpanded&&r.collapsed),expandeable:!0},i.componentProps)))})))));var D=a(7661),B=a(6486),O=a.n(B);const F=(0,c.Pi)((e=>{const t=n.useRef(null),[a,s]=n.useState(!1),c=(0,j.RO)(t,e.tableCssSelector,"0% 30px 0% 30px");return n.useEffect((()=>{c&&s(!0)}),[c]),n.createElement(n.Fragment,null,n.createElement("div",{className:(0,l.Z)(r.batch),style:{height:a?void 0:J*e.rowHeight+"px",gridColumnStart:1,gridColumnEnd:-1},ref:t}),a&&e.children)}));var M=a(6330);const V=(0,c.Pi)((e=>{const{events:t}=e;return 0===t.length?null:n.createElement("div",{key:`group-${e.group}`,className:(0,l.Z)(r.group),style:{gridColumn:"1 / -1"}},n.createElement("span",null,"KW ",e.group),n.createElement("span",null,(0,M.p6)(t[0].weekStart)," - ",(0,M.p6)(t[0].weekEnd)))}));var A=a(5999);const $={state:(0,A.I)({message:"Zustand",id:"eventGrid.header.state",description:"Label for the Event Grid Columns"}),isValid:(0,A.I)({message:"Valid",id:"eventGrid.header.isValid",description:"Label for the Event Grid Columns"}),select:(0,A.I)({message:"Ausw\xe4hlen",id:"eventGrid.header.select",description:"Label for the Event Grid Columns"}),kw:(0,A.I)({message:"KW",id:"eventGrid.header.kw",description:"Label for the Event Grid Columns"}),actions:(0,A.I)({message:"Aktionen",id:"eventGrid.header.actions",description:"Label for the Event Grid Columns"}),author:(0,A.I)({message:"Author",id:"eventGrid.header.author",description:"Label for the Event Grid Columns"}),day:(0,A.I)({message:"Tag",id:"eventGrid.header.day",description:"Label for the Event Grid Columns"}),description:(0,A.I)({message:"Stichworte",id:"eventGrid.header.description",description:"Label for the Event Grid Columns"}),start:(0,A.I)({message:"Start",id:"eventGrid.header.start",description:"Label for the Event Grid Columns"}),end:(0,A.I)({message:"Ende",id:"eventGrid.header.end",description:"Label for the Event Grid Columns"}),location:(0,A.I)({message:"Ort",id:"eventGrid.header.location",description:"Label for the Event Grid Columns"}),userGroup:(0,A.I)({message:"Gruppe",id:"eventGrid.header.userGroup",description:"Label for the Event Grid Columns"}),departmens:(0,A.I)({message:"Abteilungen",id:"eventGrid.header.departmens",description:"Label for the Event Grid Columns"}),classes:(0,A.I)({message:"Klassen",id:"eventGrid.header.classes",description:"Label for the Event Grid Columns"}),descriptionLong:(0,A.I)({message:"Beschreibung",id:"eventGrid.header.descriptionLong",description:"Label for the Event Grid Columns"})},T=(0,c.Pi)((e=>{let t;switch(e.name){case"actions":t=n.createElement(h.JO,{path:p.cl8,size:h.yd});break;case"select":t=n.createElement("div",{style:{paddingLeft:"0.2em"}},n.createElement(m.Z,{checked:e.active,onChange:e.onClick}));break;case"state":t=n.createElement(h.JO,{path:p._dp,size:h.yd});break;case"isValid":t=n.createElement(h.JO,{path:p.UPM,size:h.yd})}return n.createElement("div",{className:(0,l.Z)(r.cell,r.header,e.className,e.sortable&&r.sortable,e.active&&r.active,e.fixed&&r.fixed),style:{gridColumn:e.gridColumn,width:e.width,maxWidth:e.maxWidth,position:e.fixed?"sticky":void 0,left:e.fixed?.left,right:e.fixed?.right},title:$[e.name]},n.createElement("div",{className:(0,l.Z)(r.content,r[e.name]),onClick:e.sortable?e.onClick:void 0},t||$[e.name],e.active&&n.createElement(h.JO,{size:h.yd,path:"asc"===e.active?p.XHH:p.dYk})))})),U={state:{width:"2.1em",sortable:!0},isValid:{width:"2.1em",sortable:!0},select:{width:"2.3em",componentProps:{onSelect:()=>{}}},kw:{width:"2.8em",sortable:!0},author:{width:"5em",sortable:!0},day:{width:"2.8em",sortable:!0},description:{width:"16em"},start:{sortable:!0},end:{sortable:!0},location:{},userGroup:{},departmens:{},classes:{},descriptionLong:{width:"20em"},actions:{}},J=15,q=n.memo(F),H=(0,D.kq)((e=>{const t=O().orderBy(e.events,[e.orderBy,"start"],[e.direction,"asc"]),a=[];if(e.groupBy){const s=O().groupBy(t,e.groupBy);let n=0;Object.keys(s).sort().forEach((t=>{a.push({type:"group",groupBy:e.groupBy,group:t,events:s[t]}),s[t].forEach((e=>{a.push({type:"event",index:n,model:e}),n++}))}))}else t.forEach(((e,t)=>{a.push({type:"event",model:e,index:t})}));return O().chunk(a,J)})),Y=(0,c.Pi)((e=>{const t=n.useRef(null),[a,c]=n.useState("start"),[i,o]=n.useState("asc"),d=n.useMemo((()=>H({events:e.events,groupBy:e.groupBy,orderBy:a,direction:i})),[e.events,a,i]),[m,u]=n.useState([]);n.useEffect((()=>{const t=[],a=(e,t,a)=>{if(t&&a){const a=d.flat().filter((e=>"event"===e.type)).map((e=>e.model)),s=a.findIndex((t=>t.id===e.id)),n=a.slice(0,s).findLastIndex((e=>e.selected));n>-1&&a.slice(n,s).forEach((e=>e.setSelected(t)))}e.setSelected(t)};e.columns.forEach(((e,s)=>{const n="string"!=typeof e,l=n?e[0]:e,r={...U[l],..."select"===l?{componentProps:{onSelect:a}}:{}};if(!r)return null;t.push([l,{...r,...n?e[1]:{}}])})),u(t)}),[e.columns,d]);const v=`repeat(${e.columns.length}, max-content)`;return n.createElement("div",{className:(0,l.Z)(r.scroll,e.className)},n.createElement("div",{className:(0,l.Z)(r.grid),style:{gridTemplateColumns:v},ref:t},m.map(((t,l)=>{const[r,d]=t;let m=r===a?i:void 0,u=()=>{r===a?o("asc"===i?"desc":"asc"):(c(r),o("asc"))};return"select"===r&&(m=e.events.every((e=>e.selected)),u=()=>{e.events.forEach((e=>e.setSelected(!m)))}),n.createElement(T,(0,s.Z)({key:l,name:r,gridColumn:l+1,active:m,onClick:u},d))})),d.map(((e,t)=>n.createElement(q,{key:t,rowHeight:30,tableCssSelector:r.grid},e.map((e=>{if("group"===e.type)return n.createElement(V,(0,s.Z)({key:e.group},e));const t=e.model;return n.createElement(L,{key:t.id,event:t,columns:m,index:e.index})})))))))}))},2825:(e,t,a)=>{"use strict";a.d(t,{Z:()=>d});var s=a(7294),n=a(6010);const l="container_X8RJ",r="select_S5Gz";var c=a(6670),i=a(1314),o=a(3157);const d=(0,c.Pi)((e=>{const t=(0,i.oR)("untisStore"),{user:a}=e;return a?s.createElement("div",{className:(0,n.Z)(l)},s.createElement(o.ZP,{menuPortalTarget:document.body,styles:{menuPortal:e=>({...e,zIndex:9999}),valueContainer:e=>({...e,flexBasis:"12em"})},className:(0,n.Z)(r),classNamePrefix:"select",value:{value:a.untisId,label:a.untisTeacher?`${a.shortName} - ${a.untisTeacher?.longName}`:"-"},options:t.teachers.slice().map((e=>({value:e.id,label:`${e.shortName} - ${e.longName}`}))),onChange:e=>{a.linkUntis(e?.value)},isMulti:!1,isSearchable:!0,isClearable:!!a.untisTeacher})):null}))},6871:(e,t,a)=>{"use strict";a.d(t,{Z:()=>o});var s=a(7462),n=a(7294),l=a(6010),r=a(8542),c=a(6363),i=a(9346);const o=e=>{const t=n.useRef(null),[a,o]=n.useState(!1),d=()=>{o(!1),document.removeEventListener("click",d)};n.useEffect((()=>()=>{document.removeEventListener("click",d)}),[]),n.useEffect((()=>{a&&t.current&&t.current.scrollIntoView({behavior:"smooth",block:"center"})}),[a,t]);const m=a?n.createElement(i.Z,{className:(0,l.Z)(r.Z.confirm),color:"red",onClick:t=>{t.stopPropagation(),t.preventDefault(),e.onClick()},text:"Ja"}):null;return n.createElement("span",{className:(0,l.Z)(r.Z.delete,a&&r.Z.expanded,e.className),ref:t},"left"===(e.flyoutSide??"left")&&m,n.createElement(i.Z,(0,s.Z)({title:"L\xf6schen"},(0,i.g)(e),{className:(0,l.Z)(e.className,r.Z.delete,"right"===e.flyoutSide&&r.Z.right,e.className),onClick:e=>{o(!a),document.addEventListener("click",d),e.stopPropagation(),e.preventDefault()},color:"red",icon:n.createElement(c.pJ,{size:e.size??c.yd})})),"right"===e.flyoutSide&&m)}},2624:(e,t,a)=>{"use strict";a.d(t,{Z:()=>o});var s=a(7462),n=a(7294),l=a(6010),r=a(8542),c=a(6363),i=a(9346);const o=e=>n.createElement(i.Z,(0,s.Z)({title:"\xc4nderungen verwerfen"},(0,i.g)(e),{className:(0,l.Z)(r.Z.discard,"button--sm",e.className),color:"secondary",onClick:e.onClick,icon:n.createElement(c.wq,{size:e.size??c.yd})}))},4655:(e,t,a)=>{"use strict";a.d(t,{Z:()=>o});var s=a(7462),n=a(7294),l=a(6010),r=a(8542),c=a(6363),i=a(9346);const o=e=>n.createElement(i.Z,(0,s.Z)({title:"Bearbeiten"},(0,i.g)(e),{className:(0,l.Z)(r.Z.edit,e.className),color:"orange",onClick:e.onClick,icon:n.createElement(c.dY,{size:e.size??c.yd})}))},1687:(e,t,a)=>{"use strict";a.d(t,{Z:()=>o});var s=a(7462),n=a(7294),l=a(6010),r=a(8542),c=a(6363),i=a(9346);const o=e=>n.createElement(i.Z,(0,s.Z)({title:"Speichern"},(0,i.g)(e),{className:(0,l.Z)(r.Z.save,e.className),color:"green",onClick:e.onClick,icon:n.createElement(c.N,{size:e.size??c.yd,disabled:e.disabled})}))},3962:(e,t,a)=>{"use strict";a.d(t,{Z:()=>v});var s=a(7462),n=a(7294),l=a(6010),r=a(2389),c=a(6043);const i="details_XTtI",o="isBrowser_Z1r4",d="collapsibleContent_dVni";function m(e){return!!e&&("SUMMARY"===e.tagName||m(e.parentElement))}function u(e,t){return!!e&&(e===t||u(e.parentElement,t))}const v=e=>{let{summary:t,children:a,...v}=e;const E=(0,r.Z)(),p=(0,n.useRef)(null),{collapsed:h,setCollapsed:g}=(0,c.u)({initialState:!v.open}),[Z,f]=(0,n.useState)(v.open),b=n.isValidElement(t)?t:n.createElement("summary",null,t??"Details");return n.createElement("details",(0,s.Z)({},v,{ref:p,open:Z,"data-collapsed":h,className:(0,l.Z)("alert","alert--info",i,E&&o,v.className),onMouseDown:e=>{m(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const t=e.target;m(t)&&u(t,p.current)&&(e.preventDefault(),h?(g(!1),f(!0)):g(!0))}}),b,n.createElement(c.z,{lazy:!0,collapsed:h,disableSSRStyle:!0,onCollapseTransitionEnd:e=>{g(e),f(!e)}},n.createElement("div",{className:d},a)))}},1243:(e,t,a)=>{"use strict";a.d(t,{Z:()=>r});var s=a(7294),n=a(6010);const l="section_Ytos";const r=(0,a(6670).Pi)((e=>s.createElement("div",{className:(0,n.Z)("hero","shadow--lw",l)},s.createElement("div",{className:(0,n.Z)("container")},e.title&&s.createElement("h1",{className:(0,n.Z)("hero__title")},e.title),e.subtitle&&s.createElement("p",{className:(0,n.Z)("hero__subtitle")},e.subtitle),s.createElement("div",null,e.children)))))},1923:(e,t,a)=>{"use strict";a.d(t,{Z:()=>l});var s=a(7294),n=a(6010);const l=e=>s.createElement("div",{className:(0,n.Z)(e.className)},s.createElement("input",{type:"text",value:e.text,placeholder:e.placeholder,onChange:t=>{e.onChange(t.currentTarget.value)}}))},600:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>de});var s=a(7294),n=a(6010);const l={main:"main_bgR9",logout:"logout_gfEI",groups:"groups_HBIP"};var r=a(2379),c=a(4866),i=a(5162),o=(a(2263),a(1207),a(1314)),d=a(6670),m=a(6550),u=a(5317),v=a(9346);const E="container_DTgE",p="ical_plmt",h="icalButtons_kZMQ";var g=a(6093),Z=a(9372),f=a(2825),b=a(6363),j=a(2839),y=a(6023),k=a(1684);const N=(0,d.Pi)((e=>{const{user:t}=e,a=(0,o.oR)("userStore"),l=t,r="right",c=s.useMemo((()=>{const e=y.Z.GroupedClassesByYear(t.untisTeacher?.lessons||[],10);return Object.values(e).sort().join(", ")}),[e.user.untisTeacher?.lessons]);return s.createElement("div",{className:(0,n.Z)(E)},s.createElement(g.Z,null,s.createElement("dt",null,s.createElement(Z.Z,{text:"Login",icon:u.uUK,iconSide:r,color:"gray"})),s.createElement("dd",null,t.email),s.createElement("dt",null,s.createElement(Z.Z,{text:"Untis Account",icon:u.tuE,iconSide:r,color:"gray"})),s.createElement("dd",null,s.createElement(f.Z,{user:l})),s.createElement("dt",null,s.createElement(Z.Z,{text:"Kalender",icon:s.createElement(b.f,null),iconSide:r,color:"gray"})),s.createElement("dd",null,s.createElement("div",null,s.createElement("div",{className:(0,n.Z)(p)},t.icalUrl&&`${j.fc}/ical/${t.icalUrl}`),s.createElement("div",{className:(0,n.Z)(h)},s.createElement(v.Z,{onClick:()=>a.createIcs(),text:"Sync",icon:u.ifN,apiState:a.apiStateFor("createIcs"),size:b.yd,disabled:a.apiStateFor("createIcs")===k.gQ.LOADING}),s.createElement(v.Z,{href:`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${j.fc}/ical/${t.icalUrl}&name=GBSL`,text:"Outlook",title:"Regenerate iCal Calendar",icon:u.eN7,size:b.yd})))),s.createElement("dt",null,s.createElement(Z.Z,{text:"Events",icon:u.RaG,iconSide:r,color:"gray"})),s.createElement("dd",null,t.events.length),t.untisTeacher&&s.createElement(s.Fragment,null,s.createElement("dt",null,s.createElement(Z.Z,{text:"Schulen",icon:u.ilk,iconSide:r,color:"gray"})),s.createElement("dd",null,[...new Set(t.untisTeacher.departments.map((e=>e.name)))].join(", ")),s.createElement("dt",null,s.createElement(Z.Z,{text:"Klassen",icon:u.L_H,iconSide:r,color:"gray"})),s.createElement("dd",null,c),s.createElement("dt",null,s.createElement(Z.Z,{text:"F\xe4cher",icon:u.goG,iconSide:r,color:"gray"})),s.createElement("dd",null,[...new Set(t.untisTeacher.lessons.map((e=>e.subject)))].join(", ")))))})),S=N;var _=a(1243),C=a(7476),x=a(8106),w=a(9023),G=a(6821),z=a(8710),I=a(3962),P=a(6871);const R="card_ia0k",L=["isValid",["state",{sortable:!1,width:void 0}],"select","kw","day","description","start","end",["userGroup",{sortable:!0}],["location",{sortable:!0}],["departmens",{}],["classes",{}],"descriptionLong",["actions",{fixed:{right:0}}]],D=[...L.slice(0,3),"author",...L.slice(3)],B=(0,d.Pi)((e=>{const{user:t}=e,a=((0,o.oR)("eventStore"),(0,o.oR)("jobStore")),l=(0,o.oR)("viewStore");if(!t)return null;const r=l.usersEvents({ignoreImported:!0,states:[C.he.Draft]}),d=l.usersEvents({ignoreImported:!0,states:[C.he.Review,C.he.Refused]}),m=t?.role===x.uU.ADMIN?l.allEvents({states:[C.he.Review]}):[],u=l.usersEvents({ignoreImported:!0,states:[C.he.Published]}),v=l.usersEvents({onlyDeleted:!0});return s.createElement(c.Z,null,s.createElement(i.Z,{value:"my-events",label:"Unver\xf6ffentlicht"},s.createElement(w.Z,null),r.length>0&&s.createElement("div",{className:(0,n.Z)(R,"card")},s.createElement("div",{className:(0,n.Z)("card__header")},s.createElement("h3",null,"Unver\xf6ffentlicht"),s.createElement(G.Z,{events:r.filter((e=>e.selected))})),s.createElement("div",{className:(0,n.Z)("card__body")},s.createElement(z.ZP,{events:r,columns:L})))),d.length>0&&s.createElement(i.Z,{value:"reviewed",label:"Review"},s.createElement("div",{className:(0,n.Z)(R,"card")},s.createElement("div",{className:(0,n.Z)("card__header")},s.createElement("h3",null,"Im Review"),s.createElement(G.Z,{events:d.filter((e=>e.selected))})),s.createElement("div",{className:(0,n.Z)("card__body")},s.createElement(z.ZP,{events:d,columns:L})))),m.length>0&&s.createElement(i.Z,{value:"admin-review",label:"Admin"},s.createElement("div",{className:(0,n.Z)(R,"card")},s.createElement("div",{className:(0,n.Z)("card__header")},s.createElement("h3",null,"Review Anfragen f\xfcr Admin"),s.createElement(G.Z,{events:m.filter((e=>e.selected))})),s.createElement("div",{className:(0,n.Z)("card__body")},s.createElement(z.ZP,{events:m,columns:D})))),u.length>0&&s.createElement(i.Z,{value:"published",label:"Ver\xf6ffentlicht"},s.createElement("div",{className:(0,n.Z)(R,"card")},s.createElement("div",{className:(0,n.Z)("card__header")},s.createElement("h3",null,"Ver\xf6ffentlicht"),s.createElement(G.Z,{events:u.filter((e=>e.selected))})),s.createElement("div",{className:(0,n.Z)("card__body")},s.createElement(z.ZP,{events:u,columns:L})))),v.length>0&&s.createElement(i.Z,{value:"deleted",label:"Gel\xf6scht"},s.createElement("div",{className:(0,n.Z)(R,"card")},s.createElement("div",{className:(0,n.Z)("card__header")},s.createElement("h3",null,"Gel\xf6scht")),s.createElement("div",{className:(0,n.Z)("card__body")},s.createElement(z.ZP,{events:v,columns:L})))),a.importJobs.length>0&&s.createElement(i.Z,{value:"import",label:"Import"},a.importJobs.map(((e,t)=>{const n=l.allEvents({jobId:e.id,orderBy:"isValid-asc"});return s.createElement(I.Z,{key:t,summary:s.createElement("summary",null,e.user?.email," - ",e.filename||"|"," - ",e.state," - ",n.length)},s.createElement("div",null,s.createElement(P.Z,{onClick:()=>{a.destroy(e)},text:"Job L\xf6schen",flyoutSide:"right",iconSide:"right",apiState:a.apiStateFor(`destroy-${e.id}`)}),s.createElement(G.Z,{events:n.filter((e=>e.selected))}),s.createElement(z.ZP,{events:n,columns:L})))}))))})),O=B;var F=a(3199),M=a(381),V=a.n(M);const A="timeTable_k_zC";var $=a(6330);V().locale("de-CH");const T=(0,F.Zt)(V()),U=e=>{const t=e.event;return s.createElement("span",null,s.createElement("strong",null,t.subject),": ",s.createElement("i",null,t.classes))},J=(0,d.Pi)((e=>{const t=(0,o.oR)("viewStore"),a=(0,o.oR)("untisStore"),l=s.useMemo((()=>(t.usersLessons||[]).filter((e=>e.isFirstSuccessiveLesson)).map(((e,t)=>{const a=y.Z.GroupedClassesByYear([e]),s=Object.values(a).sort().join(", "),n=e.lastSuccessiveLesson??e;return{start:e.start,end:n.end,subject:e.subject,classes:s,id:e.id}}))),[t.usersLessons,a.initialized]),r=s.useMemo((()=>({event:U})),[]);return s.createElement("div",{className:(0,n.Z)(A)},l.length>0&&s.createElement(F.f,{defaultView:"work_week",toolbar:!1,views:["work_week"],defaultDate:new Date,formats:{dayFormat:e=>`${$.z1[e.getDay()]}.`},localizer:T,events:l,startAccessor:"start",endAccessor:"end",style:{height:600},showMultiDayTimes:!0,popup:!0,selectable:!0,components:{work_week:r},onSelectEvent:e=>{let{id:t}=e;console.log(a.findLesson(t)?.props)},min:new Date(2023,0,1,7,0,0),max:new Date(2023,0,1,18,0,0)}))})),q="group_AsGr",H="header_N_am",Y="events_FZqk",K="textInput_bhe6",W="card_GIIN",Q="badges_U2d3",X=(0,d.Pi)((e=>{const t=(0,o.oR)("viewStore"),{event:a}=e;return s.createElement("div",{className:(0,n.Z)(W,"card")},s.createElement("div",{className:(0,n.Z)("card__header")},s.createElement("div",{className:(0,n.Z)(Q)},s.createElement(Z.Z,{text:a.fStartDate,color:"secondary"}),a.affectedDepartments.map(((e,t)=>s.createElement(Z.Z,{key:e.id,text:e.shortName,color:e.color}))),a.cloned&&s.createElement(Z.Z,{icon:u.rqt,color:"gold",size:b.OW})),s.createElement("div",{className:(0,n.Z)(Q)},a.fClasses.map(((e,t)=>{const a=0===e.classes.length?"red":"gray";return s.createElement(Z.Z,{key:t,text:e.text,title:e.classes.map((e=>e.displayName)).join(", "),color:a})})),a._unknownClassGroups.map((e=>s.createElement(Z.Z,{key:e,text:`${e}*`,color:"red"}))))),s.createElement("div",{className:(0,n.Z)("card__body")},s.createElement("p",null,a.description)),s.createElement("div",{className:(0,n.Z)("card__footer")},s.createElement(v.Z,{text:"Mehr",onClick:()=>{t.setEventModalId(a.id)}})))}));var ee=a(1923),te=a(4435);const ae={};var se=a(4655),ne=a(2624),le=a(1687);const re=(0,d.Pi)((e=>{const{model:t}=e;return s.createElement("div",{className:(0,n.Z)(ae.flex,e.className)},e.leftNodes,t.isEditable&&!t.isEditing&&s.createElement(se.Z,{onClick:()=>{t.setEditing(!0),e.onEdit&&e.onEdit()}}),t.isEditing&&s.createElement(s.Fragment,null,s.createElement(ne.Z,{onClick:()=>t.reset()}),s.createElement(le.Z,{disabled:!t.isDirty,onClick:()=>t.save(),apiState:t.apiStateFor(`save-${t.id}`)}),s.createElement(P.Z,{onClick:()=>t.destroy(),apiState:t.apiStateFor(`destroy-${t.id}`)})),e.rightNodes)}));var ce=a(7462);const ie=e=>s.createElement(v.Z,(0,ce.Z)({icon:u.RDO,title:"Duplizieren"},(0,v.g)(e),{className:(0,n.Z)(e.className),size:e.size??b.yd,color:"blue",onClick:()=>{e.onClick()}})),oe=(0,d.Pi)((e=>{(0,o.oR)("viewStore");const{group:t}=e;return s.createElement("div",{className:(0,n.Z)(q,"card")},s.createElement("div",{className:(0,n.Z)(H,"card__header")},s.createElement("div",{className:"avatar__intro"},t.isEditing?s.createElement(ee.Z,{className:K,text:t.name,onChange:e=>t.update({name:e})}):s.createElement("div",{className:"avatar__name"},t.name),t.isEditing?s.createElement(te.Z,{text:t.description,onChange:e=>t.update({description:e})}):s.createElement("small",{className:"avatar__subtitle"},t.description)),s.createElement(re,{model:t,rightNodes:s.createElement(s.Fragment,null,t.isEditing&&s.createElement(ie,{onClick:()=>{t.clone()},apiState:t.apiStateFor(`clone-${t.id}`)}))})),s.createElement("div",{className:(0,n.Z)(Y,"card__body")},t.events.map((e=>s.createElement(X,{event:e,key:e.id})))))}));const de=(0,d.Pi)((()=>{const e=(0,o.oR)("userEventGroupStore"),t=(0,o.oR)("sessionStore"),a=(0,o.oR)("userStore"),{isStudent:d,loggedIn:E}=t,{current:p}=a;return E?d?s.createElement(m.l_,{to:"/"}):s.createElement(r.Z,null,s.createElement("main",{className:(0,n.Z)(l.main)},s.createElement(_.Z,{title:"Pers\xf6nlicher Bereich"},s.createElement(c.Z,{className:(0,n.Z)(l.tabs),queryString:!0,groupId:"user-tab",defaultValue:"account"},s.createElement(i.Z,{value:"account",label:"Account",default:!0},s.createElement("div",{className:(0,n.Z)(l.tab)},p&&s.createElement(S,{user:p}),s.createElement("div",{style:{height:"3em"}}),!p&&s.createElement(v.Z,{text:"Aktualisieren",icon:u.jcD,iconSide:"left",color:"orange",onClick:()=>t.login()}),s.createElement(v.Z,{onClick:()=>t.logout(),text:"Logout",color:"red",noOutline:!0,className:(0,n.Z)(l.logout)}))),s.createElement(i.Z,{value:"events",label:"Events"},s.createElement("div",{className:(0,n.Z)(l.tab)},s.createElement(O,{user:p}))),s.createElement(i.Z,{value:"groups",label:"Gruppen"},s.createElement("div",{className:(0,n.Z)(l.tab)},s.createElement("div",{className:(0,n.Z)(l.groups)},e.userEventGroups.map((e=>s.createElement(oe,{group:e,key:e.id})))))),s.createElement(i.Z,{value:"time-table",label:"Stundenplan"},s.createElement("div",{className:(0,n.Z)(l.tab)},s.createElement(J,null))))))):s.createElement(m.l_,{to:"/login"})}))},1207:(e,t,a)=>{"use strict";a.d(t,{Z:()=>s});const s={heroBanner:"heroBanner_qdFl",buttons:"buttons_AeoN"}},6700:(e,t,a)=>{var s={"./af":2786,"./af.js":2786,"./ar":867,"./ar-dz":4130,"./ar-dz.js":4130,"./ar-kw":6135,"./ar-kw.js":6135,"./ar-ly":6440,"./ar-ly.js":6440,"./ar-ma":7702,"./ar-ma.js":7702,"./ar-sa":6040,"./ar-sa.js":6040,"./ar-tn":7100,"./ar-tn.js":7100,"./ar.js":867,"./az":1083,"./az.js":1083,"./be":9808,"./be.js":9808,"./bg":8338,"./bg.js":8338,"./bm":7438,"./bm.js":7438,"./bn":8905,"./bn-bd":6225,"./bn-bd.js":6225,"./bn.js":8905,"./bo":1560,"./bo.js":1560,"./br":1278,"./br.js":1278,"./bs":622,"./bs.js":622,"./ca":2468,"./ca.js":2468,"./cs":5822,"./cs.js":5822,"./cv":877,"./cv.js":877,"./cy":7373,"./cy.js":7373,"./da":4780,"./da.js":4780,"./de":9740,"./de-at":217,"./de-at.js":217,"./de-ch":894,"./de-ch.js":894,"./de.js":9740,"./dv":5300,"./dv.js":5300,"./el":837,"./el.js":837,"./en-au":8348,"./en-au.js":8348,"./en-ca":7925,"./en-ca.js":7925,"./en-gb":2243,"./en-gb.js":2243,"./en-ie":6436,"./en-ie.js":6436,"./en-il":7207,"./en-il.js":7207,"./en-in":4175,"./en-in.js":4175,"./en-nz":6319,"./en-nz.js":6319,"./en-sg":1662,"./en-sg.js":1662,"./eo":2915,"./eo.js":2915,"./es":5655,"./es-do":5251,"./es-do.js":5251,"./es-mx":6112,"./es-mx.js":6112,"./es-us":1146,"./es-us.js":1146,"./es.js":5655,"./et":5603,"./et.js":5603,"./eu":7763,"./eu.js":7763,"./fa":6959,"./fa.js":6959,"./fi":1897,"./fi.js":1897,"./fil":2549,"./fil.js":2549,"./fo":4694,"./fo.js":4694,"./fr":4470,"./fr-ca":3049,"./fr-ca.js":3049,"./fr-ch":2330,"./fr-ch.js":2330,"./fr.js":4470,"./fy":4415,"./fy.js":4415,"./ga":9295,"./ga.js":9295,"./gd":2101,"./gd.js":2101,"./gl":8794,"./gl.js":8794,"./gom-deva":7884,"./gom-deva.js":7884,"./gom-latn":3168,"./gom-latn.js":3168,"./gu":5349,"./gu.js":5349,"./he":4206,"./he.js":4206,"./hi":94,"./hi.js":94,"./hr":316,"./hr.js":316,"./hu":2138,"./hu.js":2138,"./hy-am":1423,"./hy-am.js":1423,"./id":9218,"./id.js":9218,"./is":135,"./is.js":135,"./it":626,"./it-ch":150,"./it-ch.js":150,"./it.js":626,"./ja":9183,"./ja.js":9183,"./jv":4286,"./jv.js":4286,"./ka":2105,"./ka.js":2105,"./kk":7772,"./kk.js":7772,"./km":8758,"./km.js":8758,"./kn":9282,"./kn.js":9282,"./ko":3730,"./ko.js":3730,"./ku":1408,"./ku.js":1408,"./ky":3291,"./ky.js":3291,"./lb":6841,"./lb.js":6841,"./lo":5466,"./lo.js":5466,"./lt":7010,"./lt.js":7010,"./lv":7595,"./lv.js":7595,"./me":9861,"./me.js":9861,"./mi":5493,"./mi.js":5493,"./mk":5966,"./mk.js":5966,"./ml":7341,"./ml.js":7341,"./mn":5115,"./mn.js":5115,"./mr":370,"./mr.js":370,"./ms":9847,"./ms-my":1237,"./ms-my.js":1237,"./ms.js":9847,"./mt":2126,"./mt.js":2126,"./my":6165,"./my.js":6165,"./nb":4924,"./nb.js":4924,"./ne":6744,"./ne.js":6744,"./nl":3901,"./nl-be":9814,"./nl-be.js":9814,"./nl.js":3901,"./nn":3877,"./nn.js":3877,"./oc-lnc":2135,"./oc-lnc.js":2135,"./pa-in":5858,"./pa-in.js":5858,"./pl":4495,"./pl.js":4495,"./pt":9520,"./pt-br":7971,"./pt-br.js":7971,"./pt.js":9520,"./ro":6459,"./ro.js":6459,"./ru":238,"./ru.js":238,"./sd":950,"./sd.js":950,"./se":490,"./se.js":490,"./si":124,"./si.js":124,"./sk":4249,"./sk.js":4249,"./sl":4985,"./sl.js":4985,"./sq":1104,"./sq.js":1104,"./sr":9131,"./sr-cyrl":9915,"./sr-cyrl.js":9915,"./sr.js":9131,"./ss":5893,"./ss.js":5893,"./sv":8760,"./sv.js":8760,"./sw":1172,"./sw.js":1172,"./ta":7333,"./ta.js":7333,"./te":3110,"./te.js":3110,"./tet":2095,"./tet.js":2095,"./tg":7321,"./tg.js":7321,"./th":9041,"./th.js":9041,"./tk":9005,"./tk.js":9005,"./tl-ph":5768,"./tl-ph.js":5768,"./tlh":9444,"./tlh.js":9444,"./tr":2397,"./tr.js":2397,"./tzl":8254,"./tzl.js":8254,"./tzm":1106,"./tzm-latn":699,"./tzm-latn.js":699,"./tzm.js":1106,"./ug-cn":9288,"./ug-cn.js":9288,"./uk":7691,"./uk.js":7691,"./ur":3795,"./ur.js":3795,"./uz":6791,"./uz-latn":588,"./uz-latn.js":588,"./uz.js":6791,"./vi":5666,"./vi.js":5666,"./x-pseudo":4378,"./x-pseudo.js":4378,"./yo":5805,"./yo.js":5805,"./zh-cn":3839,"./zh-cn.js":3839,"./zh-hk":5726,"./zh-hk.js":5726,"./zh-mo":9807,"./zh-mo.js":9807,"./zh-tw":4152,"./zh-tw.js":4152};function n(e){var t=l(e);return a(t)}function l(e){if(!a.o(s,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return s[e]}n.keys=function(){return Object.keys(s)},n.resolve=l,e.exports=n,n.id=6700},3157:(e,t,a)=>{"use strict";a.d(t,{ZP:()=>c});var s=a(5342),n=a(7462),l=a(7294),r=a(6104),c=(a(8417),a(3935),a(3469),(0,l.forwardRef)((function(e,t){var a=(0,s.u)(e);return l.createElement(r.S,(0,n.Z)({ref:t},a))})))}}]);