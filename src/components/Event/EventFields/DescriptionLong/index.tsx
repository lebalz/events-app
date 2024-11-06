import React from 'react';
import clsx from 'clsx';
import styles from '../styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as Base } from '../iEventField';
import Edit from './Edit';

interface Props extends Base {
    displayMultiLine?: boolean;
}

const DescriptionLong = observer((props: Props) => {
    const { event } = props;
    if (event.isEditable && event.isEditing) {
        return <Edit {...props} />;
    }
    const displayMultiline = event.isExpanded || props.displayMultiLine;
    return (
        <div
            style={{ gridColumn: 'descriptionLong' }}
            className={clsx(
                styles.descriptionLong,
                props.className,
                displayMultiline && styles.multiline,
                'grid-descriptionLong'
            )}
        >
            {displayMultiline ? (
                <>
                    {(event.descriptionLong || '-').split('\n').map((text, index) => (
                        <div key={index} className={clsx(styles.line)}>
                            {text}
                        </div>
                    ))}
                </>
            ) : (
                <>{(event.descriptionLong || '-').replace(/\n/g, ' ')}</>
            )}
        </div>
    );
});

export default DescriptionLong;
