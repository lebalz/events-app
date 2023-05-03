import React from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Badge from '../../shared/Badge';
import Delete from '../../shared/Button/Delete';
import { action } from 'mobx';
import { EventState } from '@site/src/api/event';
import Button from '../../shared/Button';
import { mdiBookCancel, mdiBookmarkCheck, mdiBookmarkMinus, mdiFileCertificate } from '@mdi/js';
import { Icon } from '../../shared/icons';
import { Role } from '@site/src/api/user';

interface Props {
    events: EventModel[];
}

const BulkActions = observer((props: Props) => {
    const { events } = props;
    const userStore = useStore('userStore');
    const eventStore = useStore('eventStore');
    const { current } = userStore;
    if (events.length < 1) {
        return null;
    }
    const state = events[0]?.state;
    const sameState = events.every(event => event.state === state);
    const allValid = events.every(event => event.isValid);
    return (
        <div className={clsx(styles.bulk)}>
            <Badge text={`${events.length}`} color='blue' />
            {sameState && (
                <div className={clsx(styles.stateActions)}>
                    {state === EventState.Draft && allValid && (
                        <Button text='Request Review' icon={<Icon path={mdiBookmarkCheck} color='blue' />} className={clsx(styles.blue)} iconSide='left' onClick={() => {
                            eventStore.requestState(events.map(e => e.id), EventState.Review);
                        }} />
                    )}
                    {state === EventState.Review && (
                        <>
                            <Button text='Bearbeiten' icon={<Icon path={mdiBookmarkMinus} color='blue' />} className={clsx(styles.blue)} iconSide='left' onClick={() => {
                                eventStore.requestState(events.map(e => e.id), EventState.Draft);
                            }} />
                            {
                                userStore.current?.role === Role.ADMIN && (
                                    <>
                                        <Button text='Publish' icon={<Icon path={mdiFileCertificate} color='green' />} iconSide='left' className={clsx(styles.success)} onClick={() => {
                                            eventStore.requestState(events.map(e => e.id), EventState.Published);
                                        }} />
                                        <Button text='Refuse' icon={<Icon path={mdiBookCancel} color='orange' />} iconSide='left' className={clsx(styles.revoke)} onClick={() => {
                                            eventStore.requestState(events.map(e => e.id), EventState.Refused);
                                        }} />
                                    </>
                                )
                            }
                        </>
                    )}
                </div>
            )}
            {
                events.every(e => e.authorId === current.id) && (
                    <Delete onClick={action(() => {
                        events.forEach(event => event.destroy());
                    })} />
                )
            }
        </div>
    )
});

export default BulkActions;