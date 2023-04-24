import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props } from './iEventField';
import TextArea from '@site/src/components/shared/TextArea';
import Badge from '@site/src/components/shared/Badge';
import AudiencePicker from '@site/src/components/shared/AudiencePicker';
import { useStore } from '@site/src/stores/hooks';

const Audience = observer((props: Props) => {
    const {event} = props;
    if (props.isEditable && props.event.editing) {
        return (
            <div
                style={{ gridColumnStart: 'departments', gridColumnEnd: 'classesEnd' }}
                className={clsx(props.className)}
            >
                <AudiencePicker event={event} />
            </div>
        )
    }
    return (
        <React.Fragment>
            <div 
                style={{gridColumn: 'departments'}} 
                className={clsx(props.className, styles.departments)}
            >{
                event.departmentNames.map((c, idx) => {
                    const badge = styles[c.toLowerCase()];
                    return (<Badge key={idx} text={c} className={badge} color={badge ? undefined : 'gray'} />);
                })
            }</div>
            <div style={{gridColumn: 'classes'}} className={clsx(props.className, styles.classes)}>{
                event.fClasses.map((c, idx) => {
                    return (<Badge key={idx} text={c} color="gray" />);
                })
            }</div>
        </React.Fragment>
    )
});

export default Audience;