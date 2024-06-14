import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

import { ReadonlyProps } from './iEventField';
import Popup from 'reactjs-popup';
import Button from '../../shared/Button';
import { mdiCloseCircle } from '@mdi/js';
import Badge from '../../shared/Badge';
import { Icon, SIZE_S } from '../../shared/icons';

const IsValid = observer((props: ReadonlyProps) => {
    const { event } = props;
    return (
        <div 
            style={{gridColumn: 'isValid'}} 
            className={clsx('isValid', styles.isValid, props.className, 'grid-isValid')}
            onClick={() => console.log(event.id, event._errors)}
        >
            {
                props.event.isValid
                ? ''
                : <Popup
                    trigger={(
                        <span>
                            <Button
                                icon={<Icon path={mdiCloseCircle} color="red" size={SIZE_S}/>}
                                size={SIZE_S}
                            />
                        </span>
                    )}
                    position="right center"
                    on="hover"
                    closeOnDocumentClick
                    >
                        <ul className={clsx(styles.errors)}>
                            {
                                (props.event._errors?.details || []).map((error, index) => (
                                    <li key={index}>{error.message}</li>
                                ))
                            }
                        </ul>
                    </Popup>
            }
        </div>
    )
});

export default IsValid;