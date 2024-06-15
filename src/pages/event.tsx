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
import Head from '@docusaurus/Head';
import List from '../components/Event/Views/List';

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
            {
                events.length > 1 && (
                    <Head>
                        {events.length === 1
                            ? (
                                <>
                                    <meta
                                        property='og:title'
                                        content={`${events[0].description.slice(0, 57)}${events[0].description.length > 57 ? '...' : ''}`}
                                    />
                                    <meta
                                        property='og:description'
                                        content={`${events[0].fStartDate} ${events[0].fStartTime} - ${events[0].fEndDate} ${events[0].fEndTime} @ ${events[0].location}`.slice(0, 160)}
                                    />
                                </>
                            )
                            : (
                                <>
                                    <meta
                                        property='og:title'
                                        content={`${events.length} ${EventTitleTranslation.plural}`}
                                    />
                                    <meta
                                        property='og:description'
                                        content={events.map(event => `${event.description}: ${event.fStartDate} ${event.fStartTime}`).join(', ').slice(0, 160)}
                                    />
                                </>                                    
                            )
                        }
                    </Head>
                )
            }
            <Section title={title}>
                <List events={events} />
                {allSameParent && (
                    <ParentDetails event={events[0]} className={clsx(styles.event, styles.parent)} />
                )}                
            </Section>
        </Layout>
    )
});

export default EventView;