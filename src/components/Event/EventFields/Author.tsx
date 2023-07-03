import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { ReadonlyProps } from './iEventField';
import Badge from '@site/src/components/shared/Badge';

const Author = observer((props: ReadonlyProps) => {
    const { event } = props;
    return (
        <div 
            style={{gridColumn: 'author'}} 
            className={clsx('author', styles.author, props.className, 'grid-author')}
        >
            <Badge text={(props.event.author?.shortName || props.event.author?.email) ?? '-'}/>
        </div>
    )
});

export default Author;