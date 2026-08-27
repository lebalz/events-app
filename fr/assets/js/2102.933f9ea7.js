try{var t="u">typeof window?window:"u">typeof global?global:"u">typeof globalThis?globalThis:"u">typeof self?self:{};t.SENTRY_RELEASE={id:"7975763993fdd14b049f458f5a526e146747bc50"};var e=(new t.Error).stack;e&&(t._sentryDebugIds=t._sentryDebugIds||{},t._sentryDebugIds[e]="dc5add0a-3461-4691-9550-1fc3d2dadd24",t._sentryDebugIdIdentifier="sentry-dbid-dc5add0a-3461-4691-9550-1fc3d2dadd24")}catch(t){}"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([["2102"],{77454(t,e,a){function r(t,e){t.accDescr&&e.setAccDescription?.(t.accDescr),t.accTitle&&e.setAccTitle?.(t.accTitle),t.title&&e.setDiagramTitle?.(t.title)}a.d(e,{S:()=>r}),(0,a(86827).K)(r,"populateCommonDb")},26085(t,e,a){a.d(e,{diagram:()=>O});var r=a(77454),i=a(37851),l=a(90213),n=a(56149),s=a(31293),o=a(86827),c=a(78731),d={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},g={axes:[],curves:[],options:d},u=structuredClone(g),p=n.UI.radar,h=(0,o.K)(()=>(0,l.$t)({...p,...(0,n.zj)().radar}),"getConfig"),x=(0,o.K)(()=>u.axes,"getAxes"),m=(0,o.K)(()=>u.curves,"getCurves"),f=(0,o.K)(()=>u.options,"getOptions"),$=(0,o.K)(t=>{u.axes=t.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),y=(0,o.K)(t=>{u.curves=t.map(t=>({name:t.name,label:t.label??t.name,entries:b(t.entries)}))},"setCurves"),b=(0,o.K)(t=>{if(void 0==t[0].axis)return t.map(t=>t.value);let e=x();if(0===e.length)throw Error("Axes must be populated before curves for reference entries");return e.map(e=>{let a=t.find(t=>t.axis?.$refText===e.name);if(void 0===a)throw Error("Missing entry for axis "+e.label);return a.value})},"computeCurveEntries"),v={getAxes:x,getCurves:m,getOptions:f,setAxes:$,setCurves:y,setOptions:(0,o.K)(t=>{let e=t.reduce((t,e)=>(t[e.name]=e,t),{});u.options={showLegend:e.showLegend?.value??d.showLegend,ticks:e.ticks?.value??d.ticks,max:e.max?.value??d.max,min:e.min?.value??d.min,graticule:e.graticule?.value??d.graticule}},"setOptions"),getConfig:h,clear:(0,o.K)(()=>{(0,n.IU)(),u=structuredClone(g)},"clear"),setAccTitle:n.SV,getAccTitle:n.iN,setDiagramTitle:n.ke,getDiagramTitle:n.ab,getAccDescription:n.m7,setAccDescription:n.EI},w=(0,o.K)(t=>{(0,r.S)(t,v);let{axes:e,curves:a,options:i}=t;v.setAxes(e),v.setCurves(a),v.setOptions(i)},"populate"),C={parse:(0,o.K)(async t=>{let e=await (0,c.qg)("radar",t);s.R.debug(e),w(e)},"parse")},T=(0,o.K)((t,e,a,r)=>{let l=r.db,n=l.getAxes(),s=l.getCurves(),o=l.getOptions(),c=l.getConfig(),d=l.getDiagramTitle(),g=K((0,i.D)(e),c),u=o.max??Math.max(...s.map(t=>Math.max(...t.entries))),p=o.min,h=Math.min(c.width,c.height)/2;M(g,n,h,o.ticks,o.graticule),L(g,n,h,c),k(g,n,s,p,u,o.graticule,c),S(g,s,o.showLegend,c),g.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),K=(0,o.K)((t,e)=>{let a=e.width+e.marginLeft+e.marginRight,r=e.height+e.marginTop+e.marginBottom,i={x:e.marginLeft+e.width/2,y:e.marginTop+e.height/2};return(0,n.a$)(t,r,a,e.useMaxWidth??!0),t.attr("viewBox",`0 0 ${a} ${r}`).attr("overflow","visible"),t.append("g").attr("transform",`translate(${i.x}, ${i.y})`)},"drawFrame"),M=(0,o.K)((t,e,a,r,i)=>{if("circle"===i)for(let e=0;e<r;e++){let i=a*(e+1)/r;t.append("circle").attr("r",i).attr("class","radarGraticule")}else if("polygon"===i){let i=e.length;for(let l=0;l<r;l++){let n=a*(l+1)/r,s=e.map((t,e)=>{let a=2*e*Math.PI/i-Math.PI/2,r=n*Math.cos(a),l=n*Math.sin(a);return`${r},${l}`}).join(" ");t.append("polygon").attr("points",s).attr("class","radarGraticule")}}},"drawGraticule"),L=(0,o.K)((t,e,a,r)=>{let i=e.length;for(let l=0;l<i;l++){let n=e[l].label,s=2*l*Math.PI/i-Math.PI/2,o=Math.cos(s),c=Math.sin(s);t.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*o).attr("y2",a*r.axisScaleFactor*c).attr("class","radarAxisLine");let d=o>.01?"start":o<-.01?"end":"middle",g=c>.01?"hanging":c<-.01?"auto":"central";t.append("text").text(n).attr("x",a*r.axisLabelFactor*o+4*o).attr("y",a*r.axisLabelFactor*c+4*c).attr("text-anchor",d).attr("dominant-baseline",g).attr("class","radarAxisLabel")}},"drawAxes");function k(t,e,a,r,i,l,n){let s=e.length,o=Math.min(n.width,n.height)/2;a.forEach((e,a)=>{if(e.entries.length!==s)return;let c=e.entries.map((t,e)=>{let a=2*Math.PI*e/s-Math.PI/2,l=A(t,r,i,o);return{x:l*Math.cos(a),y:l*Math.sin(a)}});"circle"===l?t.append("path").attr("d",I(c,n.curveTension)).attr("class",`radarCurve-${a}`):"polygon"===l&&t.append("polygon").attr("points",c.map(t=>`${t.x},${t.y}`).join(" ")).attr("class",`radarCurve-${a}`)})}function A(t,e,a,r){return r*(Math.min(Math.max(t,e),a)-e)/(a-e)}function I(t,e){let a=t.length,r=`M${t[0].x},${t[0].y}`;for(let i=0;i<a;i++){let l=t[(i-1+a)%a],n=t[i],s=t[(i+1)%a],o=t[(i+2)%a],c={x:n.x+(s.x-l.x)*e,y:n.y+(s.y-l.y)*e},d={x:s.x-(o.x-n.x)*e,y:s.y-(o.y-n.y)*e};r+=` C${c.x},${c.y} ${d.x},${d.y} ${s.x},${s.y}`}return`${r} Z`}function S(t,e,a,r){if(!a)return;let i=(r.width/2+r.marginRight)*3/4,l=-(3*(r.height/2+r.marginTop))/4;e.forEach((e,a)=>{let r=t.append("g").attr("transform",`translate(${i}, ${l+20*a})`);r.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${a}`),r.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(e.label)})}(0,o.K)(k,"drawCurves"),(0,o.K)(A,"relativeRadius"),(0,o.K)(I,"closedRoundCurve"),(0,o.K)(S,"drawLegend");var D=(0,o.K)((t,e)=>{let a="";for(let r=0;r<t.THEME_COLOR_LIMIT;r++){let i=t[`cScale${r}`];a+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${e.curveOpacity};
			stroke: ${i};
			stroke-width: ${e.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${e.curveOpacity};
			stroke: ${i};
		}
		`}return a},"genIndexStyles"),E=(0,o.K)(t=>{let e=(0,n.P$)(),a=(0,n.zj)(),r=(0,l.$t)(e,a.themeVariables),i=(0,l.$t)(r.radar,t);return{themeVariables:r,radarOptions:i}},"buildRadarStyleOptions"),O={parser:C,db:v,renderer:{draw:T},styles:(0,o.K)(({radar:t}={})=>{let{themeVariables:e,radarOptions:a}=E(t);return`
	.radarTitle {
		font-size: ${e.fontSize};
		color: ${e.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${a.axisColor};
		stroke-width: ${a.axisStrokeWidth};
	}
	.radarAxisLabel {
		font-size: ${a.axisLabelFontSize}px;
		color: ${a.axisColor};
	}
	.radarGraticule {
		fill: ${a.graticuleColor};
		fill-opacity: ${a.graticuleOpacity};
		stroke: ${a.graticuleColor};
		stroke-width: ${a.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${a.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${D(e,a)}
	`},"styles")}}}]);
//# sourceMappingURL=2102.933f9ea7.js.map