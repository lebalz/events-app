
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { ViewStore } from '.';
import User from '@site/src/models/User';
import _ from 'lodash';

class AdminUserTable {
    private readonly store: ViewStore;
    @observable
    sortColumn: 'id' | 'email' | 'shortName' | 'role' | 'createdAt' | 'updatedAt' = 'email';
    @observable
    sortDirection: 'asc' | 'desc' = 'asc';
    constructor(store: ViewStore) {
        this.store = store;
        makeObservable(this);
    }

    @computed
    get users(): User[] {
        return _.orderBy(this.store.root.userStore.models, [this.sortColumn], [this.sortDirection]);
    }

    @action
    setSortColumn(column: 'id' | 'email' | 'shortName' | 'role' | 'createdAt' | 'updatedAt'): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
    }
}
export default AdminUserTable;