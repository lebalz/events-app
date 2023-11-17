import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Translate, { translate } from '@docusaurus/Translate';
import Button from '../shared/Button';
import { mdiCalendar, mdiMicrosoftOutlook, mdiSync } from '@mdi/js';
import { SIZE_S } from '../shared/icons';
import { ApiState } from '@site/src/stores/iStore';
import { EVENTS_API } from '@site/src/authConfig';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import _ from 'lodash';
import Link from '@docusaurus/Link';
import TextInput from '../shared/TextInput';


interface Props {
}

const ICal = observer((props: Props) => {
    const { i18n } = useDocusaurusContext();
    const viewStore = useStore('viewStore');
    const userStore = useStore('userStore');
    const untisStore = useStore('untisStore');
    const departmentStore = useStore('departmentStore');
    const { currentLocale } = i18n;
    const user = userStore.current;
    return (
        <div className={clsx(styles.icalSettings)}>
            {user && (
                <div className={clsx('card', styles.personal, styles.card)}>
                    <div className={clsx('card__header')}>
                        <h4>
                            <Translate id="ical.section.personal" description='personal ical sync address'>
                                Persönlicher Kalender
                            </Translate>
                        </h4>
                        <Translate id="ical.section.personal.description" description='text which explains, which things are included in the personal calendar'>
                            Der persönliche Kalender zeigt nur die für Sie relevanten Termine an. Administrative Termine (wie Konvente oder Noteneintragen), Termine die Lektionen mit Klassen betreffen und für KLP's auch alle Termine, die für die eigene Klasse relevant sind.
                        </Translate>
                    </div>
                    <div className={clsx('card__body')}>
                        {user.untisId ? (
                            <>
                                <div className={clsx(styles.icalButtons)}>
                                    <Button
                                        href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${user.icalUrl}&name=${translate({ message: 'GBSL', id: 'user.ical.outlook.calendar-name', description: 'Name of the calendar in Outlook' })}`}
                                        target='_blank'
                                        text={translate({ message: 'Outlook', id: 'user.ical.outlook-button.text', description: 'Button text for adding the calendar to Outlook' })}
                                        title={translate({ message: 'Abonniere den Kalender in Outlook', id: 'user.ical.outlook-button.title', description: 'Button text for adding the calendar to Outlook' })}
                                        icon={mdiMicrosoftOutlook}
                                        color={'primary'}
                                        size={SIZE_S}
                                    />
                                    <Button
                                        href={`webcals://${EVENTS_API.replace(/https?:\/\//, '')}/ical/${currentLocale}/${user.icalUrl}`}
                                        target='_blank'
                                        title={translate({ message: 'Öffnen in Kalender-Programm', id: 'user.ical.webcal-button.title', description: 'Button text for adding the calendar to Outlook' })}
                                        icon={mdiCalendar}                                        

                                        color={'primary'}
                                        size={SIZE_S}
                                    />
                                    <Button
                                        onClick={() => userStore.createIcs()}
                                        text={translate({ id: 'user.ical.sync-button.text', message: 'Sync', description: 'Button text for (re)syncing the calendar' })}
                                        title={translate({ id: 'user.ical.sync-button.title', message: 'Synchronisiere meinen Kalender', description: 'Button (hover) title for (re)syncing the calendar' })}
                                        icon={mdiSync}
                                        apiState={userStore.apiStateFor('createIcs')}
                                        size={SIZE_S}
                                        disabled={userStore.apiStateFor('createIcs') === ApiState.LOADING}
                                    />
                                </div>
                                <div className={clsx(styles.ical)}>
                                    {user.icalUrl && `${EVENTS_API}/ical/${currentLocale}/${user.icalUrl}`}
                                </div>
                            </>
                        ) : (
                            <div>
                                <Translate id="ical.user_without_untis.message" description='Message for a user, that is logged in, but is not linked to a untis account'>
                                    Sie müssen sich zuerst mit Untis verbinden, um einen persönlichen Kalender zu erhalten.
                                </Translate> <Link to={'/user?user-tab=account'} ><Translate id="ical.link.text.settings" description="Link text to navigate to the user settings">Einstellungen</Translate></Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className={clsx('card', styles.card)}>
                <div className={clsx('card__header')}>
                    <h4>
                        <Translate id="ical.section.departments" description='departments ical sync address'>
                            Abteilungs-Kalender
                        </Translate>
                    </h4>
                    <TextInput 
                        text={viewStore.icalListClassFilter} 
                        onChange={(text) => viewStore.setIcalListClassFilter(text)}
                        placeholder={translate({message: 'Filtern nach Klasse', id: 'user.ical.filter.class.placeholder', description: 'Placeholder text for the filter input'})}
                    />
                </div>
                <div className={clsx('card__body')}>
                    <div className={clsx(styles.icalWrapper)}>
                        {_.orderBy(viewStore.icalListClassesFiltered, ['name'], ['asc']).map(c => (
                            <div className={clsx(styles.publicIcal)} key={c.name}>
                                <div className={clsx(styles.icalButton)}>
                                    <Button
                                        href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${c.name}.ics&name=${c.displayName}`}
                                        target='_blank'
                                        text={c.displayName}
                                        title={translate({ message: 'Abonniere den Kalender in Outlook', id: 'user.ical.outlook-button.title', description: 'Button text for adding the calendar to Outlook' })}
                                        icon={mdiMicrosoftOutlook}
                                        size={SIZE_S}
                                        color={c.department?.color}
                                    />
                                    <Button
                                        href={`webcals://${EVENTS_API.replace(/https?:\/\//, '')}/ical/${currentLocale}/${c.name}.ics`}
                                        target='_blank'
                                        color={c.department?.color}
                                        title={translate({ message: 'Öffnen in Kalender-Programm', id: 'user.ical.webcal-button.title', description: 'Button text for adding the calendar to Outlook' })}
                                        icon={mdiCalendar}
                                        size={SIZE_S}
                                    />
                                </div>
                                <div className={clsx(styles.ical)}>
                                    {`${EVENTS_API}/ical/${currentLocale}/${c.name}.ics`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={clsx('card', styles.card)}>
                <div className={clsx('card__header')}>
                    <h4>
                        <Translate id="ical.section.classes" description='classes ical sync address'>
                            Klassen Kalender
                        </Translate>
                    </h4>
                    <TextInput 
                        text={viewStore.icalListDepartmentsFilter} 
                        onChange={(text) => viewStore.setIcalListDepartmentsFilter(text)}
                        placeholder={translate({message: 'Filtern nach Schule', id: 'user.ical.filter.department.placeholder', description: 'Placeholder text for the filter input'})}
                    />
                </div>
                <div className={clsx('card__body')}>
                    <div className={clsx(styles.icalWrapper)}>
                        {_.orderBy(viewStore.icalListDepartmentsFiltered, ['name'], ['asc']).map(d => (
                            <div className={clsx(styles.publicIcal)} key={d.name}>
                                <div className={clsx(styles.icalButton, styles.department)}>
                                    <Button
                                        href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics&name=${d.name}`}
                                        target='_blank'
                                        text={d.name}
                                        color={d.color}
                                        title={translate({ message: 'Abonniere den Kalender in Outlook', id: 'user.ical.outlook-button.title', description: 'Button text for adding the calendar to Outlook' })}
                                        icon={mdiMicrosoftOutlook}
                                        size={SIZE_S}
                                    />
                                    <Button
                                        href={`webcals://${EVENTS_API.replace(/https?:\/\//, '')}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics`}
                                        target='_blank'
                                        color={d.color}
                                        title={translate({ message: 'Öffnen in Kalender-Programm', id: 'user.ical.webcal-button.title', description: 'Button text for adding the calendar to Outlook' })}
                                        icon={mdiCalendar}
                                        size={SIZE_S}
                                    />
                                </div>
                                <div className={clsx(styles.ical)}>
                                    {`${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics`}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
});

export default ICal;