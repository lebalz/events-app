import React from 'react';
import { default as ReactIcon} from '@mdi/react';
import { mdiCalendarMonth, mdiCircleEditOutline, mdiTrashCan, mdiContentSave, mdiCloseCircle, mdiArrowRightCircle, mdiArrowLeftCircle, mdiSyncCircle, mdiCheckCircle, mdiLoading, mdiCircle, mdiContentCopy, mdiClockTimeTwelveOutline, mdiClockTimeOneOutline, mdiClockTimeTwoOutline, mdiClockTimeThreeOutline, mdiClockTimeFourOutline, mdiClockTimeFiveOutline, mdiClockTimeSixOutline, mdiClockTimeSevenOutline, mdiClockTimeEightOutline, mdiClockTimeNineOutline, mdiClockTimeTenOutline, mdiClockTimeElevenOutline } from '@mdi/js';
import { IconProps } from '@mdi/react/dist/IconProps';
import { ApiState } from '@site/src/stores/iStore';

export const SIZE = 1;
export const SIZE_S = 0.8;
export const SIZE_XS = 0.6;

interface IcoProps extends IconProps {
    disabled?: boolean;
}

type Props = Partial<IcoProps>;

/** nice tool to edit svg path: https://yqnn.github.io/svg-path-editor/ */
export const filterSvgPath = 'M 22 4.5 H 8.25 a 3.125 3.125 90 1 0 0 1.25 h 13.75 V 4.5 Z M 5.125 7 a 1.875 1.875 90 1 1 0 -3.75 a 1.875 1.875 90 0 1 0 3.75 Z m 13.75 8.75 a 3.125 3.125 90 0 0 -3.0625 2.5 H 2 v 1.25 h 13.8125 a 3.125 3.125 90 1 0 3.0625 -3.75 Z m 0 5 a 1.875 1.875 90 1 1 0 -3.75 a 1.875 1.875 90 0 1 0 3.75 Z M 22 11.375 h -6.9375 a 3.125 3.125 90 0 0 -6.125 0 H 2 v 1.25 h 6.9375 a 3.125 3.125 90 0 0 6.125 0 H 22 v -1.25 Z m -10 2.5 a 1.875 1.875 90 1 1 0 -3.75 a 1.875 1.875 90 0 1 0 3.75 Z';

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
    return (
        <ReactIcon {...props} color={color} size={props.size ?? SIZE} />
    );
};

export const EditIcon = (props: Props) => {
    return (
        <Icon path={mdiCircleEditOutline} {...props} />
    );
}; 

export const Copy = (props: Props) => {
    return (
        <Icon path={mdiContentCopy} {...props} />
    );
}; 

export const DeleteIcon = (props: Props) => {
    return (
        <Icon path={mdiTrashCan} {...props} />
    );
}; 

export const SaveIcon = (props: Props) => {
    return (
        <Icon path={mdiContentSave} {...props} />
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

const TimePathes = {
    0: mdiClockTimeTwelveOutline,
    1: mdiClockTimeOneOutline,
    2: mdiClockTimeTwoOutline,
    3: mdiClockTimeThreeOutline,
    4: mdiClockTimeFourOutline,
    5: mdiClockTimeFiveOutline,
    6: mdiClockTimeSixOutline,
    7: mdiClockTimeSevenOutline,
    8: mdiClockTimeEightOutline,
    9: mdiClockTimeNineOutline,
    10: mdiClockTimeTenOutline,
    11: mdiClockTimeElevenOutline,
}
export const Clock = (props: Props & {hour: number}) => {
    return (
        <Icon path={TimePathes[props.hour % 12]} {...props} />
    );
};


export const ApiIcon: {[key in ApiState]: (props?: Partial<IconProps>) => JSX.Element} = {
    [ApiState.IDLE]: (props: Partial<IconProps> = {}) => <Idle {...props} />,
    [ApiState.LOADING]: (props: Partial<IconProps> = {}) => <Loading {...props} />,
    [ApiState.ERROR]: (props: Partial<IconProps> = {}) => <Error {...props} />,
    [ApiState.SUCCESS]: (props: Partial<IconProps> = {}) => <Success {...props} />
}