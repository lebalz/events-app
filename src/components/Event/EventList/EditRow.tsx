import Event from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Delete from '../../shared/Button/Delete';
import Discard from '../../shared/Button/Discard';
import Save from '../../shared/Button/Save';
import ClassLinker from '../../shared/ClassSelector';
import DateTimePicker from '../../shared/DateTimePicker';
import DepartmentLinker from '../../shared/DepartmentSelector';
import LongTextInput from '../../shared/LongTextInput';
import TextInput from '../../shared/TextInput';
import styles from './EventRow.module.scss';

interface RowProps {
    event: Event;
    locked: boolean;
}

const EditRow = observer((props: RowProps) => {
    const { event } = props;
    const viewStore = useStore('viewStore');
    const { eventTable } = viewStore;
    const ref = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [ref]);

    return (
        <tr
            data-id={event.id}
            className={clsx(styles.eventRow, styles.editMode)}
        >
            <td className={clsx(styles.kw)}>{event.kw}</td>
            <td className={clsx(styles.weekday)}>{event.weekday}</td>
            <td style={{maxWidth: eventTable.maxWidthDescription}} className={clsx(styles.description)}>
                <LongTextInput 
                    maxChars={20}
                    text={event.description} 
                    onChange={(text) => event.update({description: text})}
                />
            </td>
            <td className={clsx(styles.startDate)} colSpan={2}>
                <DateTimePicker
                    date={event.start}
                    onChange={(date) => event.update({start: date.toISOString()})}
                />
            </td>
            <td className={clsx(styles.endDate)} colSpan={2}>
                <DateTimePicker
                    date={event.end}
                    onChange={(date) => event.update({end: date.toISOString()})}
                />
            </td>
            <td 
                className={clsx(styles.location)} 
                style={{maxWidth: eventTable.maxWidthLocation}}
            >
                <TextInput text={event.location} onChange={(text) => event.update({location: text})} />
            </td>
            <td className={clsx(styles.departmentNames)}>
                <DepartmentLinker eventId={event.id} />
            </td>
            <td className={clsx(styles.classes)}>            
                <ClassLinker eventId={event.id} />
            </td>
            <td 
                className={clsx(styles.descriptionLong)}
                style={{maxWidth: eventTable.maxWidthDescriptionLong}}
            >
                <LongTextInput 
                    maxChars={30}
                    text={event.descriptionLong} 
                    onChange={(text) => event.update({descriptionLong: text})}
                />
            </td>
            <td>
                <div ref={ref}>
                    <Discard onClick={() => event.reset()} />
                    {
                        event.isDirty && (
                            <Save onClick={() => event.save()} />
                        )
                    }
                    <Delete onClick={() => event.destroy()} apiState={event.apiStateFor(`delete-${event.id}`)} />
                </div>
            </td>
        </tr>
    );
});

export default EditRow;