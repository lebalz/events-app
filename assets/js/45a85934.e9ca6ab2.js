"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[202],{13238:(e,t,s)=>{s.d(t,{A:()=>o});s(96540);var i=s(36277),n=s(70033),a=s(9165),r=s(79660),d=s(74848);const o=(0,i.PA)((e=>(0,d.jsx)(n.Ay,{text:e.text,icon:(0,d.jsx)(r.In,{path:a.Bp_,size:e.size||r.SK}),iconSide:"left",color:e.color||"primary",apiState:e.apiState,onClick:e.onAdd,title:e.title})))},94958:(e,t,s)=>{s.d(t,{A:()=>g});s(96540);var i=s(34164),n=s(64841),a=s(36277),r=s(19760),d=s(19914),o=s(91168),l=s(27813),c=s(40010),m=s(70033),h=s(9165),u=s(79660),v=s(21312),p=s(46005),x=s(74848);const A=(0,a.PA)((e=>(0,x.jsxs)("div",{className:(0,i.A)(n.A.bulk,"card",e.className),children:[e.preActions,(0,x.jsx)(d.A,{text:`${e.events.length}`,className:(0,i.A)(n.A.badge),icon:h.Bc4,size:u.iJ,iconSide:"left",color:"primary",title:(0,v.T)({message:"{num} Termine",id:"event.bulk_actions.stats.total_events"},{num:e.events.length})}),e.postActions]}))),g=(0,a.PA)((e=>{const t=(0,r.Pj)("userStore"),s=(0,r.Pj)("eventStore"),a=(0,r.Pj)("eventGroupStore"),{current:g}=t,f=e.events.slice().filter((e=>e.selected));if(f.length<1)return(0,x.jsx)(A,{events:e.events,postActions:"left"===e.actionsSide?void 0:e.defaultActions,preActions:"left"===e.actionsSide?e.defaultActions:void 0,className:(0,i.A)(e.className)});const j=f[0]?.state,b=f.every((e=>e.state===j)),y=f.every((e=>e.isValid)),C=f.every((e=>e.authorId===g.id));return(0,x.jsxs)("div",{className:(0,i.A)(n.A.bulk,"card",e.className),children:[(0,x.jsx)(d.A,{text:`${f.length}`,color:"primary",icon:(0,x.jsx)(m.Ay,{onClick:(0,l.XI)((()=>{f.forEach((e=>e.setSelected(!1)))})),icon:h.hyP,size:u.WG,color:"primary",className:(0,i.A)(n.A.close),noOutline:!0,title:(0,v.T)({message:"Auswahl aufheben",id:"event.bulk_actions.clear_selection"})})}),b&&(0,x.jsxs)("div",{className:(0,i.A)(n.A.stateActions),children:[j===c.qO.Draft&&y&&(0,x.jsx)(m.Ay,{text:(0,v.T)({message:"\xdcberpr\xfcfung anfordern",id:"event.bulk_actions.request_review",description:"Request Review"}),icon:(0,x.jsx)(u.In,{path:h.vZI,color:"blue"}),className:(0,i.A)(n.A.blue),iconSide:"left",onClick:()=>{s.requestState(f.map((e=>e.id)),c.qO.Review)}}),j===c.qO.Review&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(m.Ay,{text:(0,v.T)({message:"Bearbeiten",id:"event.bulk_actions.editing",description:"Edit Event"}),icon:(0,x.jsx)(u.In,{path:h.XJe,color:"blue"}),className:(0,i.A)(n.A.blue),iconSide:"left",onClick:()=>{s.requestState(f.map((e=>e.id)),c.qO.Draft)}}),t.current?.isAdmin&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(m.Ay,{text:(0,v.T)({message:"Ver\xf6ffentlichen",id:"event.bulk_actions.publish",description:"Publish Event"}),icon:(0,x.jsx)(u.In,{path:h._Ke,color:"green"}),iconSide:"left",className:(0,i.A)(n.A.success),onClick:()=>{s.requestState(f.map((e=>e.id)),c.qO.Published)}}),(0,x.jsx)(m.Ay,{text:(0,v.T)({message:"Zur\xfcckweisen",id:"event.bulk_actions.refuse",description:"Refuse Event review"}),icon:(0,x.jsx)(u.In,{path:h.ERv,color:"orange"}),iconSide:"left",className:(0,i.A)(n.A.revoke),onClick:()=>{s.requestState(f.map((e=>e.id)),c.qO.Refused)}})]})]})]}),(0,x.jsx)(m.Ay,{text:(0,v.T)({id:"event.bulk_actions.share",message:"\xdcbersicht \xd6ffnen"}),icon:h.xO9,size:u.WG,iconSide:"left",color:"primary",href:`/event?${f.map((e=>e.queryParam)).join("&")}`}),(0,x.jsx)(m.Ay,{text:"Neue Gruppe",icon:h.HzW,size:u.WG,iconSide:"left",onClick:(0,l.XI)((()=>{const e=f.map((e=>e.id));a.create({event_ids:e,name:"Neue Gruppe"})}))}),(0,x.jsx)(p.Ay,{isMulti:!0,isSearchable:!0,isClearable:!0,menuPortalTarget:document.body,styles:{menuPortal:e=>({...e,zIndex:"var(--ifm-z-index-overlay)"})},onChange:(e,t)=>{switch(t.action){case"select-option":const e=a.find(t.option.value);e&&e.addEvents(f);break;case"remove-value":const s=a.find(t.removedValue?.value);s&&s.removeEvents(f);break;case"clear":f.forEach((e=>e.groups.forEach((t=>t.removeEvents([e])))))}},options:a.eventGroups.map((e=>({value:e.id,label:e.name}))),value:f.reduce(((e,t)=>{const s=new Set(t.groups.map((e=>e.id)));return e.filter((e=>{let{id:t}=e;return s.has(t)}))}),f[0]?.groups?.map((e=>({id:e.id,name:e.name})))||[]).map((e=>({value:e.id,label:e.name})))}),C&&(0,x.jsx)(o.A,{onClick:(0,l.XI)((()=>{f.forEach((e=>e.destroy()))}))})]})}))},52887:(e,t,s)=>{s.d(t,{BU:()=>se,Ay:()=>ae});var i=s(96540),n=s(34164),a=s(52976);const r={fullscreenContainer:"fullscreenContainer_XzvQ",editable:"editable_QIou",scroll:"scroll_fHIY",grid:"grid_zwcG",cell:"cell__bO4",deleted:"deleted_u3zH",content:"content__qbl",collapsed:"collapsed_MEvm",currentWeek:"currentWeek_pwnW",actions:"actions_dKMT",today:"today_iCiP",odd:"odd_GbvC",header:"header_VdAS",sortableButton:"sortableButton_GjAE",state:"state_xsxE",fixed:"fixed_ZNcP",group:"group_psvT",current:"current_Yfso",day:"day_eb3c",expand:"expand_f2nL"};var d=s(36277),o=s(19760),l=s(11726),c=s(80515),m=s(74848);const h=(0,d.PA)((e=>{const{event:t}=e;return(0,m.jsx)("div",{style:{gridColumn:"isValid"},className:(0,n.A)("isValid",c.A.isValid,e.className,"grid-isValid"),onClick:()=>console.log(t.id,t._errors),children:e.event.isValid?"":"\u274c"})}));var u=s(59041);const v=(0,d.PA)((e=>{const{event:t}=e;return(0,m.jsx)("div",{"data-id":t.id,style:{gridColumn:"select"},className:(0,n.A)("grid-select",c.A.select,e.className),onClick:e=>{e.stopPropagation()},children:(0,m.jsx)(u.A,{checked:t.selected,onChange:(s,i)=>{e.onSelect(t,s,i)}})})}));var p=s(47579),x=s(70033),A=s(9165),g=s(79660),f=s(15899),j=s(76006),b=s(91168),y=s(24581),C=s(40010),E=s(27813),S=s(21312),k=s(27819);const w=(0,d.PA)((e=>{const{event:t}=e,s=(0,o.Pj)("viewStore"),i=(0,o.Pj)("eventStore");(0,y.l)();return(0,m.jsxs)("div",{style:{gridColumn:"actions"},className:(0,n.A)(e.className,c.A.actions,"grid-actions"),children:[(0,m.jsxs)("div",{className:(0,n.A)(c.A.flex),children:[t.isDraft&&!t.isEditing&&(0,m.jsx)(k.sr,{event:t}),(0,m.jsx)(k.Ay,{event:t,hideEdit:t.isDraft||t.isEditing}),t.isEditing&&(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(f.A,{onClick:e=>{e.preventDefault(),e.stopPropagation(),t.reset()}}),(0,m.jsx)(j.A,{disabled:!t.isDirty||!t.isValid,title:t.isValid?t.isDraft?"\xc4nderungen speichern":"Als neue Version speichern (kann als \xc4nderungsvorschlag eingereicht werden)":"Fehler beheben vor dem Speichern",onClick:e=>{e.preventDefault(),e.stopPropagation(),t.state!==C.qO.Draft?t.save().then((0,E.XI)((e=>{const n=i.find(t.id);n?.reset(),e&&s.setEventModalId(e.id)}))):t.save()},apiState:t.apiStateFor(`save-${t.id}`)}),(0,m.jsx)(b.A,{onClick:()=>t.destroy(),apiState:t.apiStateFor(`destroy-${t.id}`)})]})]}),(0,m.jsx)("div",{className:(0,n.A)(c.A.expand,c.A.flex),children:e.expandeable&&t.isExpanded&&!t.isEditing&&(0,m.jsx)(m.Fragment,{children:(0,m.jsx)(x.Ay,{icon:A.PlR,onClick:e=>{e.preventDefault(),e.stopPropagation(),t.setExpanded(!1)},size:g.iJ,title:(0,S.T)({message:"Auf eine Zeile reduzieren",id:"event.reduce.title",description:"Button Title (hover) to reduce an expanded event in the table view"})})})})]})}));var _=s(19914);const N=(0,d.PA)((e=>{const{event:t}=e;return(0,m.jsx)("div",{style:{gridColumn:"author"},className:(0,n.A)("author",c.A.author,e.className,"grid-author"),children:(0,m.jsx)(_.A,{text:(e.event.author?.shortName||e.event.author?.email)??"-"})})}));var G=s(59655),P=s(56419),T=s(46454),W=s(80036),I=s(34842);const L=(0,d.PA)((e=>{const{event:t}=e;return(0,m.jsx)("div",{style:{gridColumn:"userGroup"},className:(0,n.A)(e.className,c.A.userGroup,t.isExpanded&&c.A.expanded),children:(0,m.jsx)("div",{className:(0,n.A)(c.A.tags),children:(0,m.jsx)(I.A,{event:t})})})}));var z=s(40261),D=s(86885),q=s(32476),B=s(63347);const V=(0,d.PA)((e=>{const{event:t}=e;return t.isEditing?(0,m.jsx)(B.A,{event:t}):(0,m.jsx)(q.A,{...e})})),R=(0,d.PA)((e=>{const{event:t}=e;return(0,m.jsx)("div",{style:{gridColumn:"isDuplicate"},className:(0,n.A)("isDuplicate",c.A.isDuplicate,e.className,"grid-isDuplicate"),children:t.isDuplicate?(0,m.jsx)(x.Ay,{icon:(0,m.jsx)(g.In,{color:"warning",path:A.Znq}),onClick:e=>{e.preventDefault(),e.stopPropagation(),console.log(t.id,t.duplicatedEvents.map((e=>e.id)))}}):""})}));var O=s(2304),J=s(63810);const F={updatedAt:s(18927).A,createdAt:J.A,state:l.A,isValid:h,isDuplicate:R,select:v,kw:p.A,teachingAffected:O.A,actions:w,author:N,day:G.A,description:P.A,start:T.cg,end:T.lV,location:W.A,userGroup:L,departmens:V,classes:z.A,descriptionLong:D.A},M=(0,d.PA)((e=>{const t=(0,o.Pj)("viewStore");return(0,m.jsx)(m.Fragment,{children:e.columns.map(((s,i)=>{const[a,d]=s,o=F[a];let l=d.colSpan??1,c=d.maxWidth,h=d.maxContentWidth;if(e.event.isEditing&&d.onEdit&&(l=d.onEdit.colSpan??1,c=d.onEdit.maxWidth??c,h=d.onEdit.maxContentWidth??h),0===l)return null;const u=`${i+1} / span ${l}`;return(0,m.jsx)("div",{className:(0,n.A)(r.cell,e.event.isDeleted&&"actions"!==a&&r.deleted,r[a],d.className,e.index%2==1&&r.odd,e.event.isToday&&r.today,e.event.isCurrentWeek&&r.currentWeek),style:{gridColumn:u,maxWidth:c,width:"string"==typeof d.sortable?d.sortable:d.width,minWidth:d.direction?d.minWidthWhenActive:void 0,position:d.fixed?"sticky":void 0,left:d.fixed?.left,right:d.fixed?.right},onContextMenu:s=>{""===window.getSelection()?.toString()&&(s.preventDefault(),t.setEventModalId(e.event.id))},onClick:s=>{if("tooltip"!==s.target.getAttribute("data-popup"))if(s.ctrlKey)t.setEventModalId(e.event.id);else if(e.event.isExpanded){if(""!==window.getSelection()?.toString())return;e.event.setExpanded(!1)}else e.event.setExpanded(!0)},children:(0,m.jsx)("div",{style:{maxWidth:h},children:(0,m.jsx)(o,{event:e.event,className:(0,n.A)(r.content,!e.event.isExpanded&&r.collapsed),expandeable:!0,...d.componentProps})})},i)}))})}));var $=s(86123),H=s(2543),K=s.n(H);const Z=(0,d.PA)((e=>{const t=i.useRef(null),[s,a]=i.useState(!1),d=(0,o.Pd)(t,e.tableCssSelector,"0% 30px 0% 30px");return i.useEffect((()=>{d&&a(!0)}),[d]),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)("div",{className:(0,n.A)(r.batch),style:{height:s?void 0:se*e.rowHeight+"px",gridColumnStart:1,gridColumnEnd:-1},ref:t}),s&&e.children]})}));var X=s(43321);const Q=(0,d.PA)((e=>{const{events:t}=e;return 0===t.length?null:(0,m.jsxs)("div",{className:(0,n.A)(r.group,e.isCurrent&&r.current),style:{gridColumn:"1 / -1"},children:[(0,m.jsxs)("span",{children:["KW ",e.group]}),(0,m.jsxs)("span",{children:[(0,X.Yq)(t[0].weekStart)," - ",(0,X.Yq)(t[0].weekEnd)]})]},`group-${e.group}`)}));var Y=s(2761);const U={state:(0,S.T)({message:"Zustand",id:"eventGrid.header.state",description:"Label for the Event Grid Columns"}),createdAt:(0,S.T)({message:"Erstellt am",id:"eventGrid.header.createdAt",description:"Label for the Event Grid Columns"}),updatedAt:(0,S.T)({message:"Ge\xe4ndert am",id:"eventGrid.header.updatedAt",description:"Label for the Event Grid Columns"}),isValid:(0,S.T)({message:"Valid",id:"eventGrid.header.isValid",description:"Label for the Event Grid Columns"}),select:(0,S.T)({message:"Ausw\xe4hlen",id:"eventGrid.header.select",description:"Label for the Event Grid Columns"}),kw:(0,S.T)({message:"KW",id:"eventGrid.header.kw",description:"Label for the Event Grid Columns"}),actions:(0,S.T)({message:"Aktionen",id:"eventGrid.header.actions",description:"Label for the Event Grid Columns"}),author:(0,S.T)({message:"Author",id:"eventGrid.header.author",description:"Label for the Event Grid Columns"}),day:(0,S.T)({message:"Tag",id:"eventGrid.header.day",description:"Label for the Event Grid Columns"}),description:(0,S.T)({message:"Stichworte",id:"eventGrid.header.description",description:"Label for the Event Grid Columns"}),start:(0,S.T)({message:"Start",id:"eventGrid.header.start",description:"Label for the Event Grid Columns"}),end:(0,S.T)({message:"Ende",id:"eventGrid.header.end",description:"Label for the Event Grid Columns"}),location:(0,S.T)({message:"Ort",id:"eventGrid.header.location",description:"Label for the Event Grid Columns"}),userGroup:(0,S.T)({message:"Gruppe",id:"eventGrid.header.userGroup",description:"Label for the Event Grid Columns"}),departmens:(0,S.T)({message:"Abteilungen",id:"eventGrid.header.departmens",description:"Label for the Event Grid Columns"}),classes:(0,S.T)({message:"Klassen",id:"eventGrid.header.classes",description:"Label for the Event Grid Columns"}),descriptionLong:(0,S.T)({message:"Beschreibung",id:"eventGrid.header.descriptionLong",description:"Label for the Event Grid Columns"}),isDuplicate:(0,S.T)({message:"Duplikat",id:"eventGrid.header.isDuplicate",description:"Label for the Event Grid Columns"})},ee=(0,d.PA)((e=>{let t,s=U[e.name];switch(e.name){case"actions":s=(0,m.jsx)(g.In,{path:A.QKT,size:g.iJ}),t=(0,S.T)({message:"Aktionen",id:"eventGrid.header.actions.title"});break;case"select":s=(0,m.jsx)("div",{style:{paddingLeft:"0.2em"},children:(0,m.jsx)(u.A,{checked:e.active,onChange:e.onClick})});break;case"state":s=(0,m.jsx)(g.In,{path:A.d2P,size:g.iJ});break;case"isValid":s=(0,m.jsx)(g.In,{path:A.vZI,size:g.iJ});break;case"teachingAffected":s=(0,m.jsx)(g.In,{path:A.zq3,size:g.iJ}),t=(0,S.T)({message:'Sortieren nach "Unterricht betroffen?"',id:"eventGrid.header.teachingAffected.title",description:"Message when hovering the icon"})}return e.sortable&&("string"!=typeof s&&(s=(0,m.jsx)(x.a2,{icon:s})),t||(t=(0,S.T)({message:'Sortieren nach "{column}"',id:"eventGrid.header.sortBy.title"},{column:U[e.name]}))),(0,m.jsx)("div",{className:(0,n.A)(r.cell,r.header,e.className,e.sortable&&r.sortable,e.active&&r.active,e.fixed&&r.fixed),style:{gridColumn:e.gridColumn,width:"string"==typeof e.sortable?e.sortable:e.width,maxWidth:e.maxWidth,minWidth:e.direction?e.minWidthWhenActive:void 0,position:e.fixed?"sticky":void 0,left:e.fixed?.left,right:e.fixed?.right},children:e.sortable?(0,m.jsx)(x.Ay,{size:g.iJ,className:(0,n.A)(r.sortableButton),iconSide:"left",disabled:!e.sortable,icon:e.active?"asc"===e.active?A.xJP:A.LLR:void 0,onClick:e.sortable?e.onClick:void 0,title:t,children:s}):(0,m.jsx)(Y.A,{title:t,children:(0,m.jsx)("span",{className:(0,n.A)(r.content,r[e.name]),children:s})})})})),te={updatedAt:{width:"7em",sortable:!0,minWidthWhenActive:"7em"},createdAt:{width:"7em",sortable:!0,minWidthWhenActive:"7em"},state:{width:"2.1em",sortable:!0,minWidthWhenActive:"4em"},isValid:{width:"2.1em",sortable:!0,minWidthWhenActive:"4em"},isDuplicate:{sortable:!0},select:{width:"2.3em",componentProps:{onSelect:()=>{}}},kw:{width:"2.8em",sortable:"3.3em",minWidthWhenActive:"4.5em"},teachingAffected:{width:"2.1em",sortable:!0,minWidthWhenActive:"4em",componentProps:{toggleExpanded:!0}},author:{width:"5em",sortable:!0,minWidthWhenActive:"6em"},day:{width:"2.8em"},description:{width:"16em"},start:{sortable:!0},end:{sortable:!0},location:{maxWidth:"10em"},userGroup:{maxContentWidth:"7em"},departmens:{maxContentWidth:"7em",onEdit:{maxWidth:"25em",colSpan:2,maxContentWidth:"25em"}},classes:{maxContentWidth:"8em",onEdit:{colSpan:0}},descriptionLong:{width:"20em"},actions:{}},se=15,ie=i.memo(Z),ne=(0,$.Aj)((e=>{const t=K().orderBy(e.events,[e.orderBy,"start"],[e.direction,"asc"]),s=[];if(e.groupBy){const i=K().groupBy(t,e.groupBy);let n=0;Object.keys(i).sort().forEach((t=>{s.push({type:"group",groupBy:e.groupBy,group:t.split("-")[1].replace(/^0+/,""),isCurrent:t===a.u,events:i[t]}),i[t].forEach((e=>{s.push({type:"event",index:n,model:e}),n++}))}))}else t.forEach(((e,t)=>{s.push({type:"event",model:e,index:t})}));return K().chunk(s,se)})),ae=(0,d.PA)(i.forwardRef(((e,t)=>{const[s,a]=i.useState("start"),[d,o]=i.useState("asc"),l=i.useMemo((()=>ne({events:e.events,groupBy:e.groupBy,orderBy:s,direction:d})),[e.events,s,d]),[c,h]=i.useState([]);i.useEffect((()=>{const t=[],i=(e,t,s)=>{if(t&&s){const s=l.flat().filter((e=>"event"===e.type)).map((e=>e.model)),i=s.findIndex((t=>t.id===e.id)),n=s.slice(0,i).findLastIndex((e=>e.selected));n>-1&&s.slice(n,i).forEach((e=>e.setSelected(t)))}e.setSelected(t)};e.columns.forEach(((e,n)=>{const a="string"!=typeof e,r=a?e[0]:e,o={...te[r],..."select"===r?{componentProps:{onSelect:i}}:{}};if(!o)return null;t.push([r,{...o,...a?e[1]:{},direction:s===r?d:void 0}])})),h(t)}),[e.columns,l]);const u=`repeat(${e.columns.length}, max-content)`;return(0,m.jsx)("div",{className:(0,n.A)(r.scroll,e.className),ref:t,children:(0,m.jsxs)("div",{className:(0,n.A)(r.grid),style:{gridTemplateColumns:u},children:[c.map(((t,i)=>{const[n,r]=t;let l=n===s?d:void 0,c=()=>{n===s?o("asc"===d?"desc":"asc"):(a(n),o("asc"))};return"select"===n&&(l=e.events.every((e=>e.selected)),c=()=>{e.events.forEach((e=>e.setSelected(!l)))}),(0,m.jsx)(ee,{name:n,gridColumn:i+1,active:l,onClick:c,...r},i)})),l.map(((e,t)=>(0,m.jsx)(ie,{rowHeight:30,tableCssSelector:r.grid,children:e.map((e=>{if("group"===e.type)return(0,m.jsx)(Q,{...e},e.group);const t=e.model;return(0,m.jsx)(M,{event:t,columns:c,index:e.index},t.id)}))},t)))]})})})))},15899:(e,t,s)=>{s.d(t,{A:()=>l});s(96540);var i=s(34164),n=s(16931),a=s(79660),r=s(70033),d=s(21312),o=s(74848);const l=e=>(0,o.jsx)(r.Ay,{title:e.title??(0,d.T)({message:"\xc4nderungen verwerfen",id:"share.button.discard.title",description:"Text of the button discard"}),...(0,r.Fj)(e),className:(0,i.A)(n.A.discard,"button--sm",e.className),color:"secondary",onClick:e.onClick,icon:(0,o.jsx)(a.wD,{size:e.size??a.iJ})})},76006:(e,t,s)=>{s.d(t,{A:()=>l});s(96540);var i=s(34164),n=s(16931),a=s(79660),r=s(70033),d=s(21312),o=s(74848);const l=e=>(0,o.jsx)(r.Ay,{title:e.title??(0,d.T)({message:"Speichern",id:"share.button.save.title",description:"Text of the button save"}),...(0,r.Fj)(e),className:(0,i.A)(n.A.save,e.className),color:"green",onClick:e.onClick,icon:e.newVersion?(0,o.jsx)(a.dQ,{size:e.size??a.iJ}):(0,o.jsx)(a.LP,{size:e.size??a.iJ})})},61151:(e,t,s)=>{s.r(t),s.d(t,{default:()=>C});s(96540);var i=s(36277),n=s(53649),a=s(19760),r=s(34164),d=s(61771),o=s(91168),l=s(13238),c=s(52887),m=s(40010);const h="main_Aenq",u="card_pLXk";var v=s(94958),p=s(11470),x=s(19365),A=s(21312),g=s(43321),f=s(24581),j=s(74848);const b=["isValid","state","select",["teachingAffected",{componentProps:{show:"icon"}}],"kw","day","description","start","end","userGroup","location","departmens","classes","descriptionLong",["actions",{fixed:{right:0}}]],y=[...b.slice(0,3),"author",...b.slice(3)],C=(0,i.PA)((()=>{const e=(0,a.Pj)("eventStore"),t=(0,a.Pj)("userStore"),s=(0,a.Pj)("jobStore"),i=(0,a.Pj)("viewStore"),C=(t.current,i.usersEvents({ignoreImported:!0,states:[m.qO.Draft]})),E=i.usersEvents({ignoreImported:!0,states:[m.qO.Review,m.qO.Refused]}),S=t.current?.isAdmin?i.allEvents({states:[m.qO.Review]}):[],k=i.usersEvents({ignoreImported:!0,states:[m.qO.Published]}),w=i.usersEvents({onlyDeleted:!0}),_=(0,f.l)();return(0,j.jsx)(n.A,{children:(0,j.jsx)("main",{className:(0,r.A)(h),children:(0,j.jsxs)(p.A,{lazy:!0,children:[(0,j.jsx)(x.A,{value:"my-events",label:(0,A.T)({message:"Unver\xf6ffentlicht",id:"my-events.tab.notpublished"}),children:C.length>0&&(0,j.jsxs)("div",{className:(0,r.A)(u,"card"),children:[(0,j.jsx)("div",{className:(0,r.A)("card__header"),children:(0,j.jsx)("h3",{children:(0,j.jsx)(A.A,{id:"my-events.unpublished",description:"text unpublished",children:"Unver\xf6ffentlicht"})})}),(0,j.jsxs)("div",{className:(0,r.A)("card__body"),children:[(0,j.jsx)(v.A,{events:C,defaultActions:(0,j.jsx)(l.A,{text:(0,A.T)({message:"Neues Event",description:"AddButton text",id:"event.AddButton.text"}),onAdd:()=>{const t=(0,g.P_)(new Date),s=new Date(t);s.setHours(s.getHours()+1),e.create({start:t.toISOString(),end:s.toISOString()}).then((e=>{"mobile"===_&&i.setEventModalId(e.id)}))},apiState:e.apiStateFor("create")})}),(0,j.jsx)(c.Ay,{events:C,columns:b})]})]})}),E.length>0&&(0,j.jsx)(x.A,{value:"reviewed",label:(0,A.T)({message:"Review",id:"my-events.tab.review"}),children:(0,j.jsxs)("div",{className:(0,r.A)(u,"card"),children:[(0,j.jsx)("div",{className:(0,r.A)("card__header"),children:(0,j.jsx)("h3",{children:(0,j.jsx)(A.A,{id:"my-events.review",description:"text In Review",children:"Im Review"})})}),(0,j.jsxs)("div",{className:(0,r.A)("card__body"),children:[(0,j.jsx)(v.A,{events:E}),(0,j.jsx)(c.Ay,{events:E,columns:b})]})]})}),S.length>0&&(0,j.jsx)(x.A,{value:"admin-review",label:(0,A.T)({message:"Admin",id:"my-events.tab.admin"}),children:(0,j.jsxs)("div",{className:(0,r.A)(u,"card"),children:[(0,j.jsx)("div",{className:(0,r.A)("card__header"),children:(0,j.jsx)("h3",{children:(0,j.jsx)(A.A,{id:"my-events.review.furadmin",description:"text In Review - wait for admin",children:"Im ReviewReview Anfragen f\xfcr Admin"})})}),(0,j.jsxs)("div",{className:(0,r.A)("card__body"),children:[(0,j.jsx)(v.A,{events:S}),(0,j.jsx)(c.Ay,{events:S,columns:y})]})]})}),k.length>0&&(0,j.jsx)(x.A,{value:"published",label:(0,A.T)({message:"Ver\xf6ffentlicht",id:"my-events.tab.published"}),children:(0,j.jsxs)("div",{className:(0,r.A)(u,"card"),children:[(0,j.jsx)("div",{className:(0,r.A)("card__header"),children:(0,j.jsx)("h3",{children:(0,j.jsx)(A.A,{id:"my-events.published",description:"published",children:"Ver\xf6ffentlicht"})})}),(0,j.jsxs)("div",{className:(0,r.A)("card__body"),children:[(0,j.jsx)(v.A,{events:k}),(0,j.jsx)(c.Ay,{events:k,columns:b})]})]})}),w.length>0&&(0,j.jsx)(x.A,{value:"deleted",label:(0,A.T)({message:"Gel\xf6scht",id:"my-events.tab.deleted"}),children:(0,j.jsxs)("div",{className:(0,r.A)(u,"card"),children:[(0,j.jsx)("div",{className:(0,r.A)("card__header"),children:(0,j.jsx)("h3",{children:(0,j.jsx)(A.A,{id:"my-events.deleted",description:"deleted",children:"Gel\xf6scht"})})}),(0,j.jsx)("div",{className:(0,r.A)("card__body"),children:(0,j.jsx)(c.Ay,{events:w,columns:b})})]})}),s.importJobs.length>0&&(0,j.jsx)(x.A,{value:"import",label:"Import",children:s.importJobs.map(((e,t)=>{const n=i.allEvents({jobId:e.id,orderBy:"isValid-desc"});return(0,j.jsx)(d.A,{summary:(0,j.jsxs)("summary",{children:[e.user?.email," - ",e.filename||"|"," - ",e.state," - ",n.length]}),children:(0,j.jsxs)("div",{children:[(0,j.jsx)(v.A,{events:n,defaultActions:(0,j.jsx)(o.A,{onClick:()=>{s.destroy(e)},text:(0,A.T)({message:"Job L\xf6schen",id:"my-events.deleted.text",description:"my-events.deleted.text"}),flyoutSide:"right",iconSide:"right",apiState:s.apiStateFor(`destroy-${e.id}`)})}),(0,j.jsx)(c.Ay,{events:n,columns:b})]})},t)}))})]})})})}))},64841:(e,t,s)=>{s.d(t,{A:()=>i});const i={bulk:"bulk_BjmH",stateActions:"stateActions_Zpyz",success:"success_BGHQ",revoke:"revoke_V7Y_",blue:"blue_xNLm",badge:"badge_zSdE",close:"close_v7Fh"}}}]);