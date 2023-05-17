import { default as EventModel } from '@site/src/models/Event';

interface CommonProps {
    event: EventModel;
    expandeable?: boolean;
    className?: string;
    styles: { [className: string]: string };
}
export interface ReadonlyProps extends CommonProps {
    isEditable?: false;
}

export interface Props extends CommonProps {
    isEditable?: boolean;
}