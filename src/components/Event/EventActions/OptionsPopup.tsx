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
import DefaultEventActions from './DefaultEventActions';


interface Props {
    trigger?: JSX.Element;
    event: Event;
}

interface ActionProps {
    event: Event;
    iconSize?: number;
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
            size={props.iconSize || SIZE_S}
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
    const [isOpen, setOpen] = React.useState(false);
    return (
        <Popup
            trigger={
                props.trigger || (
                    <Button
                        size={SIZE_S}
                        icon={mdiDotsHorizontalCircleOutline}
                        color={isOpen ? 'blue' : 'black'}
                        title={translate({
                            message: 'Optionen Anzeigen',
                            id: 'event.options.title',
                            description: 'Button Title (hover) to show a popup with options for an event'
                        })}
                    />
                )
            }
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOpen={isOpen}
            on="click"
            popupTitle={translate({
                message: 'Optionen',
                id: 'event.options.popup.header',
                description: 'Title of the popup with options for an event'
            })}
        >
            <DefaultEventActions event={props.event} closePopup={() => setOpen(false)}/>
        </Popup>
    )
});

export default OptionsPopup;