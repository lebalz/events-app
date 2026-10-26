import clsx from 'clsx';
import React from 'react';

import Translate, { translate } from '@docusaurus/Translate';
import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

import EventsViewer, { View } from '@site/src/components/EventsViewer';
import ChangeViewAction from '@site/src/components/EventsViewer/ChangeViewAction';
import Badge from '@site/src/components/shared/Badge';
import LazyDetails from '@site/src/components/shared/Details';
import SemesterSelector from '@site/src/components/shared/SemesterSelector';
import Subscription from '@site/src/models/Subscription';
import ClassSubscriptions from '../../ClassSubscriptions';
import DepartmentSubscriptions from '../../DepartmentSubscription';

interface Props {
    subscription: Subscription;
}

const Content = observer((props: Props) => {
    const { subscription } = props;
    const [viewType, setViewType] = React.useState<View>(View.Grid);
    return (
        <div>
            <div className={clsx(styles.ignoredEvents)}>
                <div className={clsx(styles.semesterSelector)}>
                    <SemesterSelector />
                </div>
                <EventsViewer
                    events={subscription.semestersIgnoredEvents}
                    type={viewType}
                    bulkActionConfig={{
                        className: styles.indent,
                        middleActions: [
                            <Badge
                                text={translate({ message: 'Ignorierte Termine', id: 'event.ignored' })}
                                key="badge-m1"
                                color="orange"
                            />
                        ],
                        rightActions: [
                            <ChangeViewAction viewType={viewType} setViewType={setViewType} key="action-r1" />
                        ],
                        actionConfig: {
                            delete: false,
                            downlaod: false,
                            groups: false,
                            share: false,
                            stateActions: false
                        }
                    }}
                />
            </div>
            <LazyDetails
                summary={
                    <summary>
                        <Translate id="subscription.content.advanced">Erweiterte Abo-Einstellungen</Translate>
                    </summary>
                }
                className={clsx(styles.advanced)}
            >
                <div className={clsx(styles.groupSubscriptions)}>
                    <ClassSubscriptions />
                    <DepartmentSubscriptions />
                </div>
            </LazyDetails>
        </div>
    );
});

export default Content;
