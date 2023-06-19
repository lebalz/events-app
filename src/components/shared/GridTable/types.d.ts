export type ColumnDefinition = {
    [key: string]: {
        label: string;
        sortable?: boolean;
        component?: React.ReactNode;
        className?: string;
        maxWidth?: string;
        width?: string;
    };
};

export interface Cell {
    value: string | number;
    span?: number;
    component?: React.ReactNode;
    className?: string;
}

export type Row = {
    [column in keyof ColumnDefinition]: Cell;
};

export interface DataItem {
    id: string | number;
    _component?: React.ReactNode;
    _transformer?: (item: unknown) => Row;
}
