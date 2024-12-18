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

interface Props {}

const Subscription = observer((props: Props) => {
    const { i18n } = useDocusaurusContext();
    const userStore = useStore('userStore');
    const subscriptionStore = useStore('subscriptionStore');
    const { currentLocale } = i18n;
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
                    <Translate
                        id="ical.section.personal.description"
                        description="text which explains, which things are included in the personal calendar"
                    >
                        Dieser Kalender ist mit dem persönlichen Stundenplan abgeglichen und zeigt nur die für
                        Sie relevanten Termine an. Es werden administrative Termine (bspw. Konvente), den
                        Unterricht betreffende Lektionen (bspw. eine Klasse ist nicht anwesend) und für KLP's
                        die eigene Klasse betreffenden Termine angezeigt.
                    </Translate>
                    {user.subscription ? (
                        <>
                            {!user.untisId && (
                                <div className="alert alert--warning" role="alert">
                                    <Translate
                                        id="subscription.no_untis_account"
                                        description="Message for a user, that is not linked to a untis account"
                                    >
                                        Sie haben keinen Untis Account verknüpft, weshalb Ihre Termine nicht
                                        mit Ihrem Stundenplan abgegelichen werden können.
                                    </Translate>
                                    <div>
                                        <Link to={useBaseUrl('/user?user-tab=account')}>
                                            <Translate
                                                id="ical.link.text.settings"
                                                description="Link text to navigate to the user settings"
                                            >
                                                👉 Einstellungen
                                            </Translate>
                                        </Link>
                                    </div>
                                </div>
                            )}
                            <div className={clsx(styles.controls)}>
                                <DefinitionList>
                                    {user.untisId && (
                                        <>
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
                                                    checked={user.subscription.subscribeToAffected}
                                                    onChange={(checked) => {
                                                        user.subscription.setSubscribeToAffected(checked);
                                                    }}
                                                />
                                            </dd>
                                        </>
                                    )}
                                    <dt>
                                        <Translate id="subscriptions.subscribed.classes">Klassen</Translate>
                                    </dt>
                                    <dd>
                                        {user.subscription.untisClasses.length > 0 ? (
                                            user.subscription.untisClasses.map((c, idx) => (
                                                <Button
                                                    key={idx}
                                                    text={c.displayName}
                                                    title={c.name}
                                                    color={c.color}
                                                    icon={mdiClose}
                                                    onClick={() => {
                                                        user.subscription.removeUntisClass(c.id);
                                                    }}
                                                    iconSide="right"
                                                    size={SIZE_XS}
                                                />
                                            ))
                                        ) : (
                                            <Badge text="0" />
                                        )}
                                    </dd>
                                    <dt>
                                        <Translate id="subscriptions.subscribed.departments">
                                            Abteilungen
                                        </Translate>
                                    </dt>
                                    <dd>
                                        {user.subscription.departments.length > 0 ? (
                                            user.subscription.departments.map((d, idx) => (
                                                <Button
                                                    key={idx}
                                                    text={d.shortName}
                                                    title={d.description}
                                                    color={d.color}
                                                    icon={mdiClose}
                                                    onClick={() => {
                                                        user.subscription.removeDepartment(d.id);
                                                    }}
                                                    iconSide="right"
                                                    size={SIZE_XS}
                                                />
                                            ))
                                        ) : (
                                            <Badge text="0" />
                                        )}
                                    </dd>
                                    <dt>
                                        <Translate id="subscriptions.subscribed.ignoredEvents">
                                            Ignorierte Termine
                                        </Translate>
                                    </dt>
                                    <dd>
                                        <Badge text={`${user.subscription.semestersIgnoredEvents.length}`} />
                                    </dd>
                                    <dt>
                                        <Translate id="subscriptions.ical.openOutlook">
                                            In Outlook öffnen
                                        </Translate>
                                    </dt>
                                    <dd>
                                        <Button
                                            href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${user.subscription.icsLocator}&name=${translate(
                                                {
                                                    message: 'GBSL',
                                                    id: 'user.ical.outlook.calendar-name',
                                                    description: 'Name of the calendar in Outlook'
                                                }
                                            )}`}
                                            target="_blank"
                                            text={translate({
                                                message: 'Outlook',
                                                id: 'user.ical.outlook-button.text',
                                                description: 'Button text for adding the calendar to Outlook'
                                            })}
                                            title={translate({
                                                message: 'Abonniere den Kalender in Outlook',
                                                id: 'user.ical.outlook-button.title',
                                                description: 'Button text for adding the calendar to Outlook'
                                            })}
                                            icon={mdiMicrosoftOutlook}
                                            color={'primary'}
                                            size={SIZE_S}
                                        />
                                    </dd>
                                    <dt>
                                        <Translate id="subscriptions.ical.url">Kalender URL</Translate>
                                    </dt>
                                    <dd>
                                        <div className={clsx(styles.ical)}>
                                            <Copy
                                                value={`${EVENTS_API}/ical/${currentLocale}/${user.subscription.icsLocator}`}
                                                size={SIZE_XS}
                                                icon={mdiClipboardText}
                                                title={translate({
                                                    message: 'Kopiere den Link zum persönlichen Kalender.',
                                                    id: 'user.ical.personal-calendar.copy-button.title'
                                                })}
                                                className={clsx(styles.copyButton)}
                                            />
                                            {`${EVENTS_API}/ical/${currentLocale}/${user.subscription.icsLocator}`}
                                        </div>
                                    </dd>
                                </DefinitionList>
                                <div className={clsx(styles.settings)}>
                                    {/* <SubscriptionPanel subscription={user.subscription} /> */}
                                    <Content subscription={user.subscription} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <Loader />
                    )}
                </>
            )}
        </div>
    );
});

export default Subscription;
