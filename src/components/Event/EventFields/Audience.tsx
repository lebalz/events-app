import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import Badge from '@site/src/components/shared/Badge';
import AudiencePicker from '@site/src/components/shared/AudiencePicker';
import { KlassName } from '@site/src/models/helpers/klassNames';
import SubjectSelector from './SubjectSelector';
import ErrorBoundary from '@docusaurus/ErrorBoundary';

interface Props extends CommonProps {
    isEditGrid?: boolean; /** true when at least one element of the grid is edited */
}

const Audience = observer((props: Props) => {
    const { event, styles } = props;
    if (props.isEditable && props.event.isEditing) {
        return (
            <div
                style={{ gridColumnStart: 'departments', gridColumnEnd: 'classesEnd' }}
                className={clsx(styles.audience, 'grid-audience', props.className)}
            >
                <AudiencePicker event={event} />
                {/* <SubjectSelector event={event} styles={styles}/> */}
            </div>
        )
    }
    const unknownClassNames = new Set(event._unknownClassNames);
    return (
        <React.Fragment>
            <div
                style={{ gridColumn: 'departments' }}
                className={clsx(props.className, styles.departments, 'grid-departments', props.isEditGrid && styles.editGrid)}
                onClick={() => props.expandeable && props.event.setExpanded(true)}
            >
                <div className={clsx(styles.tags)}>
                    {
                        event.departments.map((d, idx) => {
                            return (<Badge key={idx} text={d.shortName} color={d.color} />);
                        })
                    }
                </div>
            </div>
            <div 
                style={{ gridColumn: 'classes' }} 
                className={clsx(props.className, styles.classes, props.isEditGrid && styles.editGrid)}
                onClick={() => props.expandeable && props.event.setExpanded(true)}
            >
                <div className={clsx(styles.tags)}>
                    {
                        event.fClasses.map((c, idx) => {
                            const color = unknownClassNames.has(c as KlassName) ? 'red' : 'gray';
                            return (<Badge key={idx} text={c} color={color} />);
                        })

                    }
                </div>
            </div>
        </React.Fragment>
    )
});

export default Audience;