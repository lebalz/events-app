import clsx from 'clsx';
import React from 'react';

import { useLocation } from '@docusaurus/router';
import Translate, { translate } from '@docusaurus/Translate';
import { useStore } from '@site/src/stores/hooks';
import Layout from '@theme/Layout';
import { observer } from 'mobx-react-lite';
import queryString from 'query-string';
import EventGroup from '../components/EventGroup';
import Section from '../components/shared/Section';
import { default as EventGroupModel } from '../models/EventGroup';
import styles from './group.module.scss';

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
            } else if (parsed.id && parsed.id.length > 0) {
                setId((parsed.id as string[])[0]);
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
