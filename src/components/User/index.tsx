import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as UserModel } from '@site/src/models/User';
import DefinitionList from '../shared/DefinitionList';
import Badge from '../shared/Badge';
import {
    mdiAccountCircleOutline,
    mdiAccountGroup,
    mdiCalendarBlankMultiple,
    mdiEmail,
    mdiEmailAlert,
    mdiLink,
    mdiLogout,
    mdiOfficeBuilding,
    mdiSchool
} from '@mdi/js';
import UntisLinker from './UntisLinker';
import { ApiIcon, Calendar, SIZE_S } from '../shared/icons';
import Button from '../shared/Button';
import Lesson from '@site/src/models/Untis/Lesson';
import { translate } from '@docusaurus/Translate';
import _ from 'lodash';
import ICal from '../iCal';
import Checkbox from '../shared/Checkbox';
import { ApiState } from '@site/src/stores/iStore';
import { useStore } from '@site/src/stores/hooks';

interface Props {
    user: UserModel;
}

const User = observer((props: Props) => {
    const { user } = props;
    const current = user;
    const iconSide = 'right';
    const sessionStore = useStore('sessionStore');

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
                            message: 'Login',
                            id: 'components.user.index.login',
                            description: 'Button Login'
                        })}
                        icon={mdiAccountCircleOutline}
                        iconSide={iconSide}
                        color="gray"
                    />
                </dt>
                <dd>{user.email}</dd>
                <dt>
                    <Badge
                        text={translate({
                            message: 'Email Benachrichtigungen',
                            id: 'components.user.index.email.notifications',
                            description: 'Notification Preferences'
                        })}
                        icon={
                            user.apiStateFor(`save-${user.id}`) !== ApiState.IDLE ? (
                                <ApiIcon state={user.apiStateFor(`save-${user.id}`)} />
                            ) : (
                                mdiEmail
                            )
                        }
                        iconSide={iconSide}
                        color="gray"
                    />
                </dt>
                <dd>
                    <Checkbox
                        checked={user.notifyOnEventUpdate}
                        label={translate({
                            message: 'Benachrichtigungen für geänderte Termine erhalten',
                            id: 'components.user.index.email.notifications.notifyOnEventUpdate',
                            description: 'Label for the notification preference'
                        })}
                        onChange={(checked) => {
                            user.update({ notifyOnEventUpdate: checked });
                            setTimeout(() => user.save(), 0);
                        }}
                    />
                </dd>
                {user.isAdmin && (
                    <>
                        <dd>
                            <Checkbox
                                checked={user.notifyAdminOnReviewRequest}
                                label={translate({
                                    message: 'Benachrichtigungen für review Anfragen erhalten',
                                    id: 'components.user.index.email.notifications.notifyAdminOnReviewRequest',
                                    description: 'Label for the notification preference'
                                })}
                                onChange={(checked) => {
                                    user.update({ notifyAdminOnReviewRequest: checked });
                                    setTimeout(() => user.save(), 0);
                                }}
                            />
                        </dd>
                        <dd>
                            <Checkbox
                                checked={user.notifyAdminOnReviewDecision}
                                label={translate({
                                    message: 'Benachrichtigungen für beantwortete Anfragen erhalten',
                                    id: 'components.user.index.email.notifications.notifyAdminOnReviewDecision',
                                    description: 'Label for the notification preference'
                                })}
                                onChange={(checked) => {
                                    user.update({ notifyAdminOnReviewDecision: checked });
                                    setTimeout(() => user.save(), 0);
                                }}
                            />
                        </dd>
                    </>
                )}

                <dt>
                    <Badge
                        text={translate({
                            message: 'Untis Account',
                            id: 'components.user.index.untis.account.button',
                            description: 'Button Untis Account'
                        })}
                        icon={mdiLink}
                        iconSide={iconSide}
                        color="gray"
                    />
                </dt>
                <dd>
                    <UntisLinker user={current} />
                </dd>
                <dt>
                    <Badge
                        text={translate({
                            message: 'Account',
                            id: 'components.user.index.account',
                            description: 'Label for the account'
                        })}
                        icon={mdiAccountCircleOutline}
                        iconSide={iconSide}
                        color="gray"
                    />
                </dt>
                <dd>
                    <Button
                        onClick={() => sessionStore.logout()}
                        text={translate({
                            message: 'Logout',
                            id: 'components.user.index.logout',
                            description: 'Button label to logout'
                        })}
                        title={translate(
                            {
                                message: '{mail} abmelden',
                                id: 'user.logout.title'
                            },
                            {
                                mail: current.email
                            }
                        )}
                        color="red"
                        icon={mdiLogout}
                        iconSide="left"
                        size={SIZE_S}
                        noOutline
                        className={clsx(styles.logout)}
                    />
                </dd>
                <dt>
                    <Badge
                        text={translate({
                            message: 'Events',
                            id: 'components.user.index.events',
                            description: 'Button Events'
                        })}
                        icon={mdiCalendarBlankMultiple}
                        iconSide={iconSide}
                        color="gray"
                    />
                </dt>
                <dd>{user.events.length}</dd>
                {user.untisTeacher && (
                    <>
                        <dt>
                            <Badge
                                text={translate({
                                    message: 'Schulen',
                                    id: 'components.user.index.schools',
                                    description: 'Button Schools'
                                })}
                                icon={mdiOfficeBuilding}
                                iconSide={iconSide}
                                color="gray"
                            />
                        </dt>
                        <dd>{[...new Set(user.untisTeacher.departments.map((d) => d.name))].join(', ')}</dd>
                        <dt>
                            <Badge
                                text={translate({
                                    message: 'Klassen',
                                    id: 'components.user.index.classes',
                                    description: 'Button class'
                                })}
                                icon={mdiAccountGroup}
                                iconSide={iconSide}
                                color="gray"
                            />
                        </dt>
                        <dd>{classes}</dd>
                        <dt>
                            <Badge
                                text={translate({
                                    message: 'Fächer',
                                    id: 'components.user.index.subjects',
                                    description: 'Button subjects'
                                })}
                                icon={mdiSchool}
                                iconSide={iconSide}
                                color="gray"
                            />
                        </dt>
                        <dd>{[...new Set(user.untisTeacher.lessons.map((l) => l.subject))].join(', ')}</dd>
                    </>
                )}
                <dt>
                    <Badge
                        text={translate({
                            message: 'Kalender Abonnieren',
                            id: 'components.user.index.calendar',
                            description: 'Button Calendar'
                        })}
                        icon={<Calendar />}
                        iconSide={iconSide}
                        color="gray"
                    />
                </dt>
                <dd>
                    <ICal />
                </dd>
            </DefinitionList>
        </div>
    );
});

export default User;
