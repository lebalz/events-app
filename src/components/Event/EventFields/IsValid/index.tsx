import React from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import sharedStyles from '../styles.module.scss';

import { ReadonlyProps } from '../iEventField';
import Popup from 'reactjs-popup';
import Button from '../../../shared/Button';
import { mdiCloseCircle, mdiAlertCircle, mdiInformation, mdiCheckCircle } from '@mdi/js';
import { Icon, SIZE_S } from '../../../shared/icons';
import { ValidState } from '@site/src/models/Event';
import PopupContent from './PopupContent';

const StateIcon: { [key in ValidState]: string } = {
    [ValidState.Valid]: mdiCheckCircle,
    [ValidState.Error]: mdiCloseCircle,
    [ValidState.Warning]: mdiAlertCircle,
    [ValidState.Info]: mdiInformation
};

const StateColor: { [key in ValidState]: string } = {
    [ValidState.Valid]: 'green',
    [ValidState.Error]: 'red',
    [ValidState.Warning]: 'orange',
    [ValidState.Info]: 'blue'
};

const IsValid = observer((props: ReadonlyProps) => {
    const { event } = props;
    React.useEffect(() => {
        event.triggerInitialValidation();
    }, [event.componentKey]);
    return (
        <div
            style={{ gridColumn: 'isValid' }}
            className={clsx('isValid', sharedStyles.isValid, props.className, 'grid-isValid')}
            onClick={() => console.log(event.id, event._errors)}
        >
            {props.event.isValid ? (
                <>
                    {event.canTransition && !event.transitionAllowed.allowed && (
                        <Popup
                            closeOnEscape
                            closeOnDocumentClick
                            nested
                            trigger={
                                <span>
                                    <Button
                                        icon={
                                            <Icon
                                                path={StateIcon.INFO}
                                                color={StateColor.INFO}
                                                size={SIZE_S}
                                            />
                                        }
                                        size={SIZE_S}
                                    />
                                </span>
                            }
                            position="right center"
                            on="hover"
                        >
                            <PopupContent event={event} />
                        </Popup>
                    )}
                </>
            ) : (
                <Popup
                    closeOnEscape
                    closeOnDocumentClick
                    nested
                    trigger={
                        <span>
                            <Button
                                icon={
                                    <Icon
                                        path={StateIcon[event.validationState]}
                                        color={StateColor[event.validationState]}
                                        size={SIZE_S}
                                    />
                                }
                                size={SIZE_S}
                            />
                        </span>
                    }
                    position="right center"
                    on="hover"
                >
                    <PopupContent event={event} />
                </Popup>
            )}
        </div>
    );
});

export default IsValid;
