import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { default as EventGroupModel } from '@site/src/models/EventGroup';
import EventCard from '../Event/Card';
import TextInput from '../shared/TextInput';
import Edit from '../shared/Button/Edit';
import TextArea from '../shared/TextArea';
import Save from '../shared/Button/Save';
import ModelActions from '../ModelActions';
import Clone from '../shared/Button/Clone';
import BulkActions from '../Event/BulkActions';
import EventGrid from '../Event/EventGrid';
import LazyDetails from '../shared/Details';
import { ApiIcon, DeleteIcon, Error, Icon, Loading, SIZE_S } from '../shared/icons';
import { ApiState } from '@site/src/stores/iStore';
import Popup from '../shared/Popup';
import Translate, { translate } from '@docusaurus/Translate';
import { mdiAccount, mdiAccountGroup, mdiExclamationThick, mdiFlashTriangle } from '@mdi/js';
import { formatDateTime } from '@site/src/models/helpers/time';
import DefinitionList from '../shared/DefinitionList';


interface Props {
    group: EventGroupModel
}

const UserEventGroup = observer((props: Props) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { group } = props;

    return (
        <div className={clsx(styles.group, 'card', isOpen && styles.open)}>
            <div className={clsx(styles.header, 'card__header')}>
                <div className="avatar__intro">
                    {group.isEditing
                        ? (
                            <TextInput 
                                className={styles.textInput} 
                                text={group.name} 
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
                                />
                            ) : (
                                <small className="avatar__subtitle">
                                    {group.description || <wbr />}
                                </small>
                            )
                    }
                </div>
                <ModelActions 
                    model={group} 
                    hideDelete={group.eventCount > 0}
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
                <Badge
                    icon={group.userIds.size > 1 ? mdiAccountGroup : mdiAccount}
                    iconSide='left'
                    size={SIZE_S}
                    text={group.userIds.size > 1 ? `${group.userIds.size}` : undefined}
                    color={group.userIds.size > 1 ? 'blue' : 'gray'}
                />
            </div>
            <div className={clsx(styles.body, 'card__body')}>
                {
                    isOpen && (
                        <DefinitionList>
                            <dt><Translate id="group.createdAt">Erstellt Am</Translate></dt>
                            <dd><Badge text={formatDateTime(group.createdAt)} color='gray' /></dd>
                            <dt><Translate id="group.updatedAt">Geàndert Am</Translate></dt>
                            <dd><Badge text={formatDateTime(group.updatedAt)} color='gray' /></dd>
                        </DefinitionList>
                    )
                }
            </div>
            <div className={clsx(styles.spacer)}></div>
            <LazyDetails
                className={clsx(styles.eventDetails, 'card__footer')}
                summary={
                    <summary>
                        <div className={clsx(styles.summary)}>
                            Events
                            <div className={clsx(styles.badges)}>
                                {group.apiState !== ApiState.IDLE && (<ApiIcon state={group.apiState} />)}
                                <Badge text={`${group.eventCount}`} color='blue' />
                            </div>
                        </div>
                    </summary>
                }
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (open && !group.isFullyLoaded) {
                        group.loadEvents();
                    }
                }}
            >
                <div className={clsx(styles.events, 'card__body')}>
                    <BulkActions events={group.events.filter(e => e.selected)} />
                    <EventGrid 
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