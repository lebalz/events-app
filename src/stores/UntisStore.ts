import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { teachers as fetchTeachers, classes as fetchClasses, teacher as fetchTeacher, UntisTeacher, sync as syncUntis, UntisLesson, CheckedUntisLesson } from '../api/untis';
import _ from 'lodash';
import axios from 'axios';
import Klass from '../models/Untis/Klass';
import Lesson from '../models/Untis/Lesson';
import Teacher from '../models/Untis/Teacher';
import { RootStore } from './stores';
import Event from '../models/Event';
import iStore, { LoadeableStore, ResettableStore } from './iStore';
import { computedFn } from 'mobx-utils';
import { replaceOrAdd } from './helpers/replaceOrAdd';
import Department from '../models/Department';

export class UntisStore implements ResettableStore, LoadeableStore<UntisTeacher> {
    private readonly root: RootStore;
    abortControllers = new Map<string, AbortController>();
    classes = observable<Klass>([]);
    lessons = observable<Lesson>([]);
    teachers = observable<Teacher>([]);

    @observable
    initialized = false;
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);
        reaction(
            () => this.root.userStore.current?.untisId,
            (id) => {
                if (id && this.initialized) {
                    this.loadUntisTeacher(id);
                }
            }
        )
    }

    @computed
    get currentSemester() {
        return this.root.viewStore.semester;
    }

    withAbortController<T>(sigId: string, fn: (ct: AbortController) => Promise<T>) {
        const sig = new AbortController();
        if (this.abortControllers.has(sigId)) {
            this.abortControllers.get(sigId).abort();
        }
        this.abortControllers.set(sigId, sig);
        return fn(sig).catch((err) => {
            if (axios.isCancel(err)) {
                return { data: null };
            }
            throw err;
        }).finally(() => {
            if (this.abortControllers.get(sigId) === sig) {
                this.abortControllers.delete(sigId);
            }
        });
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

    findTeacherByName = computedFn(
        function (this: UntisStore, name?: string): Teacher | undefined {
            if (!name) {
                return;
            }
            return this.teachers.find((t) => t.name === name);
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
                return [];
            }
            return this.lessons.filter((l) => l.teacherIds.includes(teacherId));
        },
        { keepAlive: true }
    )

    @computed
    get classTree() {
        const tree: {
            [year: number]: {
                wildcard: string,
                departments: {
                    [department: string]: string[]
                }
            }
        } = {};
        this.sortedClasses.forEach(c => {
            if (!tree[c.graduationYear]) {
                tree[c.graduationYear] = {wildcard: `${c._name.slice(0, 2)}*`, departments: {}};
            }
            if (!tree[c.graduationYear].departments[c.departmentName]) {
                tree[c.graduationYear].departments[c.departmentName] = [];
            }
            tree[c.graduationYear].departments[c.departmentName].push(c._name);
        })
        return tree;
    }

    findClassesByTeacher = computedFn(
        function (this: UntisStore, teacherId?: number): Klass[] {
            if (!teacherId) {
                return [];
            }
            return this.classes.filter((kl) => kl.teacherIds.includes(teacherId));
        },
        { keepAlive: true }
    )
    findClassesByDepartment = computedFn(
        function (this: UntisStore, departmentId?: string): Klass[] {
            if (!departmentId) {
                return [];
            }
            return this.classes.filter((kl) => kl.departmentId === departmentId);
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
    findClassByName = computedFn(
        function (this: UntisStore, name?: string): Klass | undefined {
            if (!name) {
                return;
            }
            if (name.endsWith('*')) {
                const wildcard = name.replaceAll('*', '');
                return this.classes.find((kl) => kl._name.startsWith(wildcard));
            }
            return this.classes.find((kl) => name === kl._name);
        },
        { keepAlive: true }
    )

    @action
    reload() {
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

    @action
    load() {
        this.initialized = false;
        return this.withAbortController('untis', (sig) => {
            return Promise.all([fetchTeachers(sig.signal), fetchClasses(sig.signal)]).then(action(([teachers, classes]) => {
                this.teachers.replace(teachers.data.map((t) => new Teacher(t, this)));
                this.classes.replace(classes.data.map((c) => new Klass(c, this)));
                this.initialized = true;
                return { data: this.teachers };
            }));
        }).then(({ data }) => {
            return data || [];
        });
    }

    @computed
    get sortedClasses() {
        return this.classes.slice().sort((a, b) => a.name.localeCompare(b.name));
    }

    @action
    loadUntisTeacher(untisId: number) {
        /**
         * This will be called automatically by UserStores reaction 
         */
        return this.withAbortController(`untis-teacher-${untisId}`, (sig) => {
            return fetchTeacher(untisId, sig.signal).then(action(({ data }) => {
                const lessons = this.lessons.slice();
                data.lessons.forEach((l) => {
                    const lesson = new Lesson(l, this);
                    replaceOrAdd(lessons, lesson, (a, b) => a.id === b.id);
                });
                this.lessons.replace(lessons);
            }));
        })
    }

    @action
    sync() {
        return this.withAbortController(`untis-sync`, (sig) => {
            return syncUntis(sig.signal)
                .then(({ data }) => {
                    this.root.jobStore.addToStore(data);
                })
        });
    }

    findDepartment(id: string): Department | undefined {
        return this.root.departmentStore.find<Department>(id);
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

    @action
    addLessons(lessons: CheckedUntisLesson[]) {
        const models = lessons.map((l) => {
            const teacher = this.findTeacherByName(l.teacher_name);
            const klass = this.findTeacherByName(l.class_name);
            return new Lesson({
                id: l.id,
                room: l.room,
                description: l.description,
                endHHMM: l.end_hhmm,   
                startHHMM: l.start_hhmm,
                semester: l.semester,
                subject: l.subject,
                weekDay: l.week_day,
                year: l.year,
                classes: [{ id: klass?.id }], 
                teachers: [{ id: teacher?.id }] 
            }, this);
        });
        const current = this.lessons.slice();
        models.forEach((m) => {
            replaceOrAdd(current, m, (a, b) => a.id === b.id);
        });
        this.lessons.replace(current);
    }

    overlappingEvents = computedFn(
            function (this: UntisStore, lessonId: number): Event[] {
                const lesson = this.findLesson(lessonId);
                if (!lesson || !this.root.viewStore.semester) {
                    return [];
                }
                return this.root.viewStore.semester.events.filter((e) => {
                    if (!lesson.classes.some((c) => e.affectsClass(c))) {
                        return false;
                    }
                    const unaffected = lesson.weekOffsetMS_end < e.weekOffsetMS_start ||
                        lesson.weekOffsetMS_start > e.weekOffsetMS_end;
                    return !unaffected;
                })
            }
        )
}
