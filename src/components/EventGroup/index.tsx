import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { default as EventGroupModel } from '@site/src/models/EventGroup';
import TextInput from '../shared/TextInput';
import TextArea from '../shared/TextArea';
import ModelActions from '../ModelActions';
import Clone from '../shared/Button/Clone';
import { ColumnConfig } from '../Event/Views/Grid';
import LazyDetails from '../shared/Details';
import { ApiIcon, DiscardIcon, SIZE_S, SaveIcon } from '../shared/icons';
import { ApiState } from '@site/src/stores/iStore';
import Translate, { translate } from '@docusaurus/Translate';
import { mdiAccount, mdiAccountGroup, mdiCalendarClock, mdiShareCircle } from '@mdi/js';
import { formatDateTime } from '@site/src/models/helpers/time';
import DefinitionList from '../shared/DefinitionList';
import _ from 'lodash';
import UserTable from './UserTable';
import ShiftDates from './BulkEditor/ShiftDates';
import AddUserPopup from './UserTable/AddUserPopup';
import useBaseUrl from '@docusaurus/useBaseUrl';
import EventsViewer, { View } from '../EventsViewer';
import ChangeViewAction from '../EventsViewer/ChangeViewAction';
import { useStore } from '@site/src/stores/hooks';
import DeleteGroup from './DeleteGroup';
import { DestroyEventAction } from '@site/src/api/event_group';
import Popup from 'reactjs-popup';
import DiffViewer from '../Event/DiffViewer';
import ShiftAudience from './BulkEditor/ShiftAudience';
import Selector from './Groups/Collection/Selector';
import { useEventTable } from '../EventsViewer/useEventTable';
import Loader from '../shared/Loader';
import { GroupIdProvider } from '../Event/helpers/useEventGroupId';

interface Props {
    group: EventGroupModel;
    standalone?: boolean;
    onChangeCollection?: (collection: string) => void;
}
const BTN_SIZE = SIZE_S;

const DEFAULT_COLUMN_CONFIG: ColumnConfig = [
    'isValid',
    'select',
    ['state', { sortable: true, width: undefined }],
    ['teachingAffected', { componentProps: { show: 'icon' } }],
    'kw',
    'day',
    'description',
    'start',
    'end',
    ['userGroup', { sortable: false }],
    'location',
    'departmens',
    'classes',
    'descriptionLong',
    ['actions', { fixed: { right: 0 } }]
] as const;

