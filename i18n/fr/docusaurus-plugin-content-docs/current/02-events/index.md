
import styles from './styles.module.scss';
import Badge from '@site/src/components/shared/Badge';
import { EventState, EventStateButton, EventStateColor, EventStateTranslation } from '@site/src/api/event';

# Évènements

Un évènement est un évènement qui a lieu à un moment précis et possède les attributs suivants:

Titre
: Brève description de l'évènement, généralement moins de 80 caractères.
Description
: Description détaillée de l'évènement. Peut également contenir plusieurs paragraphes.
Début
: Date et heure de début de l'évènement.
Fin
: Date et heure de fin de l'évènement. L'évènement peut également durer toute une journée.
Lieu
: Lieu où se déroule l'évènement.
Participant·e·s
: Indique à qui l'évènement est destiné et s'il affecte l'enseignement. [👉 Plus de détails](#participantes)
Statut
: Indique si l'évènement a été publié ou non.
: <Badge icon={EventStateButton.DRAFT}
                    color={EventStateColor.DRAFT}
                    title={EventStateTranslation.DRAFT}
                    text={EventStateTranslation.DRAFT}
                    iconSide='left'
					className={styles.badge}
                />  *Une date qui n'a pas encore été publiée. N'est visible que pour l'auteur.*
: <Badge icon={EventStateButton.REVIEW}
                    color={EventStateColor.REVIEW}
                    title={EventStateTranslation.REVIEW}
                    text={EventStateTranslation.REVIEW}
                    iconSide='left'
					className={styles.badge}
                /> *Un évènement qui a été soumis pour examen. Visible uniquement par l'auteur et les administrateurs.*
: <Badge icon={EventStateButton.PUBLISHED}
                    color={EventStateColor.PUBLISHED}
                    title={EventStateTranslation.PUBLISHED}
                    text={EventStateTranslation.PUBLISHED}
                    iconSide='left'
					className={styles.badge}
                /> *Une date publiée visible par tous.*
: <Badge icon={EventStateButton.REFUSED}
                    color={EventStateColor.REFUSED}
                    title={EventStateTranslation.REFUSED}
                    text={EventStateTranslation.REFUSED}
                    iconSide='left'
					className={styles.badge}
                /> *Un évènement qui a été refusé. N'est visible que par l'auteur et les administrateurs.*


## Participant·e·s {#participantes}

Les dates peuvent être destinées à différents groupes cibles.

### Concerne {#concerne}
Les évènements scolaires concernent des __enseignants__ entiers, des __enseignants de classe__, les __élèves__ ou __tous__. En fonction de la personne pour laquelle les évènements ont été saisis et si l'enseignement à l'horaire est concerné, ils seront affichés dans l'agenda.

Le tableau suivant donne un aperçu du moment où un évènement est affiché pour les différents groupes cibles.

<table className={styles.audience}>
	<tbody>
		<tr>
			<td rowSpan="2" className={styles.left}><b>L'évènement...</b></td>
			<td colSpan="4">Est-ce que l'évènement pour ... est affiché ?</td>
		</tr>
		<tr>
			<td colSpan="2">Enseignant(e)</td>
			<td rowSpan="2">MC de la<br />classe <br />concernée</td>
			<td rowSpan="2">Élèves</td>
		</tr>
		<tr>
            <td className={styles.left}>...tombe pendant la leçon?\*</td>
			<td>Oui</td>
			<td>Non</td>
		</tr>
		<tr className={styles.line}>
			<td className={styles.left}>...pour tout le monde __Tous__</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td className={styles.left}>...pour les élèves __EL__</td>
			<td>✅</td>
			<td>◻️</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td className={styles.left}>...pour les enseignant·e·s __M__</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
			<td>◻️</td>
		</tr>
		<tr>
			<td className={styles.left}>...pour  les maître·sse·s de classe __MC__</td>
			<td>◻️</td>
			<td>◻️</td>
			<td>✅</td>
			<td>◻️</td>
		</tr>
	</tbody>
</table>

\* Si un évènement a lieu pendant une leçon de l'horaire normal (même s'il commence ou se termine pendant la leçon), il est affiché pour les enseignants concernés.

### Enseignement concerné ?
Le champ __Enseignement concerné?__ permet d'indiquer si, pendant l'évènement, le cours est totalement annulé, partiellement concerné ou a lieu.

Cours concernés ?
: :mdi[circle]{color=green size=12px} Oui
: :mdi[circle]{color=yellow size=12px} Partiellement
: :mdi[circle]{color=red size=12px} Non

