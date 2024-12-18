import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Translate, { translate } from '@docusaurus/Translate';
import Button from '../../shared/Button';
import { mdiClipboardText, mdiClose, mdiMicrosoftOutlook } from '@mdi/js';
import { SIZE_S, SIZE_XS } from '../../shared/icons';
import { EVENTS_API } from '@site/src/authConfig';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import _ from 'lodash';
import Link from '@docusaurus/Link';
import Copy from '../../shared/Button/Copy';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { action } from 'mobx';
import Loader from '../../shared/Loader';
import DefinitionList from '../../shared/DefinitionList';
import Badge from '../../shared/Badge';
import Checkbox from '../../shared/Checkbox';
import Content from '../SubscriptionPanel/Content';
import Subscription from '@site/src/models/Subscription';
import IcalProps from './IcalProps';
import GroupSubscriptions from '../ForUsers/GroupSubscriptions';

interface Props {
    subscription: Subscription;
}

const ForTeachers = observer((props: Props) => {
    const { subscription } = props;
    const { i18n } = useDocusaurusContext();
    const { currentLocale } = i18n;
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
                        <Checkbox
                            label={translate({
                                id: 'subscriptions.subscribed.subscribePersonal.label',
                                message: 'Abonniert'
                            })}
                            checked={subscription.subscribeToAffected}
                            onChange={(checked) => {
                                subscription.setSubscribeToAffected(checked);
                            }}
                        />
                        <i>
                            <Translate
                                id="ical.section.personal.description"
                                description="text which explains, which things are included in the personal calendar"
                            >
                                Die persönlichen Termine beinhalten alle für eine LP relevanten Termine
                            </Translate>
                            <ul>
                                <li>
                                    <Translate id="ical.personal.description.affectsLessons">
                                        Termine, die zu Stundenausfällen führen.
                                    </Translate>
                                </li>
                                <li>
                                    <Translate id="ical.personal.description.forTeachers">
                                        Termine für Lehrpersonen.
                                    </Translate>
                                </li>
                                <li>
                                    <Translate id="ical.personal.description.forSchool">
                                        Termine für die ganze Schule.
                                    </Translate>
                                </li>
                                <li>
                                    <Translate id="ical.personal.description.forClass">
                                        Termine welche die eigene Klasse betreffen.
                                    </Translate>
                                </li>
                            </ul>
                        </i>
                    </dd>
                    <dt>
                        <Translate id="subscriptions.subscribed.ignoredEvents">Ignorierte Termine</Translate>
                    </dt>
                    <dd>
                        <Badge text={`${subscription.semestersIgnoredEvents.length}`} />
                    </dd>
                    <GroupSubscriptions subscription={subscription} ignoreEmptySubscriptions />
                    <IcalProps subscription={subscription} />
                </DefinitionList>
                <div className={clsx(styles.settings)}>
                    <Content subscription={subscription} />
                </div>
            </div>
        </>
    );
});

export default ForTeachers;