const UserEventGroup = observer((props: Props) => {
    const { group } = props;
    const store = useStore('sessionStore');
    const [isOpen, setIsOpen] = React.useState(false);
    const [isShiftDatesOpen, setShiftDatesOpen] = React.useState(false);
    const [isShiftAudienceOpen, setShiftAudienceOpen] = React.useState(false);
    const [viewType, setViewType] = React.useState<View>(View.Grid);
    const shareUrl = useBaseUrl(group.shareUrl);
    const eventTable = useEventTable(group.events, DEFAULT_COLUMN_CONFIG);

    React.useEffect(() => {
        if ((isOpen || props.standalone) && store.isLoggedIn) {
            group.loadEvents();
        }
    }, [isOpen, group, group.isFullyLoaded, props.standalone, store.isLoggedIn]);

    React.useEffect(() => {
        if (!group.isFullyLoaded || !eventTable) {
            return;
        }
        const toAdd: ('nr' | 'author')[] = [];
        if (group.isFullyLoaded && group.events.some((e) => e.nr > 0)) {
            toAdd.push('nr');
        }
        if (group.isFullyLoaded && group.events.some((e) => e.author.id !== group.events[0].author.id)) {
            toAdd.push('author');
        }
        if (toAdd.length > 0) {
            eventTable.setColumnConfig([...toAdd, ...DEFAULT_COLUMN_CONFIG]);
        }
    }, [eventTable, group.isFullyLoaded]);

    if (!eventTable) {
        return <Loader />;
    }
    const toShift =
        eventTable.selectedEvents.length > 0
            ? eventTable.selectedEvents.filter((e) => e.isDraft)
            : eventTable.events.filter((e) => e.isDraft);

    return (
        <div
            className={clsx(
                styles.group,
                'card',
                (props.standalone || isOpen || group.isEditing) && styles.open
            )}
        >
            <div className={clsx(styles.header, 'card__header')}>
                <div className="avatar__intro">
                    {group.isEditing ? (
                        <TextInput
                            className={clsx(styles.textInput)}
                            text={group.name}
                            placeholder={translate({
                                id: 'group.name.placeholder',
                                message: 'Name der Gruppe'
                            })}
                            onChange={(text) => group.update({ name: text })}
                        />
                    ) : (
                        <div className="avatar__name">{group.name}</div>
                    )}
                    {group.isEditing ? (
                        <TextArea
                            text={group.description}
                            onChange={(text) => group.update({ description: text })}
                            placeholder={translate({
                                id: 'group.description.placeholder',
                                message: 'Beschreibung der Gruppe'
                            })}
                        />
                    ) : (
                        <small className="avatar__subtitle">{group.description || <wbr />}</small>
                    )}
                </div>
                <div className={clsx(styles.badges)}>
                    {!props.standalone && (
                        <Button
                            icon={mdiShareCircle}
                            color="blue"
                            href={shareUrl}
                            size={BTN_SIZE}
                            title={translate({
                                message: 'Gruppenseite anzeigen',
                                id: 'button.group.open.title'
                            })}
                        />
                    )}
                    {!group.isEditing && (
                        <Button
                            icon={group.userIds.size > 1 ? mdiAccountGroup : mdiAccount}
                            iconSide="left"
                            size={BTN_SIZE}
                            text={group.userIds.size > 1 ? `${group.userIds.size}` : undefined}
                            color={group.userIds.size > 1 ? 'primary' : 'gray'}
                            onClick={() => setIsOpen(!isOpen)}
                        />
                    )}
                    <ModelActions
                        model={group}
                        hideDelete
                        rightNodes={
                            <>
                                {group.isEditing && (
                                    <>
                                        <DeleteGroup
                                            onDelete={(action: DestroyEventAction) => {
                                                group.destroy(action);
                                            }}
                                            hasDrafts={group.events.some((e) => e.isDraft)}
                                        />
                                        <Clone
                                            onClick={() => {
                                                group.clone();
                                            }}
                                            apiState={group.apiStateFor(`clone-${group.id}`)}
                                        />
                                    </>
                                )}
                            </>
                        }
                    />
                </div>
            </div>
            <div className={clsx(styles.body, 'card__body')}>
                {(group.isEditing || isOpen || props.standalone) && (
                    <>
                        <DefinitionList>
                            <dt>
                                <Translate id="group.collection">Sammlung</Translate>
                            </dt>
                            <dd>
                                {group.isEditing ? (
                                    <Selector
                                        group={group}
                                        onSelect={(name) => {
                                            group.setCollection(name);
                                            props.onChangeCollection?.(name);
                                        }}
                                    />
                                ) : (
                                    <>
                                        {group.collection ||
                                            translate({
                                                id: 'group.collection.default',
                                                message: 'Standard'
                                            })}
                                    </>
                                )}
                            </dd>
                            <dt>
                                <Translate id="group.createdAt">Erstellt Am</Translate>
                            </dt>
                            <dd>
                                <Badge text={formatDateTime(group.createdAt)} color="gray" />
                            </dd>
                            <dt>
                                <Translate id="group.updatedAt">Geändert Am</Translate>
                            </dt>
                            <dd>
                                <Badge text={formatDateTime(group.updatedAt)} color="gray" />
                            </dd>
                            <dt>
                                <Translate id="group.clone.dt">Duplizieren</Translate>
                            </dt>
                            <dd>
                                <Translate id="group.clone.description">Gruppe inkl. Termine </Translate>
                                <Clone
                                    onClick={() => group.clone()}
                                    apiState={group.apiStateFor(`clone-${group.id}`)}
                                />
                            </dd>
                            <dt>
                                <Translate id="group.users.dt">Mitglieder</Translate>
                            </dt>
                            <dd>
                                <Translate id="group.users.description">
                                    Alle Mitglieder der Gruppe sind können Termine beliebig verändern.
                                </Translate>
                                <AddUserPopup group={props.group} />
                                {group.userIds.size > 1 && <UserTable group={group} />}
                            </dd>
                            <dt>
                                <Translate id="group.shiftDates.dt">Datum verschieben</Translate>
                            </dt>
                            <dd>
                                <Button
                                    text={
                                        isShiftDatesOpen
                                            ? translate({
                                                  id: 'group.shiftDates.closeShiftEditor',
                                                  message: 'Editor schliessen'
                                              })
                                            : translate({
                                                  id: 'group.shiftDates.openShiftEditor',
                                                  message: 'Editor öffnen'
                                              })
                                    }
                                    icon={mdiCalendarClock}
                                    active={isShiftDatesOpen}
                                    size={SIZE_S}
                                    iconSide="left"
                                    onClick={() => {
                                        if (!isShiftDatesOpen && isShiftAudienceOpen) {
                                            setShiftAudienceOpen(false);
                                        }
                                        setShiftDatesOpen(!isShiftDatesOpen);
                                    }}
                                />
                            </dd>
                            <dt>
                                <Translate id="group.shiftAudience.dt">
                                    Jahrgänge und Klassen verschieben
                                </Translate>
                            </dt>
                            <dd>
                                <Button
                                    text={
                                        isShiftAudienceOpen
                                            ? translate({
                                                  id: 'group.shiftDates.closeShiftEditor',
                                                  message: 'Editor schliessen'
                                              })
                                            : translate({
                                                  id: 'group.shiftDates.openShiftEditor',
                                                  message: 'Editor öffnen'
                                              })
                                    }
                                    icon={mdiAccountGroup}
                                    active={isShiftAudienceOpen}
                                    iconSide="left"
                                    size={SIZE_S}
                                    onClick={() => {
                                        if (!isShiftAudienceOpen && isShiftDatesOpen) {
                                            setShiftDatesOpen(false);
                                        }
                                        setShiftAudienceOpen(!isShiftAudienceOpen);
                                    }}
                                />
                            </dd>
                            {group.relatedModels.length > 0 && (
                                <>
                                    <dt>
                                        <Translate id="group.showAllChanges.dt">
                                            Alle Änderungen Anzeigen
                                        </Translate>
                                    </dt>
                                    <dd>
                                        <Popup
                                            trigger={
                                                <span>
                                                    <Button text="Öffnen" />
                                                </span>
                                            }
                                            modal
                                            nested
                                            lockScroll
                                        >
                                            <div>
                                                <DiffViewer
                                                    compare={group.relatedModels}
                                                    labels={{
                                                        a: translate({
                                                            id: 'eventGroup.diff.cloned',
                                                            message: 'Original'
                                                        }),
                                                        b: translate({
                                                            id: 'eventGroup.diff.changed',
                                                            message: 'Neu'
                                                        })
                                                    }}
                                                />
                                            </div>
                                        </Popup>
                                    </dd>
                                </>
                            )}
                            {eventTable.events.some((e) => e.isDirty) && (
                                <>
                                    <dt>
                                        <Translate id="group.groupActions">Aktionen</Translate>
                                    </dt>
                                    <dd>
                                        <div className={clsx(styles.actions)}>
                                            <Button
                                                text={translate({
                                                    id: 'group.actions.saveAll',
                                                    message: 'Alle Speichern'
                                                })}
                                                onClick={() => group.saveAll()}
                                                color="green"
                                                icon={<SaveIcon size={SIZE_S} />}
                                                iconSide="left"
                                            />
                                            <Button
                                                text={translate({
                                                    id: 'group.actions.discardAll',
                                                    message: 'Alle Verwerfen'
                                                })}
                                                onClick={() => group.discardAll()}
                                                color="black"
                                                icon={<DiscardIcon size={SIZE_S} />}
                                                iconSide="left"
                                            />
                                        </div>
                                    </dd>
                                </>
                            )}
                        </DefinitionList>
                        {isShiftDatesOpen && (
                            <ShiftDates
                                events={toShift}
                                onClose={() => {
                                    setShiftDatesOpen(false);
                                }}
                            />
                        )}
                        {isShiftAudienceOpen && (
                            <ShiftAudience
                                events={toShift}
                                onClose={() => {
                                    setShiftAudienceOpen(false);
                                }}
                            />
                        )}
                    </>
                )}
            </div>
            <div className={clsx(styles.spacer)}></div>
            <GroupIdProvider groupId={group.id}>
                <LazyDetails
                    className={clsx(styles.eventDetails, 'card__footer')}
                    open={props.standalone}
                    summary={
                        <summary className={clsx(styles.summary)}>
                            <div className={clsx(styles.summaryContent)}>
                                {translate({
                                    message: 'Events',
                                    id: 'components.eventgroup.events',
                                    description: 'text to scroll down the list of events'
                                })}
                                <div className={clsx(styles.badges)}>
                                    {group.apiState !== ApiState.IDLE && <ApiIcon state={group.apiState} />}
                                    <Badge text={`${group.eventCount}`} color="primary" />
                                </div>
                            </div>
                        </summary>
                    }
                    onOpenChange={
                        props.standalone
                            ? undefined
                            : (open) => {
                                  setIsOpen(open);
                              }
                    }
                >
                    <div className={clsx(styles.events, 'card__body')}>
                        <EventsViewer
                            bulkActionConfig={{
                                className: styles.bulkActions,
                                rightActions: [
                                    <ChangeViewAction
                                        viewType={viewType}
                                        setViewType={setViewType}
                                        key="action-r1"
                                    />
                                ]
                            }}
                            eventTable={eventTable}
                            events={group.events}
                            type={viewType}
                        />
                    </div>
                </LazyDetails>
            </GroupIdProvider>
        </div>
    );
});

export default UserEventGroup;
