import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';


interface Props {
    children: ReactNode;
    className?: string;
}

const DefinitionList = observer((props: Props) => {
    return (
        <dl className={clsx(styles.definitionList, props.className)}>
            {props.children}
        </dl>
    )
});

export default DefinitionList;