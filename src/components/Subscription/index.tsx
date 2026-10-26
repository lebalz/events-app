import clsx from 'clsx';
import React from 'react';

import Translate from '@docusaurus/Translate';
import { useStore } from '@site/src/stores/hooks';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import Loader from '../shared/Loader';
import ClassSubscriptions from './ClassSubscriptions';
import DepartmentSubscriptions from './DepartmentSubscription';
import ForTeachers from './ForTeachers';
import ForUsers from './ForUsers';
import styles from './styles.module.scss';

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
