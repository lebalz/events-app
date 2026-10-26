import clsx from 'clsx';

import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import customFiels from '@site/src/components/utils/customFields';
import Subscription from '@site/src/models/Subscription';
import { observer } from 'mobx-react-lite';
import Badge from '../../shared/Badge';
import Checkbox from '../../shared/Checkbox';
import DefinitionList from '../../shared/DefinitionList';
import GroupSubscriptions from '../ForUsers/GroupSubscriptions';
import Content from '../SubscriptionPanel/Content';
import IcalProps from './IcalProps';
import styles from './styles.module.scss';
const { EVENTS_API } = customFiels;

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
