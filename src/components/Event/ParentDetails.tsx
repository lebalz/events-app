import clsx from 'clsx';

import { translate } from '@docusaurus/Translate';
import { mdiRecordCircleOutline } from '@mdi/js';
import { default as EventModel } from '@site/src/models/Event';
import { observer } from 'mobx-react-lite';
import Badge from '../shared/Badge';
import LazyDetails from '../shared/Details';
import EventProps from './EventProps';
import styles from './styles.module.scss';

interface Props {
    event: EventModel;
    inModal?: boolean;
    className?: string;
    onOpenChange?: (isOpen: boolean) => void;
}

const ParentDetails = observer((props: Props) => {
    const { event } = props;
    if (!event.publishedParent) {
        return null;
    }
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
                props.onOpenChange?.(isOpen);
            }}
        >
            <EventProps event={event.publishedParent} inModal={props.inModal} showVersionHeader />
        </LazyDetails>
    );
});

export default ParentDetails;
