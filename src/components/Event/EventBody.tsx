import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import DefinitionList from '../shared/DefinitionList';
import Badge from '../shared/Badge';
import { mdiArrowRightBoldCircleOutline, mdiArrowRightBottom, mdiContentDuplicate, mdiDotsHorizontalCircleOutline, mdiDotsVerticalCircleOutline, mdiEqual, mdiShareCircle, mdiText } from '@mdi/js';
import { EditIcon, Icon, SIZE, SIZE_S, SIZE_XS } from '../shared/icons';
import Button from '../shared/Button';
import { useStore } from '@site/src/stores/hooks';
import Lesson from '../Lesson';
import Translate, { translate } from '@docusaurus/Translate';
import Description from './EventFields/Description';
import DescriptionLong from './EventFields/DescriptionLong';
import KW from './EventFields/Kw';
import Day from './EventFields/Day';
import DateTime, { EndDateTime, StartDateTime } from './EventFields/DateTime';
import Location from './EventFields/Location';
import Audience from './EventFields/Audience';
import State from './EventFields/State';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from "@docusaurus/router";
import EventActions from './EventActions';
import Departments from './EventFields/Departments';
import Klasses from './EventFields/Klasses';
import EventProps from './EventProps';
interface Props {
    event: EventModel;
    inModal?: boolean;
}

const EventBody = observer((props: Props) => {
    const { event } = props;
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    const history = useHistory();
    const commonClasses = clsx(event.isDeleted && styles.deleted);
    const commonProps = { event, styles, className: commonClasses };
    const commonEditProps = { ...commonProps, isEditable: true };
    const [showOptions, setShowOptions] = React.useState(false);

    return (
        <div className={clsx(styles.eventBody, event.hasParent && styles.splitView)}>
            {event.hasParent && (
                <EventProps event={event.parent} inModal={props.inModal} showVersionHeader/>
            )}
            <EventProps {...props} showVersionHeader={event.hasParent} />
        </div>
    )
});

export default EventBody;