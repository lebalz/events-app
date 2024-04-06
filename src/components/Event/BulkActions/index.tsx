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
import { mdiBookCancel, mdiBookmarkCheck, mdiBookmarkMinus, mdiClose, mdiCross, mdiFileCertificate, mdiTag } from '@mdi/js';
import { Icon, SIZE_XS } from '../../shared/icons';
import { translate } from '@docusaurus/Translate';
import Select from 'react-select';
import EventGroup from '@site/src/models/EventGroup';
import { options } from 'joi';
import Stats from './stats';

interface Props {
    events: EventModel[];
    defaultActions?: React.ReactNode | React.ReactNode[];
}

const BulkActions = observer((props: Props) => {
    const userStore = useStore('userStore');
    const eventStore = useStore('eventStore');
    const eventGroupStore = useStore('eventGroupStore');
    const { current } = userStore;
    const selected = props.events.slice().filter(e => e.selected);
    if (selected.length < 1) {
        return (<Stats events={props.events} actions={props.defaultActions} />);
    }
    const state = selected[0]?.state;
    const sameState = selected.every(event => event.state === state);
    const allValid = selected.every(event => event.isValid);
    const onlyMine = selected.every(event => event.authorId === current.id);
    return (
        <div className={clsx(styles.bulk, 'card')}>
            <Badge 
                text={`${selected.length}`} 
                color='blue'
                icon={
                    <Button
                        onClick={action(() => {
                            selected.forEach(s => s.setSelected(false));
                        })}
                        icon={mdiClose}
                        size={SIZE_XS}
                        title={translate({
                            message: 'Auswahl aufheben', 
                            id: 'event.bulk_actions.clear_selection'
                        })}
                    />
                }
            />
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
                                eventStore.requestState(selected.map(e => e.id), EventState.Review);
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
                                    eventStore.requestState(selected.map(e => e.id), EventState.Draft);
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
                                                eventStore.requestState(selected.map(e => e.id), EventState.Published);
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
                                                eventStore.requestState(selected.map(e => e.id), EventState.Refused);
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
                                const ids = selected.map(event => event.id);
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
                                            group.addEvents(selected);
                                        }
                                        break;
                                    case 'remove-value':
                                        const rmGroup = eventGroupStore.find<EventGroup>(meta.removedValue?.value);
                                        if (rmGroup) {
                                            rmGroup.removeEvents(selected);
                                        }
                                        break;
                                    case 'clear':
                                        selected.forEach(event => event.groups.forEach(g => g.removeEvents([event])));
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
                                selected.reduce((acc, event) => {
                                    const gIds = new Set(event.groups.map(g => g.id));
                                    return acc.filter(({id}) => gIds.has(id));
                                }, selected[0]?.groups?.map(g => ({id: g.id, name: g.name })) || []).
                                map(g => ({value: g.id, label: g.name}))
                            }
                        />
                    </>
                )
            }
            {
                onlyMine && (
                    <Delete onClick={action(() => {
                        selected.forEach(event => event.destroy());
                    })} />
                )
            }
        </div>
    )
});

export default BulkActions;