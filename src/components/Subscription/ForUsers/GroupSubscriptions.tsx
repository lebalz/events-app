import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Translate from '@docusaurus/Translate';
import Button from '../../shared/Button';
import { SIZE_XS } from '../../shared/icons';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import _ from 'lodash';
import Subscription from '@site/src/models/Subscription';
import { mdiClose } from '@mdi/js';
import Badge from '../../shared/Badge';

interface Props {
    subscription: Subscription;
    ignoreEmptySubscriptions?: boolean;
}

const GroupSubscriptions = observer((props: Props) => {
    const { subscription, ignoreEmptySubscriptions } = props;
    return (
        <>
            {(!ignoreEmptySubscriptions || subscription.untisClasses.length > 0) && (
                <>
                    <dt>
                        <Translate id="subscriptions.subscribed.classes">Abonnierte Klassen</Translate>
                    </dt>
                    <dd>
                        <div className={clsx(styles.badges)}>
                            {subscription.untisClasses.length > 0 ? (
                                subscription.untisClasses.map((c, idx) => (
                                    <Button
                                        key={idx}
                                        text={c.displayName}
                                        title={c.name}
                                        color={c.color}
                                        icon={mdiClose}
                                        onClick={() => {
                                            subscription.removeUntisClass(c.id);
                                        }}
                                        iconSide="right"
                                        size={SIZE_XS}
                                    />
                                ))
                            ) : (
                                <Badge text="0" />
                            )}
                        </div>
                        <i>
                            <Translate id="subscriptions.subscribed.classes.description">
                                Werden die Termine einer Klasse abonniert, erscheinen diese auch im
                                persönlichen Kalender. Doppelte Termine werden nicht angezeigt.
                            </Translate>
                        </i>
                        <div className={clsx(styles.hint, 'alert', 'alert--info')} role="alert">
                            <Translate id="subscriptions.subscribed.classes.hint">
                                Die eigene Klasse (für KLP's) muss nicht abonniert werden - diese Termine sind
                                bereits enthalten.
                            </Translate>
                        </div>
                    </dd>
                </>
            )}
            {(!ignoreEmptySubscriptions || subscription.departments.length > 0) && (
                <>
                    <dt>
                        <Translate id="subscriptions.subscribed.departments">
                            Abonnierte Abteilungen
                        </Translate>
                    </dt>
                    <dd>
                        <div className={clsx(styles.badges)}>
                            {subscription.departments.length > 0 ? (
                                subscription.departments.map((d, idx) => (
                                    <Button
                                        key={idx}
                                        text={d.shortName}
                                        title={d.description}
                                        color={d.color}
                                        icon={mdiClose}
                                        onClick={() => {
                                            subscription.removeDepartment(d.id);
                                        }}
                                        iconSide="right"
                                        size={SIZE_XS}
                                    />
                                ))
                            ) : (
                                <Badge text="0" />
                            )}
                        </div>
                        <i>
                            <Translate id="subscriptions.subscribed.departments.description">
                                Werden die Termine einer Abteilung abonniert, erscheinen diese auch im
                                persönlichen Kalender. Doppelte Termine werden nicht angezeigt.
                            </Translate>
                        </i>
                        <div className={clsx(styles.hint, 'alert', 'alert--info')} role="alert">
                            <Translate id="subscriptions.departments.classes.hint">
                                Die Abteilungen unterrichteter Klassen sind bereits im persönlichen Kalender
                                abonniert.
                            </Translate>
                        </div>
                    </dd>
                </>
            )}
        </>
    );
});

export default GroupSubscriptions;
