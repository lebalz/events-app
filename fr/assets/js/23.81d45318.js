try{var e="u">typeof window?window:"u">typeof global?global:"u">typeof globalThis?globalThis:"u">typeof self?self:{};e.SENTRY_RELEASE={id:"ee702b047d9f3ecb283bb9c46585f52c456f8c80"};var t=(new e.Error).stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="6bca089a-3ebf-4f81-83ec-7483e2f29c9c",e._sentryDebugIdIdentifier="sentry-dbid-6bca089a-3ebf-4f81-83ec-7483e2f29c9c")}catch(e){}"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([["23"],{77454(e,t,a){function i(e,t){e.accDescr&&t.setAccDescription?.(e.accDescr),e.accTitle&&t.setAccTitle?.(e.accTitle),e.title&&t.setDiagramTitle?.(e.title)}a.d(t,{S:()=>i}),(0,a(86827).K)(i,"populateCommonDb")},51082(e,t,a){a.d(t,{diagram:()=>C});var i=a(77454),l=a(37851),r=a(90213),s=a(56149),n=a(31293),o=a(86827),c=a(78731),d=a(47829),p=s.UI.pie,g={sections:new Map,showData:!1,config:p},h=g.sections,f=g.showData,u=structuredClone(p),b=(0,o.K)(()=>structuredClone(u),"getConfig"),m=(0,o.K)(()=>{h=new Map,f=g.showData,(0,s.IU)()},"clear"),w=(0,o.K)(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);h.has(e)||(h.set(e,t),n.R.debug(`added new section: ${e}, with value: ${t}`))},"addSection"),y=(0,o.K)(()=>h,"getSections"),$=(0,o.K)(e=>{f=e},"setShowData"),x=(0,o.K)(()=>f,"getShowData"),S={getConfig:b,clear:m,setDiagramTitle:s.ke,getDiagramTitle:s.ab,setAccTitle:s.SV,getAccTitle:s.iN,setAccDescription:s.EI,getAccDescription:s.m7,addSection:w,getSections:y,setShowData:$,getShowData:x},D=(0,o.K)((e,t)=>{(0,i.S)(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},"populateDb"),T={parse:(0,o.K)(async e=>{let t=await (0,c.qg)("pie",e);n.R.debug(t),D(t,S)},"parse")},v=(0,o.K)(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
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
`,"getStyles"),k=(0,o.K)(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),a=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return(0,d.rLf)().value(e=>e.value).sort(null)(a)},"createPieArcs"),C={parser:T,db:S,renderer:{draw:(0,o.K)((e,t,a,i)=>{n.R.debug("rendering pie chart\n"+e);let o=i.db,c=(0,s.D7)(),p=(0,r.$t)(o.getConfig(),c.pie),g=(0,l.D)(t),h=g.append("g");h.attr("transform","translate(225,225)");let{themeVariables:f}=c,[u]=(0,r.I5)(f.pieOuterStrokeWidth);u??=2;let b=p.legendPosition,m=p.textPosition,w=p.donutHole>0&&p.donutHole<=.9?p.donutHole:0,y=(0,d.JLW)().innerRadius(185*w).outerRadius(185),$=(0,d.JLW)().innerRadius(185*m).outerRadius(185*m),x=h.append("g");x.append("circle").attr("cx",0).attr("cy",0).attr("r",185+u/2).attr("class","pieOuterCircle");let S=o.getSections(),D=k(S),T=[f.pie1,f.pie2,f.pie3,f.pie4,f.pie5,f.pie6,f.pie7,f.pie8,f.pie9,f.pie10,f.pie11,f.pie12],v=0;S.forEach(e=>{v+=e});let C=D.filter(e=>"0"!==(e.data.value/v*100).toFixed(0)),A=(0,d.UMr)(T).domain([...S.keys()]);x.selectAll("mySlices").data(C).enter().append("path").attr("d",y).attr("fill",e=>A(e.data.label)).attr("class",e=>{let t="pieCircle";return"hover"===p.highlightSlice?t+=" highlightedOnHover":p.highlightSlice===e.data.label&&(t+=" highlighted"),t}),x.selectAll("mySlices").data(C).enter().append("text").text(e=>(e.data.value/v*100).toFixed(0)+"%").attr("transform",e=>"translate("+$.centroid(e)+")").style("text-anchor","middle").attr("class","slice");let K=h.append("text").text(o.getDiagramTitle()).attr("x",0).attr("y",-200).attr("class","pieTitleText"),R=[...S.entries()].map(([e,t])=>({label:e,value:t})),I=h.selectAll(".legend").data(R).enter().append("g").attr("class","legend");I.append("rect").attr("width",18).attr("height",18).style("fill",e=>A(e.label)).style("stroke",e=>A(e.label)),I.append("text").attr("x",22).attr("y",14).text(e=>o.getShowData()?`${e.label} [${e.value}]`:e.label);let E=Math.max(...I.selectAll("text").nodes().map(e=>e?.getBoundingClientRect().width??0)),O=450,M=490,_=22*R.length;switch(b){case"center":I.attr("transform",(e,t)=>"translate("+(-E/2-22)+","+(22*t-22*R.length/2)+")");break;case"top":O+=_,I.attr("transform",(e,t)=>`translate(${-E/2-22}, ${22*t-185})`),x.attr("transform",()=>`translate(0, ${_+22})`);break;case"bottom":O+=_,I.attr("transform",(e,t)=>"translate("+(-E/2-22)+","+(22*t- -207)+")");break;case"left":M+=22+E,I.attr("transform",(e,t)=>"translate(-207,"+(22*t-22*R.length/2)+")"),x.attr("transform",()=>`translate(${E+18+4}, 0)`);break;default:M+=22+E,I.attr("transform",(e,t)=>"translate(216,"+(22*t-22*R.length/2)+")")}let z=K.node()?.getBoundingClientRect().width??0,L=Math.min(0,225-z/2),W=Math.max(M,225+z/2)-L;g.attr("viewBox",`${L} 0 ${W} ${O}`),(0,s.a$)(g,O,W,p.useMaxWidth)},"draw")},styles:v}}}]);
//# sourceMappingURL=23.81d45318.js.map