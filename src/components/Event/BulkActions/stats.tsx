import React from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Badge from '../../shared/Badge';
import { Calendar, SIZE_S, SIZE_XS } from '../../shared/icons';
import { translate } from '@docusaurus/Translate';
import { mdiCalendarBlankMultiple, mdiDownloadCircleOutline } from '@mdi/js';
import Button from '../../shared/Button';
import { toExcel } from '@site/src/stores/helpers/EventsToExcelV1';
import { useStore } from '@site/src/stores/hooks';
import EventTable from '@site/src/stores/ViewStores/EventTable';
import Filter from '../Filter';
interface ActionConfig {
    downlaod: boolean;
}
const DEFAULT_CONFIG: ActionConfig = {
    downlaod: true
};
interface Props {
    eventTable: EventTable;
    leftActions?: React.ReactNode | React.ReactNode[];
    middleActions?: React.ReactNode | React.ReactNode[];
    rightActions?: React.ReactNode | React.ReactNode[];
    className?: string;
    actionConfig?: Partial<ActionConfig>;
    noFilter?: boolean;
}

const Stats = observer((props: Props) => {
    const departmentStore = useStore('departmentStore');
    const actionConfig: ActionConfig = { ...DEFAULT_CONFIG, ...(props.actionConfig || {}) };
    const { eventTable } = props;
    return (
        <div className={clsx(styles.bulk, 'card', props.className)}>
            {props.leftActions}
            <Badge
                text={`${eventTable.events.length}`}
                className={clsx(styles.badge)}
                icon={mdiCalendarBlankMultiple}
                size={SIZE_S}
                iconSide="left"
                color="primary"
                title={translate(
                    {
                        message: '{num} Termine',
                        id: 'event.bulk_actions.stats.total_events'
                    },
                    { num: eventTable.events.length }
                )}
            />

            <div className={clsx(styles.spacer)} />
            {!props.noFilter && (
                <Filter
                    eventTable={eventTable}
                    hideMine
                    flexWidth
                    showCurrentAndFuture={false}
                    showSelectLocation="advanced"
                />
            )}
            {props.middleActions}
            <div className={clsx(styles.spacer)} />
            {actionConfig.downlaod && (
                <Button
                    onClick={() => {
                        toExcel(eventTable.events, departmentStore.departments).then((buffer) => {
                            const blob = new Blob([buffer], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            document.body.appendChild(a);
                            a.href = url;
                            a.download = 'events.xlsx';
                            a.click();
                            document.body.removeChild(a);
                        });
                    }}
                    color="blue"
                    icon={mdiDownloadCircleOutline}
                    title={translate(
                        {
                            id: 'event.bulk_actions.download',
                            message: 'Download {number} Termine als Excel'
                        },
                        { number: eventTable.events.length }
                    )}
                />
            )}
            {props.rightActions}
        </div>
    );
});

export default Stats;
