import React from 'react';
import Icon from '@mdi/react';
import { mdiCalendarMonth, mdiCircleEditOutline, mdiTrashCan, mdiContentSave, mdiCloseCircle, mdiArrowRightCircle, mdiArrowLeftCircle, mdiSyncCircle, mdiCheckCircle, mdiLoading, mdiCircle } from '@mdi/js';
import { IconProps } from '@mdi/react/dist/IconProps';
import { ApiState } from '@site/src/stores/iStore';

export const SIZE = 1;
export const SIZE_S = 0.8;
export const SIZE_XS = 0.6;

interface Props extends Partial<IconProps> {
    disabled?: boolean;
}

export const EditIcon = (props:Props) => {
    return (
        <Icon path={mdiCircleEditOutline} size={SIZE} color={props.disabled && 'var(--ifm-color-disabled)'} {...props} />
    );
}; 

export const DeleteIcon = (props:Props) => {
    const color = props.disabled ? 'var(--ifm-color-disabled)' : 'var(--ifm-color-danger)'
    return (
        <Icon path={mdiTrashCan} size={SIZE} color={color} {...props} />
    );
}; 

export const SaveIcon = (props:Props) => {
    const color = props.disabled ? 'var(--ifm-color-disabled)' : 'var(--ifm-color-success)'

    return (
        <Icon path={mdiContentSave} size={SIZE} color={color} {...props} />
    );
}; 

export const DiscardIcon = (props:Props) => {
    return (
        <Icon path={mdiCloseCircle} size={SIZE} color={props.disabled && 'var(--ifm-color-disabled)'} {...props} />
    );
};

export const ArrowRight = (props:Props) => {
    return (
        <Icon path={mdiArrowRightCircle} size={SIZE} color={props.disabled && 'var(--ifm-color-disabled)'} {...props} />
    );
};
export const ArrowLeft = (props:Props) => {
    return (
        <Icon path={mdiArrowLeftCircle} size={SIZE} color={props.disabled && 'var(--ifm-color-disabled)'} {...props} />
    );
};

export const Calendar = (props:Props) => {
    return (
        <Icon path={mdiCalendarMonth} size={SIZE} color={props.disabled && 'var(--ifm-color-disabled)'} {...props} />
    );
};

export const Idle = (props:Props) => {
    return (
        <Icon path={mdiCircle} size={SIZE} color="var(--ifm-color-secondary)" {...props} />
    );
};

export const Loading = (props:Props) => {
    return (
        <Icon path={mdiLoading} size={SIZE} horizontal spin color="var(--ifm-color-primary)" {...props} />
    );
};

export const Error = (props:Props) => {
    return (
        <Icon path={mdiCloseCircle} size={SIZE} color="var(--ifm-color-error)" {...props} />
    );
};


export const Success = (props:Props) => {
    return (
        <Icon path={mdiCheckCircle} size={SIZE} color="var(--ifm-color-success)" {...props} />
    );
};


export const ApiIcon: {[key in ApiState]: (props?: Partial<IconProps>) => JSX.Element} = {
    [ApiState.IDLE]: (props: Partial<IconProps> = {}) => <Idle {...props} />,
    [ApiState.LOADING]: (props: Partial<IconProps> = {}) => <Loading {...props} />,
    [ApiState.ERROR]: (props: Partial<IconProps> = {}) => <Error {...props} />,
    [ApiState.SUCCESS]: (props: Partial<IconProps> = {}) => <Success {...props} />
}