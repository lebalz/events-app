import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Translate from '@docusaurus/Translate';
import _ from 'lodash';
import DefinitionList from '../../shared/DefinitionList';
import Badge from '../../shared/Badge';
import Subscription from '@site/src/models/Subscription';
import GroupSubscriptions from './GroupSubscriptions';
import IcalProps from '../ForTeachers/IcalProps';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';

interface Props {
    subscription: Subscription;
}

const ForUsers = observer((props: Props) => {
    const { subscription } = props;
    const settingsUrl = useBaseUrl('/user?user-tab=account');
    return (
        <>
            <div className={clsx(styles.controls)}>
                <DefinitionList>
                    <dt>
                        <Translate id="subscriptions.subscribed.subscribePersonal">
                            Persönliche Termine?
                        </Translate>
                    </dt>
                    <dd>
                        <div className="alert alert--warning" role="alert">
                            <Translate
                                id="subscription.no_untis_account"
                                description="Message for a user, that is not linked to a untis account"
                            >
                                Sie haben keinen Untis Account verknüpft, weshalb Ihre Termine nicht mit Ihrem
                                Stundenplan abgegelichen werden können.
                            </Translate>
                            <div>
                                <Link to={settingsUrl}>
                                    <Translate
                                        id="ical.link.text.settings"
                                        description="Link text to navigate to the user settings"
                                    >
                                        👉 Einstellungen
                                    </Translate>
                                </Link>
                            </div>
                        </div>
                    </dd>
                    <GroupSubscriptions subscription={subscription} />
                    <dt>
                        <Translate id="subscriptions.subscribed.ignoredEvents">Ignorierte Termine</Translate>
                    </dt>
                    <dd>
                        <Badge text={`${subscription.semestersIgnoredEvents.length}`} />
                    </dd>
                    <IcalProps subscription={subscription} />
                </DefinitionList>
            </div>
        </>
    );
});

export default ForUsers;
