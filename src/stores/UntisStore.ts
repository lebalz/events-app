import { action, makeObservable, observable, reaction } from 'mobx';
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

export class UntisStore implements iStore<UntisTeacher> {
    private readonly root: RootStore;
    classes = observable<Klass>([]);
    lessons = observable<Lesson>([]);
    teachers = observable<Teacher>([]);

    cancelToken = axios.CancelToken.source();
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);
        reaction(
            () => this.root.userStore.current?.untisId,
            (id) => {
                console.log('untisId changed', id);
                if (id) {
                    this.loadUntisTeacher(id);
                }
            }
        )
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
            return this.lessons.find((l) => id === l.id);
        },
        { keepAlive: true }
    )
    findLessonsByTeacher = computedFn(
        function (this: UntisStore, teacherId?: number): Lesson[] {
            if (!teacherId) {
                return;
            }
            return this.lessons.filter((l) => l.teacherIds.includes(teacherId));
        },
        { keepAlive: true }
    )

    findClassesByTeacher = computedFn(
        function (this: UntisStore, teacherId?: number): Klass[] {
            if (!teacherId) {
                return;
            }
            return this.classes.filter((kl) => kl.teacherIds.includes(teacherId));
        },
        { keepAlive: true }
    )
    findClass = computedFn(
        function (this: UntisStore, id?: number): Klass | undefined {
            if (!id) {
                return;
            }
            return this.classes.find((kl) => id === kl.id);
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
                    console.log(data)
                    this.teachers.replace(data.map((t) => new Teacher(t, this)));
                    if (this.root.userStore.current?.untisId) {
                        await this.loadUntisTeacher(this.root.userStore.current.untisId);
                    }
                    return data;
                })
            )
    }

    @action
    loadUntisTeacher(id: number) {
        return fetchTeacher(this.root.userStore.current?.untisId, this.cancelToken).then(action(({ data }) => {
            console.log(data)
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
        }));
    }

    @action
    sync() {
        return syncUntis(this.cancelToken)
            .then(({data}) => {
                console.log('Sync Job started', data);
                this.root.jobStore.addJob(data);
            })
    }

    @action
    reset() {
        this.classes.clear();
        this.lessons.clear();
        this.teachers.clear();
    }
    @action
    save(model) {
        throw new Error('Not implemented');
    }
}
