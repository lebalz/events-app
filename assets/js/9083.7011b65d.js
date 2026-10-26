try{var e="u">typeof window?window:"u">typeof global?global:"u">typeof globalThis?globalThis:"u">typeof self?self:{};e.SENTRY_RELEASE={id:"4b5d45c2fba033e30569b5b62df81d03678227b8"};var t=(new e.Error).stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="c8d069ed-c8d7-4481-904e-94397f3eda12",e._sentryDebugIdIdentifier="sentry-dbid-c8d069ed-c8d7-4481-904e-94397f3eda12")}catch(e){}"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([["9083"],{77454(e,t,a){function r(e,t){e.accDescr&&t.setAccDescription?.(e.accDescr),e.accTitle&&t.setAccTitle?.(e.accTitle),e.title&&t.setDiagramTitle?.(e.title)}a.d(t,{S:()=>r}),(0,a(86827).K)(r,"populateCommonDb")},42150(e,t,a){a.d(t,{diagram:()=>O});var r=a(77454),i=a(78203),n=a(68449),l=a(88253),s=a(31293),o=a(86827),c=a(78731),d={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},g={axes:[],curves:[],options:d},u=structuredClone(g),p=l.UI.radar,h=(0,o.K)(()=>(0,n.$t)({...p,...(0,l.zj)().radar}),"getConfig"),x=(0,o.K)(()=>u.axes,"getAxes"),m=(0,o.K)(()=>u.curves,"getCurves"),f=(0,o.K)(()=>u.options,"getOptions"),$=(0,o.K)(e=>{u.axes=e.map(e=>({name:e.name,label:e.label??e.name}))},"setAxes"),y=(0,o.K)(e=>{u.curves=e.map(e=>({name:e.name,label:e.label??e.name,entries:b(e.entries)}))},"setCurves"),b=(0,o.K)(e=>{if(void 0==e[0].axis)return e.map(e=>e.value);let t=x();if(0===t.length)throw Error("Axes must be populated before curves for reference entries");return t.map(t=>{let a=e.find(e=>e.axis?.$refText===t.name);if(void 0===a)throw Error("Missing entry for axis "+t.label);return a.value})},"computeCurveEntries"),v={getAxes:x,getCurves:m,getOptions:f,setAxes:$,setCurves:y,setOptions:(0,o.K)(e=>{let t=e.reduce((e,t)=>(e[t.name]=t,e),{});u.options={showLegend:t.showLegend?.value??d.showLegend,ticks:t.ticks?.value??d.ticks,max:t.max?.value??d.max,min:t.min?.value??d.min,graticule:t.graticule?.value??d.graticule},u.options.ticks>32&&(s.R.warn(`Radar diagram ticks (${u.options.ticks}) exceeds maximum allowed (32). Using 32 instead.`),u.options.ticks=32)},"setOptions"),getConfig:h,clear:(0,o.K)(()=>{(0,l.IU)(),u=structuredClone(g)},"clear"),setAccTitle:l.SV,getAccTitle:l.iN,setDiagramTitle:l.ke,getDiagramTitle:l.ab,getAccDescription:l.m7,setAccDescription:l.EI},w=(0,o.K)(e=>{(0,r.S)(e,v);let{axes:t,curves:a,options:i}=e;v.setAxes(t),v.setCurves(a),v.setOptions(i)},"populate"),k={parse:(0,o.K)(async e=>{let t=await (0,c.qg)("radar",e);s.R.debug(t),w(t)},"parse")},C=(0,o.K)((e,t,a,r)=>{let n=r.db,l=n.getAxes(),s=n.getCurves(),o=n.getOptions(),c=n.getConfig(),d=n.getDiagramTitle(),g=T((0,i.D)(t),c),u=o.max??Math.max(...s.map(e=>Math.max(...e.entries))),p=o.min,h=Math.min(c.width,c.height)/2;K(g,l,h,o.ticks,o.graticule),M(g,l,h,c),L(g,l,s,p,u,o.graticule,c),S(g,s,o.showLegend,c),g.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),T=(0,o.K)((e,t)=>{let a=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return(0,l.a$)(e,r,a,t.useMaxWidth??!0),e.attr("viewBox",`0 0 ${a} ${r}`).attr("overflow","visible"),e.append("g").attr("transform",`translate(${i.x}, ${i.y})`)},"drawFrame"),K=(0,o.K)((e,t,a,r,i)=>{if("circle"===i)for(let t=0;t<r;t++){let i=a*(t+1)/r;e.append("circle").attr("r",i).attr("class","radarGraticule")}else if("polygon"===i){let i=t.length;for(let n=0;n<r;n++){let l=a*(n+1)/r,s=t.map((e,t)=>{let a=2*t*Math.PI/i-Math.PI/2,r=l*Math.cos(a),n=l*Math.sin(a);return`${r},${n}`}).join(" ");e.append("polygon").attr("points",s).attr("class","radarGraticule")}}},"drawGraticule"),M=(0,o.K)((e,t,a,r)=>{let i=t.length;for(let n=0;n<i;n++){let l=t[n].label,s=2*n*Math.PI/i-Math.PI/2,o=Math.cos(s),c=Math.sin(s);e.append("line").attr("x1",0).attr("y1",0).attr("x2",a*r.axisScaleFactor*o).attr("y2",a*r.axisScaleFactor*c).attr("class","radarAxisLine");let d=o>.01?"start":o<-.01?"end":"middle",g=c>.01?"hanging":c<-.01?"auto":"central";e.append("text").text(l).attr("x",a*r.axisLabelFactor*o+4*o).attr("y",a*r.axisLabelFactor*c+4*c).attr("text-anchor",d).attr("dominant-baseline",g).attr("class","radarAxisLabel")}},"drawAxes");function L(e,t,a,r,i,n,l){let s=t.length,o=Math.min(l.width,l.height)/2;a.forEach((t,a)=>{if(t.entries.length!==s)return;let c=t.entries.map((e,t)=>{let a=2*Math.PI*t/s-Math.PI/2,n=A(e,r,i,o);return{x:n*Math.cos(a),y:n*Math.sin(a)}});"circle"===n?e.append("path").attr("d",I(c,l.curveTension)).attr("class",`radarCurve-${a}`):"polygon"===n&&e.append("polygon").attr("points",c.map(e=>`${e.x},${e.y}`).join(" ")).attr("class",`radarCurve-${a}`)})}function A(e,t,a,r){return r*(Math.min(Math.max(e,t),a)-t)/(a-t)}function I(e,t){let a=e.length,r=`M${e[0].x},${e[0].y}`;for(let i=0;i<a;i++){let n=e[(i-1+a)%a],l=e[i],s=e[(i+1)%a],o=e[(i+2)%a],c={x:l.x+(s.x-n.x)*t,y:l.y+(s.y-n.y)*t},d={x:s.x-(o.x-l.x)*t,y:s.y-(o.y-l.y)*t};r+=` C${c.x},${c.y} ${d.x},${d.y} ${s.x},${s.y}`}return`${r} Z`}function S(e,t,a,r){if(!a)return;let i=(r.width/2+r.marginRight)*3/4,n=-(3*(r.height/2+r.marginTop))/4;t.forEach((t,a)=>{let r=e.append("g").attr("transform",`translate(${i}, ${n+20*a})`);r.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${a}`),r.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(t.label)})}(0,o.K)(L,"drawCurves"),(0,o.K)(A,"relativeRadius"),(0,o.K)(I,"closedRoundCurve"),(0,o.K)(S,"drawLegend");var D=(0,o.K)((e,t)=>{let a="";for(let r=0;r<e.THEME_COLOR_LIMIT;r++){let i=e[`cScale${r}`];a+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
		}
		`}return a},"genIndexStyles"),E=(0,o.K)(e=>{let t=(0,l.P$)(),a=(0,l.zj)(),r=(0,n.$t)(t,a.themeVariables),i=(0,n.$t)(r.radar,e);return{themeVariables:r,radarOptions:i}},"buildRadarStyleOptions"),O={parser:k,db:v,renderer:{draw:C},styles:(0,o.K)(({radar:e}={})=>{let{themeVariables:t,radarOptions:a}=E(e);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
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
	${D(t,a)}
	`},"styles")}}}]);
//# sourceMappingURL=9083.7011b65d.js.map