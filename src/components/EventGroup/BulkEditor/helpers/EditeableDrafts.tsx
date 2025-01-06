import React from 'react';
import Translate from '@docusaurus/Translate';
import clsx from 'clsx';
import { EventStateButton, EventStateColor } from '@site/src/api/event';
import Badge from '@site/src/components/shared/Badge';
import styles from './styles.module.scss';

interface Props {
    count: number;
}

const EditableDrafts = (props: Props) => {
    return (
        <div className={clsx(styles.description, 'alert', 'alert--info')} role="alert">
            <Badge icon={EventStateButton.DRAFT} size={0.8} color={EventStateColor.DRAFT} />
            <Translate id="shiftEditor.description">
                Änderungen werden nur auf Entwürfe angewandt. Betroffene Termine:
            </Translate>
            <Badge text={`${props.count}`} size={0.8} color={EventStateColor.DRAFT} />
        </div>
    );
};

export default EditableDrafts;
