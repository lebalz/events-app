import React from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';
import styles from './styles.module.scss';
import gDefault from './gridConfigs/default.module.scss';
import gSelect from './gridConfigs/selectable.module.scss';
import gSelectAuthor from './gridConfigs/select_author.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { action, computed, reaction } from 'mobx';
import Filter from '../Filter';
import { formatDate } from '@site/src/models/helpers/time';
import EventModal from '../Modal';
import GridTable from '../../shared/GridTable';
import { useWindowSize } from '@docusaurus/theme-common';
import Select from '../EventFields/Select';
import DateTime from '../EventFields/DateTime';
import Description from '../EventFields/Description';
import Day from '../EventFields/Day';
import UserGroup from '../EventFields/UserGroup';
import DepartmentsOrAudiencePicker from '../EventFields/DepartmentsOrAudience';
import DescriptionLong from '../EventFields/DescriptionLong';
import { Icon, SIZE_S } from '../../shared/icons';
import Location from '../EventFields/Location';
import Klasses from '../EventFields/Klasses';
import Actions from '../EventFields/Actions';
import { mdiTools } from '@mdi/js';
import State from '../EventFields/State';
import IsValid from '../EventFields/IsValid';
import KW from '../EventFields/Kw';
import Author from '../EventFields/Author';


interface Props {
    events: EventModel[];
    showFullscreenButton?: boolean;
    gridConfig?: string;
    selectable?: boolean;
    showAuthor?: boolean;
    groupBy?: 'kw';
    showFilter?: boolean;
    scrollToCurrent?: boolean;
    sortable?: boolean;
    showState?: boolean;
    showIsValid?: boolean;
    showKW?: boolean;
}

const EventGrid = observer((props: Props) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const viewStore = useStore('viewStore');
    const windowSize = useWindowSize();

    React.useEffect(() => {
        const current = viewStore.fullscreen;
        viewStore.setShowFullscreenButton(props.showFullscreenButton ?? true);
        return () => viewStore.setShowFullscreenButton(current);
    }, []);

    React.useEffect(
        () =>
            reaction(
                () => viewStore.fullscreen,
                (fullscreen) => {
                    if (fullscreen) {
                        ref.current?.requestFullscreen();
                    } else if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                }
            ),
        []
    );
    // Watch for fullscreenchange
    React.useEffect(() => {
        const onFullscreenChange = () => {
            if (!!document.fullscreenElement !== viewStore.fullscreen) {
                viewStore.setFullscreen(!!document.fullscreenElement);
            }
        }
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    // React.useEffect(() => {
    //     const current = document.querySelector('#current-week');
    //     if (current) {
    //         current.scrollIntoView(
    //             {
    //                 behavior: 'smooth',
    //                 block: 'start',
    //                 inline: 'nearest'
    //             }
    //         );
    //         const tid = setTimeout(() => {
    //             window.scrollTo({top: 0, behavior: 'smooth'});
    //         }, 1000);
    //         return () => clearTimeout(tid);
    //     }
    // }, [props.events, props.scrollToCurrent]);

    const editable = props.events.some(e => e.isEditable);
    return (
        <div className={clsx(viewStore.fullscreen && styles.fullscreenContainer)} ref={ref}>
            {props.showFilter && <Filter />}
            <GridTable
                className={clsx(styles.table, editable && styles.editable)}
                data={props.events || []}
                columns={{
                    state: props.showState && { width: '2.1em', label: '', render: (item) => <State event={item} />, transform: (item) => item.state },
                    isValid: props.showIsValid && { width: '2.1em', label: '', render: (item) => <IsValid event={item} />, transform: (item) => item.isValid ? 'Valid' : 'Invalid' },
                    select: props.selectable && {
                        width: '2.1em',
                        label: '',
                        render: (item, self) => (
                            <Select
                                event={item}
                                onSelect={(selected: boolean, shiftKey: boolean) => {
                                    const idx = self.items.findIndex(i => i.model.id === item.id);
                                    const topIdx = self.items.slice(0, idx).findLastIndex(i => i.model.selected);
                                    if (shiftKey) {
                                        if (topIdx > -1) {
                                            self.items.slice(topIdx, idx).forEach(i => i.model.setSelected(selected));
                                        }
                                    }
                                    item.setSelected(selected)
                                }}
                            />),
                        transform: (item) => item.id
                    },
                    kw: props.showKW && { width: '2.8em', label: 'KW', transform: (item) => item.kw, render: (item) => <KW event={item} /> },
                    author: props.showAuthor && { width: '5em', label: 'Author', transform: (item) => item.author?.shortName, render: (item) => <Author event={item} /> },
                    day: { width: '2.8em', label: 'Tag', transform: (item) => item.fStartDate, render: (item) => <Day event={item} /> },
                    description: { width: '16em', label: 'Stichworte', render: (item) => <Description event={item} /> },
                    start: { label: 'Start', render: (item) => <DateTime event={item} time='start' />, className: styles.flex },
                    end: { label: 'Ende', render: (item) => <DateTime event={item} time='end' />, className: styles.flexEnd },
                    location: { label: 'Ort', render: (item) => <Location event={item} /> },
                    userGroup: { label: 'Gruppe', render: (item) => <UserGroup event={item} /> },
                    departmens: { label: 'Abteilungen', transform: (item) => item.departmentNames.join(', '), render: (item) => <DepartmentsOrAudiencePicker event={item} />, colSpan: (item) => item.isEditing ? 2 : 1 },
                    classes: { label: 'Klassen', transform: (item) => item.fClasses.map(t => t.text).join(', '), render: (item) => <Klasses event={item} />, hidden: (item) => item.isEditing },
                    descriptionLong: { width: '20em', label: 'Beschreibung', render: (item) => <DescriptionLong event={item} /> },
                    actions: { label: <Icon path={mdiTools} size={SIZE_S} />, fixed: { right: 0 }, render: (item) => <Actions event={item} />, transform: (item) => item.id },
                }}
                groupBy={props.groupBy}
                groupHeader={props.groupBy ? (item) => <div>KW {item.models[0].model.kw}</div> : undefined}
                onRowClick={(e, model) => {
                    if (e.ctrlKey || e.metaKey || windowSize === 'mobile') {
                        viewStore.setEventModalId(model.id);
                    } else if (e.altKey && model.isEditable) {
                        model.setEditing(true);
                    } else {
                        model.setExpanded(true);
                    }
                }}
            />
        </div>
    )
});

export default EventGrid;