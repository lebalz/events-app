
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { ViewStore } from '.';
import User from '@site/src/models/User';
import _ from 'lodash';

class AdminUserTable {
    private readonly store: ViewStore;
    @observable
    sortColumn: 'id' | 'email' | 'shortName' | 'role' | 'createdAt' | 'updatedAt' | 'notifyOnEventUpdate' = 'email';
    @observable
    sortDirection: 'asc' | 'desc' = 'asc';

    @observable
    _filter = '';

    constructor(store: ViewStore) {
        this.store = store;
        makeObservable(this);
    }

    @computed
    get users(): User[] {
        const models = this.filter 
            ? this.store.root.userStore.models.filter((user) => {
                return user.email.includes(this.filter) || user.shortName?.toLowerCase()?.includes(this.filter);
            })
            : this.store.root.userStore.models;
        return _.orderBy(models, [this.sortColumn], [this.sortDirection]);
    }

    @computed
    get filter() {
        return this._filter.toLowerCase();
    }

    @action
    setTextFilter(text?: string): void {
        this._filter = text || '';
    }

    @action
    setSortColumn(column: 'id' | 'email' | 'shortName' | 'role' | 'createdAt' | 'updatedAt' | 'notifyOnEventUpdate'): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
    }
}
export default AdminUserTable;