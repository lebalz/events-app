import React from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Badge from '../../shared/Badge';
import { Calendar, SIZE_S } from '../../shared/icons';
import { translate } from '@docusaurus/Translate';
import { mdiCalendarBlankMultiple } from '@mdi/js';


interface Props {
    events: EventModel[];
    preActions?: React.ReactNode | React.ReactNode[];
    postActions?: React.ReactNode | React.ReactNode[];
    className?: string;
}

const Stats = observer((props: Props) => {
    return (
        <div className={clsx(styles.bulk, 'card', props.className)}>
            {props.preActions}
            <Badge
                text={`${props.events.length}`}
                className={clsx(styles.badge)}
                icon={mdiCalendarBlankMultiple}
                size={SIZE_S}
                iconSide='left'
                color='blue'
                title={
                    translate({
                        message: '{num} Termine', 
                        id: 'event.bulk_actions.stats.total_events',
                    }, {num: props.events.length})
                }
            />
            {props.postActions}
        </div>
    )
});

export default Stats;