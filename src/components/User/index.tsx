import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import {default as UserModel} from '@site/src/models/User';
import DefinitionList from '../shared/DefinitionList';
import Badge from '../shared/Badge';
import { mdiAccountCircleOutline, mdiAccountGroup, mdiCalendarBlankMultiple, mdiLink, mdiMicrosoftOutlook, mdiOfficeBuilding, mdiSchool, mdiSync } from '@mdi/js';
import UntisLinker from './UntisLinker';
import { Calendar, SIZE_S, SIZE_XS } from '../shared/icons';
import { EVENTS_API } from '@site/src/authConfig';
import Button from '../shared/Button';
import Klass from '@site/src/models/Untis/Klass';
import Lesson from '@site/src/models/Untis/Lesson';
import { ApiState } from '@site/src/stores/iStore';
import { translate } from '@docusaurus/Translate';


interface Props {
    user: UserModel;
}


const User = observer((props: Props) => {
    const { user } = props;
    const userStore = useStore('userStore');
    const current = user;
    const iconSide = 'right';

    const classes = React.useMemo(() => {
        const klGroups = Lesson.GroupedClassesByYear(user.untisTeacher?.lessons || [], 10);
        const kl = Object.values(klGroups).sort().join(', ');
        return kl;
    }, [props.user.untisTeacher?.lessons]);


    return (
        <div className={clsx(styles.container)}>
            <DefinitionList>
                <dt><Badge text={translate({
                        message : "Login",
                        id:'components.user.index.login' ,
                        description:'Button Login'})} icon={mdiAccountCircleOutline} iconSide={iconSide} color='gray' /></dt>
                <dd>{user.email}</dd>

                <dt><Badge text={translate({
                        message : "Untis Account",
                        id:'components.user.index.untis.account.button' ,
                        description:'Button Untis Account'})}
                        icon={mdiLink} iconSide={iconSide} color='gray' /></dt>
                <dd><UntisLinker user={current} /></dd>

                <dt><Badge text={translate({
                        message : "Calendar",
                        id:'components.user.index.calendar' ,
                        description:'Button Calendar'})} icon={<Calendar />} iconSide={iconSide} color='gray' /></dt>
                <dd>
                    <div>
                        <div className={clsx(styles.ical)}>
                            {user.icalUrl && `${EVENTS_API}/ical/${user.icalUrl}`}
                        </div>
                        <div className={clsx(styles.icalButtons)}>
                            <Button
                                onClick={() => userStore.createIcs()}
                                text={translate({ id: 'user.ical.sync-button.text', message: 'Sync', description: 'Button text for (re)syncing the calendar'})}
                                title={translate({ id: 'user.ical.sync-button.title', message: 'Synchronisiere meinen Kalender', description: 'Button (hover) title for (re)syncing the calendar'})}
                                icon={mdiSync}
                                apiState={userStore.apiStateFor('createIcs')}
                                size={SIZE_S}
                                disabled={userStore.apiStateFor('createIcs') === ApiState.LOADING}
                            />
                            <Button
                                href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${user.icalUrl}&name=GBSL`}
                                target='_blank'
                                text={translate({message: 'Outlook', id: 'user.ical.outlook-button.text', description: 'Button text for adding the calendar to Outlook'})}
                                title={translate({message: 'Abonniere den Kalender in Outlook', id: 'user.ical.outlook-button.title', description: 'Button text for adding the calendar to Outlook'})}
                                icon={mdiMicrosoftOutlook}
                                size={SIZE_S}
                            />
                        </div>
                    </div>
                </dd>

                <dt><Badge text={translate({
                        message : "Events",
                        id:'components.user.index.events' ,
                        description:'Button Events'})} icon={mdiCalendarBlankMultiple} iconSide={iconSide} color='gray' /></dt>
                <dd>{user.events.length}</dd>

                {
                    user.untisTeacher && (
                        <>
                            <dt><Badge text={translate({
                        message : "Schools",
                        id:'components.user.index.schools' ,
                        description:'Button Schools'})} icon={mdiOfficeBuilding} iconSide={iconSide} color='gray' /></dt>
                            <dd>{[...new Set(user.untisTeacher.departments.map(d => d.name))].join(', ')}</dd>
                            <dt><Badge text={translate({
                        message : "Class",
                        id:'components.user.index.classes' ,
                        description:'Button class'})} icon={mdiAccountGroup} iconSide={iconSide} color='gray' /></dt>
                            <dd>{classes}</dd>
                            <dt><Badge text={translate({
                        message : "Subjects",
                        id:'components.user.index.subjects' ,
                        description:'Button subjects'})} icon={mdiSchool} iconSide={iconSide} color='gray' /></dt>
                            <dd>{[...new Set(user.untisTeacher.lessons.map(l => l.subject))].join(', ')}</dd>
                        </>
                    )
                }

            </DefinitionList>
        </div>
    )
});

export default User;