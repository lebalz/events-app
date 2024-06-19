import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

import { ReadonlyProps } from './iEventField';
import Popup from 'reactjs-popup';
import Button from '../../shared/Button';
import { mdiCloseCircle, mdiAlertCircle, mdiInformation, mdiCheckCircle } from '@mdi/js';
import Badge from '../../shared/Badge';
import { Icon, SIZE_S } from '../../shared/icons';
import { ValidState } from '@site/src/models/Event';

const StateIcon: {[key in ValidState]: string} = {
    [ValidState.Valid]: mdiCheckCircle,
    [ValidState.Error]: mdiCloseCircle,
    [ValidState.Warning]: mdiAlertCircle,
    [ValidState.Info]: mdiInformation
}

const StateColor: {[key in ValidState]: string} = {
    [ValidState.Valid]: 'green',
    [ValidState.Error]: 'red',
    [ValidState.Warning]: 'orange',
    [ValidState.Info]: 'blue'
}

const IsValid = observer((props: ReadonlyProps) => {
    const { event } = props;
    const errors = event._errors?.details || [];
    const warnings = event.meta?.warningsReviewed ? [] : (event.meta?.warnings || []);
    const infos = event.meta?.infosReviewed ? [] : (event.meta?.infos || []);

    return (
        <div
            style={{ gridColumn: 'isValid' }}
            className={clsx('isValid', styles.isValid, props.className, 'grid-isValid')}
            onClick={() => console.log(event.id, event._errors)}
        >
            {props.event.isValid ? (
                ''
            ) : (
                <Popup
                    trigger={
                        <span>
                            <Button
                                icon={(<Icon 
                                    path={StateIcon[event.validationState]} 
                                    color={StateColor[event.validationState]} 
                                    size={SIZE_S} 
                                />)}
                                size={SIZE_S}
                            />
                        </span>
                    }
                    position="right center"
                    on="hover"
                    closeOnDocumentClick
                >
                    {
                        errors.length > 0 && (
                            <ul className={clsx(styles.errors)}>
                                {errors.map((error, index) => (
                                    <li key={index}>{error.message}</li>
                                ))}
                            </ul>
                        )
                    }
                    {
                        warnings.length > 0 && (
                            <ul className={clsx(styles.warnings)}>
                                {warnings.map((warning, index) => (
                                    <li key={index}>{warning}</li>
                                ))}
                            </ul>
                        )
                    }
                    {
                        infos.length > 0 && (
                            <ul className={clsx(styles.infos)}>
                                {infos.map((info, index) => (
                                    <li key={index}>{info}</li>
                                ))}
                            </ul>
                        )
                    }
                </Popup>
            )}
        </div>
    );
});

export default IsValid;
