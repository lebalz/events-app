import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../../../shared/Button';
import { mdiMinusCircleOutline, mdiPlusCircleOutline } from '@mdi/js';
import DatePicker from '../../../shared/DatePicker';
import Checkbox from '../../../shared/Checkbox';
import Translate, { translate } from '@docusaurus/Translate';
import Select from 'react-select';
import Department from '@site/src/models/Department';
import _ from 'lodash';
import ShowSelectCheckBoxes from '../../BulkActions/ShowSelectCheckBoxes';
import { EventAudience, EventAudienceTranslationShort } from '@site/src/api/event';
import EventTable from '@site/src/stores/ViewStores/EventTable';
import { selectClassNamesConfig, selectStyleConfig, selectThemeConfig } from '..';
import { DAYS } from '@site/src/models/helpers/time';

interface Props {
    eventTable: EventTable;
    showSelectLocation: 'quick' | 'advanced';
    showSelects?: boolean;
}

const AdvancedFilter = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const departmentStore = useStore('departmentStore');
    const untisStore = useStore('untisStore');
    const { eventTable } = props;
    return (
        <div className={clsx(styles.advanced)}>
            <div className={clsx(styles.selects)}>
                <div className={clsx(styles.department)}>
                    <Select
                        isMulti
                        closeMenuOnSelect={false}
                        placeholder={translate({
                            message: 'Abteilungen',
                            id: 'event.filter.departments',
                            description: 'Filter: Departments'
                        })}
                        name="departments-filter"
                        menuPortalTarget={document.body}
                        options={_.orderBy(departmentStore.usedDepartments, ['name']).map((d) => ({
                            value: d.id,
                            label: d.name,
                            color: d?.color
                        }))}
                        styles={selectStyleConfig}
                        className={clsx(styles.select)}
                        classNames={selectClassNamesConfig}
                        value={[...eventTable.departmentIds].map((id) => {
                            const department = departmentStore.find<Department>(id);
                            return {
                                value: id,
                                label: department?.name || '',
                                color: department?.color || '#ccc'
                            };
                        })}
                        onChange={(opt) => {
                            const ids = opt.map((o) => o.value);
                            eventTable.setDepartmentIds(ids);
                        }}
                        theme={selectThemeConfig}
                    />
                </div>

                <div className={clsx(styles.classes)}>
                    <Select
                        isMulti
                        closeMenuOnSelect={false}
                        placeholder={translate({
                            message: 'Klassen',
                            id: 'event.filter.classes',
                            description: 'Filter: Classes'
                        })}
                        name="class-filter"
                        menuPortalTarget={document.body}
                        options={_.orderBy(untisStore.classes, ['name']).map((c) => ({
                            value: c.name,
                            label: c.displayName,
                            color: c.department?.color
                        }))}
                        styles={selectStyleConfig}
                        className={clsx(styles.select)}
                        classNames={selectClassNamesConfig}
                        value={[...eventTable.classNames].map((id) => {
                            const klass = untisStore.findClassByName(id);
                            return {
                                value: id,
                                label: klass?.displayName || '',
                                color: klass?.department?.color || '#ccc'
                            };
                        })}
                        onChange={(opt) => {
                            const cNames = opt.map((o) => o.value);
                            eventTable.setClassNames(cNames);
                        }}
                        theme={selectThemeConfig}
                    />
                </div>
            </div>
            <div>
                <div>
                    <Translate id="event.filter.advanced.filterAudience">Nach Zielgruppe filtern</Translate>
                </div>
                <div className={clsx(styles.buttonGroup, 'button-group', 'button-group--block')}>
                    {Object.keys(EventAudience).map((audience) => {
                        return (
                            <Button
                                text={EventAudienceTranslationShort[audience]}
                                active={eventTable.audienceFilter.has(audience as EventAudience)}
                                key={audience}
                                color="primary"
                                onClick={() => eventTable.toggleAudienceFilter(audience as EventAudience)}
                                noWrap
                            />
                        );
                    })}
                </div>
            </div>
            <div>
                <div>
                    <Translate id="event.filter.advanced.dayFilter">Betroffene Tage</Translate>
                </div>
                <div className={clsx(styles.buttonGroup, 'button-group', 'button-group--block')}>
                    {[...DAYS.slice(1), DAYS[0]].map((day) => {
                        return (
                            <Button
                                text={day}
                                active={eventTable.dayFilter.has(day)}
                                key={day}
                                color="primary"
                                onClick={() => eventTable.toggleDayFilter(day)}
                                noWrap
                            />
                        );
                    })}
                </div>
            </div>
            <div>
                <Checkbox
                    label={translate({
                        message: 'Gelöschte Verstecken?',
                        id: 'event.filter.deleted',
                        description: 'Filter: deleted'
                    })}
                    checked={eventTable.hideDeleted}
                    onChange={(checked) => eventTable.setHideDeleted(checked)}
                    labelSide="left"
                />
            </div>
            {props.showSelects && !eventTable.showSelect && props.showSelectLocation === 'advanced' && (
                <div>
                    <ShowSelectCheckBoxes
                        label={translate({
                            id: 'event.filter.show_select',
                            message: 'Termine auswählen'
                        })}
                    />
                </div>
            )}
            <div className={clsx(styles.dates)}>
                <div className={clsx(styles.date, styles.start)}>
                    {!!eventTable.start ? (
                        <>
                            <DatePicker
                                date={eventTable.start || new Date()}
                                onChange={(date) => eventTable.setStartFilter(date)}
                                time="start"
                            />
                            <Button
                                icon={mdiMinusCircleOutline}
                                iconSide="left"
                                text={translate({
                                    message: 'Start',
                                    id: 'event.filter.index.button.start',
                                    description: 'Text of button start time'
                                })}
                                onClick={() => eventTable.setStartFilter(null)}
                            />
                        </>
                    ) : (
                        <Button
                            icon={mdiPlusCircleOutline}
                            iconSide="left"
                            text={translate({
                                message: 'Start',
                                id: 'event.filter.index.button.start',
                                description: 'Text of button start time'
                            })}
                            onClick={() => eventTable.setStartFilter(new Date())}
                        />
                    )}
                </div>
                <div className={clsx(styles.date, styles.end)}>
                    {!!eventTable.end ? (
                        <>
                            <DatePicker
                                date={eventTable.end || new Date()}
                                onChange={(date) => eventTable.setEndFilter(date)}
                                time="end"
                            />
                            <Button
                                icon={mdiMinusCircleOutline}
                                iconSide="left"
                                text={translate({
                                    message: 'Ende',
                                    id: 'event.filter.index.button.end',
                                    description: 'Text of button end time'
                                })}
                                onClick={() => eventTable.setEndFilter(null)}
                            />
                        </>
                    ) : (
                        <Button
                            icon={mdiPlusCircleOutline}
                            iconSide="left"
                            text={translate({
                                message: 'Ende',
                                id: 'event.filter.index.button.end',
                                description: 'Text of button end time'
                            })}
                            onClick={() => eventTable.setEndFilter(new Date())}
                        />
                    )}
                </div>
            </div>
        </div>
    );
});

export default AdvancedFilter;
