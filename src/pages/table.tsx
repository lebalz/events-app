import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import Layout from '@theme/Layout';
import Button from '../components/shared/Button';
import { mdiCheckboxBlankBadge, mdiDownloadCircleOutline } from '@mdi/js';
import Filter from '../components/Event/Filter';
import clsx from 'clsx';
import styles from './table.module.scss';
import Grid from '../components/Event/Views/Grid';
import { toExcel } from '../stores/helpers/EventsToExcelV1';
import { rmUndefined } from '../models/helpers/filterHelpers';
import BulkActions from '../components/Event/BulkActions';
import useResizeObserver from '../components/shared/hooks/useResizeObserver';
import { SIZE_S } from '../components/shared/icons';
import { translate } from '@docusaurus/Translate';

const Table = observer(() => {
    const [width, setWidth] = React.useState<number | undefined>(undefined);
    const viewStore = useStore('viewStore');
    const departmentStore = useStore('departmentStore');
    const onResize = React.useCallback((target: HTMLDivElement) => {
        const currentWidth = target.getBoundingClientRect().width;
        setWidth(currentWidth);
    }, []);

    const ref = useResizeObserver(onResize);
    return (
        <Layout>
            <div className={clsx(styles.table)}>
                <div style={{ width: `${width}px` || 'min(95vw, 800px)' }}>
                    <Filter
                        showCurrentAndFuture
                        showSelects
                        showSelectLocation={width > 410 ? 'quick' : 'advanced'}
                    />
                    {viewStore.eventTable.showSelect && (
                        <BulkActions
                            events={viewStore.eventTable.events}
                            className={clsx(styles.bulkActions)}
                            leftActions={[
                                <Button
                                    icon={mdiCheckboxBlankBadge}
                                    key={'show_select'}
                                    size={SIZE_S}
                                    color={'red'}
                                    title={translate({
                                        id: 'event.bulk_actions.hide_select',
                                        message: 'Terminauswahl verbergen'
                                    })}
                                    onClick={() => viewStore.eventTable.toggleShowSelect()}
                                />
                            ]}
                        />
                    )}
                </div>
                <Grid
                    events={viewStore.eventTable.events}
                    ref={ref}
                    groupBy="yearsKw"
                    columns={rmUndefined([
                        viewStore.eventTable.showSelect ? 'select' : undefined,
                        ['teachingAffected', { componentProps: { show: 'icon' } }],
                        'day',
                        'description',
                        'start',
                        'end',
                        'location',
                        'departmens',
                        'classes',
                        'descriptionLong',
                        ['actions', { fixed: { right: 0 } }]
                    ])}
                />
                <Button
                    onClick={() => {
                        toExcel(viewStore.eventTable.events, departmentStore.departments).then((buffer) => {
                            const blob = new Blob([buffer], {
                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            document.body.appendChild(a);
                            a.href = url;
                            a.download = 'events.xlsx';
                            a.click();
                            document.body.removeChild(a);
                        });
                    }}
                    color="primary"
                    iconSide="left"
                    icon={mdiDownloadCircleOutline}
                    text={translate({
                        message: 'Download',
                        id: 'table.button.download',
                        description: 'Text of the button download xlsx'
                    })}
                />
            </div>
        </Layout>
    );
});

export default Table;
