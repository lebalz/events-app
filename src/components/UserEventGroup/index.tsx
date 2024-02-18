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


interface Props {
    group: EventGroupModel
}

const UserEventGroup = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const { group } = props;

    return (
        <div className={clsx(styles.group, 'card')}>
            <div className={clsx(styles.header, 'card__header')}>
                <div className="avatar__intro">
                    {group.isEditing
                        ? <TextInput className={styles.textInput} text={group.name} onChange={(text) => group.update({ name: text })} />
                        : <div className="avatar__name">{group.name}</div>
                    }
                    {
                        group.isEditing
                            ? (<TextArea text={group.description} onChange={(text) => group.update({ description: text })} />)
                            : (<small className="avatar__subtitle">
                                {group.description}
                            </small>)
                    }
                </div>
                <ModelActions 
                    model={group} 
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
            <div className={clsx(styles.events, 'card__body')}>
                {
                    group.events.map(e => {
                        return (
                            <EventCard event={e} key={e.id} />
                        )
                    })
                }
            </div>
        </div>
    )
});

export default UserEventGroup;