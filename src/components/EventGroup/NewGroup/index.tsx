import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import AddButton from '../../Event/AddButton';
import { translate } from '@docusaurus/Translate';
import UserEventGroup from '..';
import TextInput from '../../shared/TextInput';
import TextArea from '../../shared/TextArea';
import Button from '../../shared/Button';
import { mdiCloseCircle, mdiPlusCircleOutline, mdiTag } from '@mdi/js';
import Icon from '@mdi/react';

interface Props {
    onDone: () => void;
    eventIds: string[];
}

const NewGroup = observer((props: Props) => {
    const eventGroupStore = useStore('eventGroupStore');
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    return (
        <div className={clsx('card')}>
            <div className={clsx('card__header')}>
                <h4>
                    <Icon path={mdiTag} size={0.8} className={styles.groupIcon} />
                    Neue Gruppe
                </h4>
            </div>
            <div className={clsx('card__body')}>
                <TextInput
                    className={clsx(styles.textInput)}
                    text={title}
                    placeholder={translate({
                        id: 'group.name.placeholder',
                        message: 'Name der Gruppe'
                    })}
                    onChange={setTitle}
                />
                <TextArea
                    text={description}
                    onChange={setDescription}
                    placeholder={translate({
                        id: 'group.description.placeholder',
                        message: 'Beschreibung der Gruppe'
                    })}
                />
            </div>
            <div className={clsx('card__footer')}>
                <div className={clsx('button-group', 'button-group--block')}>
                    <Button
                        color="secondary"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            props.onDone();
                        }}
                        text={translate({
                            message: 'Abbrechen',
                            id: 'share.button.deleteGroup.confirm.no',
                            description: 'Text of the button confirm no'
                        })}
                        icon={mdiCloseCircle}
                        iconSide="left"
                        noWrap
                    />
                    <Button
                        color="green"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            eventGroupStore
                                .create({
                                    event_ids: props.eventIds,
                                    name: title,
                                    description: description
                                })
                                .then(() => {
                                    props.onDone();
                                });
                        }}
                        apiState={eventGroupStore.apiStateFor('create')}
                        text={translate({
                            message: 'Erstellen',
                            id: 'eventGroup.createGroup'
                        })}
                        icon={mdiPlusCircleOutline}
                        iconSide="left"
                        noWrap
                    />
                </div>
            </div>
        </div>
    );
});

export default NewGroup;
