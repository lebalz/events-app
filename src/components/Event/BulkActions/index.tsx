import React from 'react';
import clsx from 'clsx';
import {default as EventModel} from '@site/src/models/Event';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Badge from '../../shared/Badge';
import Delete from '../../shared/Button/Delete';
import { action } from 'mobx';
import { EventState } from '@site/src/api/event';
import Button from '../../shared/Button';
import { mdiBookCancel, mdiBookmarkCheck, mdiFileCertificate } from '@mdi/js';
import { Icon } from '../../shared/icons';

interface Props {
    events: EventModel[];
}

const BulkActions = observer((props: Props) => {
    const {events} = props;
    if (events.length < 1) {
        return null;
    }
    const state = events[0]?.state;
    const sameState = events.every(event => event.state === state);
    return (
        <div className={clsx(styles.bulk)}>
            <Badge text={`${events.length}`} color='blue' />
            {sameState && (
                <div className={clsx(styles.stateActions)}>
                    {state === EventState.Draft && (
                        <Button text='Request Review' icon={<Icon path={mdiBookmarkCheck} color='blue' />} className={clsx(styles.blue)} iconSide='left' onClick={() => {
                            events.forEach(event => event.requestState(EventState.Review));
                        }} />
                    )}
                    {state === EventState.Review && (
                        <>
                            <Button text='Publish' icon={<Icon path={mdiFileCertificate} color='green' />} iconSide='left' className={clsx(styles.success)} onClick={() => {
                                events.forEach(event => event.requestState(EventState.Published));
                            }} />
                            <Button text='Refuse' icon={<Icon path={mdiBookCancel} color='orange' />} iconSide='left' className={clsx(styles.revoke)} onClick={() => {
                                events.forEach(event => event.requestState(EventState.Refused));
                            }} />
                        </>
                    )}
                </div>
            )}
            <Delete onClick={action(() => {
                events.forEach(event => event.destroy());
            })} />
        </div>
    )
});

export default BulkActions;