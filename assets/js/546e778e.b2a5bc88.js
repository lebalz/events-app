"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[184],{94391:(e,i,s)=>{s.d(i,{A:()=>v});var a=s(96540),t=s(34164);const n={icalSettings:"icalSettings_P2Kc",card:"card_BAFx",icalButtons:"icalButtons_Em9T",icalWrapper:"icalWrapper_jFa6",publicIcal:"publicIcal_ow2H",icalButton:"icalButton_TmPn",department:"department_RJY8",ical:"ical_hx_l",personal:"personal_PPXO"};var l=s(36277),c=s(19760),r=s(21312),o=s(70033),d=s(9165),u=s(79660),m=s(84765),p=s(44586),h=s(2543),x=s.n(h),A=s(28774),j=s(70347),b=s(74848);const g=e=>{const[i,s]=a.useState("none");a.useEffect((()=>{if(["none","spin"].includes(i))return;const e=setTimeout((()=>s("none")),2e3);return()=>clearTimeout(e)}),[i]);let t=e.icon??(0,b.jsx)(u.QR,{size:e.size});switch(i){case"spin":t=(0,b.jsx)(u.Rh,{size:e.size});break;case"copied":t=(0,b.jsx)(u.wV,{size:e.size});break;case"error":t=(0,b.jsx)(u.$D,{size:e.size})}return(0,b.jsx)(o.Ay,{title:e.title??(0,r.T)({message:"Kopieren",id:"share.button.copy.title",description:"Text of the button copy"}),...(0,o.Fj)(e),onClick:i=>{i.preventDefault(),i.stopPropagation(),s("spin"),navigator.clipboard.writeText(e.value).then((()=>{s("copied")})).catch((()=>{s("error")}))},icon:t})},v=(0,l.PA)((e=>{const{i18n:i}=(0,p.A)(),s=(0,c.Pj)("viewStore"),a=(0,c.Pj)("userStore"),{currentLocale:l}=((0,c.Pj)("untisStore"),(0,c.Pj)("departmentStore"),i),h=a.current;return(0,b.jsxs)("div",{className:(0,t.A)(n.icalSettings),children:[h&&(0,b.jsxs)("div",{className:(0,t.A)("card",n.personal,n.card),children:[(0,b.jsxs)("div",{className:(0,t.A)("card__header"),children:[(0,b.jsx)("h4",{children:(0,b.jsx)(r.A,{id:"ical.section.personal",description:"personal ical sync address",children:"Pers\xf6nlicher Kalender"})}),(0,b.jsx)(r.A,{id:"ical.section.personal.description",description:"text which explains, which things are included in the personal calendar",children:"Dieser Kalender ist mit dem pers\xf6nlichen Stundenplan abgeglichen und zeigt nur die f\xfcr Sie relevanten Termine an. Es werden administrative Termine (bspw. Konvente), den Unterricht betreffende Lektionen (bspw. eine Klasse ist nicht anwesend) und f\xfcr KLP's die eigene Klasse betreffenden Termine angezeigt."})]}),(0,b.jsx)("div",{className:(0,t.A)("card__body"),children:h.untisId?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:(0,t.A)(n.icalButtons),children:(0,b.jsx)(o.Ay,{href:`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${m.l5}/ical/${l}/${h.icalUrl}&name=${(0,r.T)({message:"GBSL",id:"user.ical.outlook.calendar-name",description:"Name of the calendar in Outlook"})}`,target:"_blank",text:(0,r.T)({message:"Outlook",id:"user.ical.outlook-button.text",description:"Button text for adding the calendar to Outlook"}),title:(0,r.T)({message:"Abonniere den Kalender in Outlook",id:"user.ical.outlook-button.title",description:"Button text for adding the calendar to Outlook"}),icon:d.w9E,color:"primary",size:u.iJ})}),(0,b.jsxs)("div",{className:(0,t.A)(n.ical),children:[(0,b.jsx)(g,{value:`${m.l5}/ical/${l}/${h.icalUrl}`,size:u.WG,icon:d.ADG,title:(0,r.T)({message:"Kopiere den Link zum pers\xf6nlichen Kalender.",id:"user.ical.personal-calendar.copy-button.title"}),className:(0,t.A)(n.copyButton)}),h.icalUrl&&`${m.l5}/ical/${l}/${h.icalUrl}`]})]}):(0,b.jsxs)("div",{children:[(0,b.jsx)(r.A,{id:"ical.user_without_untis.message",description:"Message for a user, that is logged in, but is not linked to a untis account",children:"Sie m\xfcssen sich zuerst mit Untis verbinden, um einen pers\xf6nlichen Kalender zu erhalten."}),(0,b.jsx)(A.A,{to:"/user?user-tab=account",children:(0,b.jsx)(r.A,{id:"ical.link.text.settings",description:"Link text to navigate to the user settings",children:"Einstellungen"})})]})})]}),(0,b.jsxs)("div",{className:(0,t.A)("card",n.card),children:[(0,b.jsxs)("div",{className:(0,t.A)("card__header"),children:[(0,b.jsx)("h4",{children:(0,b.jsx)(r.A,{id:"ical.section.classes",description:"classes ical sync address",children:"Klassen Kalender"})}),(0,b.jsx)(j.A,{text:s.icalListClassFilter,onChange:e=>s.setIcalListClassFilter(e),placeholder:(0,r.T)({message:"Filtern nach Klasse",id:"user.ical.filter.class.placeholder",description:"Placeholder text for the filter input"})})]}),(0,b.jsx)("div",{className:(0,t.A)("card__body"),children:(0,b.jsx)("div",{className:(0,t.A)(n.icalWrapper),children:x().orderBy(s.icalListClassesFiltered,["name"],["asc"]).map((e=>(0,b.jsxs)("div",{className:(0,t.A)(n.publicIcal),children:[(0,b.jsxs)("div",{className:(0,t.A)(n.icalButton),children:[(0,b.jsx)(o.Ay,{href:`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${m.l5}/ical/${l}/${e.name}.ics&name=${e.displayName}`,target:"_blank",text:e.displayName,title:(0,r.T)({message:"Abonniere den Kalender in Outlook",id:"user.ical.outlook-button.title",description:"Button text for adding the calendar to Outlook"}),icon:d.w9E,size:u.iJ,color:e.department?.color}),(0,b.jsx)(o.Ay,{href:`${m.l5}/ical/${l}/${e.name}.ics`,icon:d.Bxv,text:e.displayName,color:e.department?.color,size:u.iJ,iconSide:"right"})]}),(0,b.jsxs)("div",{className:(0,t.A)(n.ical),children:[(0,b.jsx)(g,{value:`${m.l5}/ical/${l}/${e.name.replaceAll("/","_")}.ics`,size:u.WG,icon:d.ADG,title:(0,r.T)({message:"Kopiere den Link zum Kalender {name}.",id:"user.ical.copy-button.title"},{name:e.name}),className:(0,t.A)(n.copyButton)}),`${m.l5}/ical/${l}/${e.name}.ics`]})]},e.name)))})})]}),(0,b.jsxs)("div",{className:(0,t.A)("card",n.card),children:[(0,b.jsxs)("div",{className:(0,t.A)("card__header"),children:[(0,b.jsx)("h4",{children:(0,b.jsx)(r.A,{id:"ical.section.departments",description:"departments ical sync address",children:"Abteilungs-Kalender"})}),(0,b.jsx)(j.A,{text:s.icalListDepartmentsFilter,onChange:e=>s.setIcalListDepartmentsFilter(e),placeholder:(0,r.T)({message:"Filtern nach Schule",id:"user.ical.filter.department.placeholder",description:"Placeholder text for the filter input"})})]}),(0,b.jsx)("div",{className:(0,t.A)("card__body"),children:(0,b.jsx)("div",{className:(0,t.A)(n.icalWrapper),children:x().orderBy(s.icalListDepartmentsFiltered,["name"],["asc"]).map((e=>(0,b.jsxs)("div",{className:(0,t.A)(n.publicIcal),children:[(0,b.jsxs)("div",{className:(0,t.A)(n.icalButton,n.department),children:[(0,b.jsx)(o.Ay,{href:`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${m.l5}/ical/${l}/${e.name.replaceAll("/","_")}.ics&name=${e.name}`,target:"_blank",text:e.name,color:e.color,title:(0,r.T)({message:"Abonniere den Kalender in Outlook",id:"user.ical.outlook-button.title",description:"Button text for adding the calendar to Outlook"}),icon:d.w9E,size:u.iJ}),(0,b.jsx)(o.Ay,{href:`${m.l5}/ical/${l}/${e.name.replaceAll("/","_")}.ics`,icon:d.Bxv,text:e.name,color:e.color,size:u.iJ,iconSide:"right"})]}),(0,b.jsxs)("div",{className:(0,t.A)(n.ical),children:[(0,b.jsx)(g,{value:`${m.l5}/ical/${l}/${e.name.replaceAll("/","_")}.ics`,size:u.WG,icon:d.ADG,title:(0,r.T)({message:"Kopiere den Link zum Kalender {name}.",id:"user.ical.copy-button.title"},{name:e.name}),className:(0,t.A)(n.copyButton)}),`${m.l5}/ical/${l}/${e.name.replaceAll("/","_")}.ics`]})]},e.name)))})})]})]})}))},45109:(e,i,s)=>{s.d(i,{A:()=>c});s(96540);var a=s(34164);const t="section_Ytos";var n=s(36277),l=s(74848);const c=(0,n.PA)((e=>(0,l.jsx)("div",{className:(0,a.A)("hero","shadow--lw",t,e.className),children:(0,l.jsxs)("div",{className:(0,a.A)("container"),children:[e.title&&(0,l.jsx)("h1",{className:(0,a.A)("hero__title"),children:e.title}),e.subtitle&&(0,l.jsx)("p",{className:(0,a.A)("hero__subtitle"),children:e.subtitle}),(0,l.jsx)("div",{children:e.children})]})})))},70347:(e,i,s)=>{s.d(i,{A:()=>c});var a=s(96540),t=s(34164);const n="textInput_K1iv";var l=s(74848);const c=e=>{const i=a.useRef(null);return a.useEffect((()=>{i.current&&e.autoFocus&&i.current.focus()}),[i,e.autoFocus]),(0,l.jsx)("div",{className:(0,t.A)(e.className,n),children:(0,l.jsx)("input",{ref:i,type:e.search?"search":"text",value:e.text,placeholder:e.placeholder,autoFocus:e.autoFocus,onChange:i=>{e.onChange(i.currentTarget.value)}})})}},93842:(e,i,s)=>{s.r(i),s.d(i,{default:()=>u});s(96540);var a=s(34164),t=s(42075),n=s(87798),l=s(36277),c=s(94391),r=s(45109),o=s(21312),d=s(74848);const u=(0,l.PA)((()=>(0,d.jsx)(n.A,{children:(0,d.jsx)("main",{className:(0,a.A)(t.A.main),children:(0,d.jsx)(r.A,{title:(0,o.T)({message:"Kalender Abonnieren",id:"abo.section.title.subscribe-calendar",description:"subscribe to calendars .ics file"}),subtitle:(0,o.T)({message:"Abonniere Kalender in einem Kalenderprogramm wie z.B. Outlook",id:"abo.section.subtitle.subscribe-calendar",description:"subscribe to calendars .ics file"}),children:(0,d.jsx)(c.A,{})})})})))},42075:(e,i,s)=>{s.d(i,{A:()=>a});const a={main:"main_bgR9",logout:"logout_gfEI",tabItem:"tabItem_N2wC",tabs:"tabs_eTSi",tab:"tab_X6VD"}}}]);