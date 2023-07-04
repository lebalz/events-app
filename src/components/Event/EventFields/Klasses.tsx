import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import Badge from '@site/src/components/shared/Badge';

interface Props extends CommonProps {
    isEditGrid?: boolean; /** true when at least one element of the grid is edited */
}

const Klasses = observer((props: Props) => {
    const { event } = props;
    return (
        <div 
            style={{ gridColumn: 'classes' }} 
            className={clsx(props.className, styles.classes, props.isEditGrid && styles.editGrid, event.isExpanded && styles.expanded)}
        >
            <div className={clsx(styles.tags)}>
                {
                    event.fClasses.map((c, idx) => {
                        const color = c.classes.length === 0 ? 'red' : 'gray';
                        return (<Badge key={idx} text={c.text} title={c.classes.map(cl => cl.displayName).join(', ')} color={color} />);
                    })
                }
                {
                    event._unknownClassGroups.map((cg) => {
                        return (<Badge key={cg} text={`${cg}*`} color="red" />);
                    })
                }
            </div>
        </div>
    )
});

export default Klasses;