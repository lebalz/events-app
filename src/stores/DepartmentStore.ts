import { action, makeObservable, observable } from 'mobx';
import _ from 'lodash';
import { RootStore } from './stores';
import iStore from './iStore';
import { computedFn } from 'mobx-utils';
import {Department as DepartmentProps, departments as fetchDepartments, find as loadDepartment, update, destroy} from '../api/department';
import Department from '../models/Department';

export class DepartmentStore implements iStore<Department> {
    private readonly root: RootStore;

    
    departments = observable<Department>([]);
    abortControllers = new Map<string, AbortController>();
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);
    }

    withSignal<T>(sigId: string, fn: (ct: AbortController) => Promise<T>) {
        const sig = new AbortController();
        if (this.abortControllers.has(sigId)) {
            this.abortControllers.get(sigId).abort();
        }
        this.abortControllers.set(sigId, sig);
        return fn(sig).finally(() => {
            if (this.abortControllers.get(sigId) === sig) {
                this.abortControllers.delete(sigId);
            }
        });
    }

    findDepartment = computedFn(
        function (this: DepartmentStore, id?: string): Department | undefined {
            if (!id) {
                return;
            }
            return this.departments.find((d) => d.id === id);
        },
        { keepAlive: true }
    )

    getEvents(department: Department) {
        return this.root.eventStore.events.filter((e) => e.departmentIds.includes(department.id));
    }

    @action
    addToStore(data: DepartmentProps): Department {
        const department = new Department(data, this);
        this.removeFromStore(data.id);
        this.departments.push(department);
        return department;
    }

    @action
    removeFromStore(id: string): Department {
        const old = this.findDepartment(id);
        if (old) {
            this.departments.remove(old);
        }
        return old;
    }

    @action
    reload() {
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

    @action
    load() {
        return this.withSignal('loadAll', (sig) => {
            return fetchDepartments(sig.signal)
                .then(
                    action(({ data }) => {
                        console.log('departments', data)
                        if (data) {
                            this.departments.replace(data.map((d) => new Department(d, this)));
                        }
                        return this.departments;
                    })
                )
        });
    }

    @action
    reset() {
        this.departments.clear();
    }

    @action
    loadDepartment(id: string) {
        this.withSignal(`load-${id}`, (sig) => {
            return loadDepartment(id, sig.signal);
        }).then(action(({data}) => {
            if(data) {
                this.addToStore(data);
            }
        }));
    }

    @action
    save(model: Department) {
        if (model.isDirty) {
            this.withSignal(`save-${model.id}`, (sig) => {
                return update(model.id, model.props, sig.signal);
            }).then(action(({data}) => {
                if (data) {
                    this.addToStore(data);
                }
            }));
        }
    }

    @action
    destroy(model: Department) {
        this.withSignal(`destroy-${model.id}`, (sig) => {
            return destroy(model.id, sig.signal);
        });
    }
}
