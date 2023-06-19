import { action, computed, makeObservable, observable } from 'mobx';
import { ViewStore } from '.';
import _ from 'lodash';


interface Cell<T> {
    value: string | number;
    component?: React.ReactNode;
    className?: string;
    maxWidth?: string;
    width?: string;
    rowName: keyof T;
    gridColumn?: number;
}

export interface DataItem<T> {
    id: string | number;
}


export interface ComponentProps<T> {
    type: 'group' | 'item';
}

export interface GroupProps<T> extends ComponentProps<T> {
    type: 'group';
    items: T[];
}
export interface ItemProps<T> extends ComponentProps<T> {
    type: 'item';
    item: T;
}

interface ColumnProps<T> {
    label: string;
    render?: (item: T) => React.JSX.Element;
    component?: React.ReactNode;
    className?: string;
    maxWidth?: string;
    width?: string;
    sortable?: boolean;
    transform?: (item: T) => string | number;
}

type ColumnConfig<T> = {
    [key in keyof T]?: ColumnProps<T>;
}

type RawColumnConfig<T> = {
    [key: string]: ColumnProps<T> & {transform: (item: T) => string | number};
}

interface ConfigProps<T> {
    sortColumn?: keyof T;
    sortDirection?: 'asc' | 'desc';
    columns: RawColumnConfig<T> | ColumnConfig<T>;
    groupBy?: keyof T;
    batchSize?: number;
}

export class DataRow<T> {
    readonly store: Config<T>;

    @observable.ref
    model: T & DataItem<T>;
    readonly type: 'item' = 'item';

    constructor(model: T & DataItem<T>, store: Config<T>) {
        this.store = store;
        this.model = model;
        makeObservable(this);
    }

    @computed
    get id() {
        return this.model.id;
    }

    @computed
    get cells(): Cell<T>[] {
        return (Object.keys(this.config.columns) as (keyof T)[]).map((key) => {
            const col = this.config.columns[key as string];
            const value = col.transform ? col.transform(this.model) : this.model[key] as string | number;
            return {
                value: value,
                component: col.render ? col.render(this.model) : undefined,
                rowName: key,
                className: col.className,
                maxWidth: col.maxWidth,
                width: col.width,
                gridColumn: this.store.colIndices.get(key)?.index,
            }
        });
    }

    @computed
    get config() {
        return this.store.config;
    }
}

export class GroupRow<T> {
    readonly store: Config<T>;
    @observable.ref
    models: DataRow<T>[];

    @observable
    expanded = false;
    
    readonly type: 'group' = 'group';
    constructor(models: DataRow<T>[], store: Config<T>) {
        this.store = store;
        this.models = models;
        makeObservable(this);
    }

    @action
    setExpanded(expanded: boolean) {
        this.expanded = expanded;
    }


    @computed
    get config() {
        return this.store.config;
    }
}

export class Config<T> {
    private readonly store: TableData;


    @observable
    config: ConfigProps<T>;

    @observable.ref
    data: DataRow<T>[];
    constructor(data: (T & DataItem<T>)[], config: ConfigProps<T>, store: TableData) {
        this.store = store;
        this.config = config;
        this.data = data.map((item) => new DataRow(item, this));
        makeObservable(this);
    }

    @computed
    get header() {
        return this.config.columns;
    }

    @computed
    get colIndices() {
        const templateColumns = new Map<keyof T, {index: number, style: React.CSSProperties}>();
        (Object.keys(this.header) as (keyof T)[]).forEach((key, idx) => {
            const value = this.header[key as string];
            templateColumns.set(key, {index: idx + 1, style: {maxWidth: value.maxWidth, width: value.width}});
        });
        return Object.freeze(templateColumns);
    }


    @computed
    get columnSize(): number {
        return Object.keys(this.config.columns).length;
    }

    @action
    setSortColumn(column: keyof T): void {
        if (this.config.sortColumn === column) {
            this.config.sortDirection = this.config.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.config.sortColumn = column;
            this.config.sortDirection = 'asc';
        }
        console.log('setSortColumn', column, this.config.sortDirection);
    }

    @computed
    get items(): DataRow<T>[] {
        if (!this.config.sortColumn) {
            return this.data;
        }
        return _.orderBy(this.data, [(r) => r.model[this.config.sortColumn]], [this.config.sortDirection ?? 'asc']);
    }

    @computed
    get rows(): (DataRow<T> | GroupRow<T>)[] {
        if (!this.config.groupBy && !this.config.batchSize) {
            return this.items;
        }
        const grouped = new Map<string, DataRow<T>[]>();
        this.items.forEach((item, idx) => {
            if (this.config.groupBy) {
                const key = item.model[this.config.groupBy] as string;
                if (!grouped.has(key)) {
                    grouped.set(key, []);
                }
                grouped.get(key)?.push(item);
            } else if (this.config.batchSize) {
                const key = `b-${Math.floor(idx / this.config.batchSize)}`;
                if (!grouped.has(key)) {
                    grouped.set(key, []);
                }
                grouped.get(key)?.push(item);
            }
        });
        return [...grouped.keys()].map((key, idx) => {
            return new GroupRow(grouped.get(key) || [], this);
        });
        // if (this.config.groupBy) {
        //     const groups = _.groupBy(this.items, this.config.groupBy);
        // }
        // return this.data.map((item) => {
        //     if (item._transformer) {
        //         return item._transformer(item);
        //     }

        //     return (Object.keys(this.config.columns) as (keyof T)[]).reduce((acc, key) => {
        //         const column = this.config.columns[key];
        //         if (column.transform) {
        //             acc[key] = column.transform(item);
        //         } else {
        //             acc[key] = {
        //                 value: item[key] as string | number,
        //             };
        //         }
        //         return acc;
        //     }, {} as Row<T>);
        // });
    }

}


class TableData {
    private readonly store: ViewStore;

    tables = observable.map<string, Config<any>>();

    constructor(store: ViewStore) {
        this.store = store;
        makeObservable(this);
    }

    @action
    register<T>(id: string, data: (T & DataItem<T>)[], config: ConfigProps<T>): Config<T> {
        const tableConfig = new Config(data, config, this);
        this.tables.set(id, tableConfig);
        return tableConfig;
    }

    @action
    unregister(id: string): void {
        this.tables.delete(id);
    }

}

export default TableData;