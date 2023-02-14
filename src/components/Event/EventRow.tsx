import SchoolEvent from '@site/src/models/SchoolEvent';
import { observer } from 'mobx-react-lite';
import React from 'react';
import EditTD from './EditTD';
import SimpleTD from './SimpleTD';

interface RowProps {
    event: SchoolEvent;
    onChange: (event: any, eventId: string) => void;
    locked: boolean;
}

const EventRow = observer(React.forwardRef((props: RowProps, ref?: React.RefObject<HTMLTableRowElement>) => {
    const [showEdit, setShowEdit] = React.useState(false);
    const { event } = props;
    return (
        <tr
            ref={ref}
            data-id={event.id}
            onClick={() => {
                if (!props.locked && !showEdit) {
                    setShowEdit(true);
                }
            }}
            onBlur={() => {
                setShowEdit(false);
            }}
        >
            {showEdit ? (
                <EditTD event={event} onChange={props.onChange} locked={props.locked} />
            ) : (
                <SimpleTD event={event} locked={props.locked} />
            )}
        </tr>
    );
}));

export default EventRow;