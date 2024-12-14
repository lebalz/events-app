import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import LazyDetails from '../shared/Details';
import Badge from '../shared/Badge';
import { mdiRecordCircleOutline } from '@mdi/js';
import { translate } from '@docusaurus/Translate';
import EventProps from './EventProps';
import { default as EventModel } from '@site/src/models/Event';

interface Props {
    event: EventModel;
    inModal?: boolean;
    className?: string;
    onOpenChange?: (isOpen: boolean) => void;
}

const ParentDetails = observer((props: Props) => {
    const { event } = props;
    return (
        <LazyDetails
            summary={
                <summary>
                    <Badge
                        icon={mdiRecordCircleOutline}
                        iconSide="left"
                        text={translate({
                            id: 'event.version.current.long',
                            message: 'Aktuelle Version'
                        })}
                        color="green"
                    />
                </summary>
            }
            className={clsx('alert--success', styles.parentEventDetails, props.className)}
            onOpenChange={(isOpen) => {
                if (isOpen) {
                    event.loadParent();
                }
                props.onOpenChange(isOpen);
            }}
        >
            <EventProps event={event.publishedParent} inModal={props.inModal} showVersionHeader />
        </LazyDetails>
    );
});

export default ParentDetails;
