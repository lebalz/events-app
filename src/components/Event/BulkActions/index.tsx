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
import {
    mdiBellPlus,
    mdiBellRemove,
    mdiBookCancel,
    mdiBookmarkCheck,
    mdiBookmarkMinus,
    mdiClose,
    mdiDownloadCircleOutline,
    mdiFileCertificate,
    mdiShareAll,
    mdiTag
} from '@mdi/js';
import { Icon, SIZE_S, SIZE_XS } from '../../shared/icons';
import { translate } from '@docusaurus/Translate';
import Select from 'react-select';
import EventGroup from '@site/src/models/EventGroup';
import Stats from './stats';
import { toExcel } from '@site/src/stores/helpers/EventsToExcelV1';
import { InvalidTransitionMessages } from '../EventFields/Actions/Transition';
import Loader from '../../shared/Loader';
import ValidationChecker from './ValidationChecker';
import Popup from 'reactjs-popup';
import NewGroup from '../../EventGroup/NewGroup';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface ActionConfig {
    stateActions: boolean;
    share: boolean;
    downlaod: boolean;
    groups: boolean;
    delete: boolean;
    unsubscribe: boolean;
}

const DEFAULT_CONFIG: ActionConfig = {
    delete: true,
    downlaod: true,
    groups: true,
    share: true,
    stateActions: true,
    unsubscribe: true
};
export interface Props {
    events: EventModel[];
    leftActions?: React.ReactNode | React.ReactNode[];
    middleActions?: React.ReactNode | React.ReactNode[];
    rightActions?: React.ReactNode | React.ReactNode[];
    className?: string;
    actionConfig?: Partial<ActionConfig>;
}

