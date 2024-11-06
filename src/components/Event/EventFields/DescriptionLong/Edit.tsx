import React from 'react';
import clsx from 'clsx';
import styles from '../styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as Base } from '../iEventField';
import TextArea from '@site/src/components/shared/TextArea';

interface Props extends Base {
    displayMultiLine?: boolean;
}

const Edit = observer((props: Props) => {
    const { event } = props;
    return (
        <div
            style={{ gridColumn: 'descriptionLong' }}
            className={clsx(styles.descriptionLong, props.className, 'grid-descriptionLong')}
        >
            <TextArea
                text={event.descriptionLong}
                onChange={(text) => event.update({ descriptionLong: text })}
            />
        </div>
    );
});

export default Edit;
