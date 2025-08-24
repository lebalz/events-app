import React from 'react';
import clsx from 'clsx';
import styles from './CopyIcs.module.scss';
import { observer } from 'mobx-react-lite';
import { useIcsUrl } from '@site/src/hookes/useSubscriptionUrl';
import { mdiClipboardText, mdiDownloadOutline } from '@mdi/js';
import { SIZE_S } from '../icons';
import Copy from './Copy';
import Button from '.';
import { translate } from '@docusaurus/Translate';

interface Props {
    locale: 'de' | 'fr';
    icsName: string;
    name: string;
    color?: string;
    className?: string;
    title?: string;
}

const DownloadIcs = observer((props: Props) => {
    const { locale, icsName } = props;
    const url = useIcsUrl(locale, icsName);

    return (
        <Button
            href={url}
            icon={mdiDownloadOutline}
            title={translate({
                message: 'ICS Date herunterladen',
                id: 'user.ical.download-button.title',
                description: 'Button text for downloading the ics calendar file'
            })}
            text={props.name}
            color={props.color}
            size={SIZE_S}
            iconSide="right"
        />
    );
});

export default DownloadIcs;
