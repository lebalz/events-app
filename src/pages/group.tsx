import React from 'react';
import clsx from 'clsx';

import styles from './group.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';
import queryString from 'query-string';
import Section from '../components/shared/Section';
import Translate, { translate } from '@docusaurus/Translate';
import EventGroup from '../components/EventGroup';
import { default as EventGroupModel } from '../models/EventGroup';

interface Props {}

const GroupView = observer((props: Props) => {
    const [id, setId] = React.useState<string>('');
    const location = useLocation();
    const groupStore = useStore('eventGroupStore');
    React.useEffect(() => {
        if (groupStore.initialAuthorizedLoadPerformed) {
            const parsed = queryString.parse(location.search);
            if (typeof parsed.id === 'string') {
                setId(parsed.id);
            } else if (parsed.id.length > 0) {
                setId(parsed.id[0]);
            }
        }
    }, [location.search, groupStore.initialAuthorizedLoadPerformed]);

    const group = groupStore.find<EventGroupModel>(id);
    // Select the appropriate pluralized label based on `items.length`
    return (
        <Layout>
            <Section
                title={translate({ message: 'Gruppe', id: 'group.title' })}
                classNameContainer={clsx(styles.groups)}
            >
                {group ? (
                    <EventGroup group={group} standalone />
                ) : (
                    <h3>
                        {groupStore.initialAuthorizedLoadPerformed ? (
                            <Translate id="group.message.notFound">Gruppe nicht gefunden</Translate>
                        ) : (
                            <Translate id="group.message.loading">Gruppe Laden</Translate>
                        )}
                    </h3>
                )}
            </Section>
        </Layout>
    );
});

export default GroupView;
