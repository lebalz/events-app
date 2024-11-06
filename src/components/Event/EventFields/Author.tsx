import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import Badge from '@site/src/components/shared/Badge';

const Author = observer((props: ReadonlyProps) => {
    const { event } = props;
    return (
        <div
            style={{ gridColumn: 'author' }}
            className={clsx('author', styles.author, props.className, 'grid-author')}
        >
            <Badge text={(event.author?.shortName || event.author?.email) ?? '-'} />
        </div>
    );
});

export default Author;
