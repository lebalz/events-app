import React from 'react';
import clsx from 'clsx';

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
    mdiBookArrowLeftOutline,
    mdiBookCancel,
    mdiBookmarkCheck,
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
import ValidationChecker from './ValidationChecker';
import Popup from 'reactjs-popup';
import NewGroup from '../../EventGroup/NewGroup';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import EventTable from '@site/src/stores/ViewStores/EventTable';
import Filter from '../Filter';
import useIsMobileView from '@site/src/hookes/useIsMobileView';

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
    leftActions?: React.ReactNode | React.ReactNode[];
    middleActions?: React.ReactNode | React.ReactNode[];
    rightActions?: React.ReactNode | React.ReactNode[];
    className?: string;
    actionConfig?: Partial<ActionConfig>;
    eventTable: EventTable;
    noFilter?: boolean;
    hideRecallAction?: boolean;
}

const BulkActions = observer((props: Props) => {
    const { eventTable } = props;
    const userStore = useStore('userStore');
    const eventStore = useStore('eventStore');
    const eventGroupStore = useStore('eventGroupStore');
    const departmentStore = useStore('departmentStore');
    const { current } = userStore;
    const ref = React.useRef<PopupActions>(null);
    const history = useHistory();
    const reviewedEventsUrl = useBaseUrl('/user?user-tab=events&events-tab=reviewed');
    const draftEventsUrl = useBaseUrl('/user?user-tab=events&events-tab=my-events');
    const isMobileViewXS = useIsMobileView(870);
    const isMobileView = useIsMobileView(1142);
    if (eventTable.selectedEvents.length < 1) {
        return (
            <Stats
                eventTable={eventTable}
                leftActions={props.leftActions}
                middleActions={props.middleActions}
                rightActions={props.rightActions}
                className={clsx(props.className)}
                actionConfig={props.actionConfig}
                noFilter={props.noFilter}
            />
        );
    }
    const actionConfig: ActionConfig = { ...DEFAULT_CONFIG, ...(props.actionConfig || {}) };
    const sameState = eventTable.selectedStates.length === 1;
    const showUnsubscribe =
        actionConfig.unsubscribe && sameState && eventTable.selectedStates[0] === EventState.Published;
    const allUnsubscribed = showUnsubscribe && eventTable.selectedSubscriptionIgnored;
    return (
        <div className={clsx(styles.bulk, 'card', props.className)}>
            <Badge
                text={`${eventTable.selectedEvents.length}`}
                color="primary"
                icon={
                    <Button
                        onClick={action(() => {
                            eventTable.setSelectedEvents([...eventTable.selectedEventIds], false);
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
            {!props.noFilter && (
                <Filter
                    eventTable={eventTable}
                    hideMine
                    flexWidth
                    showCurrentAndFuture={false}
                    showSelectLocation="advanced"
                />
            )}
            {sameState && actionConfig.stateActions && (
                <div className={clsx(styles.stateActions)}>
                    <ValidationChecker events={eventTable.selectedEvents} />
                    {eventTable.selectedStates[0] === EventState.Draft && (
                        <Button
                            text={
                                isMobileViewXS
                                    ? undefined
                                    : translate({
                                          message: 'Überprüfung anfordern',
                                          id: 'event.bulk_actions.request_review',
                                          description: 'Request Review'
                                      })
                            }
                            title={
                                eventTable.selectedTransitionIssues.size > 0
                                    ? [...eventTable.selectedTransitionIssues]
                                          .map((issue) => `⚠️ ${InvalidTransitionMessages[issue]}`)
                                          .join('\n')
                                    : isMobileViewXS
                                      ? translate({
                                            message: 'Überprüfung anfordern',
                                            id: 'event.bulk_actions.request_review',
                                            description: 'Request Review'
                                        })
                                      : undefined
                            }
                            icon={mdiBookmarkCheck}
                            color="blue"
                            size={SIZE_S}
                            className={clsx(styles.blue)}
                            iconSide="left"
                            onClick={() => {
                                eventStore
                                    .requestState(
                                        eventTable.selectedEvents.map((e) => e.id),
                                        EventState.Review
                                    )
                                    .then(() => {
                                        history.push(reviewedEventsUrl);
                                    });
                            }}
                            disabled={!eventTable.selectedTransitionable}
                        />
                    )}
                    {eventTable.selectedStates[0] === EventState.Review && (
                        <>
                            {!props.hideRecallAction && (
                                <Button
                                    text={
                                        isMobileView
                                            ? undefined
                                            : translate({
                                                  message: 'Zurückziehen',
                                                  id: 'event.bulk_actions.editing',
                                                  description: 'Edit Event'
                                              })
                                    }
                                    title={translate({
                                        message: 'Termin zurückziehen zum bearbeiten.',
                                        id: 'event.bulk_actions.editing.title',
                                        description: 'Edit Event'
                                    })}
                                    disabled={eventTable.selectedEvents.some(
                                        (e) => e.authorId !== current?.id
                                    )}
                                    icon={<Icon path={mdiBookArrowLeftOutline} color="red" size={SIZE_S} />}
                                    className={clsx(styles.red)}
                                    iconSide="left"
                                    onClick={() => {
                                        const currentSelected = [...eventTable.selectedEvents];
                                        eventStore
                                            .updateBatched(currentSelected.map((e) => ({ id: e.id })))
                                            .then((newEvents) => {
                                                newEvents.forEach((e) => {
                                                    eventStore.find(e.id)?.setEditing(true);
                                                });
                                                history.push(draftEventsUrl);
                                                eventStore.destroyMany(currentSelected);
                                            });
                                    }}
                                />
                            )}
                            {userStore.current?.isAdmin && (
                                <>
                                    <Button
                                        text={
                                            isMobileView
                                                ? undefined
                                                : translate({
                                                      message: 'Veröffentlichen',
                                                      id: 'event.bulk_actions.publish',
                                                      description: 'Publish Event'
                                                  })
                                        }
                                        title={
                                            isMobileView
                                                ? translate({
                                                      message: 'Veröffentlichen',
                                                      id: 'event.bulk_actions.publish',
                                                      description: 'Publish Event'
                                                  })
                                                : undefined
                                        }
                                        size={SIZE_S}
                                        icon={mdiFileCertificate}
                                        color="green"
                                        iconSide="left"
                                        className={clsx(styles.success)}
                                        onClick={() => {
                                            eventStore.requestState(
                                                eventTable.selectedEvents.map((e) => e.id),
                                                EventState.Published
                                            );
                                        }}
                                    />
                                    <Button
                                        text={
                                            isMobileView
                                                ? undefined
                                                : translate({
                                                      message: 'Zurückweisen',
                                                      id: 'event.bulk_actions.refuse',
                                                      description: 'Refuse Event review'
                                                  })
                                        }
                                        title={
                                            isMobileView
                                                ? translate({
                                                      message: 'Zurückweisen',
                                                      id: 'event.bulk_actions.refuse',
                                                      description: 'Refuse Event review'
                                                  })
                                                : undefined
                                        }
                                        size={SIZE_S}
                                        icon={mdiBookCancel}
                                        color="orange"
                                        iconSide="left"
                                        className={clsx(styles.revoke)}
                                        onClick={() => {
                                            eventStore.requestState(
                                                eventTable.selectedEvents.map((e) => e.id),
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
                    text={
                        isMobileView
                            ? undefined
                            : translate({
                                  id: 'event.bulk_actions.share',
                                  message: 'Übersicht Öffnen'
                              })
                    }
                    title={
                        isMobileView
                            ? translate({
                                  id: 'event.bulk_actions.share',
                                  message: 'Übersicht Öffnen'
                              })
                            : undefined
                    }
                    icon={mdiShareAll}
                    size={SIZE_XS}
                    iconSide="left"
                    color="primary"
                    href={`/event?${eventTable.selectedEvents.map((e) => e.queryParam).join('&')}`}
                />
            )}
            {actionConfig.groups && (
                <>
                    <Popup
                        ref={ref}
                        trigger={
                            <span>
                                <Button
                                    text={
                                        isMobileView
                                            ? undefined
                                            : translate({
                                                  message: 'Neue Gruppe',
                                                  id: 'bulkActions.newGroup.text'
                                              })
                                    }
                                    title={
                                        isMobileView
                                            ? translate({
                                                  message: 'Neue Gruppe',
                                                  id: 'bulkActions.newGroup.text'
                                              })
                                            : undefined
                                    }
                                    icon={mdiTag}
                                    size={SIZE_XS}
                                    iconSide="left"
                                />
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
                                eventIds={eventTable.selectedEvents.map((e) => e.id)}
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
                                        group.addEvents(eventTable.selectedEvents);
                                    }
                                    break;
                                case 'remove-value':
                                    const rmGroup = eventGroupStore.find<EventGroup>(
                                        meta.removedValue?.value
                                    );
                                    if (rmGroup) {
                                        rmGroup.removeEvents(eventTable.selectedEvents);
                                    }
                                    break;
                                case 'clear':
                                    eventTable.selectedEvents.forEach((event) =>
                                        event.groups.forEach((g) => g.removeEvents([event]))
                                    );
                                    break;
                            }
                        }}
                        options={eventGroupStore.eventGroups.map((group) => ({
                            value: group.id,
                            label: group.name
                        }))}
                        value={eventTable.selectedEvents
                            .reduce(
                                (acc, event) => {
                                    const gIds = new Set(event.groups.map((g) => g.id));
                                    return acc.filter(({ id }) => gIds.has(id));
                                },
                                eventTable.selectedEvents[0]?.groups?.map((g) => ({
                                    id: g.id,
                                    name: g.name
                                })) || []
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
                            text={
                                isMobileView
                                    ? undefined
                                    : translate({
                                          message: 'Wieder abonnieren',
                                          id: 'event.bulk_actions.resubscribe'
                                      })
                            }
                            onClick={() => {
                                const { subscription } = current;
                                if (subscription) {
                                    subscription.unignoreEvents(eventTable.selectedEvents.map((e) => e.id));
                                    eventTable.setSelectedEvents([...eventTable.selectedEventIds], false);
                                }
                            }}
                            color={'green'}
                        />
                    ) : (
                        <Button
                            icon={mdiBellRemove}
                            text={
                                isMobileView
                                    ? undefined
                                    : translate({
                                          message: 'Deabonnieren',
                                          id: 'event.bulk_actions.unsubscribe'
                                      })
                            }
                            title={
                                isMobileView
                                    ? translate({
                                          message: 'Deabonnieren',
                                          id: 'event.bulk_actions.unsubscribe'
                                      })
                                    : undefined
                            }
                            onClick={() => {
                                const { subscription } = current;
                                if (subscription) {
                                    subscription.ignoreEvents(eventTable.selectedEvents.map((e) => e.id));
                                    eventTable.setSelectedEvents([...eventTable.selectedEventIds], false);
                                    props.eventTable.setShowSelect(false);
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
                        toExcel(eventTable.selectedEvents, departmentStore.departments).then((buffer) => {
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
                        { number: eventTable.selectedEvents.length }
                    )}
                />
            )}
            {eventTable.selectedDeletable && actionConfig.delete && (
                <Delete
                    onClick={action(() => {
                        eventStore.destroyMany(eventTable.selectedEvents);
                    })}
                />
            )}
        </div>
    );
});

export default BulkActions;
