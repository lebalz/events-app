import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button, { POPUP_BUTTON_STYLE } from '../../shared/Button';
import { Icon, SIZE_S } from '../../shared/icons';
import { mdiContentDuplicate, mdiDotsHorizontalCircleOutline } from '@mdi/js';
import { translate } from '@docusaurus/Translate';
import Edit from '../../shared/Button/Edit';
import Event from '@site/src/models/Event';
import { useWindowSize } from '@docusaurus/theme-common';
import i18n from '@generated/i18n';
import { useHistory } from '@docusaurus/router';
import EventsGroupPopup from '../../EventGroup/EventsGroupPopup';
import DefaultEventActions from './DefaultEventActions';
import Popup from 'reactjs-popup';
import { PopupActions } from 'reactjs-popup/dist/types';
import clrStyles from '../../shared/Colors/styles.module.scss';
import { action } from 'mobx';
import { useGroupId } from '../helpers/useEventGroupId';
import EventGroup from '@site/src/models/EventGroup';

interface Props {
    trigger?: React.ReactNode;
    event: Event;
    hideEdit?: boolean;
}

interface ActionProps {
    event: Event;
    onClosePopup?: () => void;
    iconSize?: number;
}

export const EditRowMode = observer((props: ActionProps) => {
    const windowSize = useWindowSize();
    const viewStore = useStore('viewStore');
    const { event } = props;

    return (
        <Edit
            onClick={() => {
                event.setEditing(true);
                if (windowSize === 'mobile') {
                    viewStore.setEventModalId(event.id);
                }
                if (props.onClosePopup) {
                    props.onClosePopup();
                }
            }}
            size={props.iconSize || SIZE_S}
            newVersion={!event.isDraft}
        />
    );
});

export const Clone = observer((props: ActionProps) => {
    const eventStore = useStore('eventStore');
    const eventGroupStore = useStore('eventGroupStore');
    const windowSize = useWindowSize();
    const viewStore = useStore('viewStore');
    const history = useHistory();
    const groupId = useGroupId();
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
                        const id = newEvent.id;
                        if (groupId) {
                            const group = eventGroupStore.find<EventGroup>(groupId);
                            if (group) {
                                group.addEvents([newEvent]);
                            }
                        } else {
                            history.push(
                                `${i18n.currentLocale === i18n.defaultLocale ? '' : `/${i18n.currentLocale}`}/user?user-tab=events&events-tab=my-events`
                            );
                        }
                        const cloned = eventStore.find(id);
                        if (cloned) {
                            cloned.setEditing(true);
                            if (windowSize === 'mobile') {
                                setTimeout(() => {
                                    viewStore.setEventModalId(cloned.id);
                                }, 0);
                            }
                        }
                        props.onClosePopup?.();
                    }
                });
            }}
        />
    );
});
export const AddToGroup = observer((props: ActionProps) => {
    const { event, iconSize } = props;
    return <EventsGroupPopup event={event} iconSize={iconSize} />;
});

const OptionsPopup = observer((props: Props) => {
    const ref = React.useRef<PopupActions>(null);

    return (
        <Popup
            ref={ref}
            trigger={action((open) => (
                <button
                    className={clsx(
                        POPUP_BUTTON_STYLE,
                        open ? clrStyles.butonPrimary : clrStyles.buttonBlack,
                        styles.optionsButton
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <Icon path={mdiDotsHorizontalCircleOutline} size={SIZE_S} />
                </button>
            ))}
            position={['bottom right', 'top right']}
            on={'click'}
            nested
        >
            <DefaultEventActions
                event={props.event}
                hideEdit={props.hideEdit}
                closePopup={() => ref.current?.close()}
            />
        </Popup>
    );
});

export default OptionsPopup;
