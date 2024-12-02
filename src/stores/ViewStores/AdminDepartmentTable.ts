import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { ViewStore } from '.';
import Department from '@site/src/models/Department';
import _ from 'lodash';
class AdminDepartmentTable {
    private readonly store: ViewStore;
    @observable accessor sortColumn: 'name' | 'color' | 'createdAt' | 'updatedAt' | 'letter' = 'letter';
    @observable accessor sortDirection: 'asc' | 'desc' = 'asc';
    constructor(store: ViewStore) {
        this.store = store;
    }

    @computed
    get departments(): Department[] {
        return _.orderBy(
            this.store.root.departmentStore.departments,
            [(d) => d.pristine[this.sortColumn]],
            [this.sortDirection]
        );
    }

    @action
    setSortColumn(column: 'name' | 'color' | 'createdAt' | 'updatedAt' | 'letter'): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
    }
}

export default AdminDepartmentTable;
