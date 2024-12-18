import React from 'react';
import clsx from 'clsx';

import sharedStyles from '../shared.module.scss';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Translate, { translate } from '@docusaurus/Translate';
import Button from '../../shared/Button';
import { mdiClipboardText, mdiMicrosoftOutlook } from '@mdi/js';
import { SIZE_S, SIZE_XS } from '../../shared/icons';
import { EVENTS_API } from '@site/src/authConfig';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import _ from 'lodash';
import Copy from '../../shared/Button/Copy';
import Subscription from '@site/src/models/Subscription';

interface Props {
    subscription: Subscription;
}

const IcalProps = observer((props: Props) => {
    const { subscription } = props;
    const { i18n } = useDocusaurusContext();
    const { currentLocale } = i18n;
    return (
        <>
            <dt>
                <Translate id="subscriptions.ical.openOutlook">In Outlook öffnen</Translate>
            </dt>
            <dd>
                <Button
                    href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${subscription.icsLocator}&name=${translate(
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
                <div className={clsx(sharedStyles.ical)}>
                    <Copy
                        value={`${EVENTS_API}/ical/${currentLocale}/${subscription.icsLocator}`}
                        size={SIZE_XS}
                        icon={mdiClipboardText}
                        title={translate({
                            message: 'Kopiere den Link zum persönlichen Kalender.',
                            id: 'user.ical.personal-calendar.copy-button.title'
                        })}
                        className={clsx(sharedStyles.copyButton)}
                    />
                    {`${EVENTS_API}/ical/${currentLocale}/${subscription.icsLocator}`}
                </div>
            </dd>
        </>
    );
});

export default IcalProps;
