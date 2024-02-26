import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Popup from '../../shared/Popup';
import Button from '../../shared/Button';
import { SIZE_S } from '../../shared/icons';
import { mdiContentDuplicate, mdiDotsHorizontalCircleOutline } from '@mdi/js';
import { translate } from '@docusaurus/Translate';
import Edit from '../../shared/Button/Edit';
import Event from '@site/src/models/Event';
import {useWindowSize} from '@docusaurus/theme-common';
import i18n from '@generated/i18n';
import { useHistory } from '@docusaurus/router';
import EventsGroupPopup from '../../EventGroup/EventsGroupPopup';


interface Props {
    trigger?: JSX.Element;
    // actions: JSX.Element[];
    event: Event;
}

interface ActionProps {
    event: Event;
    iconSize?: number;
    showText?: boolean;
}

export const EditRowMode = observer((props: ActionProps) => {
    const windowSize = useWindowSize();
    const viewStore = useStore('viewStore');
    const { event } = props;
    return (
        <Edit onClick={() => {
            event.setEditing(true);
            if (windowSize === 'mobile') {
                viewStore.setEventModalId(event.id)
            }
        }} />
    )
});

export const Clone = observer((props: ActionProps) => {
    const eventStore = useStore('eventStore');
    const history = useHistory();
    const { event } = props;
    return (
        <Button
            icon={mdiContentDuplicate}
            size={SIZE_S}
            title={translate({
                message: 'Duplizieren',
                id: 'event.options.clone',
                description: 'Button Title (hover) to clone an event'
            })}
            onClick={() => {
                eventStore.clone(event).then((newEvent) => {
                    if (newEvent) {
                        const id = (newEvent as { id: string }).id;
                        history.push(`${i18n.currentLocale === i18n.defaultLocale ? '' : `/${i18n.currentLocale}`}/user?user-tab=events`);
                        eventStore.find(id)?.setEditing(true);
                    }
                });

            }}
        />
    )
});
export const AddToGroup = observer((props: ActionProps) => {
    const { event } = props;
    return (
        <EventsGroupPopup event={event} />
    )
});

const OptionsPopup = observer((props: Props) => {
    return (
        <Popup
            trigger={
                props.trigger || (
                    <Button
                        size={SIZE_S}
                        icon={mdiDotsHorizontalCircleOutline}
                        title={translate({
                            message: 'Optionen Anzeigen',
                            id: 'event.options.title',
                            description: 'Button Title (hover) to show a popup with options for an event'
                        })}
                    />
                )
            }
            on="click"
            popupTitle={translate({
                message: 'Optionen',
                id: 'event.options.popup.header',
                description: 'Title of the popup with options for an event'
            })}
        >
            <div className={clsx(styles.options)}>
                <AddToGroup event={props.event} />
                <Clone event={props.event} />
                <EditRowMode event={props.event} />
            </div>
        </Popup>
    )
});

export default OptionsPopup;