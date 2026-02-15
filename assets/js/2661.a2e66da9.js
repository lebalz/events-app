try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{};e.SENTRY_RELEASE={id:"94011591dc42a058e5ae059c339bc6ce6786d0d4"};var t=(new e.Error).stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="3f624145-e4cb-494d-83c2-eb74da918afd",e._sentryDebugIdIdentifier="sentry-dbid-3f624145-e4cb-494d-83c2-eb74da918afd")}catch(e){}"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([["2661"],{25871:function(e,t,a){function i(e,t){e.accDescr&&t.setAccDescription?.(e.accDescr),e.accTitle&&t.setAccTitle?.(e.accTitle),e.title&&t.setDiagramTitle?.(e.title)}a.d(t,{S:()=>i}),(0,a(40797).K2)(i,"populateCommonDb")},69412:function(e,t,a){a.d(t,{diagram:()=>C});var i=a(73590),l=a(25871),r=a(13226),s=a(58365),n=a(40797),o=a(78731),c=a(47829),d=s.UI.pie,p={sections:new Map,showData:!1,config:d},u=p.sections,f=p.showData,g=structuredClone(d),h=(0,n.K2)(()=>structuredClone(g),"getConfig"),m=(0,n.K2)(()=>{u=new Map,f=p.showData,(0,s.IU)()},"clear"),w=(0,n.K2)(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);u.has(e)||(u.set(e,t),n.Rm.debug(`added new section: ${e}, with value: ${t}`))},"addSection"),b=(0,n.K2)(()=>u,"getSections"),y=(0,n.K2)(e=>{f=e},"setShowData"),x=(0,n.K2)(()=>f,"getShowData"),S={getConfig:h,clear:m,setDiagramTitle:s.ke,getDiagramTitle:s.ab,setAccTitle:s.SV,getAccTitle:s.iN,setAccDescription:s.EI,getAccDescription:s.m7,addSection:w,getSections:b,setShowData:y,getShowData:x},D=(0,n.K2)((e,t)=>{(0,l.S)(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},"populateDb"),T={parse:(0,n.K2)(async e=>{let t=await (0,o.qg)("pie",e);n.Rm.debug(t),D(t,S)},"parse")},$=(0,n.K2)(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),v=(0,n.K2)(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),a=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1).sort((e,t)=>t.value-e.value);return(0,c.rLf)().value(e=>e.value)(a)},"createPieArcs"),C={parser:T,db:S,renderer:{draw:(0,n.K2)((e,t,a,l)=>{n.Rm.debug("rendering pie chart\n"+e);let o=l.db,d=(0,s.D7)(),p=(0,r.$t)(o.getConfig(),d.pie),u=(0,i.D)(t),f=u.append("g");f.attr("transform","translate(225,225)");let{themeVariables:g}=d,[h]=(0,r.I5)(g.pieOuterStrokeWidth);h??=2;let m=p.textPosition,w=(0,c.JLW)().innerRadius(0).outerRadius(185),b=(0,c.JLW)().innerRadius(185*m).outerRadius(185*m);f.append("circle").attr("cx",0).attr("cy",0).attr("r",185+h/2).attr("class","pieOuterCircle");let y=o.getSections(),x=v(y),S=[g.pie1,g.pie2,g.pie3,g.pie4,g.pie5,g.pie6,g.pie7,g.pie8,g.pie9,g.pie10,g.pie11,g.pie12],D=0;y.forEach(e=>{D+=e});let T=x.filter(e=>"0"!==(e.data.value/D*100).toFixed(0)),$=(0,c.UMr)(S);f.selectAll("mySlices").data(T).enter().append("path").attr("d",w).attr("fill",e=>$(e.data.label)).attr("class","pieCircle"),f.selectAll("mySlices").data(T).enter().append("text").text(e=>(e.data.value/D*100).toFixed(0)+"%").attr("transform",e=>"translate("+b.centroid(e)+")").style("text-anchor","middle").attr("class","slice"),f.append("text").text(o.getDiagramTitle()).attr("x",0).attr("y",-200).attr("class","pieTitleText");let C=[...y.entries()].map(([e,t])=>({label:e,value:t})),k=f.selectAll(".legend").data(C).enter().append("g").attr("class","legend").attr("transform",(e,t)=>"translate(216,"+(22*t-22*C.length/2)+")");k.append("rect").attr("width",18).attr("height",18).style("fill",e=>$(e.label)).style("stroke",e=>$(e.label)),k.append("text").attr("x",22).attr("y",14).text(e=>o.getShowData()?`${e.label} [${e.value}]`:e.label);let A=512+Math.max(...k.selectAll("text").nodes().map(e=>e?.getBoundingClientRect().width??0));u.attr("viewBox",`0 0 ${A} 450`),(0,s.a$)(u,450,A,p.useMaxWidth)},"draw")},styles:$}}}]);
//# sourceMappingURL=2661.a2e66da9.js.map