import React from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Badge from '../../shared/Badge';
import { Calendar, SIZE_S } from '../../shared/icons';
import { translate } from '@docusaurus/Translate';


interface Props {
    events: EventModel[];
    actions?: React.ReactNode | React.ReactNode[];
}

const Stats = observer((props: Props) => {
    return (
        <div className={clsx(styles.bulk, 'card')}>
            <Badge
                text={`${props.events.length}`}
                className={clsx(styles.badge)}
                icon={<Calendar size={SIZE_S}/>}
                iconSide='left'
                color='blue'
                title={
                    translate({
                        message: 'Anzahl Termine', 
                        id: 'event.bulk_actions.stats.total_events'
                    })
                }
            />
            {props.actions}
        </div>
    )
});

export default Stats;