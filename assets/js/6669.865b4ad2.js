try{var e="u">typeof window?window:"u">typeof global?global:"u">typeof globalThis?globalThis:"u">typeof self?self:{};e.SENTRY_RELEASE={id:"49df63912cc6efe2d141a16957b28753907cf7d3"};var t=(new e.Error).stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="04b4da53-c75e-4255-bed1-233137c74398",e._sentryDebugIdIdentifier="sentry-dbid-04b4da53-c75e-4255-bed1-233137c74398")}catch(e){}"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([["6669"],{77454(e,t,r){function i(e,t){e.accDescr&&t.setAccDescription?.(e.accDescr),e.accTitle&&t.setAccTitle?.(e.accTitle),e.title&&t.setDiagramTitle?.(e.title)}r.d(t,{S:()=>i}),(0,r(86827).K)(i,"populateCommonDb")},7827(e,t,r){r.d(t,{$:()=>O,U:()=>q,db:()=>b});var i=r(37851),a=r(56149),n=r(31293),o=r(86827),l="",s="",d="",m=[],c=new Map,h=(0,o.K)(e=>(0,a.jZ)(e,(0,a.D7)()),"sanitizeText"),p=(0,o.K)(e=>{switch(e.type){case"terminal":return{...e,value:h(e.value)};case"nonterminal":return{...e,name:h(e.name)};case"sequence":return{...e,elements:e.elements.map(p)};case"choice":return{...e,alternatives:e.alternatives.map(p)};case"optional":return{...e,element:p(e.element)};case"repetition":return{...e,element:p(e.element),separator:e.separator?p(e.separator):void 0};case"special":return{...e,text:h(e.text)}}},"sanitizeAstNode"),u=(0,o.K)(()=>{l="",s="",d="",m.length=0,c.clear(),(0,a.IU)(),n.R.debug("[Railroad] Database cleared")},"clear"),g=(0,o.K)(e=>{l=h(e),n.R.debug("[Railroad] Title set:",e)},"setTitle"),f=(0,o.K)(()=>l,"getTitle"),T=(0,o.K)(e=>{let t={...e,name:h(e.name),definition:p(e.definition),comment:e.comment?h(e.comment):void 0};n.R.debug("[Railroad] Adding rule:",t.name),c.has(t.name)&&n.R.warn(`[Railroad] Rule '${t.name}' is already defined. Overwriting.`),m.push(t),c.set(t.name,t)},"addRule"),x=(0,o.K)(()=>m,"getRules"),w=(0,o.K)(e=>c.get(e),"getRule"),k=(0,o.K)(e=>{s=h(e).replace(/^\s+/g,""),n.R.debug("[Railroad] Accessibility title set:",e)},"setAccTitle"),C=(0,o.K)(()=>s,"getAccTitle"),y=(0,o.K)(e=>{d=h(e).replace(/\n\s+/g,"\n"),n.R.debug("[Railroad] Accessibility description set:",e)},"setAccDescription"),b={clear:u,setTitle:g,getTitle:f,addRule:T,getRules:x,getRule:w,setAccTitle:k,getAccTitle:C,setAccDescription:y,getAccDescription:(0,o.K)(()=>d,"getAccDescription"),setDiagramTitle:g,getDiagramTitle:f},$={compactMode:!1,padding:10,verticalSeparation:8,horizontalSeparation:10,arcRadius:10,fontSize:14,fontFamily:"monospace",terminalFill:"#FFFFC0",terminalStroke:"#000000",terminalTextColor:"#000000",nonTerminalFill:"#FFFFFF",nonTerminalStroke:"#000000",nonTerminalTextColor:"#000000",lineColor:"#000000",strokeWidth:2,markerFill:"#000000",commentFill:"#E8E8E8",commentStroke:"#888888",commentTextColor:"#666666",specialFill:"#F0E0FF",specialStroke:"#8800CC",ruleNameColor:"#000066",showMarkers:!0,markerRadius:5},S=/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$|^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s%+,./-]+\)$|^[a-z]+$/i,F=/^[\w "',.-]+$/,R=new Set(["compactMode","padding","verticalSeparation","horizontalSeparation","arcRadius","fontSize","fontFamily","terminalFill","terminalStroke","terminalTextColor","nonTerminalFill","nonTerminalStroke","nonTerminalTextColor","lineColor","strokeWidth","markerFill","commentFill","commentStroke","commentTextColor","specialFill","specialStroke","ruleNameColor","showMarkers","markerRadius"]),v=(0,o.K)(e=>!!e&&Object.keys(e).every(e=>"railroad"===e||R.has(e)),"isRailroadStyleOptions"),z=(0,o.K)(e=>e?"railroad"in e&&e.railroad?e.railroad:v(e)?e:{}:{},"extractRailroadOverrides"),K=(0,o.K)(e=>{if(!e||v(e))return{};let{railroad:t,svgId:r,theme:i,look:a,...n}=e;return n},"extractThemeOverrides"),N=(0,o.K)((e,t)=>{if("string"!=typeof e)return t;let r=e.trim();return S.test(r)?r:t},"sanitizeColorValue"),D=(0,o.K)((e,t)=>{if("string"!=typeof e)return t;let r=e.trim();return F.test(r)?r:t},"sanitizeFontFamilyValue"),M=(0,o.K)((e,t)=>{let r="number"==typeof e?e:"string"==typeof e?Number.parseFloat(e):NaN;return Number.isFinite(r)&&r>=0?r:t},"sanitizeNumberValue"),A=(0,o.K)(e=>{let t="number"==typeof e?e:"string"==typeof e?Number.parseFloat(e):NaN;return Number.isFinite(t)&&t>0?t:void 0},"parseThemeFontSize"),E=(0,o.K)(e=>{let t=D(e.fontFamily,$.fontFamily),r=A(e.fontSize)??$.fontSize;return{...$,fontFamily:t,fontSize:r,terminalFill:N(e.secondBkg??e.secondaryColor,$.terminalFill),terminalStroke:N(e.secondaryBorderColor??e.lineColor,$.terminalStroke),terminalTextColor:N(e.secondaryTextColor??e.textColor,$.terminalTextColor),nonTerminalFill:N(e.mainBkg??e.background,$.nonTerminalFill),nonTerminalStroke:N(e.primaryBorderColor??e.lineColor,$.nonTerminalStroke),nonTerminalTextColor:N(e.primaryTextColor??e.textColor,$.nonTerminalTextColor),lineColor:N(e.lineColor,$.lineColor),markerFill:N(e.lineColor,$.markerFill),commentFill:N(e.labelBackground??e.tertiaryColor,$.commentFill),commentStroke:N(e.tertiaryBorderColor??e.lineColor,$.commentStroke),commentTextColor:N(e.tertiaryTextColor??e.textColor,$.commentTextColor),specialFill:N(e.tertiaryColor??e.secondaryColor,$.specialFill),specialStroke:N(e.tertiaryBorderColor??e.secondaryBorderColor,$.specialStroke),ruleNameColor:N(e.titleColor??e.textColor,$.ruleNameColor)}},"buildThemeDefaults"),B=(0,o.K)(e=>{let t=(0,a.zj)(),r=E({...(0,a.P$)(),...t.themeVariables??{},...K(e)}),i={...t.railroad??{},...z(e)};return{compactMode:i.compactMode??r.compactMode,padding:M(i.padding,r.padding),verticalSeparation:M(i.verticalSeparation,r.verticalSeparation),horizontalSeparation:M(i.horizontalSeparation,r.horizontalSeparation),arcRadius:M(i.arcRadius,r.arcRadius),fontSize:M(i.fontSize,r.fontSize),fontFamily:D(i.fontFamily,r.fontFamily),terminalFill:N(i.terminalFill,r.terminalFill),terminalStroke:N(i.terminalStroke,r.terminalStroke),terminalTextColor:N(i.terminalTextColor,r.terminalTextColor),nonTerminalFill:N(i.nonTerminalFill,r.nonTerminalFill),nonTerminalStroke:N(i.nonTerminalStroke,r.nonTerminalStroke),nonTerminalTextColor:N(i.nonTerminalTextColor,r.nonTerminalTextColor),lineColor:N(i.lineColor,r.lineColor),strokeWidth:M(i.strokeWidth,r.strokeWidth),markerFill:N(i.markerFill,r.markerFill),commentFill:N(i.commentFill,r.commentFill),commentStroke:N(i.commentStroke,r.commentStroke),commentTextColor:N(i.commentTextColor,r.commentTextColor),specialFill:N(i.specialFill,r.specialFill),specialStroke:N(i.specialStroke,r.specialStroke),ruleNameColor:N(i.ruleNameColor,r.ruleNameColor),showMarkers:i.showMarkers??r.showMarkers,markerRadius:M(i.markerRadius,r.markerRadius)}},"buildRailroadStyleOptions"),O=(0,o.K)(e=>{let{fontFamily:t,fontSize:r,terminalFill:i,terminalStroke:a,terminalTextColor:n,nonTerminalFill:o,nonTerminalStroke:l,nonTerminalTextColor:s,lineColor:d,strokeWidth:m,markerFill:c,commentFill:h,commentStroke:p,commentTextColor:u,specialFill:g,specialStroke:f,ruleNameColor:T}=B(e);return`
  .railroad-diagram {
    font-family: ${t};
    font-size: ${r}px;
  }

  .railroad-terminal rect {
    fill: ${i};
    stroke: ${a};
    stroke-width: ${m}px;
  }

  .railroad-terminal text {
    fill: ${n};
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-nonterminal rect {
    fill: ${o};
    stroke: ${l};
    stroke-width: ${m}px;
  }

  .railroad-nonterminal text {
    fill: ${s};
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-line {
    stroke: ${d};
    stroke-width: ${m}px;
    fill: none;
  }

  .railroad-start circle,
  .railroad-end circle {
    fill: ${c};
  }

  .railroad-comment ellipse {
    fill: ${h};
    stroke: ${p};
    stroke-width: ${m}px;
  }

  .railroad-comment text {
    fill: ${u};
    font-style: italic;
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-special rect {
    fill: ${g};
    stroke: ${f};
    stroke-width: ${m}px;
    stroke-dasharray: 5,3;
  }

  .railroad-special text {
    fill: ${s};
    font-family: ${t};
    font-size: ${r}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-rule-name {
    font-weight: bold;
    fill: ${T};
    font-family: ${t};
    font-size: ${r}px;
  }

  .railroad-group {
    /* Grouping container, no specific styles */
  }
`},"getStyles"),I=class{constructor(){this.d=""}static{(0,o.K)(this,"PathBuilder")}moveTo(e,t){return this.d+=`M ${e} ${t} `,this}lineTo(e,t){return this.d+=`L ${e} ${t} `,this}horizontalTo(e){return this.d+=`H ${e} `,this}verticalTo(e){return this.d+=`V ${e} `,this}arcTo(e,t,r,i,a,n,o){return this.d+=`A ${e} ${t} ${r} ${+!!i} ${+!!a} ${n} ${o} `,this}build(){return this.d.trim()}},_=class{constructor(e,t=B()){this.textCache=new Map,this.svg=e,this.config=t}static{(0,o.K)(this,"RailroadRenderer")}measureText(e){if(this.textCache.has(e))return this.textCache.get(e);let t=this.svg.append("text").attr("font-family",this.config.fontFamily).attr("font-size",this.config.fontSize).text(e),r=t.node().getBBox(),i={width:r.width,height:r.height};return t.remove(),this.textCache.set(e,i),i}renderTerminal(e,t){let r=this.measureText(t),i=r.width+2*this.config.padding,a=r.height+2*this.config.padding,n=e.append("g").attr("class","railroad-terminal");return n.append("rect").attr("x",0).attr("y",0).attr("width",i).attr("height",a).attr("rx",10).attr("ry",10),n.append("text").attr("x",i/2).attr("y",a/2).text(t),{element:n.node(),dimensions:{width:i,height:a,up:a/2,down:a/2}}}renderNonTerminal(e,t){let r=this.measureText(t),i=r.width+2*this.config.padding,a=r.height+2*this.config.padding,n=e.append("g").attr("class","railroad-nonterminal");return n.append("rect").attr("x",0).attr("y",0).attr("width",i).attr("height",a),n.append("text").attr("x",i/2).attr("y",a/2).text(t),{element:n.node(),dimensions:{width:i,height:a,up:a/2,down:a/2}}}renderSequence(e,t){let r=t.map(t=>this.renderExpression(e,t)),i=0,a=0,n=0;for(let e of r)i+=e.dimensions.width,a=Math.max(a,e.dimensions.up),n=Math.max(n,e.dimensions.down);i+=(r.length-1)*this.config.horizontalSeparation;let o=e.append("g").attr("class","railroad-sequence"),l=0;for(let e=0;e<r.length;e++){let t=r[e],i=a-t.dimensions.up;if(o.node().appendChild(t.element).setAttribute("transform",`translate(${l}, ${i})`),e<r.length-1){let e=l+t.dimensions.width,r=e+this.config.horizontalSeparation,i=a;o.append("path").attr("class","railroad-line").attr("d",new I().moveTo(e,i).lineTo(r,i).build())}l+=t.dimensions.width+this.config.horizontalSeparation}return{element:o.node(),dimensions:{width:i,height:a+n,up:a,down:n}}}renderChoice(e,t){let r=t.map(t=>this.renderExpression(e,t)),i=0,a=0;for(let e of r)i=Math.max(i,e.dimensions.width),a+=e.dimensions.height;a+=(r.length-1)*this.config.verticalSeparation;let n=this.config.arcRadius,o=i+4*n,l=e.append("g").attr("class","railroad-choice"),s=0,d=a/2;for(let e of r){let t=s,r=t+e.dimensions.up,a=2*n+(i-e.dimensions.width)/2;l.node().appendChild(e.element).setAttribute("transform",`translate(${a}, ${t})`);let m=new I,c=r>d;r===d?m.moveTo(0,d).lineTo(a,r):m.moveTo(0,d).arcTo(n,n,0,!1,c,n,d+(c?n:-n)).lineTo(n,r-(c?n:-n)).arcTo(n,n,0,!1,!c,2*n,r).lineTo(a,r),l.append("path").attr("class","railroad-line").attr("d",m.build());let h=new I,p=a+e.dimensions.width,u=o-2*n;r===d?h.moveTo(p,r).lineTo(o,d):h.moveTo(p,r).lineTo(u,r).arcTo(n,n,0,!1,!c,o-n,r+(c?-n:n)).lineTo(o-n,d+(c?n:-n)).arcTo(n,n,0,!1,c,o,d),l.append("path").attr("class","railroad-line").attr("d",h.build()),s+=e.dimensions.height+this.config.verticalSeparation}return{element:l.node(),dimensions:{width:o,height:a,up:d,down:a-d}}}renderOptional(e,t){let r=this.renderExpression(e,t),i=this.config.arcRadius,a=2*i,n=r.dimensions.width+4*i,o=r.dimensions.height+a,l=e.append("g").attr("class","railroad-optional"),s=2*i;l.node().appendChild(r.element).setAttribute("transform",`translate(${s}, ${a})`);let d=a+r.dimensions.up,m=new I().moveTo(0,d).lineTo(2*i,d);l.append("path").attr("class","railroad-line").attr("d",m.build());let c=new I().moveTo(s+r.dimensions.width,d).lineTo(n,d);l.append("path").attr("class","railroad-line").attr("d",c.build());let h=new I().moveTo(0,d).arcTo(i,i,0,!1,!1,i,d-i).lineTo(i,i).arcTo(i,i,0,!1,!0,2*i,0).lineTo(n-2*i,0).arcTo(i,i,0,!1,!0,n-i,i).lineTo(n-i,d-i).arcTo(i,i,0,!1,!1,n,d);return l.append("path").attr("class","railroad-line").attr("d",h.build()),{element:l.node(),dimensions:{width:n,height:o,up:d,down:o-d}}}renderRepetition(e,t,r){let i=this.renderExpression(e,t),a=this.config.arcRadius,n=2*a,o=i.dimensions.width+4*a,l=0===r,s=i.dimensions.height+n+(l?n:0),d=e.append("g").attr("class","railroad-repetition"),m=2*a,c=l?n:0;d.node().appendChild(i.element).setAttribute("transform",`translate(${m}, ${c})`);let h=c+i.dimensions.up;d.append("path").attr("class","railroad-line").attr("d",new I().moveTo(0,h).lineTo(2*a,h).build()),d.append("path").attr("class","railroad-line").attr("d",new I().moveTo(m+i.dimensions.width,h).lineTo(o,h).build());let p=c+i.dimensions.height+a,u=new I().moveTo(m+i.dimensions.width,h).arcTo(a,a,0,!1,!0,m+i.dimensions.width+a,h+a).lineTo(m+i.dimensions.width+a,p).arcTo(a,a,0,!1,!0,m+i.dimensions.width,p+a).lineTo(2*a,p+a).arcTo(a,a,0,!1,!0,a,p).lineTo(a,h+a).arcTo(a,a,0,!1,!0,2*a,h);if(d.append("path").attr("class","railroad-line").attr("d",u.build()),l){let e=new I().moveTo(0,h).arcTo(a,a,0,!1,!1,a,h-a).lineTo(a,a).arcTo(a,a,0,!1,!0,2*a,0).lineTo(o-2*a,0).arcTo(a,a,0,!1,!0,o-a,a).lineTo(o-a,h-a).arcTo(a,a,0,!1,!1,o,h);d.append("path").attr("class","railroad-line").attr("d",e.build())}return{element:d.node(),dimensions:{width:o,height:s,up:h,down:s-h}}}renderSpecial(e,t){let r=this.measureText("? "+t+" ?"),i=r.width+2*this.config.padding,a=r.height+2*this.config.padding,n=e.append("g").attr("class","railroad-special");return n.append("rect").attr("x",0).attr("y",0).attr("width",i).attr("height",a),n.append("text").attr("x",i/2).attr("y",a/2).text("? "+t+" ?"),{element:n.node(),dimensions:{width:i,height:a,up:a/2,down:a/2}}}renderExpression(e,t){switch(t.type){case"terminal":return this.renderTerminal(e,t.value);case"nonterminal":return this.renderNonTerminal(e,t.name);case"sequence":return this.renderSequence(e,t.elements);case"choice":return this.renderChoice(e,t.alternatives);case"optional":return this.renderOptional(e,t.element);case"repetition":return this.renderRepetition(e,t.element,t.min);case"special":return this.renderSpecial(e,t.text);default:throw Error(`Unknown node type: ${t.type}`)}}renderRule(e,t){let r=this.svg.append("g").attr("class","railroad-rule").attr("transform",`translate(0, ${t})`),i=e.name+" =",a=this.measureText(i).width+20,n=a+20,o=r.append("g"),l=this.renderExpression(o,e.definition),s=Math.max(20,l.dimensions.up),d=s-l.dimensions.up;return o.attr("transform",`translate(${n}, ${d})`),r.append("g").attr("class","railroad-rule-name-group").append("text").attr("class","railroad-rule-name").attr("x",0).attr("y",s).text(i),r.append("g").attr("class","railroad-start").append("circle").attr("cx",a).attr("cy",s).attr("r",this.config.markerRadius),r.append("g").attr("class","railroad-end").append("circle").attr("cx",n+l.dimensions.width+10).attr("cy",s).attr("r",this.config.markerRadius),r.append("path").attr("class","railroad-line").attr("d",new I().moveTo(a+this.config.markerRadius,s).lineTo(n,s).build()),r.append("path").attr("class","railroad-line").attr("d",new I().moveTo(n+l.dimensions.width,s).lineTo(n+l.dimensions.width+10-this.config.markerRadius,s).build()),{height:Math.max(40,d+l.dimensions.height+2*this.config.padding),width:n+l.dimensions.width+10+this.config.markerRadius}}renderDiagram(e){let t=this.config.padding,r=0;for(let i of e){let e=this.renderRule(i,t);t+=e.height+this.config.verticalSeparation,r=Math.max(r,e.width)}return{width:r+2*this.config.padding,height:t+this.config.padding}}},W=(0,o.K)((e,t,r)=>{(0,a.a$)(e,t.height,t.width,r),e.attr("viewBox",`0 0 ${t.width} ${t.height}`)},"configureRailroadSvgSize"),q={draw:(0,o.K)((e,t,r)=>{n.R.debug("[Railroad] Rendering diagram\n"+e);try{let e=(0,i.D)(t);e.attr("class","railroad-diagram");let r=(0,a.zj)().railroad,o=r?.useMaxWidth??!0,l=b.getRules();if(n.R.debug(`[Railroad] Rendering ${l.length} rules`),0===l.length){n.R.warn("[Railroad] No rules to render"),W(e,{height:100,width:200},o);return}let s=new _(e,B()).renderDiagram(l);W(e,s,o),n.R.debug("[Railroad] Render complete")}catch(e){throw n.R.error("[Railroad] Render error:",e),e}},"draw")}}}]);
//# sourceMappingURL=6669.865b4ad2.js.map