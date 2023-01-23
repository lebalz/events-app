import { action, makeObservable, observable } from 'mobx';
import { teachers as fetchTeachers, UntisTeacher, sync as syncUntis } from '../api/untis';
import _ from 'lodash';
import axios from 'axios';
import Klass from '../models/Untis/Klass';
import Lesson from '../models/Untis/Lesson';
import Teacher from '../models/Untis/Teacher';
import { RootStore } from './stores';
import iStore from './iStore';
import { computedFn } from 'mobx-utils';

export class UntisStore implements iStore<UntisTeacher[]> {
    private readonly root: RootStore;
    classes = observable<Klass>([]);
    lessons = observable<Lesson>([]);
    teachers = observable<Teacher>([]);

    cancelToken = axios.CancelToken.source();
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);
    }

    

    findTeacher = computedFn(
        function (this: UntisStore, id?: number): Teacher | undefined {
            if (!id) {
                return;
            }
            return this.teachers.find((t) => t.id === id);
        },
        { keepAlive: true }
    )

    cancelRequest() {
        this.cancelToken.cancel();
        this.cancelToken = axios.CancelToken.source();
    }

    @action
    reload() {
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

    @action
    load() {
        return fetchTeachers(this.cancelToken)
            .then(
                action(({ data }) => {
                    this.teachers.replace(data.map((t) => new Teacher(t, this)));
                    return data
                })
            )
    }

    @action
    sync() {
        return syncUntis(this.cancelToken)
            .then((data) => {
                console.log('Sync Job started', data);
            })
    }

    @action
    reset() {
        this.classes.clear();
        this.lessons.clear();
        this.teachers.clear();
    }
}
