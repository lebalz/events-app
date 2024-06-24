import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../../shared/Button';
import {
    mdiCheckboxBlankBadge,
    mdiCheckboxBlankBadgeOutline,
    mdiCircle,
    mdiMinusCircleOutline,
    mdiPlusCircleOutline,
    mdiStar,
    mdiStarCircle,
    mdiStarOutline
} from '@mdi/js';
import TextInput from '../../shared/TextInput';
import DatePicker from '../../shared/DatePicker';
import { SIZE_S, FilterSvgPath, SIZE_XS, SIZE, SIZE_XXS } from '../../shared/icons';
import Checkbox from '../../shared/Checkbox';
import Translate, { translate } from '@docusaurus/Translate';
import Select, { Theme, ThemeConfig } from 'react-select';
import Department from '@site/src/models/Department';
import _ from 'lodash';
import Icon, { Stack } from '@mdi/react';
import ShowSelectCheckBoxes from '../BulkActions/ShowSelectCheckBoxes';
import { EventAudience, EventAudienceTranslationShort } from '@site/src/api/event';

interface Props {
    showCurrentAndFuture?: boolean;
    showSelects?: boolean;
    showSelectLocation?: 'quick' | 'advanced';
}

export const selectStyleConfig = {
    option: (styles, { data, isFocused }) => ({
        ...styles,
        color: (data as unknown as { color: string })?.color,
        backgroundColor: isFocused ? 'var(--docusaurus-collapse-button-bg-hover)' : undefined
    }),
    multiValue: (styles, { data }) => ({
        ...styles,
        color: (data as unknown as { color: string })?.color
    }),
    multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: (data as unknown as { color: string })?.color
    }),
    valueContainer: (styles) => ({
        ...styles,
        padding: '0px',
        paddingLeft: '4px'
    }),
    menuPortal: (base) => ({ ...base, zIndex: 'var(--ifm-z-index-overlay)' })
};

export const selectClassNamesConfig = {
    indicatorsContainer: () => styles.indicatorsContainer,
    multiValue: () => styles.multiValue,
    control: () => styles.control,
    menu: () => styles.control
};

export const selectThemeConfig = (theme: Theme) => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary25: 'var(--ifm-color-primary-lightest)',
        primary50: 'var(--ifm-color-primary-lighter)',
        primary75: 'var(--ifm-color-primary-light)',
        primary: 'var(--ifm-color-primary)'
    }
});

