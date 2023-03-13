import { action, computed, makeObservable, observable } from 'mobx';
import _ from 'lodash';
import { RootStore } from './stores';
import iStore from './iStore';
import {Semester as SemesterProps} from '../api/semester';
import Semester from '../models/Semester';

export class SemesterStore extends iStore<SemesterProps> {
    readonly API_ENDPOINT = 'semester';
    readonly root: RootStore;
    models = observable<Semester>([]);
    constructor(root: RootStore) {
        super();
        this.root = root;
        makeObservable(this);
    }

    createModel(data: SemesterProps): Semester {
        return new Semester(data, this);
    }

    @computed
    get semesters() {
        return this.models.slice().sort((a, b) => a.start.getTime() - b.start.getTime());
    }

    @action
    reload() {
        if (this.root.sessionStore.account) {
            this.load();
        }
    }
}
