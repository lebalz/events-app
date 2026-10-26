import { translate } from '@docusaurus/Translate';
import { mdiAlert } from '@mdi/js';
import Icon from '@mdi/react';
import { SIZE } from '@site/src/components/shared/icons';
import clsx from 'clsx';
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
