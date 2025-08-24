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
import SubscribeIcs from '../../shared/Button/SubscribeIcs';
import CopyIcs from '../../shared/Button/CopyIcs';

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
                <SubscribeIcs
                    name={translate({
                        message: 'GBSL',
                        id: 'user.ical.outlook.calendar-name',
                        description: 'Name of the calendar in Outlook'
                    })}
                    icsName={subscription.icsLocator}
                    locale={currentLocale as 'de' | 'fr'}
                    color="primary"
                />
            </dd>
            <dt>
                <Translate id="subscriptions.ical.url">Kalender URL</Translate>
            </dt>
            <dd>
                <CopyIcs
                    locale={currentLocale as 'de' | 'fr'}
                    icsName={subscription.icsLocator}
                    title={translate({
                        message: 'Kopiere den Link zum persönlichen Kalender.',
                        id: 'user.ical.personal-calendar.copy-button.title'
                    })}
                />
            </dd>
        </>
    );
});

export default IcalProps;
