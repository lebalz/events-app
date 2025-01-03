import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';

interface Props {
    children: ReactNode;
    className?: string;
    gridTemplateColumns?: string;
    slim?: boolean;
}

const DefinitionList = observer((props: Props) => {
    return (
        <dl
            className={clsx(
                styles.definitionList,
                props.slim && styles.slim,
                props.className,
                props.gridTemplateColumns && styles.ignoreMediaQueries
            )}
            style={{ gridTemplateColumns: props.gridTemplateColumns }}
        >
            {props.children}
        </dl>
    );
});

export default DefinitionList;
