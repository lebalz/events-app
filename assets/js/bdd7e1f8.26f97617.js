"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[738],{75584:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>d,contentTitle:()=>i,default:()=>o,frontMatter:()=>s,metadata:()=>l,toc:()=>u});var a=r(74848),t=r(28453);const s={},i="Mode d'emploi FR",l={id:"dev/guide-fr/index",title:"Mode d'emploi FR",description:"Traduire le site",source:"@site/docs/dev/guide-fr/index.md",sourceDirName:"dev/guide-fr",slug:"/dev/guide-fr/",permalink:"/docs/dev/guide-fr/",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/dev/guide-fr/index.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Database",permalink:"/docs/dev/database/"},next:{title:"Scenes",permalink:"/docs/dev/scenes/"}},d={},u=[{value:"Traduire le site",id:"traduire-le-site",level:2},{value:"Traduire directement du texte en HTML :",id:"traduire-directement-du-texte-en-html-",level:3},{value:"Traduire \xe0 l&#39;int\xe9rieur d&#39;une balise HTML :",id:"traduire-\xe0-lint\xe9rieur-dune-balise-html-",level:3},{value:"Traduire dans un objet JS :",id:"traduire-dans-un-objet-js-",level:3},{value:"Traduire dans un objet Dicosaurus :",id:"traduire-dans-un-objet-dicosaurus-",level:3},{value:"Traduire avec un op\xe9rateur ternaire JS :",id:"traduire-avec-un-op\xe9rateur-ternaire-js-",level:3},{value:"Traduire dans un objet JS avec variable",id:"traduire-dans-un-objet-js-avec-variable",level:3},{value:"Travailler sur une nouvelle branche sur le d\xe9p\xf4t original",id:"travailler-sur-une-nouvelle-branche-sur-le-d\xe9p\xf4t-original",level:3},{value:"Continuer \xe0 travailler lorsque la branche a \xe9t\xe9 fusionn\xe9e sur le d\xe9p\xf4t original",id:"continuer-\xe0-travailler-lorsque-la-branche-a-\xe9t\xe9-fusionn\xe9e-sur-le-d\xe9p\xf4t-original",level:3}];function c(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,t.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h1,{id:"mode-demploi-fr",children:"Mode d'emploi FR"}),"\n",(0,a.jsx)(n.h2,{id:"traduire-le-site",children:"Traduire le site"}),"\n",(0,a.jsx)(n.p,{children:"Il y a plusieurs cas de figures. Dans tous les cas, il faut importer la biblioth\xe8que correspondante:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-tsx",children:"/* to import translate and Translate */\nimport Translate, { translate } from '@docusaurus/Translate';\n\n/* to import only translate */\nimport Translate from '@docusaurus/Translate';\n\n/* to import only Translate */\nimport Translate from '@docusaurus/Translate';\n"})}),"\n",(0,a.jsx)(n.h3,{id:"traduire-directement-du-texte-en-html-",children:"Traduire directement du texte en HTML :"}),"\n",(0,a.jsx)(n.p,{children:"On ajoute directement la balise Translate :"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-tsx",children:'<Translate\n    id="header.transation.id"\n    description="the header description"\n>\n    This header will be translated\n</Translate>\n'})}),"\n",(0,a.jsx)(n.h3,{id:"traduire-\xe0-lint\xe9rieur-dune-balise-html-",children:"Traduire \xe0 l'int\xe9rieur d'une balise HTML :"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-tsx",children:"<Button \n    title='Semester Hinzuf\xfcgen'\n    text=\"Neues Semester\"\n...\n"})}),"\n",(0,a.jsx)(n.p,{children:"devient:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-tsx",children:"<Button\n    title={translate({\n        message : \"blablab\",\n        id:'...' ,\n        description:'...\n    })}\n    text={translate...}\n    ...\n"})}),"\n",(0,a.jsx)(n.h3,{id:"traduire-dans-un-objet-js-",children:"Traduire dans un objet JS :"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-tsx",children:"messages={{\n    next: translate({\n        message : \"N\xe4chste\",\n        id:'calendar.button.nextWeek',\n        description:'button to show the next week on the calendar'\n    }),\n    ...\n}}\n"})}),"\n",(0,a.jsx)(n.h3,{id:"traduire-dans-un-objet-dicosaurus-",children:"Traduire dans un objet Dicosaurus :"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-tsx",children:"<TabItem\n    value='reviewed'\n    label={translate({\n        message: 'Review',\n        id: 'my-events.tab.review'\n    })}\n>\n"})}),"\n",(0,a.jsx)(n.h3,{id:"traduire-avec-un-op\xe9rateur-ternaire-js-",children:"Traduire avec un op\xe9rateur ternaire JS :"}),"\n",(0,a.jsx)(n.p,{children:"Avant:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-tsx",children:'title={store.fullscreen ? "Verlasse Vollbildschirm" : "Vollbildschirm"}\n'})}),"\n",(0,a.jsx)(n.p,{children:"Apr\xe8s :"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-tsx",children:'title={store.fullscreen ?\n        translate({\n            message : "Verlasse Vollbildschirm",\n            id : "shared.fullscreenbutton.exitfullscreen"\n        })\n    :\n        translate({\n            message : "Vollbildschirm",\n            id : "shared.fullscreenbutton.gofullscreen"\n        })\n    }\n'})}),"\n",(0,a.jsx)(n.p,{children:"Autre exemple avec plusieurs imbrications :"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-tsx",children:'text={showText \n        ? event.isDirty \n            ? translate({\n                    message : \'Verwerfen\',\n                    id : "components.event.actions.discard",\n                    description : "Text of the button discard"\n                })\n            : translate({\n                    message : \'Abbrechen\',\n                    id : "components.event.actions.cancel",\n                    description : "Text of the button cancel"\n                })\n        : undefined\n}\n'})}),"\n",(0,a.jsx)(n.h3,{id:"traduire-dans-un-objet-js-avec-variable",children:"Traduire dans un objet JS avec variable"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-tsx",children:'setErrorMessages([`Abteilung "${token.charAt(2)}" nicht gefunden`]);\n'})}),"\n",(0,a.jsx)(n.p,{children:"devient :"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-tsx",children:'setErrorMessages([\n    translate(\n        {\n            message : `Abteilung "{letter}" nicht gefunden`,\n            id : "share.audiencePicker.classSelector.errormsg.department",\n            description : "Error message department not found"\n        },\n\n        {letter : token.charAt(2)}\n    )\n]);\n\net dans fr/code.json :\n\n```tsx\n    "..."" : {\n        "message" : "Abteilung \\"{letter}\\" nicht gefunden",\n        "description" : "..."\n    }\n'})}),"\n",(0,a.jsx)(n.h3,{id:"travailler-sur-une-nouvelle-branche-sur-le-d\xe9p\xf4t-original",children:"Travailler sur une nouvelle branche sur le d\xe9p\xf4t original"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'git clone git@github.com:lebalz/events-app.git events-app\ncd events-app\ngit checkout -b "nom-de-la-nouvelle-branche"\n# Maintenant sur la nouvelle branche\n# travailler et faire des commits\n# et lors du premier push\ngit push -u origin neuer-branch-name\n# continuer \xe0 travailler...\n# pour les push suivants :\ngit push\n'})}),"\n",(0,a.jsx)(n.h3,{id:"continuer-\xe0-travailler-lorsque-la-branche-a-\xe9t\xe9-fusionn\xe9e-sur-le-d\xe9p\xf4t-original",children:"Continuer \xe0 travailler lorsque la branche a \xe9t\xe9 fusionn\xe9e sur le d\xe9p\xf4t original"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-bash",children:'# Revenir sur la branche principale\ngit checkout main\n# Mettre la branche \xe0 jour\ngit pull\n# Supprimer l\'ancienne branche\ngit branch -d nom-ancienne-branche\n# Supprimer la branche fusionn\xe9e \xe9galement sur GitHub\n# Cr\xe9er une nouvelle branche pour un nouveau d\xe9veloppement\ngit checkout -b "nom-de-la-nouvelle-branche"\n'})})]})}function o(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},28453:(e,n,r)=>{r.d(n,{R:()=>i,x:()=>l});var a=r(96540);const t={},s=a.createContext(t);function i(e){const n=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),a.createElement(s.Provider,{value:n},e.children)}}}]);