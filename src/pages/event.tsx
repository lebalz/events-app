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

interface Props {
}

const EventView = observer((props: Props) => {
    const [ids, setIds] = React.useState<string[]>([]);
    const location = useLocation();
    const eventStore = useStore('eventStore');
    React.useEffect(() => {
        if (eventStore.initialLoadPerformed) {
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
    }, [location.search, eventStore.initialLoadPerformed]);

    const events = eventStore.byIds(ids);
    const title = events.length > 1 ? 'Termine' : 'Termin';

    return (
        <Layout>
            <Section title={title}>
                {events.map((event, idx) => {
                    return (<EventModelView event={event} key={idx}/>);
                })}
            </Section>
        </Layout>
    )
});

export default EventView;