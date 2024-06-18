import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import EventBody from './EventBody';
interface Props {
    event: EventModel;
    inModal?: boolean;
    hideShowVersionsButton?: boolean;
    hideParent?: boolean;
    className?: string;
}

const Event = observer((props: Props) => {
    const { event } = props;
    return (
        <div className={clsx(styles.eventCard, 'card', props.className)}>
            {!props.inModal && (
                <div className={clsx(styles.header, 'card__header')}>
                    <h3>{event.description}</h3>
                </div>
            )}
            <div className={clsx('card__body')}>
                <EventBody {...props} />
            </div>
        </div>
    );
});

export default Event;
