import { translate } from '@docusaurus/Translate';
import { mdiAlert } from '@mdi/js';
import Icon from '@mdi/react';
import { SIZE } from '@site/src/components/shared/icons';
import clsx from 'clsx';
import styles from './styles.module.scss';

interface Props {
    category: string;
}
const NoEventsAlert = (props: Props) => {
    return (
        <div role="alert" className={clsx('alert', 'alert--warning', styles.alert)}>
            <Icon size={SIZE} path={mdiAlert} color="var(--ifm-color-warning-darkest)" />
            <div>
                {translate(
                    {
                        id: 'event.NoEventsAlert.text',
                        message: 'In der Kategorie "{category}" sind keine Termine vorhanden.'
                    },
                    { category: props.category }
                )}
            </div>
        </div>
    );
};

export default NoEventsAlert;
