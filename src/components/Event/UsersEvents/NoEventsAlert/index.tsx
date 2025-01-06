import React from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import { SIZE } from '@site/src/components/shared/icons';
import { mdiAlert } from '@mdi/js';
import Icon from '@mdi/react';
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
