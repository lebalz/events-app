import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import { mdiText } from '@mdi/js';
import Button from '../shared/Button';
import { useStore } from '@site/src/stores/hooks';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from "@docusaurus/router";
import EventBody from './EventBody';
interface Props {
    event: EventModel;
    inModal?: boolean;
}

const Event = observer((props: Props) => {
    const { event } = props;
    const socketStore = useStore('socketStore');
    const commonClasses = clsx(event.isDeleted && styles.deleted);
    const commonProps = { event, styles, className: commonClasses };
    const commonEditProps = { ...commonProps, isEditable: true };



    return (
        <div className={clsx(styles.eventCard, 'card')}>
            {!props.inModal && (
                <div className={clsx(styles.header, 'card__header')}>
                    <h3>{event.description}</h3>
                </div>
            )}
            <div className={clsx('card__body')}>
                <EventBody {...props} />
            </div>
            <div className={clsx('card__footer', styles.footer)}>
                <Button
                    text={translate({ message: "Alle betroffenen Lektionen anzeigen", id: 'event.button.showAllLessons', description: 'for a single event: button to show all affected lessons' })}
                    icon={mdiText}
                    onClick={() => {
                        socketStore.checkUnpersistedEvent(event.props);
                    }}
                />
            </div>
        </div>
    )
});

export default Event;