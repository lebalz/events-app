import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { ViewStore } from '.';
import User from '@site/src/models/User';
import _ from 'es-toolkit/compat';

type SortColumn =
    | 'id'
    | 'email'
    | 'shortName'
    | 'authProviders'
    | 'role'
    | 'createdAt'
    | 'updatedAt'
    | 'notifyOnEventUpdate';

class AdminUserTable {
    private readonly store: ViewStore;
    @observable accessor sortColumn: SortColumn = 'email';
    @observable accessor sortDirection: 'asc' | 'desc' = 'asc';

    @observable accessor _filter = '';

    constructor(store: ViewStore) {
        this.store = store;
    }

    @computed
    get users(): User[] {
        const models = this.filter
            ? this.store.root.userStore.models.filter((user) => {
                  return (
                      user.email.includes(this.filter) || user.shortName?.toLowerCase()?.includes(this.filter)
                  );
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
    setSortColumn(column: SortColumn): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
    }
}
export default AdminUserTable;
