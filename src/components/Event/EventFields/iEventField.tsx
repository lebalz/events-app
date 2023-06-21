import { default as EventModel } from '@site/src/models/Event';

interface CommonProps {
    event: EventModel;
    expandeable?: boolean;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
export interface ReadonlyProps extends CommonProps {
    isEditable?: false;
}

export interface Props extends CommonProps {
    isEditable?: boolean;
}