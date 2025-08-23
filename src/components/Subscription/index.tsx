import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Translate from '@docusaurus/Translate';
import _ from 'lodash';
import { action } from 'mobx';
import Loader from '../shared/Loader';
import ForTeachers from './ForTeachers';
import ForUsers from './ForUsers';
import ClassSubscriptions from './ClassSubscriptions';
import DepartmentSubscriptions from './DepartmentSubscription';

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
            {user ? (
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
            ) : (
                <div className={clsx(styles.publicSubscriptions)}>
                    <ClassSubscriptions />
                    <DepartmentSubscriptions />
                </div>
            )}
        </div>
    );
});

export default Subscription;
