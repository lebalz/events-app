import React from 'react';
import Icon from '@mdi/react';
import { mdiCalendarMonth, mdiCircleEditOutline, mdiTrashCan, mdiContentSave, mdiCloseCircle, mdiArrowRightCircle, mdiArrowLeftCircle, mdiSyncCircle, mdiCheckCircle, mdiLoading, mdiCircle } from '@mdi/js';
import { IconProps } from '@mdi/react/dist/IconProps';
import { ApiState } from '@site/src/stores/iStore';

export const SIZE = 1;
export const SIZE_S = 0.8;
export const SIZE_XS = 0.6;

export const EditIcon = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiCircleEditOutline} size={SIZE} {...props} />
    );
}; 

export const DeleteIcon = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiTrashCan} size={SIZE} color="var(--ifm-color-danger)" {...props} />
    );
}; 

export const SaveIcon = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiContentSave} size={SIZE} color="var(--ifm-color-success)" {...props} />
    );
}; 

export const DiscardIcon = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiCloseCircle} size={SIZE} {...props} />
    );
};

export const ArrowRight = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiArrowRightCircle} size={SIZE} {...props} />
    );
};
export const ArrowLeft = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiArrowLeftCircle} size={SIZE} {...props} />
    );
};

export const Calendar = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiCalendarMonth} size={SIZE} {...props} />
    );
};

export const Idle = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiCircle} size={SIZE} color="var(--ifm-color-secondary)" {...props} />
    );
};

export const Loading = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiLoading} size={SIZE} horizontal spin color="var(--ifm-color-primary)" {...props} />
    );
};

export const Error = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiCloseCircle} size={SIZE} color="var(--ifm-color-error)" {...props} />
    );
};


export const Success = (props: Partial<IconProps>) => {
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