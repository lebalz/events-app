import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Translate, { translate } from '@docusaurus/Translate';
import Button, { ButtonIcon } from '../shared/Button';
import {
    mdiCalendar,
    mdiClipboard,
    mdiClipboardEdit,
    mdiClipboardFile,
    mdiClipboardText,
    mdiDownload,
    mdiDownloadOutline,
    mdiMicrosoftOutlook,
    mdiSync
} from '@mdi/js';
import { SIZE_S, SIZE_XS } from '../shared/icons';
import { ApiState } from '@site/src/stores/iStore';
import { EVENTS_API } from '@site/src/authConfig';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import _ from 'lodash';
import Link from '@docusaurus/Link';
import TextInput from '../shared/TextInput';
import Copy from '../shared/Button/Copy';

interface Props {}

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
                            <Translate id="ical.section.personal" description="personal ical sync address">
                                Persönlicher Kalender
                            </Translate>
                        </h4>
                        <Translate
                            id="ical.section.personal.description"
                            description="text which explains, which things are included in the personal calendar"
                        >
                            Dieser Kalender ist mit dem persönlichen Stundenplan abgeglichen und zeigt nur die
                            für Sie relevanten Termine an. Es werden administrative Termine (bspw. Konvente),
                            den Unterricht betreffende Lektionen (bspw. eine Klasse ist nicht anwesend) und
                            für KLP's die eigene Klasse betreffenden Termine angezeigt.
                        </Translate>
                    </div>
                    <div className={clsx('card__body')}>
                        {user.untisId ? (
                            <>
                                <div className={clsx(styles.icalButtons)}>
                                    <Button
                                        href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${user.icalUrl}&name=${translate(
                                            {
                                                message: 'GBSL',
                                                id: 'user.ical.outlook.calendar-name',
                                                description: 'Name of the calendar in Outlook'
                                            }
                                        )}`}
                                        target="_blank"
                                        text={translate({
                                            message: 'Outlook',
                                            id: 'user.ical.outlook-button.text',
                                            description: 'Button text for adding the calendar to Outlook'
                                        })}
                                        title={translate({
                                            message: 'Abonniere den Kalender in Outlook',
                                            id: 'user.ical.outlook-button.title',
                                            description: 'Button text for adding the calendar to Outlook'
                                        })}
                                        icon={mdiMicrosoftOutlook}
                                        color={'primary'}
                                        size={SIZE_S}
                                    />
                                </div>
                                <div className={clsx(styles.ical)}>
                                    <Copy
                                        value={`${EVENTS_API}/ical/${currentLocale}/${user.icalUrl}`}
                                        size={SIZE_XS}
                                        icon={mdiClipboardText}
                                        title={translate({
                                            message: 'Kopiere den Link zum persönlichen Kalender.',
                                            id: 'user.ical.personal-calendar.copy-button.title'
                                        })}
                                        className={clsx(styles.copyButton)}
                                    />
                                    {user.icalUrl && `${EVENTS_API}/ical/${currentLocale}/${user.icalUrl}`}
                                </div>
                            </>
                        ) : (
                            <div>
                                <Translate
                                    id="ical.user_without_untis.message"
                                    description="Message for a user, that is logged in, but is not linked to a untis account"
                                >
                                    Sie müssen sich zuerst mit Untis verbinden, um einen persönlichen Kalender
                                    zu erhalten.
                                </Translate>
                                <Link to={'/user?user-tab=account'}>
                                    <Translate
                                        id="ical.link.text.settings"
                                        description="Link text to navigate to the user settings"
                                    >
                                        Einstellungen
                                    </Translate>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className={clsx('card', styles.card)}>
                <div className={clsx('card__header')}>
                    <h4>
                        <Translate id="ical.section.classes" description="classes ical sync address">
                            Klassen Kalender
                        </Translate>
                    </h4>
                    <TextInput
                        text={viewStore.icalListClassFilter}
                        onChange={(text) => viewStore.setIcalListClassFilter(text)}
                        placeholder={translate({
                            message: 'Filtern nach Klasse',
                            id: 'user.ical.filter.class.placeholder',
                            description: 'Placeholder text for the filter input'
                        })}
                    />
                </div>
                <div className={clsx('card__body')}>
                    <div className={clsx(styles.icalWrapper)}>
                        {_.orderBy(viewStore.icalListClassesFiltered, ['name'], ['asc']).map((c) => (
                            <div className={clsx(styles.publicIcal)} key={c.name}>
                                <div className={clsx(styles.icalButton)}>
                                    <Button
                                        href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${c.name}.ics&name=${c.displayName}`}
                                        target="_blank"
                                        text={c.displayName}
                                        title={translate({
                                            message: 'Abonniere den Kalender in Outlook',
                                            id: 'user.ical.outlook-button.title',
                                            description: 'Button text for adding the calendar to Outlook'
                                        })}
                                        icon={mdiMicrosoftOutlook}
                                        size={SIZE_S}
                                        color={c.department?.color}
                                    />
                                    <Button
                                        href={`${EVENTS_API}/ical/${currentLocale}/${c.name}.ics`}
                                        icon={mdiDownloadOutline}
                                        text={c.displayName}
                                        color={c.department?.color}
                                        size={SIZE_S}
                                        iconSide="right"
                                    />
                                </div>
                                <div className={clsx(styles.ical)}>
                                    <Copy
                                        value={`${EVENTS_API}/ical/${currentLocale}/${c.name.replaceAll('/', '_')}.ics`}
                                        size={SIZE_XS}
                                        icon={mdiClipboardText}
                                        title={translate(
                                            {
                                                message: 'Kopiere den Link zum Kalender {name}.',
                                                id: 'user.ical.copy-button.title'
                                            },
                                            { name: c.name }
                                        )}
                                        className={clsx(styles.copyButton)}
                                    />
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
                        <Translate id="ical.section.departments" description="departments ical sync address">
                            Abteilungs-Kalender
                        </Translate>
                    </h4>
                    <TextInput
                        text={viewStore.icalListDepartmentsFilter}
                        onChange={(text) => viewStore.setIcalListDepartmentsFilter(text)}
                        placeholder={translate({
                            message: 'Filtern nach Schule',
                            id: 'user.ical.filter.department.placeholder',
                            description: 'Placeholder text for the filter input'
                        })}
                    />
                </div>
                <div className={clsx('card__body')}>
                    <div className={clsx(styles.icalWrapper)}>
                        {_.orderBy(viewStore.icalListDepartmentsFiltered, ['name'], ['asc']).map((d) => (
                            <div className={clsx(styles.publicIcal)} key={d.name}>
                                <div className={clsx(styles.icalButton, styles.department)}>
                                    <Button
                                        href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics&name=${d.name}`}
                                        target="_blank"
                                        text={d.name}
                                        color={d.color}
                                        title={translate({
                                            message: 'Abonniere den Kalender in Outlook',
                                            id: 'user.ical.outlook-button.title',
                                            description: 'Button text for adding the calendar to Outlook'
                                        })}
                                        icon={mdiMicrosoftOutlook}
                                        size={SIZE_S}
                                    />
                                    <Button
                                        href={`${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics`}
                                        icon={mdiDownloadOutline}
                                        text={d.name}
                                        color={d.color}
                                        size={SIZE_S}
                                        iconSide="right"
                                    />
                                </div>
                                <div className={clsx(styles.ical)}>
                                    <Copy
                                        value={`${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics`}
                                        size={SIZE_XS}
                                        icon={mdiClipboardText}
                                        title={translate(
                                            {
                                                message: 'Kopiere den Link zum Kalender {name}.',
                                                id: 'user.ical.copy-button.title'
                                            },
                                            { name: d.name }
                                        )}
                                        className={clsx(styles.copyButton)}
                                    />
                                    {`${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ICal;
