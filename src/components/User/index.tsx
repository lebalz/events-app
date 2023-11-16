import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as UserModel } from '@site/src/models/User';
import DefinitionList from '../shared/DefinitionList';
import Badge from '../shared/Badge';
import { mdiAccountCircleOutline, mdiAccountGroup, mdiCalendarBlankMultiple, mdiLink, mdiMicrosoftOutlook, mdiOfficeBuilding, mdiSchool, mdiSync } from '@mdi/js';
import UntisLinker from './UntisLinker';
import { Calendar, SIZE_S } from '../shared/icons';
import { EVENTS_API } from '@site/src/authConfig';
import Button from '../shared/Button';
import Lesson from '@site/src/models/Untis/Lesson';
import { ApiState } from '@site/src/stores/iStore';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import _ from 'lodash';


interface Props {
    user: UserModel;
}


const User = observer((props: Props) => {
    const { i18n } = useDocusaurusContext();
    const { user } = props;
    const userStore = useStore('userStore');
    const untisStore = useStore('untisStore');
    const departmentStore = useStore('departmentStore');
    const current = user;
    const iconSide = 'right';
    const { currentLocale } = i18n;

    const classes = React.useMemo(() => {
        const klGroups = Lesson.GroupedClassesByYear(user.untisTeacher?.lessons || [], 10);
        const kl = Object.values(klGroups).sort().join(', ');
        return kl;
    }, [props.user.untisTeacher?.lessons]);


    return (
        <div className={clsx(styles.container)}>
            <DefinitionList>
                <dt>
                    <Badge
                        text={translate({
                            message: "Login",
                            id: 'components.user.index.login',
                            description: 'Button Login'
                        })}
                        icon={mdiAccountCircleOutline}
                        iconSide={iconSide}
                        color='gray'
                    />
                </dt>
                <dd>{user.email}</dd>

                <dt>
                    <Badge
                        text={translate({
                            message: "Untis Account",
                            id: 'components.user.index.untis.account.button',
                            description: 'Button Untis Account'
                        })}
                        icon={mdiLink}
                        iconSide={iconSide}
                        color='gray'
                    />
                </dt>
                <dd><UntisLinker user={current} /></dd>
                <dt>
                    <Badge
                        text={translate({
                            message: "Events",
                            id: 'components.user.index.events',
                            description: 'Button Events'
                        })}
                        icon={mdiCalendarBlankMultiple}
                        iconSide={iconSide}
                        color='gray'
                    />
                </dt>
                <dd>{user.events.length}</dd>

                {
                    user.untisTeacher && (
                        <>
                            <dt>
                                <Badge
                                    text={translate({
                                        message: "Schulen",
                                        id: 'components.user.index.schools',
                                        description: 'Button Schools'
                                    })}
                                    icon={mdiOfficeBuilding}
                                    iconSide={iconSide}
                                    color='gray'
                                />
                            </dt>
                            <dd>{[...new Set(user.untisTeacher.departments.map(d => d.name))].join(', ')}</dd>
                            <dt>
                                <Badge
                                    text={translate({
                                        message: "Klassen",
                                        id: 'components.user.index.classes',
                                        description: 'Button class'
                                    })}
                                    icon={mdiAccountGroup}
                                    iconSide={iconSide}
                                    color='gray'
                                />
                            </dt>
                            <dd>{classes}</dd>
                            <dt>
                                <Badge
                                    text={translate({
                                        message: "Fächer",
                                        id: 'components.user.index.subjects',
                                        description: 'Button subjects'
                                    })}
                                    icon={mdiSchool}
                                    iconSide={iconSide}
                                    color='gray'
                                />
                            </dt>
                            <dd>{[...new Set(user.untisTeacher.lessons.map(l => l.subject))].join(', ')}</dd>
                        </>
                    )
                }
                <dt>
                    <Badge
                        text={translate({
                            message: "Kalender Abonnieren",
                            id: 'components.user.index.calendar',
                            description: 'Button Calendar'
                        })}
                        icon={<Calendar />}
                        iconSide={iconSide}
                        color='gray'
                    />
                </dt>
                <dd>
                    <div className={clsx(styles.icalSettings)}>
                        <div className={clsx('card', styles.personal, styles.card)}>
                            <div className={clsx('card__header')}>
                                <h5>
                                    <Translate id="ical.section.personal" description='personal ical sync address'>
                                        Persönlicher Kalender
                                    </Translate>
                                </h5>
                            </div>
                            <div className={clsx('card__body')}>
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
                            </div>
                        </div>
                        <div className={clsx('card', styles.card)}>
                            <div className={clsx('card__header')}>
                                <h5>
                                    <Translate id="ical.section.departments" description='departments ical sync address'>
                                        Abteilungs-Kalender
                                    </Translate>
                                </h5>
                            </div>
                            <div className={clsx('card__body', styles.icalWrapper)}>
                                {_.orderBy(untisStore.classes, ['name'], ['asc']).map(c => (
                                    <div className={clsx(styles.publicIcal)} key={c.name}>
                                        <div className={clsx(styles.icalButton)}>
                                            <Button
                                                href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${c.name}.ics&name=${c.name}`}
                                                target='_blank'
                                                text={c.displayName}
                                                title={translate({ message: 'Abonniere den Kalender in Outlook', id: 'user.ical.outlook-button.title', description: 'Button text for adding the calendar to Outlook' })}
                                                icon={mdiMicrosoftOutlook}
                                                size={SIZE_S}
                                                color={c.department.color}
                                            />
                                        </div>
                                        <div className={clsx(styles.ical)}>
                                            {user.icalUrl && `${EVENTS_API}/ical/${currentLocale}/${c.name}.ics`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={clsx('card', styles.card)}>
                            <div className={clsx('card__header')}>
                                <h5>
                                    <Translate id="ical.section.classes" description='classes ical sync address'>
                                        Klassen Kalender
                                    </Translate>
                                </h5>
                            </div>
                            <div className={clsx('card__body', styles.icalWrapper)}>
                                {_.orderBy(departmentStore.departments, ['name'], ['asc']).map(d => (
                                    <div className={clsx(styles.publicIcal)} key={d.name}>
                                        <div className={clsx(styles.icalButton)}>
                                            <Button
                                                href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics&name=${d.name}`}
                                                target='_blank'
                                                text={d.name}
                                                color={d.color}
                                                title={translate({ message: 'Abonniere den Kalender in Outlook', id: 'user.ical.outlook-button.title', description: 'Button text for adding the calendar to Outlook' })}
                                                icon={mdiMicrosoftOutlook}
                                                size={SIZE_S}
                                            />
                                        </div>
                                        <div className={clsx(styles.ical)}>
                                            {user.icalUrl && `${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </dd>
            </DefinitionList>
        </div>
    )
});

export default User;