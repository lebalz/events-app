import { action, computed, makeObservable, observable } from 'mobx';
import { ViewStore } from '.';
import _ from 'lodash';


interface Cell<T> {
    value: string | number;
    component?: React.ReactNode;
    hidden: boolean,
    colSpan: number,
    className?: string;
    maxWidth?: string;
    width?: string;
    rowName: keyof T;
    gridColumn?: number;
    fixed?: { right: number, left?: undefined } | { left: number, right?: undefined };
}

export interface DataItem {
    id: string | number;
}


export interface ComponentProps {
    type: 'group' | 'item';
}

export interface GroupProps<T> extends ComponentProps {
    type: 'group';
    items: T[];
}
export interface ItemProps<T> extends ComponentProps {
    type: 'item';
    item: T;
}

interface ColumnProps<T> {
    label: string | React.ReactNode;
    render?: (item: T) => React.JSX.Element;
    colSpan?: (item: T) => number;
    hidden?: (item: T) => boolean;
    component?: React.ReactNode;
    className?: string;
    maxWidth?: string;
    width?: string;
    sortable?: boolean;
    fixed?: { right: number, left?: undefined } | { left: number, right?: undefined };
    transform?: (item: T) => string | number;
}
type ColumnConfig<T> = {
    [key in keyof T]?: ColumnProps<T>;
} | {
    [key: string]: ColumnProps<T>;
};

export interface ConfigProps<T> {
    sortColumn?: keyof T;
    sortDirection?: 'asc' | 'desc';
    columns: ColumnConfig<T>;
    groupBy?: keyof T;
    batchSize?: number;
}

export class DataRow<T> {
    readonly store: Config<T>;

    @observable.ref
    model: T & DataItem;
    readonly type: 'item' = 'item';

    constructor(model: T & DataItem, store: Config<T>) {
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
        return (Object.keys(this.columnConfig) as (keyof T)[]).map((key, idx) => {
            const col = this.columnConfig[key as string] as ColumnProps<T>;
            const value = col.transform ? col.transform(this.model) : this.model[key] as string | number;
            const component = col.render ? col.render(this.model) : undefined;
            const colSpan = col.colSpan ? col.colSpan(this.model) : 1;
            const hidden = col.hidden ? col.hidden(this.model) : false;
            let width = col.width;
            if (!hidden && colSpan > 1) {
                const spannedWidths = this.store.columnWidths.slice(idx, idx + colSpan);
                if (spannedWidths.some((w) => w === undefined)) {
                    width = undefined;
                } else {
                    width = `calc(${spannedWidths.join(' + ')})`
                }
            }
            return {
                value: value,
                component: component,
                rowName: key,
                className: col.className,
                maxWidth: col.maxWidth,
                width: width,
                fixed: col.fixed,
                gridColumn: this.store.colIndices.get(key)?.index,
                hidden: hidden,
                colSpan: colSpan,
            }
        });
    }

    get columnConfig() {
        return this.config.columns;
    }

    get columnKeys() {
        return [...Object.keys(this.config.columns)];
    }

    @computed
    get config() {
        return this.store.config;
    }
}

export class GroupRow<T> {
    readonly store: Config<T>;
    models = observable.array<DataRow<T>>([], { deep: false });

    @observable
    expanded = false;

    @observable
    inView = false;

    readonly type: 'group' = 'group';
    constructor(models: DataRow<T>[], store: Config<T>) {
        this.store = store;
        this.models.replace(models);
        makeObservable(this);
    }

    @action
    setModels(models: DataRow<T>[]) {
        this.models.replace(models);
    }

    @action
    setExpanded(expanded: boolean) {
        this.expanded = expanded;
    }

    @action
    setInView(inView: boolean) {
        this.inView = inView;
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

    data = observable<DataRow<T>>([]);
    grouped = observable<GroupRow<T>>([]);
    constructor(data: (T & DataItem)[], config: ConfigProps<T>, store: TableData) {
        this.store = store;
        this.config = {
            columns: config.columns,
            sortColumn: config.sortColumn,
            sortDirection: config.sortDirection,
            groupBy: config.groupBy,
            batchSize: config.batchSize
        };
        this.data.replace(data.map((item) => new DataRow(item, this)));
        makeObservable(this);
    }

    @computed
    get columns() {
        return this.config.columns;
    }

    @computed
    get colIndices() {
        const templateColumns = new Map<keyof T, { index: number, style: React.CSSProperties }>();
        (Object.keys(this.columns) as (keyof T)[]).forEach((key, idx) => {
            const value = this.columns[key as string];
            templateColumns.set(key, { index: idx + 1, style: { maxWidth: value.maxWidth, width: value.width } });
        });
        return Object.freeze(templateColumns);
    }

    @computed
    get columnKeys() {
        return Object.freeze([...Object.keys(this.columns)]);
    }
    
    @computed
    get columnWidths() {
        return Object.values(this.columns).map((col) => col.width);
    }

    @action
    setData(data: (T & DataItem)[]): void {
        const newData = data.map((item) => new DataRow(item, this));
        const newIds = new Set(newData.map((item) => item.id));
        const oldIds = new Set(this.data.map((item) => item.id));
        const toRemove = this.data.filter((item) => !newIds.has(item.id));
        const toAdd = newData.filter((item) => !oldIds.has(item.id));
        toRemove.forEach((item) => this.data.remove(item));
        this.data.push(...toAdd);
        this.updateGroups();
    }

    @action
    updateConfig(config: ConfigProps<T>): void {
        if (config.columns) {
            this.config.columns = config.columns;
        }
        if (config.sortColumn) {
            this.config.sortColumn = config.sortColumn;
        }
        if (config.sortDirection) {
            this.config.sortDirection = config.sortDirection;
        }
        if (config.groupBy) {
            this.config.groupBy = config.groupBy;
        }
        if (config.batchSize) {
            this.config.batchSize = config.batchSize;
        }
        this.updateGroups();
    }


    @computed
    get columnCount(): number {
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
        this.updateGroups();
        console.log('setSortColumn', column, this.config.sortDirection);
    }

    @computed
    get items(): DataRow<T>[] {
        if (!this.config.sortColumn) {
            return this.data;
        }
        return _.orderBy(this.data, [(r) => r.model[this.config.sortColumn]], [this.config.sortDirection ?? 'asc']);
    }

    @action
    updateGroups() {
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
        const groups = [...grouped.values()];
        if (groups.length === 0) {
            this.grouped.clear();
        } else if (groups.length < this.grouped.length) {
            while (groups.length < this.grouped.length) {
                this.grouped.remove(this.grouped[this.grouped.length - 1]);
            }
        }
        let initial = false
        groups.forEach((group, idx) => {
            if (idx >= this.grouped.length) {
                this.grouped.push(new GroupRow(group, this));
            } else {
                this.grouped[idx].setModels(group);
                /** set everything above the current to visible */
                if (this.grouped[idx].inView) {
                    this.grouped[idx].setExpanded(true);
                    initial = true;
                } else {
                    /** and only after the last shown group, disable the (initial) render... */
                    this.grouped[idx].setExpanded(!initial);
                }
            }
        });
    }

    @computed
    get rows(): (DataRow<T> | GroupRow<T>)[] {
        if (!this.config.groupBy && !this.config.batchSize) {
            return this.items;
        }
        return this.grouped;
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
    register<T>(id: string, data: (T & DataItem)[], config: ConfigProps<T>): Config<T> {
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