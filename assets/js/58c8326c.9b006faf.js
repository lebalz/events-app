"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[712],{7655:(e,t,l)=>{l.r(t),l.d(t,{default:()=>u});var n=l(5229),a=l(7294),r=l(6010),s=l(1217),o=l(1314);const c=(0,s.Pi)((()=>{const[e,t]=(0,a.useState)(null),l=(0,o.o)("jobStore");return a.createElement("div",{className:"App"},a.createElement("form",null,a.createElement("input",{className:(0,r.default)("button","button--secondary"),type:"file",name:"terminplan",accept:".xlsx",style:{marginBottom:"12px"},onChange:e=>t(e.currentTarget.files[0])}),a.createElement("div",{className:(0,r.default)("button","button--secondary"),onClick:()=>{if(!e)throw"No file was selected";l.importExcel(e)}},"Upload")))})),u=(0,s.Pi)((()=>{const e=(0,o.o)("untisStore"),t=(0,o.o)("jobStore");return a.createElement(n.Z,null,a.createElement("div",null,a.createElement(c,null)),a.createElement("div",null,t.jobs.map((e=>{var l;return a.createElement("div",{className:(0,r.default)("alert","alert--info"),role:"alert"},a.createElement("button",{"aria-label":"Close",className:"clean-btn close",type:"button",onClick:()=>{t.destroy(e)}},a.createElement("span",{"aria-hidden":"true"},"\xd7")),null==(l=e.user)?void 0:l.email," - ",e.filename||"|"," - ",e.state," - ",e.events.length)}))),a.createElement("div",{className:(0,r.default)("button","button--primary"),onClick:()=>{console.log("Sync Untis"),e.sync()}},"Sync Untis"))}))}}]);