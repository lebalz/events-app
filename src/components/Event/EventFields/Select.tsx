import clsx from 'clsx';

import Checkbox from '@site/src/components/shared/Checkbox';
import Event from '@site/src/models/Event';
import EventTable from '@site/src/stores/ViewStores/EventTable';
import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import styles from './styles.module.scss';

interface Props extends ReadonlyProps {
    onSelect: (event: Event, selected: boolean, shiftKey: boolean) => void;
    eventTable: EventTable;
}

const Select = observer((props: Props) => {
    const { event, eventTable } = props;
    return (
        <div
            data-id={event.id}
            style={{ gridColumn: 'select' }}
            className={clsx('grid-select', styles.select, props.className)}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <Checkbox
                checked={eventTable.selectedEventIds.has(event.id)}
                onChange={(checked, shiftKey) => {
                    if (shiftKey) {
                        eventTable.selectUntil(event.id);
                    } else {
                        eventTable.setSelectedEvents([event.id], checked);
                    }
                }}
            />
        </div>
    );
});

export default Select;
