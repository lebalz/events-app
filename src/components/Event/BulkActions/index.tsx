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
import { mdiBookCancel, mdiBookmarkCheck, mdiBookmarkMinus, mdiFileCertificate, mdiTag } from '@mdi/js';
import { Icon } from '../../shared/icons';
import Select from 'react-select';
import { translate } from '@docusaurus/Translate';

interface Props {
    events: EventModel[];
}

const BulkActions = observer((props: Props) => {
    const { events } = props;
    const userStore = useStore('userStore');
    const eventStore = useStore('eventStore');
    const userEventGroupStore = useStore('userEventGroupStore');
    const { current } = userStore;
    if (events.length < 1) {
        return null;
    }
    const state = events[0]?.state;
    const sameState = events.every(event => event.state === state);
    const allValid = events.every(event => event.isValid);
    const onlyMine = events.every(event => event.authorId === current.id);
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
                                userStore.current?.isAdmin && (
                                    <>
                                        <Button 
                                            text={translate({message: 'Veröffentlichen', id: 'event.bulk_actions.pubslish', description: 'Publish Event'})}
                                            icon={<Icon path={mdiFileCertificate} color='green' />}
                                            iconSide='left'
                                            className={clsx(styles.success)}
                                            onClick={() => {
                                                eventStore.requestState(events.map(e => e.id), EventState.Published);
                                            }}
                                        />
                                        <Button 
                                            text={translate({message: 'Zurückweisen', id: 'event.bulk_actions.refuse', description: 'Refuse Event review'})}
                                            icon={<Icon path={mdiBookCancel} color='orange' />}
                                            iconSide='left'
                                            className={clsx(styles.revoke)} 
                                            onClick={() => {
                                                eventStore.requestState(events.map(e => e.id), EventState.Refused);
                                            }}
                                        />
                                    </>
                                )
                            }
                        </>
                    )}
                </div>
            )}
            {
                onlyMine && (
                    <>
                        <Button
                            text='Neue Gruppe'
                            icon={mdiTag}
                            iconSide='left'
                            onClick={action(() => {
                                const ids = events.map(event => event.id);
                                userEventGroupStore.create(
                                    {event_ids: ids, name: 'Neue Gruppe'},
                                );
                            })} 
                        />
                        <Select
                            isMulti={false}
                            isSearchable={true}
                            isClearable={true}
                            onChange={(opt) => {
                                events.forEach(event => {
                                    event.update({userGroupId: opt?.value ?? null});
                                    event.save();
                                });
                            }}
                            options={
                                userEventGroupStore.userEventGroups.map(group => ({
                                    value: group.id,
                                    label: group.name,
                                }))
                            }
                            value={
                                events.every(e => e.userGroupId === events[0].userGroupId) 
                                ? {value: events[0]?.userGroupId, label: events[0]?.userGroup?.name } 
                                : undefined
                            }
                        />
                    </>
                )
            }
            {
                onlyMine && (
                    <Delete onClick={action(() => {
                        events.forEach(event => event.destroy());
                    })} />
                )
            }
        </div>
    )
});

export default BulkActions;