import { mdiClipboardText } from '@mdi/js';
import { useIcsUrl } from '@site/src/hooks/useSubscriptionUrl';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { SIZE_XS } from '../icons';
import Copy from './Copy';
import styles from './CopyIcs.module.scss';

interface Props {
    locale: 'de' | 'fr';
    icsName: string;
    color?: string;
    className?: string;
    title?: string;
}

const CopyIcs = observer((props: Props) => {
    const { locale, icsName } = props;
    const url = useIcsUrl(locale, icsName);

    return (
        <div className={clsx(styles.ical)}>
            <Copy
                value={url}
                title={props.title}
                icon={mdiClipboardText}
                size={SIZE_XS}
                color={props.color}
                className={props.className}
            />
            {url}
        </div>
    );
});

export default CopyIcs;
