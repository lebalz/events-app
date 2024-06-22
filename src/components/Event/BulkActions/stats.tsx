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

interface Props {
    events: EventModel[];
    leftActions?: React.ReactNode | React.ReactNode[];
    middleActions?: React.ReactNode | React.ReactNode[];
    rightActions?: React.ReactNode | React.ReactNode[];
    className?: string;
}

const Stats = observer((props: Props) => {
    const departmentStore = useStore('departmentStore');
    return (
        <div className={clsx(styles.bulk, 'card', props.className)}>
            {props.leftActions}
            <Badge
                text={`${props.events.length}`}
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
                    { num: props.events.length }
                )}
            />
            <div className={clsx(styles.spacer)} />
            {props.middleActions}
            <div className={clsx(styles.spacer)} />
            <Button
                onClick={() => {
                    toExcel(props.events, departmentStore.departments).then((buffer) => {
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
                size={SIZE_S}
                title={translate({
                    id: 'event.bulk_actions.download',
                    message: 'Download {number} Termine als Excel',
                }, {number: props.events.length})}
            />
            {props.rightActions}
        </div>
    );
});

export default Stats;
