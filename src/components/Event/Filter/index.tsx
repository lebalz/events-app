import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../../shared/Button';
import { mdiAbacus, mdiMinusCircleOutline, mdiPlusCircleOutline } from '@mdi/js';
import TextInput from '../../shared/TextInput';
import DatePicker from '../../shared/DatePicker';
import { SIZE_S, SIZE_XS, filterSvgPath } from '../../shared/icons';

interface Props {
    showCurrentAndFuture?: boolean;
}

const Filter = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const departmentStore = useStore('departmentStore');
    const { eventTable } = viewStore;
    React.useEffect(() => {
        if (!props.showCurrentAndFuture && eventTable.onlyCurrentWeekAndFuture) {
            eventTable.setOnlyCurrentWeekAndFuture(false);
            return () => eventTable.setOnlyCurrentWeekAndFuture(true);
        }
    }, [props.showCurrentAndFuture]);
    return (
        <div className={clsx(styles.filter)}>
            <div className={clsx(styles.basic)}>
                <div className={clsx(styles.audience, 'button-group', 'button-group--block')}>
                    <Button
                        text="Meine"
                        active={eventTable.onlyMine}
                        color='blue'
                        onClick={() => eventTable.toggleOnlyMine()}
                    />
                    {eventTable.showCurrentAndFutureFilter && props.showCurrentAndFuture && (
                        <Button
                            text="Künftige"
                            active={eventTable.onlyCurrentWeekAndFuture}
                            color='blue'
                            onClick={() => eventTable.setOnlyCurrentWeekAndFuture(!eventTable.onlyCurrentWeekAndFuture)}
                        />
                    )}
                </div>
                <div className={clsx(styles.classes, styles.fuzzyFilter)}>
                    <TextInput
                        placeholder="Stichworte"
                        onChange={(txt) => eventTable.setTextFilter(txt)} 
                        text={eventTable.klassFilter} 
                    />
                </div>
                <div className={clsx(styles.showMore)}>
                    <Button
                        icon={filterSvgPath}
                        size={SIZE_S}
                        active={eventTable.showAdvancedFilter}
                        className={clsx(styles.showAdvancedFilter)}
                        color={eventTable.hasAdvancedFilters ? 'blue' : undefined}
                        onClick={() => eventTable.setShowAdvancedFilter(!eventTable.showAdvancedFilter)}
                    />
                </div>
            </div>
            {eventTable.showAdvancedFilter && (
                <div className={clsx(styles.advanced)}>
                    <div>
                        <div className={clsx(styles.department, 'button-group', 'button-group--block')}>
                            {departmentStore.usedDepartments.map((department) => (
                                <Button
                                    text={department.name}
                                    active={eventTable.departmentIds.has(department.id)}
                                    onClick={() => eventTable.toggleDepartment(department)}
                                    color="blue"
                                    key={department.id}
                                />
                            ))}
                        </div>
                    </div>
                    <div className={clsx(styles.dates)}>
                        <div className={clsx(styles.date, styles.start)}>
                            {!!eventTable.start ? (
                                <>
                                    <DatePicker date={eventTable.start || new Date()} onChange={(date)=>eventTable.setStartFilter(date)} />
                                    <Button icon={mdiMinusCircleOutline} iconSide='left' text='Start' onClick={() => eventTable.setStartFilter(null)}/>
                                </>
                            ) : (
                                <Button icon={mdiPlusCircleOutline} iconSide='left' text='Start' onClick={() => eventTable.setStartFilter(new Date())}/>
                            )}
                        </div>
                        <div className={clsx(styles.date, styles.end)}>
                            {!!eventTable.end ? (
                                <>
                                    <DatePicker date={eventTable.end || new Date()} onChange={(date)=>eventTable.setEndFilter(date)} />
                                    <Button icon={mdiMinusCircleOutline} iconSide='left' text='Ende' onClick={() => eventTable.setEndFilter(null)}/>
                                </>
                            ) : (
                                <Button icon={mdiPlusCircleOutline} iconSide='left' text='Ende' onClick={() => eventTable.setEndFilter(new Date())}/>
                            )}
                        </div>
                        </div>
                </div>
            )}
        </div>
    )
});

export default Filter;