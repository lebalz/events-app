import React, { type ReactNode } from 'react';
import clsx from 'clsx';

// import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
// @ts-ignore
import queryString from 'query-string';
import {default as EventModelView} from '@site/src/components/Event';
import Section from '../components/shared/Section';
import EventModal from '../components/Event/Modal';

interface Props {
}

const EventView = observer((props: Props) => {
    const location = useLocation();
    const eventStore = useStore('eventStore');
    const parsed = queryString.parse(location.search);
    const events = eventStore.byIds(parsed.id);
    const title = events.length > 1 ? 'Termine' : 'Termin';

    return (
        <Layout>
            <Section title={title}>
                {events.map((event, idx) => {
                    return (<EventModelView event={event} key={idx}/>);
                })}
            </Section>
            <EventModal />
        </Layout>
    )
});

export default EventView;