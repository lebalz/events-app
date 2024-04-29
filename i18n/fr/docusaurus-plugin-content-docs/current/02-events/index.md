
import styles from './styles.module.scss';
import Badge from '@site/src/components/shared/Badge';
import { EventState, EventStateButton, EventStateColor, EventStateTranslation } from '@site/src/api/event';

# Evénements

Un rendez-vous est un événement qui a lieu à un moment précis et possède les attributs suivants:

Titre
: Brève description du rendez-vous, généralement moins de 80 caractères.
Description
: description détaillée du rendez-vous. Peut également contenir plusieurs paragraphes.
Début
: Date et heure de début du rendez-vous.
Fin
: Date et heure de fin du rendez-vous. Le rendez-vous peut également durer toute une journée.
Lieu
: lieu où se déroule le rendez-vous.
Participant·e·s
: Indique à qui le rendez-vous est destiné et s'il affecte l'enseignement. [👉 Plus de détails](#participantes)
Statut
: Indique si le rendez-vous a été publié ou non.
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
                /> *Un rendez-vous qui a été soumis pour examen. Visible uniquement par l'auteur et les administrateurs.*
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
                /> *Un rendez-vous qui a été refusé. N'est visible que par l'auteur et les administrateurs.*


## Participant·e·s {#participantes}

Les dates peuvent être destinées à différents groupes cibles.

### Concerne {#concerne}
Les rendez-vous scolaires concernent des __enseignants__ entiers, des __enseignants de classe__, les __élèves__ ou __tous__. En fonction de la personne pour laquelle les rendez-vous ont été saisis et si l'enseignement à l'horaire est concerné, ils seront affichés dans l'agenda.

Le tableau suivant donne un aperçu du moment où un rendez-vous est affiché pour les différents groupes cibles.

<table className={styles.audience}>
	<tbody>
		<tr>
			<td rowspan="2" className={styles.left}><b>L'événement...</b></td>
			<td colspan="4">Est-ce que le rendez-vous pour ... est affiché ?</td>
		</tr>
		<tr>
			<td colspan="2">Enseignant(e)</td>
			<td rowspan="2">MC de la<br />classe <br />concernée</td>
			<td rowspan="2">Élèves</td>
		</tr>
		<tr>
            <td className={styles.left}>...c'est pendant la leçon?\*</td>
			<td>Oui</td>
			<td>Non</td>
		</tr>
		<tr className={styles.line}>
			<td className={styles.left}>...pour __Tout__</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td className={styles.left}>...pour les Élèves __EL__</td>
			<td>✅</td>
			<td>◻️</td>
			<td>✅</td>
			<td>✅</td>
		</tr>
		<tr>
			<td className={styles.left}>...pour Enseignant·e·s __M__</td>
			<td>✅</td>
			<td>✅</td>
			<td>✅</td>
			<td>◻️</td>
		</tr>
		<tr>
			<td className={styles.left}>...pour  les Maître·sse·s de classe __MC__</td>
			<td>◻️</td>
			<td>◻️</td>
			<td>✅</td>
			<td>◻️</td>
		</tr>
	</tbody>
</table>

\* Si un rendez-vous a lieu pendant une leçon de l'horaire normal (même s'il commence ou se termine pendant la leçon), il est affiché pour les enseignants concernés.

### Enseignement concerné ?
Le champ __Enseignement concerné?__ permet d'indiquer si, pendant le rendez-vous, le cours est totalement annulé, partiellement concerné ou a lieu.

Cours concernés ?
: :mdi[circle]{color=green size=12px} Oui
: :mdi[circle]{color=yellow size=12px} Partiellement
: :mdi[circle]{color=red size=12px} Non

:::warning[Visibilité]
Mais dans tous les cas, le rendez-vous sera **affiché dans le calendrier** s'il est visible pour le groupe cible selon le [👉 tableau ci-dessus](#concerne).
:::
### Départements
Les rendez-vous peuvent être fixés pour des départements entiers. Dans ce cas, le rendez-vous est affiché pour tous les enseignants et/ou élèves du département concerné, en respectant le champ __Concerné__.

### Classes
Les rendez-vous peuvent être fixés pour des classes individuelles. Dans ce cas, le rendez-vous est affiché pour tous les enseignants et/ou élèves de la classe concernée, en respectant le champ __Concerné__.


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
