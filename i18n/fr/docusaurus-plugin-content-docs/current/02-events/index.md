
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

Vorlage
: [👉 Termin-Import V1 DE](./assets/[2024-04-24]%20Import-Format-v1%20DE.xlsx)
: [👉 Termin-Import V1 FR](./assets/[2024-04-24]%20Import-Format-v1%20FR.xlsx)

<details>
<summary>Felder Definition</summary>

| **Spalte**                        | **Datentyp/ Wertebereich**                                                                                                       | **Beschreibung**                                                                                                                                                                                                                                                                                                                                                                                       | **Beispiel**                                                                                   |
|:----------------------------------|:---------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------|
| **SC**                            | -                                                                                                                                | Kalenderwoche, wird automatisch vom Startdatum berechnet. Dient zur Integritätsprüfung.                                                                                                                                                                                                                                                                                                                |                                                                                                |
| **Jour de la semaine**                     | -                                                                                                                                | Wochentag, wird automatisch vom Startdatum berechnet. Dient zur Integritätsprüfung.                                                                                                                                                                                                                                                                                                                    |                                                                                                |
| **Titre**                         | Text                                                                                                                             | Kurzbeschreibung des Termins                                                                                                                                                                                                                                                                                                                                                                           | *Solothurner Filmtage 25i*                                                                     |
| **Date début**                  | Datum im Format __dd.mm.yyyy__                                                                                                   | Startdatum                                                                                                                                                                                                                                                                                                                                                                                             | *12.01.2024*                                                                                   |
| **Heure début**                   | *[optionnel]* Zeit im Format __HH:MM__                                                                                            | Zeit des Terminstarts. <br /> Ganztägige Termine haben ein leeres Feld.                                                                                                                                                                                                                                                                                                                                | *12:00*                                                                                        |
| **Date fin**                    | Datum im Format __dd.mm.yyyy__                                                                                                   | Enddatum                                                                                                                                                                                                                                                                                                                                                                                               | *12.01.2024*                                                                                   |
| **Heure fin**                     | *[optionnel]* Zeit im Format __HH:MM__                                                                                            | Zeit des Terminendes. Ganztägige Termine haben ein leeres Feld. Ist das Feld leer und gleichzeitig die Startzeit gesetzt, wird die Endzeit auf die Startzeit festgelegt.                                                                                                                                                                                                                               | *12:15*                                                                                        |
| **Lieu**                           | *[optionnel]* Text                                                                                                                | Ortsangaben                                                                                                                                                                                                                                                                                                                                                                                            | *F102*                                                                                         |
| **Description**                  | Text, mehrzeilig(Zeilenumbruch kann mit `Alt+Enter` erzeugt werden)                                                              | Ausführliche Beschreibung des Termins.                                                                                                                                                                                                                                                                                                                                                                 | *Der Filmanlass GYM4, FMS3, WMS3 in Zusammenarbeit mit dem Filmpodium und der Filmgilde.*      |
| **GYMD**                          | *[optionnel]* `0`, `1`                                                                                                            | Sind alle vom GYM GBSL betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                 |                                                                                                |
| **GYMD/GYMF**                     | *[optionnel]* `0`, `1`                                                                                                            | Sind alle vom bilinguen GYM GBSL betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                       |                                                                                                |
| **GYMF**                          | *[optionnel]* `0`, `1`                                                                                                            | Sind alle vom Maturité GBJB betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                            |                                                                                                |
| **GYMF/GYMD**                     | *[optionnel]* `0`, `1`                                                                                                            | Sind alle vom bilinguen Maturité GBJB betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                  |                                                                                                |
| **FMS**                           | *[optionnel]* `0`, `1`                                                                                                            | Sind alle der FMS betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                      |                                                                                                |
| **FMS/ECG**                       | *[optionnel]* `0`, `1`                                                                                                            | Sind alle der FMS/ECG betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                  |                                                                                                |
| **ECG**                           | *[optionnel]* `0`, `1`                                                                                                            | Sind alle des ECG’s betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                    |                                                                                                |
| **ECG/FMS**                       | *[optionnel]* `0`, `1`                                                                                                            | Sind alle vom bilinguen ECG betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                            |                                                                                                |
| **WMS**                           | *[optionnel]* `0`, `1`                                                                                                            | Sind alle der WMS betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                      |                                                                                                |
| **ESC**                           | *[optionnel]* `0`, `1`                                                                                                            | Sind alle des ESC betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                      |                                                                                                |
| **FMPäd**                         | *[optionnel]* `0`, `1`                                                                                                            | Sind alle vom FMPäd betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                    |                                                                                                |
| **MSOP**                          | *[optionnel]* `0`, `1`                                                                                                            | Sind alle des MSOP betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                     |                                                                                                |
| **Passerelle**                    | *[optionnel]* `0`, `1`                                                                                                            | Sind alle der Passerelle betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                               |                                                                                                |
| **Concerne profs des classes bilingues?** | *[optionnel]* `0`, `1` Wird nur beachtet, wenn eine Bilingue-Schule (GYMD/GYMF, GYMF/GYMD oder ECG/FMS, FMS/ECG) ausgewählt wurde | Sind alle LP’s des GBJB anzusprechen, dann werden die Schulen bspw. `GYMF, GYMF/GYMD, ECG, ESC` ausgewählt.<br />Für LP’s des GBSL, welche an Bilingue-Klassen unterrichten (bspw. bei `27mT`) wird der Termin **nicht** angezeigt, ausser dieses Feld wird auf `1` gestellt.                                                                                                                          |                                                                                                |
| **Classes**                       | *[optionnel]* Klassenbezeichnungen, mit Komma getrennt. Mit `*` wird angegeben, dass alle der Jahrgangsstufe betroffen sind.      |                                                                                                                                                                                                                                                                                                                                                                                                        | -   `25h, 25i, 24K` <br />Alle 24er GYMD:<br />-   `24G*`<br />Alle 25er GYMF:<br />-   `25m*` |
| **Classes exclues**       | *[optionnel]* Auszuschliessende Klassen der Spalte "Klassen"                                                                      | Wenn alle deutschsprachigen Klassen der JG. Stufe 27 gemeint sind (ohne Bilingue Klassen), so kommt diese Spalte zum Einsatz.                                                                                                                                                                                                                                                                          | - "Klasse": `27*`<br />- "Ausgeschlossene Klassen": `27Gw, 27Gx, 27Gy`                         |
| **Concerne**                      | __LP__, __KLP__, __STUDENTS__, __ALL__                                                                                           | **LP**: nur Lehrpersonen, die an den gegebenen Klassen unterrichten, sind betroffen.<br />**KLP**: nur Klassenlehrpersonen sind betroffen<br />**STUDENTS**: nur die Schüler:innen sowie Lehrpersonen, deren Unterricht tangiert wird, sind betroffen. Zusätzliche werden diese Termine den KLP’s der betroffenen Klassen angezeigt.<br />**ALL**: Alle, sowohl LP’s wie auch STUDENTS sind betroffen. |                                                                                                |
| **Leçons impactées?**         | __YES__, __PARTIAL__ , __NO__                                                                                                    | **YES**: der Unterricht kann nicht in gewohnter Form stattfinden (die ganze Klasse ist bspw. abwesend)<br />**PARTIAL**: der Unterricht ist teilweise betroffen (bspw. einige Personen fehlen), kann aber normal stattfinden.<br />**NO**: der Unterricht ist nicht tangiert – bspw. Noteneingabe in Evento…                                                                                           |                                                                                                |

</details>

### `GBSL` Format :mdi[file-excel]{color=teal}

:::warning[Altes Format]
Dieses Format wurde bis Sommer 2024 am GBSL verwendet und ist nicht mehr aktuell. Bitte verwenden Sie das `V1` Format.
:::

Vorlage
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
