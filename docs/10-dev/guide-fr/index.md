# Mode d'emploi FR

## Traduire le site
Il y a plusieurs cas de figures. Dans tous les cas, il faut importer la bibliothèque correspondante:

```tsx
/* to import translate and Translate */
import Translate, { translate } from '@docusaurus/Translate';

/* to import only translate */
import Translate from '@docusaurus/Translate';

/* to import only Translate */
import Translate from '@docusaurus/Translate';
```

### Traduire directement du texte en HTML :
On ajoute directement la balise Translate :
```tsx
<Translate
    id="header.transation.id"
    description="the header description"
>
    This header will be translated
</Translate>
```

### Traduire à l'intérieur d'une balise HTML :
```tsx
<Button 
    title='Semester Hinzufügen'
    text="Neues Semester"
...
```

devient:

```tsx
<Button
    title={translate({
        message : "blablab",
        id:'...' ,
        description:'...
    })}
    text={translate...}
    ...
```

### Traduire dans un objet JS :
```tsx
messages={{
    next: translate({
        message : "Nächste",
        id:'calendar.button.nextWeek',
        description:'button to show the next week on the calendar'
    }),
    ...
}}
```

### Traduire dans un objet Dicosaurus :
```tsx
<TabItem
    value='reviewed'
    label={translate({
        message: 'Review',
        id: 'my-events.tab.review'
    })}
>
```

### Traduire avec un opérateur ternaire JS :

Avant:
```tsx
title={store.fullscreen ? "Verlasse Vollbildschirm" : "Vollbildschirm"}
```
Après :

```tsx
title={store.fullscreen ?
        translate({
            message : "Verlasse Vollbildschirm",
            id : "shared.fullscreenbutton.exitfullscreen"
        })
    :
        translate({
            message : "Vollbildschirm",
            id : "shared.fullscreenbutton.gofullscreen"
        })
    }
```

Autre exemple avec plusieurs imbrications :

```tsx
text={showText 
        ? event.isDirty 
            ? translate({
                    message : 'Verwerfen',
                    id : "components.event.actions.discard",
                    description : "Text of the button discard"
                })
            : translate({
                    message : 'Abbrechen',
                    id : "components.event.actions.cancel",
                    description : "Text of the button cancel"
                })
        : undefined
}
```

### Traduire dans un objet JS avec variable

```tsx
setErrorMessages([`Abteilung "${token.charAt(2)}" nicht gefunden`]);
```

devient :

```tsx
setErrorMessages([
    translate(
        {
            message : `Abteilung "{letter}" nicht gefunden`,
            id : "share.audiencePicker.classSelector.errormsg.department",
            description : "Error message department not found"
        },

        {letter : token.charAt(2)}
    )
]);
```

et dans fr/code.json :

```tsx
    "..."" : {
        "message" : "Abteilung \"{letter}\" nicht gefunden",
        "description" : "..."
    }
```

## Mettre à jour les traductions

Après avoir ajouté les balises translate, lancer en ligne de commande

```bash
yarn write-translations --locale de
```
ou

```bash
yarn write-translations --locale fr
```

pour ajouter automatiquement les entrées dans le fichier code.json.

## Mettre à jour les traductions
S'assurer le code est bien mis en forme avec 
```bash
yarn prettier chemin/du/fichier --write
```

## Gestion des branches de traduction

### Travailler sur une nouvelle branche sur le dépôt original

```bash
git clone git@github.com:lebalz/events-app.git events-app
cd events-app
git 
# Maintenant sur la nouvelle branche
# travailler et faire des commits
# et lors du premier pushya
git push -u origin neuer-branch-name
# continuer à travailler...
# pour les push suivants :
git push
```

### Continuer à travailler lorsque la branche a été fusionnée sur le dépôt original
```bash
# Revenir sur la branche principale
git checkout main
# Mettre la branche à jour
git pull
# Supprimer l'ancienne branche
git branch -d nom-ancienne-branche
# Supprimer la branche fusionnée également sur GitHub
# Créer une nouvelle branche pour un nouveau développement
git checkout -b "nom-de-la-nouvelle-branche"
```

