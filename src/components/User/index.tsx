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
import ICal from '../iCal';


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
                    <ICal />
                </dd>
            </DefinitionList>
        </div>
    )
});

export default User;