---
sidebar_position: 1
---
import styles from './styles.module.scss';

# Calendrier

## Délais

Les rendez-vous scolaires concernent des __départements__ entiers, des __classes__, des __enseignants__ ou des __élèves__. En fonction des personnes pour lesquelles les rendez-vous ont été saisis, ils sont affichés dans l'agenda.


### Publikum

<table className={styles.audience}>
	<tbody>
		<tr>
			<td rowspan="2" className={styles.left}><b>Le rendez-vous ...</b></td>
			<td colspan="4">Le rendez-vous pour ... est-il affiché ?</td>
		</tr>
		<tr>
			<td colspan="2">Enseignant/e</td>
			<td rowspan="2">PC de <br />la classe <br />concernée</td>
			<td rowspan="2">Élève</td>
		</tr>
		<tr>
            <td className={styles.left}>...est pendant la leçon?\*</td>
			<td>Oui</td>
			<td>Non</td>
		</tr>
		<tr className={styles.line}>
			<td className={styles.left}>...pour __tous__</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td className={styles.left}>...pour les élèves __SuS__</td>
			<td>✅</td>
			<td>◻️</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td className={styles.left}>...pour les enseignants __LP__</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
			<td>◻️</td>
		</tr>
		<tr>
			<td className={styles.left}>...pour les maîtres de classe  __KLP__</td>
			<td>◻️</td>
			<td>◻️</td>
			<td>✅</td>
			<td>◻️</td>
		</tr>
	</tbody>
</table>

\* Si un rendez-vous a lieu pendant une leçon de l'horaire régulier (il peut aussi commencer ou se terminer pendant la leçon), il est affiché pour les enseignants.


### Département

