import React from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import { SIZE } from '@site/src/components/shared/icons';
import { mdiAlert } from '@mdi/js';
import Icon from '@mdi/react';
import styles from './styles.module.scss';

interface Props {
    collection: string;
}
const NoGroupsAlert = (props: Props) => {
    return (
        <div role="alert" className={clsx('alert', 'alert--warning', styles.alert)}>
            <Icon size={SIZE} path={mdiAlert} color="var(--ifm-color-warning-darkest)" />
            <div>
                {translate(
                    {
                        id: 'collection.NoGroupsAlert.text',
                        message: 'In der Sammlung "{collection}" sind keine Gruppen vorhanden.'
                    },
                    { collection: props.collection }
                )}
            </div>
        </div>
    );
};

export default NoGroupsAlert;
