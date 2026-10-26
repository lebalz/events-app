import clsx from 'clsx';
import { type ReactNode } from 'react';

import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

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