:::warning[Visibilité]
Mais dans tous les cas, l'évènement sera **affiché dans le calendrier** s'il est visible pour le groupe cible selon le [👉 tableau ci-dessus](#concerne).
:::
### Filières
Les évènements peuvent être fixés pour des filières entières. Dans ce cas, l'évènement est affiché pour tous les enseignants et/ou élèves de la filière concernée, en respectant le champ __Concerné__.

### Classes
Les évènements peuvent être fixés pour des classes individuelles. Dans ce cas, l'évènement est affiché pour tous les enseignants et/ou élèves de la classe concernée, en respectant le champ __Concerné__.


<details>
<summary>
Futures classes
</summary>

Pour les classes qui ne sont pas encore gérées dans WebUntis, les classes correspondantes peuvent déjà être enregistrées à l'avance __:mdi[dots-vertical-circle-outline] > Futures classes__ :

export const year = ((new Date()).getFullYear()+5) % 100

Nom de classe exact
: par exemple __{year}Ga__ oder __{year}mB__
Année entière
: par exemple __{year}G__ oder __{year}m__
: uniquement possible par division

</details>



## Import-Formate

### `V1` Format :mdi[file-excel]{color=green}

Modèle
: [👉 Termin-Import V1 DE](./assets/[2024-04-24]%20Import-Format-v1%20DE.xlsx)
: [👉 Termin-Import V1 FR](./assets/[2024-04-24]%20Import-Format-v1%20FR.xlsx)

<details>
<summary>Définition des champs</summary>

| **Colonnes**                        | **Type de données/ Plage de valeurs**                                                                                                       | **Description**                                                                                                                                                                                                                                                                                                                                                                                       | **Exemple**                                                                                   |
|:----------------------------------|:---------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------|
| **SC**                            | -                                                                                                                                | Semaine calendaire, calculée automatiquement à partir de la date de début. Sert à vérifier l'intégrité.                                                                                                                                                                                                                                                                                                                |                                                                                                |
| **Jour de la semaine**                     | -                                                                                                                                | Jour de la semaine, calculé automatiquement. A des fins de vérification.                                                                                                                                                                                                                                                                                                                     |                                                                                                |
| **Titre**                         | Texte                                                                                                                             | Courte description de l’évènement                                                                                                                                                                                                                                                                                                                                                                            | GYMF > Excursion OC géographie                                                                     |
| **Date début**                  | Date format __jj.mm.aaaa__                                                                             | Date du début                                                                                                                                                                                                                                                                                                                                                                                              | *12.01.2024*                                                                                   |
| **Heure début**                   | *[optionnel]* heure format __HH:MM__                                                                                            | Heure du début de l’évènement.   Les évènements de journée entière ont ce champ libre (ou commencent à 00:00)                                                                                                                                                                                                                                                                                                                                | *12:00*                                                                                        |
| **Date fin**                    | Date format __jj.mm.aaaa__                                                                                                   | Date de fin                                                                                                                                                                                                                                                                                                                                                                                               | *12.01.2024*                                                                                   |
| **Heure fin**                     | *[optionnel]* heure format __HH:MM__                                                                                            | Heure de fin de l’évènement.   Les évènements de journée entière ont ce champ libre (ou se terminent à 00:00 le jour suivant). Si ce champ est vide et le champ Heure début est renseigné, l’heure de fin est la même que l’heure de début (pour échéances)                                                                                                                                                                                                                                | *12:15*                                                                                        |
| **Lieu**                           | *[optionnel]* Texte                                                                                                                | Lieu(x)                                                                                                                                                                                                                                                                                                                                                                                            | *F102*                                                                                         |
| **Description**                  | Texte, plusieurs lignes   (aller à la ligne est possible avec `Alt+Enter`)                                                              | Description détaillée.                                                                                                                                                                                                                                                                                                                                                                 | *OC géographie volée 25: excursion à Riederalp (STE).   Départ vendredi à 12h00, retour samedi à 19h00.*      |
| **GYMD**                          | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans GYM GBSL monolingue sont concernées?  Aucune valeur signifie Non ( `0`)                                                                                                                                                                                                                                                                                                                                 |                                                                                                |
| **GYMD/GYMF**                     | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans GYM GBSL bilingue sont concernées?                                                                                                                                                                                                                                                                                                                       |                                                                                                |
| **GYMF**                          | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans GYM GBJB monolingue sont concernées?                                                                                                                                                                                                                                                                                                                              |                                                                                                |
| **GYMF/GYMD**                     | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans GYM GBJB bilingue sont concernées?                                                                                                                                                                                                                                                                                                                    |                                                                                                |
| **FMS**                           | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans FMS sont concernées?                                                                                                                                                                                                                                                                                                                                        |                                                                                                |
| **FMS/ECG**                       | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans FMS/ECG bilingue sont concernées?                                                                                                                                                                                                                                                                                                                                    |                                                                                                |
| **ECG**                           | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans ECG sont concernées?                                                                                                                                                                                                                                                                                                                                 |                                                                                                |
| **ECG/FMS**                       | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans ECG/FMS bilingue sont concernées?                                                                                                                                                                                                                                                                                                                            |                                                                                                |
| **WMS**                           | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans WMS sont concernées?                                                                                                                                                                                                                                                                                                                                      |                                                                                                |
| **ESC**                           | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans ESC sont concernées?                                                                                                                                                                                                                                                                                                                                      |                                                                                                |
| **FMPäd**                         | *[optionnel]* `0`, `1`                                                                                                            |Est-ce que toutes les personnes impliquées dans FMPäd sont concernées?                                                                                                                                                                                                                                                                                                                                    |                                                                                                |
| **MSOP**                          | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans MSOP sont concernées?                                                                                                                                                                                                                                                                                                                                     |                                                                                                |
| **Passerelle**                    | *[optionnel]* `0`, `1`                                                                                                            | Est-ce que toutes les personnes impliquées dans Passerelle sont concernées?                                                                                                                                                                                                                                                                                                                               |                                                                                                |
| **Concerne profs des classes bilingues?** | *[optionnel]* `0`, `1`   N’est pris en considération que si une filière bilingue (GBSL/GBJB, GBJB/GBSL ou ECG/FMS) ou une classe bilingue a été choisie.   Seulement pertinent si le champ Concerne = « MC » ou « Tout »                                                                                                                          |                                                                                                |
| **Classes**                       | *[optionnel]* Noms de classe, séparés par des virgules. Avec `*` on indique que toutes les classes d’une volée sont concernées.     |                                                                                                                                                                                                                                                                                                                                                                                                        | -   `28mH, 29sA, 24cB` <br />Toute la volée 27 GYMD:<br />-   `27G*`<br />Toute la volée 26 GYMF:<br />-   `26m*` |
| **Classes exclues**       | *[optionnel]* Classes à exclure de la colonne “Classes”                                                                      | Si toutes les classes monolingues de la volée 27 sont concernées (sans le classes bilingues), alors on  peut utiliser cette colonne: “Classes”: 27m* -> “Classes exclues”: 27mT, 27mU. Ne pas utiliser l’* pour ce champ.                                                                                                                                                                                                                                                                          | - "Classes": `27*`<br />- "Classes exclues": `27mG, 27mH, 27mI`                         |
| **Concerne**                      | __LP__, __KLP__, __STUDENTS__, __ALL__                                                                                           | **LP**: seuls les profs qui enseignent dans la classe sont concernés. <br />**KLP**: seuls les maître·sses de classe sont concernés<br />**STUDENTS**: seuls les élèves ainsi que les profs dont l’enseignement est touché sont concernés. Ces événements sont également visibles pour les maître·sses de classe. <br />**ALL**: tout le monde, autant les profs que les élèves sont concerné·e·s. |                                                                                                |
| **Leçons impactées?**         | __YES__, __PARTIAL__ , __NO__                                                                                                    | **YES**:  l’enseignement ne peut pas avoir lieu<br />**PARTIAL**: l’enseignement est touché partiellement, mais peut avoir lieu normalement. <br />**NO**:  l’enseignement n’est pas touché<br />*Est lié à l’horaire dans WebUntis à si YES ou PARTIAL, les profs qui ont la classe dans la plage horaire indiquée sont atteints même si STUDENTS dans « Concerne »*                                                                                         |                                                                                                |

</details>

### `GBSL` Format :mdi[file-excel]{color=teal}

:::warning[Altes Format]
Dieses Format wurde bis Sommer 2024 am GBSL verwendet und ist nicht mehr aktuell. Bitte verwenden Sie das `V1` Format.
:::

Modèle
: [👉 Termin-Import GBSL](./assets/[2024-05-21]%20Import-Format-GBSL.xlsx)


<details>
<summary>Felder Definition</summary>

| **Spalte**                        | **Datentyp/ Wertebereich**                                                                                                       | **Beschreibung**                                                                                                                                                                                                                                                                                                                                                                                       | **Beispiel**                                                                                   |
|:----------------------------------|:---------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------|
| A: **KW**                            | -                                                                                                                                | Kalenderwoche, wird automatisch vom Startdatum berechnet. Dient zur Integritätsprüfung.                                                                                                                                                                                                                                                                                                                |                                                                                                |
| B: **Wochentag**                     | -                                                                                                                                | Wochentag, wird automatisch vom Startdatum berechnet. Dient zur Integritätsprüfung.                                                                                                                                                                                                                                                                                                                    |                                                                                                |
| C: **Stichwort**                         | Text                                                                                                                             | Kurzbeschreibung des Termins                                                                                                                                                                                                                                                                                                                                                                           | *Solothurner Filmtage 25i*                                                                     |
| D: **Datum Beginn**                  | Datum im Format __dd.mm.yyyy__                                                                                                   | Startdatum                                                                                                                                                                                                                                                                                                                                                                                             | *12.01.2024*                                                                                   |
| E: **Zeit Beginn**                   | *[optionnel]* Zeit im Format __HH:MM__                                                                                            | Zeit des Terminstarts. <br /> Ganztägige Termine haben ein leeres Feld.                                                                                                                                                                                                                                                                                                                                | *12:00*                                                                                        |
| F: **Datum Ende**                    | Datum im Format __dd.mm.yyyy__                                                                                                   | Enddatum                                                                                                                                                                                                                                                                                                                                                                                               | *12.01.2024*                                                                                   |
| G: **Zeit Ende**                     | *[optionnel]* Zeit im Format __HH:MM__                                                                                            | Zeit des Terminendes. Ganztägige Termine haben ein leeres Feld. Ist das Feld leer und gleichzeitig die Startzeit gesetzt, wird die Endzeit auf die Startzeit festgelegt.                                                                                                                                                                                                                               | *12:15*                                                                                        |
| H: **Ort**                           | *[optionnel]* Text                                                                                                                | Ortsangaben                                                                                                                                                                                                                                                                                                                                                                                            | *F102*                                                                                         |
| I: **betroffene Lehrkräfte**         | Angaben über betroffene Lehrkräfte                                                              | Ausführliche Beschreibung des Termins.                                                                                                                                                                                                                                                                                                                                                                 | *Der Filmanlass GYM4, FMS3, WMS3 in Zusammenarbeit mit dem Filmpodium und der Filmgilde.*      |
| J: **GYM**                          | *[optionnel]* `GYM`                                                                                                            | Sind alle vom GYM GBSL betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                 |                                                                                                |
| K: **FMS**                          | *[optionnel]* `FMS`                                                                                                            | Sind alle vom GYM GBSL betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                 |                                                                                                |
| L: **WMS**                          | *[optionnel]* `WMS`                                                                                                            | Sind alle vom GYM GBSL betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                 |                                                                                                |
| M: **Beschreibung**                  | Text, mehrzeilig(Zeilenumbruch kann mit `Alt+Enter` erzeugt werden)                                                              | Ausführliche Beschreibung des Termins.                                                                                                                                                                                                                                                                                                                                                                 | *Der Filmanlass GYM4, FMS3, WMS3 in Zusammenarbeit mit dem Filmpodium und der Filmgilde.*      |
| N: **Jahrgangsstufe**               | *[optionnel]* Abteilung + Ausbildungsjahr, mit Komma getrennt      | | `WMS2` oder `GYM1, GYM1 bilingue` |
| O: **Einzelne Klassen**             | *[optionnel]* Klassenbezeichnungen, mit Komma getrennt.      |                                                                                                                                                                                                                                                                                                                                                                                                        | `27Ga, 25h, 25i, 24K` |
| P: **Betrifft**<br />  0=KLP<br />  1=LP<br />  2=SuS<br />  3=Alle | *[optionnel]* `0`, `1`, `2`, `3` | **0: KLP**: nur Klassenlehrpersonen sind betroffen<br />**1: LP**: nur Lehrpersonen, die an den gegebenen Klassen unterrichten, sind betroffen.<br />**2: SuS**: nur die Schüler:innen sowie Lehrpersonen, deren Unterricht tangiert wird, sind betroffen. Zusätzliche werden diese Termine den KLP’s der betroffenen Klassen angezeigt.<br />**3: ALL**: Alle, sowohl LP’s wie auch STUDENTS sind betroffen. |                                                                                                |
| Q: **Unterricht Betroffen?**<br />  0=Nein<br />  1=Teilweise<br />  2=Ja       | *[optionnel]* `0`, `1`, `2` | **0: Nein**: der Unterricht ist nicht tangiert – bspw. Noteneingabe in Evento…<br />**1: Teilweise**: der Unterricht ist teilweise betroffen (bspw. einige Personen fehlen), kann aber normal stattfinden.<br />**2: Ja**: der Unterricht kann nicht in gewohnter Form stattfinden (die ganze Klasse ist bspw. abwesend)                                                                                      |                                                                                                |

</details>

### `GBJB` Format :mdi[file-delimited]{color=blue}

:::warning[Altes Format]
Dieses Format wurde bis Winter 2023 am GBJB verwendet und ist nicht mehr aktuell. Bitte verwenden Sie das `V1` Format.
:::
