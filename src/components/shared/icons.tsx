import React from 'react';
import { default as ReactIcon} from '@mdi/react';
import { mdiCalendarMonth, mdiCircleEditOutline, mdiTrashCan, mdiContentSave, mdiCloseCircle, mdiArrowRightCircle, mdiArrowLeftCircle, mdiSyncCircle, mdiCheckCircle, mdiLoading, mdiCircle } from '@mdi/js';
import { IconProps } from '@mdi/react/dist/IconProps';
import { ApiState } from '@site/src/stores/iStore';

export const SIZE = 1;
export const SIZE_S = 0.8;
export const SIZE_XS = 0.6;

interface IcoProps extends IconProps {
    disabled?: boolean;
}

type Props = Partial<IcoProps>;

export const Icon = (props: IcoProps) => {
    let color = props.disabled ? 'var(--ifm-color-disabled)' : props.color;
    switch (color) {
        case 'primary':
            color = 'var(--ifm-color-primary)';
            break;
        case 'secondary':
        case 'gray':
            color = 'var(--ifm-color-secondary)';
            break;
        case 'success':
        case 'green':
            color = 'var(--ifm-color-success)';
            break;
        case 'error':
        case 'red':
            color = 'var(--ifm-color-danger)';
            break;
        case 'warning':
        case 'orange':
            color = 'var(--ifm-color-warning)';
            break;
        case 'info':
        case 'lightBlue':
        case 'light-blue':
            color = 'var(--ifm-color-info)';
            break;
        case 'blue':
            color = 'var(--ifm-color-blue)';
            break;
    }
    console.log(props.color, color);
    return (
        <ReactIcon {...props} color={color} size={props.size ?? SIZE} />
    );
};

export const EditIcon = (props: Props) => {
    return (
        <Icon path={mdiCircleEditOutline} {...props} />
    );
}; 

export const DeleteIcon = (props: Props) => {
    return (
        <Icon path={mdiTrashCan} color={'var(--ifm-color-danger)'} {...props} />
    );
}; 

export const SaveIcon = (props: Props) => {
    return (
        <Icon path={mdiContentSave} color={'var(--ifm-color-success)'} {...props} />
    );
}; 

export const DiscardIcon = (props:Props) => {
    return (
        <Icon path={mdiCloseCircle} {...props} />
    );
};

export const ArrowRight = (props:Props) => {
    return (
        <Icon path={mdiArrowRightCircle} {...props} />
    );
};
export const ArrowLeft = (props:Props) => {
    return (
        <Icon path={mdiArrowLeftCircle} {...props} />
    );
};

export const Calendar = (props:Props) => {
    return (
        <Icon path={mdiCalendarMonth} {...props} />
    );
};

export const Sync = (props:Props) => {
    return (
        <Icon path={mdiSyncCircle} horizontal {...props} />
    );
};

export const Idle = (props:Props) => {
    return (
        <Icon path={mdiCircle} color="var(--ifm-color-secondary)" {...props} />
    );
};

export const Loading = (props:Props) => {
    return (
        <Icon path={mdiLoading} horizontal spin color={'var(--ifm-color-primary)'} {...props} />
    );
};

export const Error = (props:Props) => {
    return (
        <Icon path={mdiCloseCircle} color={'var(--ifm-color-danger)'} {...props} />
    );
};


export const Success = (props:Props) => {
    return (
        <Icon path={mdiCheckCircle} color={'var(--ifm-color-success)'} {...props} />
    );
};


export const ApiIcon: {[key in ApiState]: (props?: Partial<IconProps>) => JSX.Element} = {
    [ApiState.IDLE]: (props: Partial<IconProps> = {}) => <Idle {...props} />,
    [ApiState.LOADING]: (props: Partial<IconProps> = {}) => <Loading {...props} />,
    [ApiState.ERROR]: (props: Partial<IconProps> = {}) => <Error {...props} />,
    [ApiState.SUCCESS]: (props: Partial<IconProps> = {}) => <Success {...props} />
}