const Filter = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const departmentStore = useStore('departmentStore');
    const untisStore = useStore('untisStore');
    const { eventTable } = viewStore;
    React.useEffect(() => {
        if (!props.showCurrentAndFuture && eventTable.onlyCurrentWeekAndFuture) {
            eventTable.setOnlyCurrentWeekAndFuture(false);
            return () => eventTable.setOnlyCurrentWeekAndFuture(true);
        }
    }, [props.showCurrentAndFuture]);
    const showSelectLocation = props.showSelectLocation || 'quick';
    return (
        <div className={clsx(styles.filter)}>
            <div className={clsx(styles.basic)}>
                {props.showSelects && !eventTable.showSelect && showSelectLocation === 'quick' && (
                    <ShowSelectCheckBoxes />
                )}
                <div className={clsx(styles.spacer)}></div>
                <div className={clsx(styles.audience, 'button-group', 'button-group--block')}>
                    {!!viewStore.user && (
                        <Button
                            text={translate({
                                message: 'Meine',
                                id: 'event.filter.mine',
                                description: 'Filter: Only events affecting me'
                            })}
                            title={translate({
                                message: 'Nur die für mich relevanten Termine anzeigen',
                                id: 'event.filter.mine.title'
                            })}
                            active={eventTable.onlyMine}
                            color="primary"
                            onClick={() => eventTable.toggleOnlyMine()}
                        />
                    )}
                    {eventTable.showCurrentAndFutureFilter && props.showCurrentAndFuture && (
                        <Button
                            text={translate({
                                message: 'Künftige',
                                id: 'event.filter.future',
                                description: 'Filter: Only current and future events'
                            })}
                            title={translate({
                                message: 'Vergangene Termine ausblenden.',
                                id: 'event.filter.future.title',
                                description: 'Filter: Only current and future events'
                            })}
                            active={eventTable.onlyCurrentWeekAndFuture}
                            color="primary"
                            onClick={() =>
                                eventTable.setOnlyCurrentWeekAndFuture(!eventTable.onlyCurrentWeekAndFuture)
                            }
                        />
                    )}
                </div>
                <div className={clsx(styles.classes, styles.fuzzyFilter)}>
                    <TextInput
                        placeholder={translate({
                            message: 'Suche',
                            id: 'event.filter.search'
                        })}
                        onChange={(txt) => eventTable.setTextFilter(txt)}
                        text={eventTable.klassFilter}
                    />
                </div>
                <div className={clsx(styles.showMore)}>
                    <Button
                        icon={FilterSvgPath}
                        size={SIZE_S}
                        active={eventTable.showAdvancedFilter}
                        className={clsx(styles.showAdvancedFilter)}
                        color={eventTable.hasAdvancedFilters ? 'primary' : undefined}
                        title={translate({
                            id: 'event.filter.showAdvanced',
                            message: 'Erweiterte Filter anzeigen',
                            description: 'Button: Show advanced filter'
                        })}
                        onClick={() => eventTable.setShowAdvancedFilter(!eventTable.showAdvancedFilter)}
                    />
                    {eventTable.hasAdvancedFilters && (
                        <span className={clsx(styles.dirty)}>
                            <Stack size={SIZE_XS}>
                                <Icon
                                    path={mdiCircle}
                                    size={SIZE_XS}
                                    color="var(--ifm-background-surface-color)"
                                />
                                <Icon path={mdiStar} size={0.9 * SIZE_XS} color="var(--ifm-color-primary)" />
                            </Stack>
                        </span>
                    )}
                </div>
                <div className={clsx(styles.spacer)}></div>
            </div>
            {eventTable.showAdvancedFilter && (
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
                            <Translate id="event.filter.advanced.filterAudience">
                                Nach Zielgruppe filtern
                            </Translate>
                        </div>
                        <div className={clsx(styles.buttonGroup, 'button-group', 'button-group--block')}>
                            {Object.keys(EventAudience).map((audience) => {
                                return (
                                    <Button
                                        text={EventAudienceTranslationShort[audience]}
                                        active={eventTable.audienceFilter.has(audience as EventAudience)}
                                        key={audience}
                                        color="primary"
                                        onClick={() =>
                                            eventTable.setAudienceFilter(audience as EventAudience)
                                        }
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
                    {props.showSelects && !eventTable.showSelect && showSelectLocation === 'advanced' && (
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
                                            message : "Start",
                                            id:'event.filter.index.button.start' ,
                                            description:'Text of button start time'
                                        })}
                                        onClick={() => eventTable.setStartFilter(null)}
                                    />
                                </>
                            ) : (
                                <Button
                                    icon={mdiPlusCircleOutline}
                                    iconSide="left"
                                    text={translate({
                                        message : "Start",
                                        id:'event.filter.index.button.start' ,
                                        description:'Text of button start time'
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
                                            message : "Ende",
                                            id:'event.filter.index.button.end' ,
                                            description:'Text of button end time'
                                        })}
                                        onClick={() => eventTable.setEndFilter(null)}
                                    />
                                </>
                            ) : (
                                <Button
                                    icon={mdiPlusCircleOutline}
                                    iconSide="left"
                                    text={translate({
                                        message : "Ende",
                                        id:'event.filter.index.button.end' ,
                                        description:'Text of button end time'
                                    })}
                                    onClick={() => eventTable.setEndFilter(new Date())}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default Filter;
