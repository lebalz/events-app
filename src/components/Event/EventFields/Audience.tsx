import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { Props } from './iEventField';
import Badge from '@site/src/components/shared/Badge';
import AudiencePicker from '@site/src/components/shared/AudiencePicker';
import { KlassName } from '@site/src/models/helpers/klassNames';

const Audience = observer((props: Props) => {
    const { event, styles } = props;
    if (props.isEditable && props.event.editing) {
        return (
            <div
                style={{ gridColumnStart: 'departments', gridColumnEnd: 'classesEnd' }}
                className={clsx(styles.audience, 'grid-audience', props.className)}
            >
                <AudiencePicker event={event} />
            </div>
        )
    }
    const unknownClassNames = new Set(event._unknownClassNames);
    return (
        <React.Fragment>
            <div
                style={{ gridColumn: 'departments' }}
                className={clsx(props.className, styles.departments, 'grid-departments')}
            >
                <div className={clsx(styles.tags)}>
                    {
                        event.departments.map((d, idx) => {
                            return (<Badge key={idx} text={d.shortName} color={d.color} />);
                        })
                    }
                </div>
            </div>
            <div style={{ gridColumn: 'classes' }} className={clsx(props.className, styles.classes)}>
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