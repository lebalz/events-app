import { default as EventModel } from '@site/src/models/Event';

interface CommonProps {
    event: EventModel;
    expandeable?: boolean;
    highlight?: (name: keyof EventModel, event: EventModel) => boolean;
    className?: string;
}
export interface ReadonlyProps extends CommonProps {
    isEditable?: boolean;
}

export interface Props extends CommonProps {
    isEditable?: boolean;
}
