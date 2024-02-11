import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Popup from '.';
import Icon from '@mdi/react';
import { mdiInformationOutline } from '@mdi/js';
import { SIZE_S } from '../icons';


interface Props {
    icon?: string;
    children: JSX.Element;
    size?: number;
    color?: string;
    paddingLeft?: string;
    maxWidth?: string;
    maxHeight?: string;
}

const InfoPopup = observer((props: Props) => {
    const [open, setOpen] = React.useState(false);
    return (
        <span style={{paddingLeft: props.paddingLeft}}>
            <Popup
                on='hover'
                trigger={
                    <span className={clsx(styles.trigger)}>
                        <Icon
                            path={props.icon || mdiInformationOutline}
                            size={props.size || SIZE_S}
                            color={open ? props.color || 'var(--ifm-color-primary)' : 'secondary'}
                            className={clsx(styles.infoIcon)}
                        />
                    </span>
                }
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                maxWidth={props.maxWidth}

            >
                {props.children}
            </Popup>
        </span>
    )
});

export default InfoPopup;