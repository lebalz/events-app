import React from 'react';
import Icon from '@mdi/react';
import { mdiCalendarMonth, mdiCircleEditOutline, mdiTrashCan, mdiContentSave, mdiCloseCircle, mdiArrowRightCircle, mdiArrowLeftCircle } from '@mdi/js';
import { IconProps } from '@mdi/react/dist/IconProps';

export const EditIcon = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiCircleEditOutline} size={1} {...props} />
    );
}; 

export const DeleteIcon = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiTrashCan} size={1} {...props} />
    );
}; 

export const SaveIcon = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiContentSave} size={1} {...props} />
    );
}; 

export const DiscardIcon = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiCloseCircle} size={1} {...props} />
    );
};

export const ArrowRight = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiArrowRightCircle} size={1} {...props} />
    );
};
export const ArrowLeft = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiArrowLeftCircle} size={1} {...props} />
    );
};

export const Calendar = (props: Partial<IconProps>) => {
    return (
        <Icon path={mdiCalendarMonth} size={1} {...props} />
    );
};
