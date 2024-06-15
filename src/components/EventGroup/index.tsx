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
import BulkActions from '../Event/BulkActions';
import Grid from '../Event/Views/Grid';
import LazyDetails from '../shared/Details';
import { ApiIcon, DiscardIcon, SIZE, SIZE_S, SaveIcon } from '../shared/icons';
import { ApiState } from '@site/src/stores/iStore';
import Translate, { translate } from '@docusaurus/Translate';
import { mdiAccount, mdiAccountGroup, mdiShareCircle } from '@mdi/js';
import { formatDateTime } from '@site/src/models/helpers/time';
import DefinitionList from '../shared/DefinitionList';
import _ from 'lodash';
import UserTable from './UserTable';
import ShiftDatesEditor from './ShiftDatesEditor';
import AddUserPopup from './UserTable/AddUserPopup';
import useBaseUrl from '@docusaurus/useBaseUrl';


interface Props {
    group: EventGroupModel
    standalone?: boolean

}
const BTN_SIZE = SIZE_S;

const UserEventGroup = observer((props: Props) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isShiftEditorOpen, setShiftEditorOpen] = React.useState(false);
    React.useEffect(() => {
        if ((isOpen || props.standalone) && !group.isFullyLoaded) {
            group.loadEvents();
        }
    }, [isOpen, props.group, props.group.isFullyLoaded, props.standalone]);
    const { group } = props;
    return (
        <div className={clsx(styles.group, 'card', (props.standalone || isOpen || group.isEditing) && styles.open)}>
            <div className={clsx(styles.header, 'card__header')}>
                <div className="avatar__intro">
                    {group.isEditing
                        ? (
                            <TextInput 
                                className={clsx(styles.textInput)} 
                                text={group.name}
                                placeholder={translate({id: 'group.name.placeholder', message: 'Name der Gruppe'})}
                                onChange={(text) => group.update({ name: text })}
                            />
                        ) : (
                            <div
                                className="avatar__name"
                            >
                                {group.name}
                            </div>
                        )
                    }
                    {
                        group.isEditing
                            ? (
                                <TextArea 
                                    text={group.description} 
                                    onChange={(text) => group.update({ description: text })}
                                    placeholder={translate({id: 'group.description.placeholder', message: 'Beschreibung der Gruppe'})}
                                />
                            ) : (
                                <small className="avatar__subtitle">
                                    {group.description || <wbr />}
                                </small>
                            )
                    }
                </div>
                <div className={clsx(styles.badges)}>
                    {
                        !props.standalone && (
                            <Button
                                icon={mdiShareCircle}
                                color='blue'
                                href={useBaseUrl(group.shareUrl)}
                                size={BTN_SIZE}
                                title={translate({
                                    message: 'Gruppenseite anzeigen',
                                    id: 'button.group.open.title'
                                })}
                            />
                        )
                    }
                    {
                        !group.isEditing && (
                            <Button
                                icon={group.userIds.size > 1 ? mdiAccountGroup : mdiAccount}
                                iconSide='left'
                                size={BTN_SIZE}
                                text={group.userIds.size > 1 ? `${group.userIds.size}` : undefined}
                                color={group.userIds.size > 1 ? 'primary' : 'gray'}
                                onClick={() => setIsOpen(!isOpen)}
                            />
                        )
                    }
                    <ModelActions 
                        model={group} 
                        disableDelete={group.eventCount > 0}
                        deleteTitle={
                            group.eventCount > 0 
                                ? translate({id: 'group.delete.title', message: 'Nur Gruppen ohne Termine können gelöscht werden'})
                                : undefined
                        }
                        rightNodes={
                            <>
                                {
                                    group.isEditing && (
                                        <Clone
                                            onClick={() => {
                                                group.clone();
                                            }}
                                            apiState={group.apiStateFor(`clone-${group.id}`)}
                                        />
                                    )
                                }
                            </>
                        }
                    />
                </div>
            </div>
            <div className={clsx(styles.body, 'card__body')}>
                {
                    (group.isEditing || isOpen || props.standalone) && (
                        <>
                            <DefinitionList>
                                <dt><Translate id="group.createdAt">Erstellt Am</Translate></dt>
                                <dd><Badge text={formatDateTime(group.createdAt)} color='gray' /></dd>
                                <dt><Translate id="group.updatedAt">Geändert Am</Translate></dt>
                                <dd><Badge text={formatDateTime(group.updatedAt)} color='gray' /></dd>
                                <dt><Translate id="group.clone.dt">Duplizieren</Translate></dt>
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
                                    <Translate id="group.users.description">Alle Mitglieder der Gruppe sind können Termine beliebig verändern.</Translate>
                                    <AddUserPopup group={props.group} />
                                    {
                                        group.userIds.size > 1 && (
                                            <UserTable group={group} />
                                        )
                                    }
                                </dd>
                                {
                                    group.eventCount > 0 && (
                                        <>
                                            <dt><Translate id="group.shiftDates.dt">Datum Verschieben</Translate></dt>
                                            <dd>
                                                <Translate id="group.shiftDates.description">Alle unveröffentlichten Termine um eine bestimmte Anzahl Tage verschieben</Translate>
                                                <Button
                                                    text={
                                                        isShiftEditorOpen ?
                                                            translate({id: 'group.shiftDates.closeShiftEditor', message: 'Editor schliessen'}) :
                                                            translate({id: 'group.shiftDates.openShiftEditor', message: 'Editor öffnen'})
                                                    }
                                                    onClick={() => setShiftEditorOpen(!isShiftEditorOpen)}
                                                />
                                            </dd>
                                        </>
                                    )
                                }
                                {group.events.some(e => e.isDirty) && (
                                    <>
                                        <dt>
                                            <Translate id="group.groupActions">Aktionen</Translate>
                                        </dt>
                                        <dd>
                                            <div className={clsx(styles.actions)}>
                                                <Button
                                                    text={translate({id: "group.actions.saveAll", message: "Alle Speichern"})}
                                                    onClick={() => group.saveAll()}
                                                    color='green'
                                                    icon={<SaveIcon size={SIZE_S} />}
                                                    iconSide='left'
                                                />
                                                <Button
                                                    text={translate({id: "group.actions.discardAll", message: "Alle Verwerfen"})}
                                                    onClick={() => group.discardAll()}
                                                    color='black'
                                                    icon={<DiscardIcon size={SIZE_S} />}
                                                    iconSide='left'
                                                />
                                            </div>
                                        </dd>
                                    </>
                                )}
                            </DefinitionList>
                            {
                                isShiftEditorOpen && (
                                    <ShiftDatesEditor group={group} close={() => setShiftEditorOpen(false)} />
                                )
                            }
                        </>
                    )
                }
            </div>
            <div className={clsx(styles.spacer)}></div>
            <LazyDetails
                className={clsx(styles.eventDetails, 'card__footer')}
                open={props.standalone}
                summary={
                    <summary className={clsx(styles.summary)}>
                        <div className={clsx(styles.summaryContent)}>
                            Events
                            <div className={clsx(styles.badges)}>
                                {group.apiState !== ApiState.IDLE && (<ApiIcon state={group.apiState} />)}
                                <Badge text={`${group.eventCount}`} color='primary' />
                            </div>
                        </div>
                    </summary>
                }
                onOpenChange={props.standalone ? undefined : (open) => {
                    setIsOpen(open);
                }}
            >
                <div className={clsx(styles.events, 'card__body')}>
                    <BulkActions events={group.events} className={clsx(styles.bulkActions)} />
                    <Grid 
                        events={group.events}
                        columns={[
                            'isValid',
                            'select',
                            ['state', {sortable: false, width: undefined}],
                            ['teachingAffected', {componentProps: {show: 'icon'}}],
                            'kw',
                            'day',
                            'description', 
                            'start',
                            'end',
                            ['userGroup', {sortable: false}],
                            'location',
                            'departmens',
                            'classes',
                            'descriptionLong',
                            ['actions', {fixed: {right: 0}}]
                        ]}
                    />
                </div>
            </LazyDetails>
        </div>
    )
});

export default UserEventGroup;