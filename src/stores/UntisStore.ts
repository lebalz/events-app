import { action, makeObservable, observable } from 'mobx';
import { teachers as fetchTeachers, teacher as fetchTeacher, UntisTeacher, sync as syncUntis } from '../api/untis';
import _ from 'lodash';
import axios from 'axios';
import Klass from '../models/Untis/Klass';
import Lesson from '../models/Untis/Lesson';
import Teacher from '../models/Untis/Teacher';
import { RootStore } from './stores';
import iStore from './iStore';
import { computedFn } from 'mobx-utils';
import { replaceOrAdd } from './helpers/replaceOrAdd';

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

    findLesson = computedFn(
        function (this: UntisStore, id?: number): Lesson | undefined {
            if (!id) {
                return;
            }
            return this.lessons.find((l) => l.id === id);
        },
        { keepAlive: true }
    )

    findClass = computedFn(
        function (this: UntisStore, id?: number): Klass | undefined {
            if (!id) {
                return;
            }
            return this.classes.find((kl) => kl.id === id);
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
                action(async ({ data }) => {
                    this.teachers.replace(data.map((t) => new Teacher(t, this)));
                    if (this.root.userStore.current?.untisId) {
                        await fetchTeacher(this.root.userStore.current?.untisId, this.cancelToken).then(({ data }) => {
                            const classes = this.classes.slice();
                            const lessons = this.lessons.slice();
                            data.classes.forEach((c) => {
                                const klass = new Klass(c, this);
                                replaceOrAdd(classes, klass, (a, b) => a.id === b.id);
                            });
                            data.lessons.forEach((l) => {
                                const lesson = new Lesson(l, this);
                                replaceOrAdd(lessons, lesson, (a, b) => a.id === b.id);
                            });
                            this.classes.replace(classes);
                            this.lessons.replace(lessons);
                        });
                    }
                    return data;
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
