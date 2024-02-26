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
import { translate } from '@docusaurus/Translate';
import Select from 'react-select';
import EventGroup from '@site/src/models/EventGroup';
import { options } from 'joi';

interface Props {
    events: EventModel[];
}

const BulkActions = observer((props: Props) => {
    const { events } = props;
    const userStore = useStore('userStore');
    const eventStore = useStore('eventStore');
    const eventGroupStore = useStore('eventGroupStore');
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
                        <Button
                            text={translate({
                                message: 'Überprüfung anfordern',
                                id: 'event.bulk_actions.request_review',
                                description: 'Request Review'
                            })}
                            icon={<Icon path={mdiBookmarkCheck}
                            color='blue' />}
                            className={clsx(styles.blue)}
                            iconSide='left'
                            onClick={() => {
                                eventStore.requestState(events.map(e => e.id), EventState.Review);
                            }}
                        />
                    )}
                    {state === EventState.Review && (
                        <>
                            <Button
                                text={translate({
                                    message: 'Bearbeiten',
                                    id: 'event.bulk_actions.editing',
                                    description: 'Edit Event'
                                })}
                                icon={<Icon path={mdiBookmarkMinus}
                                color='blue' />} className={clsx(styles.blue)}
                                iconSide='left' onClick={() => {
                                    eventStore.requestState(events.map(e => e.id), EventState.Draft);
                                }}
                            />
                            {
                                userStore.current?.isAdmin && (
                                    <>
                                        <Button 
                                            text={translate({
                                                message: 'Veröffentlichen',
                                                id: 'event.bulk_actions.publish',
                                                description: 'Publish Event'
                                            })}
                                            icon={<Icon path={mdiFileCertificate} color='green' />}
                                            iconSide='left'
                                            className={clsx(styles.success)}
                                            onClick={() => {
                                                eventStore.requestState(events.map(e => e.id), EventState.Published);
                                            }}
                                        />
                                        <Button 
                                            text={translate({
                                                message: 'Zurückweisen',
                                                id: 'event.bulk_actions.refuse',
                                                description: 'Refuse Event review'
                                            })}
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
                                eventGroupStore.create(
                                    {event_ids: ids, name: 'Neue Gruppe'},
                                );
                            })}
                        />
                        <Select
                            isMulti={true}
                            isSearchable={true}
                            isClearable={true}
                            menuPortalTarget={document.body}
                            styles={{ 
                                menuPortal: (base) => ({ ...base, zIndex: 'var(--ifm-z-index-overlay)' })
                            }}
                            onChange={(options, meta) => {
                                switch (meta.action) {
                                    case 'select-option':
                                        const group = eventGroupStore.find<EventGroup>(meta.option.value);
                                        if (group) {
                                            group.addEvents(events);
                                        }
                                        break;
                                    case 'remove-value':
                                        const rmGroup = eventGroupStore.find<EventGroup>(meta.removedValue?.value);
                                        if (rmGroup) {
                                            rmGroup.removeEvents(events);
                                        }
                                        break;
                                    case 'clear':
                                        events.forEach(event => event.groups.forEach(g => g.removeEvents([event])));
                                        break;
                                }
                            }}
                            options={
                                eventGroupStore.eventGroups.map(group => ({
                                    value: group.id,
                                    label: group.name,
                                }))
                            }
                            value={
                                events.reduce((acc, event) => {
                                    const gIds = new Set(event.groups.map(g => g.id));
                                    return acc.filter(({id}) => gIds.has(id));
                                }, events[0]?.groups?.map(g => ({id: g.id, name: g.name })) || []).
                                map(g => ({value: g.id, label: g.name}))
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