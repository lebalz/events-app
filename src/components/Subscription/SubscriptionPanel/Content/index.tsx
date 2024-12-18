import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Translate, { translate } from '@docusaurus/Translate';

import { EVENTS_API } from '@site/src/authConfig';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import _ from 'lodash';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { action } from 'mobx';
import Subscription from '@site/src/models/Subscription';
import SemesterSelector from '@site/src/components/shared/SemesterSelector';
import EventsViewer, { View } from '@site/src/components/EventsViewer';
import { ColumnConfig } from '@site/src/components/Event/Views/Grid';
import ChangeViewAction from '@site/src/components/EventsViewer/ChangeViewAction';
import ClassSubscriptions from '../../ClassSubscriptions';
import DepartmentSubscriptions from '../../DepartmentSubscription';
import Badge from '@site/src/components/shared/Badge';

interface Props {
    subscription: Subscription;
}

export const COLUMN_CONFIG: ColumnConfig = [
    'select',
    ['teachingAffected', { componentProps: { show: 'icon' } }],
    'kw',
    'day',
    'description',
    'start',
    'end',
    ['location', { sortable: true }],
    ['departmens', {}],
    ['classes', {}],
    'descriptionLong'
];

const Content = observer((props: Props) => {
    const { subscription } = props;
    const [viewType, setViewType] = React.useState<View>(View.Grid);
    return (
        <div>
            <div className={clsx(styles.ignoredEvents)}>
                <SemesterSelector />
                <EventsViewer
                    events={subscription.semestersIgnoredEvents}
                    gridConfig={{ columns: COLUMN_CONFIG }}
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
            <div className={clsx(styles.groupSubscriptions)}>
                <ClassSubscriptions />
                <DepartmentSubscriptions />
            </div>
        </div>
    );
});

export default Content;
