
import styles from './styles.module.scss';
import Badge from '@site/src/components/shared/Badge';
import { EventState, EventStateButton, EventStateColor, EventStateTranslation } from '@site/src/api/event';

# Termine

Ein Termin ist ein Ereignis, das zu einem bestimmten Zeitpunkt stattfindet und hat folgende Attribute:

Titel
: Kurze Beschreibung des Termins, in der Regel weniger als 80 Zeichen.
Beschreibung
: Detaillierte Beschreibung des Termins. Kann auch mehrere Absätze enthalten.
Start
: Datum und Uhrzeit, wann der Termin beginnt.
Ende
: Datum und Uhrzeit, wann der Termin endet. Der Termin kann auch ganztägig sein.
Ort
: Ort, an dem der Termin stattfindet.
Publikum
: Gibt an, für wen der Termin bestimmt ist und ob er den Unterricht tangiert. [👉 Weitere Details](#publikum)
Status
: Gibt an, ob der Termin veröffentlicht wurde oder nicht.
: <Badge icon={EventStateButton.DRAFT}
                    color={EventStateColor.DRAFT}
                    title={EventStateTranslation.DRAFT}
                    text={EventStateTranslation.DRAFT}
                    iconSide='left'
					className={styles.badge}
                />  *Ein Termin, der noch nicht veröffentlicht wurde. Ist nur für die Author\:in sichtbar.*
: <Badge icon={EventStateButton.REVIEW}
                    color={EventStateColor.REVIEW}
                    title={EventStateTranslation.REVIEW}
                    text={EventStateTranslation.REVIEW}
                    iconSide='left'
					className={styles.badge}
                /> *Ein Termin, der zur Überprüfung eingereicht wurde. Ist nur für die Author\:in und die Administratoren sichtbar.*
: <Badge icon={EventStateButton.PUBLISHED}
                    color={EventStateColor.PUBLISHED}
                    title={EventStateTranslation.PUBLISHED}
                    text={EventStateTranslation.PUBLISHED}
                    iconSide='left'
					className={styles.badge}
                /> *Ein veröffentlichter Termin der für alle sichtbar ist.*
: <Badge icon={EventStateButton.REFUSED}
                    color={EventStateColor.REFUSED}
                    title={EventStateTranslation.REFUSED}
                    text={EventStateTranslation.REFUSED}
                    iconSide='left'
					className={styles.badge}
                /> *Ein Termin, der abgelehnt wurde. Ist nur für die Author\:in und die Administratoren sichtbar.*


## Publikum

Termine können für verschiedene Zielgruppen bestimmt sein.

### Betrifft
Schulische Termine betreffen ganze __Lehrpersonen__, __Klassenlehrpersonen__, die __Schülerschaft__ oder __Alle__. Abhängig davon, für wen die Terimine erfasst wurden und ob der Stundenplanmässige Unterricht betroffen ist, werden sie im Terminplan angezeigt.

In der folgenden Tabelle ist eine Übersicht, wann ein Termin für die verschiedenen Zielgruppen angezeigt wird.

<table className={styles.audience}>
	<tbody>
		<tr>
			<td rowSpan="2" className={styles.left}><b>Der Termin...</b></td>
			<td colSpan="4">Wird der Termin für ... Angezeigt?</td>
		</tr>
		<tr>
			<td colSpan="2">Lehrperson</td>
			<td rowSpan="2">KLP der <br />betroffenen <br />Klasse</td>
			<td rowSpan="2">Schüler\:in</td>
		</tr>
		<tr>
            <td className={styles.left}>...ist während der Lektion?\*</td>
			<td>Ja</td>
			<td>Nein</td>
		</tr>
		<tr className={styles.line}>
			<td className={styles.left}>...für __Alle__</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td className={styles.left}>...für Schüler\:innen __SuS__</td>
			<td>✅</td>
			<td>◻️</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td className={styles.left}>...für Lehrpersonen __LP__</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
			<td>◻️</td>
		</tr>
		<tr>
			<td className={styles.left}>...für Klassenlehrpersonen __KLP__</td>
			<td>◻️</td>
			<td>◻️</td>
			<td>✅</td>
			<td>◻️</td>
		</tr>
	</tbody>
</table>

\* Wenn ein Termin während einer Lektion im Regelstundenplan stattfindet (auch, wenn er während der Lektion Beginnt oder Endet), wird er für betroffene Lehrpersonen angezeigt.

### Unterricht betroffen?

Mit dem Feld __Unterricht Betroffen?__ kann angegeben, ob während des Termins der Unterricht ganz ausfällt, teilweise betroffen ist oder stattfindet.

Unterricht Betroffen?
: :mdi[circle]{color=green size=12px} Ja
: :mdi[circle]{color=yellow size=12px} Teilweise
: :mdi[circle]{color=red size=12px} Nein

:::warning[Sichtbarkeit]
In jedemfall wird der Termin aber **im Kalender angezeigt**, wenn er gemäss der [👉 obigen Tabelle](#betrifft) für die Zielgruppe sichtbar ist.
:::

### Abteilungen
Termine können für ganze Abteilungen festgelegt werden. In diesem Fall wird der Termin unter Einhaltung des __Betrifft__ Feldes für alle Lehrpersonen und/oder Schüler:innen der betroffenen Abteilung angezeigt.

### Klassen
Termine können für einzelne Klassen festgelegt werden. In diesem Fall wird der Termin unter Einhaltung des __Betrifft__ Feldes für alle Lehrpersonen und/oder Schüler:innen der betroffenen Klasse angezeigt.

<details>
<summary>
Künftige Klassen
</summary>

Für Klassen, die noch nicht in WebUntis geführt werden, können entsprechende Klassen bereits im Voraus hinterlegt werden __:mdi[dots-vertical-circle-outline] > Künftige Klassen__:

export const year = ((new Date()).getFullYear()+5) % 100

Exakter Klassenname
: bspw. __{year}Ga__ oder __{year}mB__
Ganze Jahrgangsstufe
: bspw. __{year}G__ oder __{year}m__
: nur Abteilungsweise möglich

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
| **KW**                            | -                                                                                                                                | Kalenderwoche, wird automatisch vom Startdatum berechnet. Dient zur Integritätsprüfung.                                                                                                                                                                                                                                                                                                                |                                                                                                |
| **Wochentag**                     | -                                                                                                                                | Wochentag, wird automatisch vom Startdatum berechnet. Dient zur Integritätsprüfung.                                                                                                                                                                                                                                                                                                                    |                                                                                                |
| **Titel**                         | Text                                                                                                                             | Kurzbeschreibung des Termins                                                                                                                                                                                                                                                                                                                                                                           | *Solothurner Filmtage 25i*                                                                     |
| **Datum Beginn**                  | Datum im Format __dd.mm.yyyy__                                                                                                   | Startdatum                                                                                                                                                                                                                                                                                                                                                                                             | *12.01.2024*                                                                                   |
| **Zeit Beginn**                   | *[optional]* Zeit im Format __HH:MM__                                                                                            | Zeit des Terminstarts. <br /> Ganztägige Termine haben ein leeres Feld.                                                                                                                                                                                                                                                                                                                                | *12:00*                                                                                        |
| **Datum Ende**                    | Datum im Format __dd.mm.yyyy__                                                                                                   | Enddatum                                                                                                                                                                                                                                                                                                                                                                                               | *12.01.2024*                                                                                   |
| **Zeit Ende**                     | *[optional]* Zeit im Format __HH:MM__                                                                                            | Zeit des Terminendes. Ganztägige Termine haben ein leeres Feld. Ist das Feld leer und gleichzeitig die Startzeit gesetzt, wird die Endzeit auf die Startzeit festgelegt.                                                                                                                                                                                                                               | *12:15*                                                                                        |
| **Ort**                           | *[optional]* Text                                                                                                                | Ortsangaben                                                                                                                                                                                                                                                                                                                                                                                            | *F102*                                                                                         |
| **Beschreibung**                  | Text, mehrzeilig(Zeilenumbruch kann mit `Alt+Enter` erzeugt werden)                                                              | Ausführliche Beschreibung des Termins.                                                                                                                                                                                                                                                                                                                                                                 | *Der Filmanlass GYM4, FMS3, WMS3 in Zusammenarbeit mit dem Filmpodium und der Filmgilde.*      |
| **GYMD**                          | *[optional]* `0`, `1`                                                                                                            | Sind alle vom GYM GBSL betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                 |                                                                                                |
| **GYMD/GYMF**                     | *[optional]* `0`, `1`                                                                                                            | Sind alle vom bilinguen GYM GBSL betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                       |                                                                                                |
| **GYMF**                          | *[optional]* `0`, `1`                                                                                                            | Sind alle vom Maturité GBJB betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                            |                                                                                                |
| **GYMF/GYMD**                     | *[optional]* `0`, `1`                                                                                                            | Sind alle vom bilinguen Maturité GBJB betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                  |                                                                                                |
| **FMS**                           | *[optional]* `0`, `1`                                                                                                            | Sind alle der FMS betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                      |                                                                                                |
| **FMS/ECG**                       | *[optional]* `0`, `1`                                                                                                            | Sind alle der FMS/ECG betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                  |                                                                                                |
| **ECG**                           | *[optional]* `0`, `1`                                                                                                            | Sind alle des ECG’s betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                    |                                                                                                |
| **ECG/FMS**                       | *[optional]* `0`, `1`                                                                                                            | Sind alle vom bilinguen ECG betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                            |                                                                                                |
| **WMS**                           | *[optional]* `0`, `1`                                                                                                            | Sind alle der WMS betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                      |                                                                                                |
| **ESC**                           | *[optional]* `0`, `1`                                                                                                            | Sind alle des ESC betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                      |                                                                                                |
| **FMPäd**                         | *[optional]* `0`, `1`                                                                                                            | Sind alle vom FMPäd betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                    |                                                                                                |
| **MSOP**                          | *[optional]* `0`, `1`                                                                                                            | Sind alle des MSOP betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                     |                                                                                                |
| **Passerelle**                    | *[optional]* `0`, `1`                                                                                                            | Sind alle der Passerelle betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                               |                                                                                                |
| **Bilingue LP’s auch betroffen?** | *[optional]* `0`, `1` Wird nur beachtet, wenn eine Bilingue-Schule (GYMD/GYMF, GYMF/GYMD oder ECG/FMS, FMS/ECG) ausgewählt wurde | Sind alle LP’s des GBJB anzusprechen, dann werden die Schulen bspw. `GYMF, GYMF/GYMD, ECG, ESC` ausgewählt.<br />Für LP’s des GBSL, welche an Bilingue-Klassen unterrichten (bspw. bei `27mT`) wird der Termin **nicht** angezeigt, ausser dieses Feld wird auf `1` gestellt.                                                                                                                          |                                                                                                |
| **Klassen**                       | *[optional]* Klassenbezeichnungen, mit Komma getrennt. Mit `*` wird angegeben, dass alle der Jahrgangsstufe betroffen sind.      |                                                                                                                                                                                                                                                                                                                                                                                                        | -   `25h, 25i, 24K` <br />Alle 24er GYMD:<br />-   `24G*`<br />Alle 25er GYMF:<br />-   `25m*` |
| **Ausgeschlossene Klassen**       | *[optional]* Auszuschliessende Klassen der Spalte "Klassen"                                                                      | Wenn alle deutschsprachigen Klassen der JG. Stufe 27 gemeint sind (ohne Bilingue Klassen), so kommt diese Spalte zum Einsatz.                                                                                                                                                                                                                                                                          | - "Klasse": `27*`<br />- "Ausgeschlossene Klassen": `27Gw, 27Gx, 27Gy`                         |
| **Betrifft**                      | __LP__, __KLP__, __STUDENTS__, __ALL__                                                                                           | **LP**: nur Lehrpersonen, die an den gegebenen Klassen unterrichten, sind betroffen.<br />**KLP**: nur Klassenlehrpersonen sind betroffen<br />**STUDENTS**: nur die Schüler:innen sowie Lehrpersonen, deren Unterricht tangiert wird, sind betroffen. Zusätzliche werden diese Termine den KLP’s der betroffenen Klassen angezeigt.<br />**ALL**: Alle, sowohl LP’s wie auch STUDENTS sind betroffen. |                                                                                                |
| **Unterricht betroffen?**         | __YES__, __PARTIAL__ , __NO__                                                                                                    | **YES**: der Unterricht kann nicht in gewohnter Form stattfinden (die ganze Klasse ist bspw. abwesend)<br />**PARTIAL**: der Unterricht ist teilweise betroffen (bspw. einige Personen fehlen), kann aber normal stattfinden.<br />**NO**: der Unterricht ist nicht tangiert – bspw. Noteneingabe in Evento…                                                                                           |                                                                                                |

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
| E: **Zeit Beginn**                   | *[optional]* Zeit im Format __HH:MM__                                                                                            | Zeit des Terminstarts. <br /> Ganztägige Termine haben ein leeres Feld.                                                                                                                                                                                                                                                                                                                                | *12:00*                                                                                        |
| F: **Datum Ende**                    | Datum im Format __dd.mm.yyyy__                                                                                                   | Enddatum                                                                                                                                                                                                                                                                                                                                                                                               | *12.01.2024*                                                                                   |
| G: **Zeit Ende**                     | *[optional]* Zeit im Format __HH:MM__                                                                                            | Zeit des Terminendes. Ganztägige Termine haben ein leeres Feld. Ist das Feld leer und gleichzeitig die Startzeit gesetzt, wird die Endzeit auf die Startzeit festgelegt.                                                                                                                                                                                                                               | *12:15*                                                                                        |
| H: **Ort**                           | *[optional]* Text                                                                                                                | Ortsangaben                                                                                                                                                                                                                                                                                                                                                                                            | *F102*                                                                                         |
| I: **betroffene Lehrkräfte**         | Angaben über betroffene Lehrkräfte                                                              | Ausführliche Beschreibung des Termins.                                                                                                                                                                                                                                                                                                                                                                 | *Der Filmanlass GYM4, FMS3, WMS3 in Zusammenarbeit mit dem Filmpodium und der Filmgilde.*      |
| J: **GYM**                          | *[optional]* `GYM`                                                                                                            | Sind alle vom GYM GBSL betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                 |                                                                                                |
| K: **FMS**                          | *[optional]* `FMS`                                                                                                            | Sind alle vom GYM GBSL betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                 |                                                                                                |
| L: **WMS**                          | *[optional]* `WMS`                                                                                                            | Sind alle vom GYM GBSL betroffen? Ein leerer Wert bedeutet Nein ( `0`)                                                                                                                                                                                                                                                                                                                                 |                                                                                                |
| M: **Beschreibung**                  | Text, mehrzeilig(Zeilenumbruch kann mit `Alt+Enter` erzeugt werden)                                                              | Ausführliche Beschreibung des Termins.                                                                                                                                                                                                                                                                                                                                                                 | *Der Filmanlass GYM4, FMS3, WMS3 in Zusammenarbeit mit dem Filmpodium und der Filmgilde.*      |
| N: **Jahrgangsstufe**               | *[optional]* Abteilung + Ausbildungsjahr, mit Komma getrennt      | | `WMS2` oder `GYM1, GYM1 bilingue` |
| O: **Einzelne Klassen**             | *[optional]* Klassenbezeichnungen, mit Komma getrennt.      |                                                                                                                                                                                                                                                                                                                                                                                                        | `27Ga, 25h, 25i, 24K` |
| P: **Betrifft**<br />  0=KLP<br />  1=LP<br />  2=SuS<br />  3=Alle | *[optional]* `0`, `1`, `2`, `3` | **0: KLP**: nur Klassenlehrpersonen sind betroffen<br />**1: LP**: nur Lehrpersonen, die an den gegebenen Klassen unterrichten, sind betroffen.<br />**2: SuS**: nur die Schüler:innen sowie Lehrpersonen, deren Unterricht tangiert wird, sind betroffen. Zusätzliche werden diese Termine den KLP’s der betroffenen Klassen angezeigt.<br />**3: ALL**: Alle, sowohl LP’s wie auch STUDENTS sind betroffen. |                                                                                                |
| Q: **Unterricht Betroffen?**<br />  0=Nein<br />  1=Teilweise<br />  2=Ja       | *[optional]* `0`, `1`, `2` | **0: Nein**: der Unterricht ist nicht tangiert – bspw. Noteneingabe in Evento…<br />**1: Teilweise**: der Unterricht ist teilweise betroffen (bspw. einige Personen fehlen), kann aber normal stattfinden.<br />**2: Ja**: der Unterricht kann nicht in gewohnter Form stattfinden (die ganze Klasse ist bspw. abwesend)                                                                                      |                                                                                                |

</details>

### `GBJB` Format :mdi[file-delimited]{color=blue}

:::warning[Altes Format]
Dieses Format wurde bis Winter 2023 am GBJB verwendet und ist nicht mehr aktuell. Bitte verwenden Sie das `V1` Format.
:::
