# Mode d'emploi FR

## Traduire le site
Il y a plusieurs cas de figures. Dans tous les cas, il faut importer la bibliothèque correspondante :

    /* to import translate and Translate */
    import Translate, { translate } from '@docusaurus/Translate';

    /* to import only translate */
    import Translate from '@docusaurus/Translate';

    /* to import only Translate */
    import Translate from '@docusaurus/Translate';

### Traduire directement du texte en HTML :
On ajoute directement la balise Translate :

    <Translate id="header.transation.id" description="the header description">
        This header will be translated
    </Translate>

### Traduire à l'intérieur d'une balise HTML :

    <Button 
        title='Semester Hinzufügen'
        text="Neues Semester"
    ...

devient :

    <Button
        title={translate({
            message : "blablab",
            id:'...' ,
            description:'...'})}
        text={translate...}
        ...

### Traduire dans un objet JS :
    messages={{
        next: translate({
            message : "Nächste",
            id:'calendar.button.nextWeek',
            description:'button to show the next week on the calendar'
        }),
        ...
    }}

### Traduire dans un objet Dicosaurus :
    <TabItem value='reviewed' label={
        translate({
            message: 'Review',
            id: 'my-events.tab.review'})
        }>