import React from 'react';
import { default as ReactIcon } from '@mdi/react';
import {
    mdiCalendarMonth,
    mdiCircleEditOutline,
    mdiTrashCan,
    mdiContentSave,
    mdiCloseCircle,
    mdiArrowRightCircle,
    mdiArrowLeftCircle,
    mdiSyncCircle,
    mdiCheckCircle,
    mdiLoading,
    mdiCircle,
    mdiContentCopy,
    mdiClockTimeTwelveOutline,
    mdiClockTimeOneOutline,
    mdiClockTimeTwoOutline,
    mdiClockTimeThreeOutline,
    mdiClockTimeFourOutline,
    mdiClockTimeFiveOutline,
    mdiClockTimeSixOutline,
    mdiClockTimeSevenOutline,
    mdiClockTimeEightOutline,
    mdiClockTimeNineOutline,
    mdiClockTimeTenOutline,
    mdiClockTimeElevenOutline,
    mdiContentSavePlus,
    mdiCalendarEditOutline
} from '@mdi/js';
import { IconProps } from '@mdi/react/dist/IconProps';
import { ApiState } from '@site/src/stores/iStore';

export const SIZE = 1;
export const SIZE_S = 0.8;
export const SIZE_XS = 0.6;
export const SIZE_XXS = 0.4;

interface IcoProps extends IconProps {
    disabled?: boolean;
}

type Props = Partial<IcoProps>;

/** nice tool to edit svg path: https://yqnn.github.io/svg-path-editor/ */
export const FilterSvgPath =
    'M 22 4.5 H 8.25 a 3.125 3.125 90 1 0 0 1.25 h 13.75 V 4.5 Z M 5.125 7 a 1.875 1.875 90 1 1 0 -3.75 a 1.875 1.875 90 0 1 0 3.75 Z m 13.75 8.75 a 3.125 3.125 90 0 0 -3.0625 2.5 H 2 v 1.25 h 13.8125 a 3.125 3.125 90 1 0 3.0625 -3.75 Z m 0 5 a 1.875 1.875 90 1 1 0 -3.75 a 1.875 1.875 90 0 1 0 3.75 Z M 22 11.375 h -6.9375 a 3.125 3.125 90 0 0 -6.125 0 H 2 v 1.25 h 6.9375 a 3.125 3.125 90 0 0 6.125 0 H 22 v -1.25 Z m -10 2.5 a 1.875 1.875 90 1 1 0 -3.75 a 1.875 1.875 90 0 1 0 3.75 Z' as const;

export const CalendarCheckPartial =
    'M19 19H5V8H19M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19A2 2 0 005 21H19A2 2 0 0021 19V5A2 2 0 0019 3M16.53 11.06 15.47 10 10.59 14.88 8.47 12.76 7.41 13.82 10.59 17 16.53 11.06ZM7.93 8.553a.4998.4165 90 01.482 1.035c-.226.206-.144.123-.254.1962a4.2504 3.542 90 00-.509.6698C7.052 11.216 6.742 12.103 6.825 13.464c0 1.1208.3395 2.1204.9105 2.9898.202.3078.419.576.635.8022.127.1332.223.2208.272.2604a.4998.4165 90 11-.467.828c-.3615-.2204-.7115-.5504-1.2275-1.2314C6.11 16.0428 5.7 14.8344 5.7 13.4676c0-1.5498.412-2.8062 1.099-3.78.415-.5886.835-.9552 1.1315-1.134ZM16.07 18.447a.4998.4165 270 01-.374-.894c.0425-.0258.1325-.09.254-.1962a4.2504 3.542 270 00.615-.69C17.1285 15.8676 17.4665 14.8374 17.4665 13.533c0-1.1208-.3395-2.1204-.9105-2.9898-.202-.3078-.419-.576-.635-.8022-.127-.1332-.223-.2208-.272-.2604a.4998.4165 270 11.619-.8006c.283.2292.6895.6552 1.217 1.341C18.021 10.907 18.536 11.814 18.557 13.402c0 1.5498-.412 2.8062-1.099 3.78-.415.5886-.835.9552-1.1315 1.134Z' as const;

export const Timeline =
    'M 2 2 H 4 V 20 H 22 V 22 H 2 V 2 M 7 10 H 17 V 13 H 7 V 10 M 11 15 H 21 V 18 H 11 V 15 M 6 5 H 21 V 8 H 6 Z' as const;

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
    return <ReactIcon {...props} color={color} size={props.size ?? SIZE} />;
};

export const EditVersionIcon = (props: Props) => {
    return <Icon path={mdiCalendarEditOutline} {...props} />;
};

export const EditIcon = (props: Props) => {
    return <Icon path={mdiCircleEditOutline} {...props} />;
};

export const Copy = (props: Props) => {
    return <Icon path={mdiContentCopy} {...props} />;
};

export const DeleteIcon = (props: Props) => {
    return <Icon path={mdiTrashCan} {...props} />;
};

mdiContentSavePlus;
export const SaveVersionIcon = (props: Props) => {
    return <Icon path={mdiContentSavePlus} {...props} />;
};

export const SaveIcon = (props: Props) => {
    return <Icon path={mdiContentSave} {...props} />;
};

export const DiscardIcon = (props: Props) => {
    return <Icon path={mdiCloseCircle} {...props} />;
};

export const ArrowRight = (props: Props) => {
    return <Icon path={mdiArrowRightCircle} {...props} />;
};
export const ArrowLeft = (props: Props) => {
    return <Icon path={mdiArrowLeftCircle} {...props} />;
};

export const Calendar = (props: Props) => {
    return <Icon path={mdiCalendarMonth} {...props} />;
};

export const Sync = (props: Props) => {
    return <Icon path={mdiSyncCircle} horizontal {...props} />;
};

export const Idle = (props: Props) => {
    return <Icon path={mdiCircle} color="var(--ifm-color-secondary)" {...props} />;
};

export const Loading = (props: Props) => {
    return <Icon path={mdiLoading} horizontal spin color={'var(--ifm-color-primary)'} {...props} />;
};

export const Error = (props: Props) => {
    return <Icon path={mdiCloseCircle} color={'var(--ifm-color-danger)'} {...props} />;
};

export const Success = (props: Props) => {
    return <Icon path={mdiCheckCircle} color={'var(--ifm-color-success)'} {...props} />;
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
    11: mdiClockTimeElevenOutline
};
export const Clock = (props: Props & { hour: number }) => {
    return <Icon path={TimePathes[props.hour % 12]} {...props} />;
};

export const ApiIcon = (props: { state: ApiState } & Partial<IconProps>) => {
    switch (props.state) {
        case ApiState.IDLE:
            return <Idle {...props} />;
        case ApiState.LOADING:
            return <Loading {...props} />;
        case ApiState.ERROR:
            return <Error {...props} />;
        case ApiState.SUCCESS:
            return <Success {...props} />;
    }
};
