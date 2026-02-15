import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../../../shared/Button';
import { mdiCircle, mdiMinusCircleOutline, mdiPlusCircleOutline } from '@mdi/js';
import DatePicker from '../../../shared/DatePicker';
import Checkbox from '../../../shared/Checkbox';
import Translate, { translate } from '@docusaurus/Translate';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Department from '@site/src/models/Department';
import _ from 'lodash';
import ShowSelectCheckBoxes from '../../BulkActions/ShowSelectCheckBoxes';
import { EventAudience, EventAudienceTranslationShort, TeachingAffected } from '@site/src/api/event';
import EventTable from '@site/src/stores/ViewStores/EventTable';
import { selectClassNamesConfig, selectStyleConfig, selectThemeConfig } from '..';
import { DAYS } from '@site/src/models/helpers/time';
import { DescriptionMap, TeachingAffectedColors } from '../../EventFields/TeachingAffected';
import Icon from '@mdi/react';
import { SIZE_XXS } from '@site/src/components/shared/icons';

interface Props {
    eventTable: EventTable;
    showSelectLocation: 'quick' | 'advanced';
    showSelects?: boolean;
}

const AdvancedFilter = observer((props: Props) => {
    const departmentStore = useStore('departmentStore');
    const untisStore = useStore('untisStore');
    const userStore = useStore('userStore');
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
                    <CreatableSelect
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
                        formatCreateLabel={(inputValue) => {
                            return translate(
                                {
                                    id: 'event.filter.wildcard_class',
                                    message: 'Alle Klassen die mit "{inputValue}" beginnen'
                                },
                                { inputValue: inputValue.replace('*', '') }
                            );
                        }}
                        isValidNewOption={(inputValue) => {
                            if (inputValue.length < 2 || inputValue.length > 4) {
                                return false;
                            }
                            return inputValue.endsWith('*');
                        }}
                        onCreateOption={(inputValue) => {
                            if (!inputValue.endsWith('*')) {
                                return;
                            }
                            eventTable.addWildcardClassFilter(inputValue);
                        }}
                        styles={selectStyleConfig}
                        className={clsx(styles.select)}
                        classNames={selectClassNamesConfig}
                        value={[
                            ...[...eventTable.classNames].map((id) => {
                                const klass = untisStore.findClassByName(id);
                                return {
                                    value: id,
                                    label: klass?.displayName || '',
                                    color: klass?.department?.color || '#ccc'
                                };
                            }),
                            ...[...eventTable.wildcardClassFilter].map((wc) => ({
                                value: wc,
                                label: wc,
                                color: 'var(--ifm-color-warning)'
                            }))
                        ]}
                        onChange={(opt) => {
                            const cNames = _.groupBy(
                                opt.map((o) => o.value),
                                (val) => (val.endsWith('*') ? 'wildcard' : 'normal')
                            );
                            eventTable.setClassNames(cNames.normal || []);
                            eventTable.setWildcardClassFilter(cNames.wildcard || []);
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
            {userStore.current?.untisId && (
                <div>
                    <Checkbox
                        label={translate({
                            message: 'Während meinen Unterrichtslektionen?',
                            id: 'event.filter.affectedLessons',
                            description: 'Filter: affected lessons'
                        })}
                        checked={eventTable.duringTaughtLessonFilter}
                        onChange={(checked) => eventTable.setDuringTaughtLessonFilter(checked)}
                        labelSide="left"
                    />
                </div>
            )}
            <div>
                <div>
                    <Translate
                        id="event.teachingAffected"
                        description="for a single event: teaching affected?"
                    >
                        Unterricht betroffen?
                    </Translate>
                </div>
                <div className={clsx(styles.buttonGroup, 'button-group', 'button-group--block')}>
                    {[TeachingAffected.YES, TeachingAffected.PARTIAL, TeachingAffected.NO].map((ta) => {
                        return (
                            <Button
                                text={DescriptionMap[ta]}
                                active={eventTable.teachingAffectedFilter === ta}
                                key={ta}
                                color="primary"
                                icon={
                                    <Icon
                                        path={mdiCircle}
                                        size={SIZE_XXS}
                                        color={TeachingAffectedColors[ta]}
                                        style={{ transform: 'translateY(-20%)' }}
                                    />
                                }
                                iconSide="left"
                                onClick={() =>
                                    eventTable.setTeachingAffectedFilter(
                                        eventTable.teachingAffectedFilter === ta ? null : ta
                                    )
                                }
                                noWrap
                            />
                        );
                    })}
                </div>
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
                <div>
                    <Translate id="event.filter.advanced.dateRange">Datumsbereich</Translate>
                </div>
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
        </div>
    );
});

export default AdvancedFilter;
