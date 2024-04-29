
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
			<td rowspan="2" className={styles.left}><b>Der Termin...</b></td>
			<td colspan="4">Wird der Termin für ... Angezeigt?</td>
		</tr>
		<tr>
			<td colspan="2">Lehrperson</td>
			<td rowspan="2">KLP der <br />betroffenen <br />Klasse</td>
			<td rowspan="2">Schüler\:in</td>
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
