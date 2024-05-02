import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './event.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
// @ts-ignore
import queryString from 'query-string';
import {default as EventModelView} from '@site/src/components/Event';
import Section from '../components/shared/Section';
import ParentDetails from '../components/Event/ParentDetails';
import { translate } from '@docusaurus/Translate';

interface Props {
}

const EventTitleTranslation = {
    singular: translate({message: 'Termin', id: 'event.title', description: '[singular] Title of the event overview'}),
    plural: translate({message: 'Termine', id: 'event.title', description: '[plural] Title of the event overview'})
}

const EventView = observer((props: Props) => {
    const [ids, setIds] = React.useState<string[]>([]);
    const location = useLocation();
    const eventStore = useStore('eventStore');
    React.useEffect(() => {
        if (eventStore.initialPublicLoadPerformed) {
            const parsed = queryString.parse(location.search);
            const _ids: string[] = [];
            if (typeof parsed.id === 'string') {
                _ids.push(parsed.id);
            } else {
                _ids.push(...parsed.id);
            }
            setIds(_ids);
            _ids.filter(id => !eventStore.find(id)).forEach(id => eventStore.loadModel(id));
        }
    }, [location.search, eventStore.initialPublicLoadPerformed]);

    const events = eventStore.byIds(ids);
    const allSameParent = events.length > 1 && events[0].hasParent && events.every(event => event.parentId === events[0]?.parentId);
    const allUnpublishedVersions = allSameParent && events[0].unpublishedVersions.length === events.length;
    const title = allUnpublishedVersions
                    ? translate({message: 'Unveröffentlichte Versionen', id: 'event.versions.unpublished.title'})
                    : events.length > 1
                        ? EventTitleTranslation.plural
                        : EventTitleTranslation.singular;

    return (
        <Layout>
            <Section title={title} containerClassName={clsx(styles.events)}>
                {events.map((event, idx) => {
                    return (
                        <EventModelView
                            key={idx}
                            event={event}
                            className={clsx(styles.event)}
                            hideParent={allSameParent}
                            hideShowVersionsButton={allUnpublishedVersions}
                        />
                    );
                })}
                {allSameParent && (
                    <ParentDetails event={events[0]} className={clsx(styles.event, styles.parent)} />
                )}                
            </Section>
        </Layout>
    )
});

export default EventView;