const BulkActions = observer((props: Props) => {
    const userStore = useStore('userStore');
    const eventStore = useStore('eventStore');
    const eventGroupStore = useStore('eventGroupStore');
    const departmentStore = useStore('departmentStore');
    const viewStore = useStore('viewStore');
    const { current } = userStore;
    const ref = React.useRef<PopupActions>(null);
    const history = useHistory();
    const reviewedEventsUrl = useBaseUrl('/user?user-tab=events&events-tab=reviewed');

    const selected = props.events?.filter((e) => e.selected) || [];
    if (selected.length < 1) {
        return (
            <Stats
                events={props.events}
                leftActions={props.leftActions}
                middleActions={props.middleActions}
                rightActions={props.rightActions}
                className={clsx(props.className)}
                actionConfig={props.actionConfig}
            />
        );
    }

    const state = selected[0]?.state;
    const sameState = selected.every((event) => event.state === state);
    const allTransitionable = selected.every((event) => event.transitionAllowed.allowed);
    const transitionIssues = new Set(
        selected.flatMap((event) => event.transitionAllowed.reason).filter((x) => !!x)
    );
    const onlyMine = selected.every((event) => event.authorId === current.id);
    const actionConfig: ActionConfig = { ...DEFAULT_CONFIG, ...(props.actionConfig || {}) };
    const showUnsubscribe = sameState && state === EventState.Published && actionConfig.unsubscribe;
    const allUnsubscribed = showUnsubscribe && selected.every((event) => event.isIgnored);
    return (
        <div className={clsx(styles.bulk, 'card', props.className)}>
            <Badge
                text={`${selected.length}`}
                color="primary"
                icon={
                    <Button
                        onClick={action(() => {
                            selected.forEach((s) => s.setSelected(false));
                        })}
                        icon={mdiClose}
                        size={SIZE_XS}
                        color="primary"
                        className={clsx(styles.close)}
                        noOutline
                        title={translate({
                            message: 'Auswahl aufheben',
                            id: 'event.bulk_actions.clear_selection'
                        })}
                    />
                }
            />
            {sameState && actionConfig.stateActions && (
                <div className={clsx(styles.stateActions)}>
                    <ValidationChecker events={selected} />
                    {state === EventState.Draft && (
                        <Button
                            text={translate({
                                message: 'Überprüfung anfordern',
                                id: 'event.bulk_actions.request_review',
                                description: 'Request Review'
                            })}
                            icon={<Icon path={mdiBookmarkCheck} color="blue" />}
                            className={clsx(styles.blue)}
                            iconSide="left"
                            onClick={() => {
                                eventStore
                                    .requestState(
                                        selected.map((e) => e.id),
                                        EventState.Review
                                    )
                                    .then(() => {
                                        history.push(reviewedEventsUrl);
                                    });
                            }}
                            title={
                                transitionIssues.size > 0
                                    ? [...transitionIssues]
                                          .map((issue) => `⚠️ ${InvalidTransitionMessages[issue]}`)
                                          .join('\n')
                                    : undefined
                            }
                            disabled={!allTransitionable}
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
                                icon={<Icon path={mdiBookmarkMinus} color="blue" />}
                                className={clsx(styles.blue)}
                                iconSide="left"
                                onClick={() => {
                                    eventStore.requestState(
                                        selected.map((e) => e.id),
                                        EventState.Draft
                                    );
                                }}
                            />
                            {userStore.current?.isAdmin && (
                                <>
                                    <Button
                                        text={translate({
                                            message: 'Veröffentlichen',
                                            id: 'event.bulk_actions.publish',
                                            description: 'Publish Event'
                                        })}
                                        icon={<Icon path={mdiFileCertificate} color="green" />}
                                        iconSide="left"
                                        className={clsx(styles.success)}
                                        onClick={() => {
                                            eventStore.requestState(
                                                selected.map((e) => e.id),
                                                EventState.Published
                                            );
                                        }}
                                    />
                                    <Button
                                        text={translate({
                                            message: 'Zurückweisen',
                                            id: 'event.bulk_actions.refuse',
                                            description: 'Refuse Event review'
                                        })}
                                        icon={<Icon path={mdiBookCancel} color="orange" />}
                                        iconSide="left"
                                        className={clsx(styles.revoke)}
                                        onClick={() => {
                                            eventStore.requestState(
                                                selected.map((e) => e.id),
                                                EventState.Refused
                                            );
                                        }}
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
            {actionConfig.share && (
                <Button
                    text={translate({
                        id: 'event.bulk_actions.share',
                        message: 'Übersicht Öffnen'
                    })}
                    icon={mdiShareAll}
                    size={SIZE_XS}
                    iconSide="left"
                    color="primary"
                    href={`/event?${selected.map((e) => e.queryParam).join('&')}`}
                />
            )}
            {actionConfig.groups && (
                <>
                    <Popup
                        ref={ref}
                        trigger={
                            <span>
                                <Button text="Neue Gruppe" icon={mdiTag} size={SIZE_XS} iconSide="left" />
                            </span>
                        }
                        modal
                        lockScroll
                        nested
                        overlayStyle={{ background: 'rgba(0, 0, 0, 0.2)' }}
                    >
                        <div>
                            <NewGroup
                                onDone={() => {
                                    ref.current?.close();
                                }}
                                eventIds={selected.map((e) => e.id)}
                            />
                        </div>
                    </Popup>
                    <Select
                        isMulti={true}
                        isSearchable={true}
                        isClearable={true}
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 'var(--ifm-z-index-overlay)' }),
                            container: (base) => ({ ...base, minWidth: '15em' })
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
                                    const rmGroup = eventGroupStore.find<EventGroup>(
                                        meta.removedValue?.value
                                    );
                                    if (rmGroup) {
                                        rmGroup.removeEvents(selected);
                                    }
                                    break;
                                case 'clear':
                                    selected.forEach((event) =>
                                        event.groups.forEach((g) => g.removeEvents([event]))
                                    );
                                    break;
                            }
                        }}
                        options={eventGroupStore.eventGroups.map((group) => ({
                            value: group.id,
                            label: group.name
                        }))}
                        value={selected
                            .reduce(
                                (acc, event) => {
                                    const gIds = new Set(event.groups.map((g) => g.id));
                                    return acc.filter(({ id }) => gIds.has(id));
                                },
                                selected[0]?.groups?.map((g) => ({ id: g.id, name: g.name })) || []
                            )
                            .map((g) => ({ value: g.id, label: g.name }))}
                    />
                </>
            )}
            {showUnsubscribe && (
                <>
                    {allUnsubscribed ? (
                        <Button
                            icon={mdiBellPlus}
                            text={translate({
                                message: 'Wieder abonnieren',
                                id: 'event.bulk_actions.resubscribe'
                            })}
                            onClick={() => {
                                const { subscription } = current;
                                if (subscription) {
                                    subscription.unignoreEvents(selected.map((e) => e.id));
                                    selected.forEach((s) => s.setSelected(false));
                                }
                            }}
                            color={'green'}
                        />
                    ) : (
                        <Button
                            icon={mdiBellRemove}
                            text={translate({
                                message: 'Deabonnieren',
                                id: 'event.bulk_actions.unsubscribe'
                            })}
                            onClick={() => {
                                const { subscription } = current;
                                if (subscription) {
                                    subscription.ignoreEvents(selected.map((e) => e.id));
                                    selected.forEach((s) => s.setSelected(false));
                                    viewStore.eventTable.setShowSelect(false);
                                }
                            }}
                            color="red"
                        />
                    )}
                </>
            )}
            {actionConfig.downlaod && (
                <Button
                    onClick={() => {
                        toExcel(selected, departmentStore.departments).then((buffer) => {
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
                    title={translate(
                        {
                            id: 'event.bulk_actions.download',
                            message: 'Download {number} Termine als Excel'
                        },
                        { number: selected.length }
                    )}
                />
            )}
            {onlyMine && actionConfig.delete && (
                <Delete
                    onClick={action(() => {
                        eventStore.destroyMany(selected);
                    })}
                />
            )}
        </div>
    );
});

export default BulkActions;
