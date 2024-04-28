---
sidebar_position: 1
---
import styles from './styles.module.scss';

# Terminplan

## Termine

Schulische Termine betreffen ganze __Abteilungen__, __Klassen__, __Lehrpersonen__ oder die __Schülerschaft__. Abhängig davon, für wen die Terimine erfasst wurden, werden sie im Terminplan angezeigt.

### Publikum

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

\* Wenn ein Termin während einer Lektion im Regelstundenplan stattfindet (kann auch sein, dass er während der Lektion Beginnt oder Endet), wird er für Lehrpersonen angezeigt.

### Abteilungen

