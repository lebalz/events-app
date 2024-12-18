import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Translate, { translate } from '@docusaurus/Translate';
import Button from '../shared/Button';
import { mdiClipboardText, mdiClose, mdiMicrosoftOutlook } from '@mdi/js';
import { SIZE_S, SIZE_XS } from '../shared/icons';
import { EVENTS_API } from '@site/src/authConfig';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import _ from 'lodash';
import Link from '@docusaurus/Link';
import Copy from '../shared/Button/Copy';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { action } from 'mobx';
import Loader from '../shared/Loader';
import DefinitionList from '../shared/DefinitionList';
import Badge from '../shared/Badge';
import Checkbox from '../shared/Checkbox';
import Content from './SubscriptionPanel/Content';
import ForTeachers from './ForTeachers';
import ForUsers from './ForUsers';

interface Props {}

const Subscription = observer((props: Props) => {
    const userStore = useStore('userStore');
    const subscriptionStore = useStore('subscriptionStore');
    const user = userStore.current;
    React.useEffect(() => {
        if (user && !user.subscription) {
            subscriptionStore.create({}).then(
                action((subscription) => {
                    if (subscription) {
                        user.setSubscriptionId(subscription.id);
                    }
                })
            );
        }
    }, [subscriptionStore, user]);
    return (
        <div className={clsx(styles.icalSettings)}>
            {user && (
                <>
                    <h3>
                        <Translate id="ical.section.personal" description="personal ical sync address">
                            Persönliches Kalenderabo
                        </Translate>
                    </h3>
                    {user.subscription ? (
                        <div className={clsx(styles.controls)}>
                            {user.untisId ? (
                                <ForTeachers subscription={user.subscription} />
                            ) : (
                                <ForUsers subscription={user.subscription} />
                            )}
                        </div>
                    ) : (
                        <Loader />
                    )}
                </>
            )}
        </div>
    );
});

export default Subscription;
