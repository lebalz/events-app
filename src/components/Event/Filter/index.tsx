import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../../shared/Button';
import { mdiCircle, mdiStar } from '@mdi/js';
import TextInput from '../../shared/TextInput';
import { SIZE_S, FilterSvgPath, SIZE_XS } from '../../shared/icons';
import { translate } from '@docusaurus/Translate';
import { Theme } from 'react-select';
import _ from 'lodash';
import Icon from '@mdi/react';
import ShowSelectCheckBoxes from '../BulkActions/ShowSelectCheckBoxes';
import EventTable from '@site/src/stores/ViewStores/EventTable';
import AdvancedFilter from './AdvancedFilter';

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

interface Props {
    showCurrentAndFuture?: boolean;
    showSelects?: boolean;
    showSelectLocation?: 'quick' | 'advanced';
    eventTable: EventTable;
    hideMine?: boolean;
    flexWidth?: boolean;
}
const Filter = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const { eventTable } = props;
    React.useEffect(() => {
        if (eventTable && !props.showCurrentAndFuture && eventTable.onlyCurrentWeekAndFuture) {
            eventTable.setOnlyCurrentWeekAndFuture(false);
            return () => eventTable.setOnlyCurrentWeekAndFuture(true);
        }
    }, [eventTable, props.showCurrentAndFuture]);
    const showSelectLocation = props.showSelectLocation || 'quick';
    return (
        <div className={clsx(styles.filter)}>
            <div className={clsx(styles.basic)}>
                {props.showSelects && !eventTable.showSelect && showSelectLocation === 'quick' && (
                    <ShowSelectCheckBoxes />
                )}
                <div className={clsx(styles.spacer)}></div>
                <div className={clsx(styles.audience, 'button-group', 'button-group--block')}>
                    {!!viewStore.user && !props.hideMine && (
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
                            noWrap
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
                            noWrap
                        />
                    )}
                </div>
                <div className={clsx(styles.fuzzyFilter, props.flexWidth && styles.flexWidth)}>
                    <TextInput
                        placeholder={translate({
                            message: 'Suche',
                            id: 'event.filter.search'
                        })}
                        inputClassName={clsx(styles.input)}
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
                            <Icon
                                path={mdiCircle}
                                size={SIZE_XS}
                                color="var(--ifm-background-surface-color)"
                                className={styles.icon}
                            />
                            <Icon
                                path={mdiStar}
                                size={0.9 * SIZE_XS}
                                color="var(--ifm-color-primary)"
                                className={styles.icon}
                            />
                        </span>
                    )}
                </div>
                <div className={clsx(styles.spacer)}></div>
            </div>
            {eventTable.showAdvancedFilter && (
                <AdvancedFilter
                    eventTable={eventTable}
                    showSelects={props.showSelects}
                    showSelectLocation={showSelectLocation}
                />
            )}
        </div>
    );
});

export default Filter;
