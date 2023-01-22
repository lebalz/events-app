import { action, makeObservable, observable, reaction } from 'mobx';
import { computedFn } from 'mobx-utils';
import { teachers as fetchTeachers, Teacher as UntisTeacher, sync as syncUntis } from '../api/untis';
import _ from 'lodash';
import axios from 'axios';
import Department from '../models/Untis/Department';
import Klass from '../models/Untis/Klass';
import Lesson from '../models/Untis/Lesson';
import Subject from '../models/Untis/Subject';
import Teacher from '../models/Untis/Teacher';
import Schoolyear from '../models/Untis/Schoolyear';
import { RootStore } from './stores';
import iStore from './iStore';

export class UntisStore implements iStore<UntisTeacher[]> {
    private readonly root: RootStore;
    deparments = observable<Department>([]);
    classes = observable<Klass>([]);
    lessons = observable<Lesson>([]);
    subjects = observable<Subject>([]);
    teachers = observable<Teacher>([]);
    schoolyears = observable<Schoolyear>([]);

    cancelToken = axios.CancelToken.source();
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);
    }

    cancelRequest() {
        this.cancelToken.cancel();
        this.cancelToken = axios.CancelToken.source();
    }

    findSchoolyear = computedFn(
        function (this: UntisStore, id?: number): Schoolyear | undefined {
            if (!id) {
                return;
            }
            return this.schoolyears.find((sy) => sy.id === id);
        },
        { keepAlive: true }
    );
    findClass = computedFn(
        function (this: UntisStore, id?: number): Klass | undefined {
            if (!id) {
                return;
            }
            return this.classes.find((item) => item.id === id);
        },
        { keepAlive: true }
    );
    findClassByName = computedFn(
        function (this: UntisStore, name?: string): Klass | undefined {
            if (!name) {
                return;
            }
            return this.classes.find((item) => item.name === name);
        },
        { keepAlive: true }
    );
    findLesson = computedFn(
        function (this: UntisStore, id?: number): Lesson | undefined {
            if (!id) {
                return;
            }
            return this.lessons.find((item) => item.id === id);
        },
        { keepAlive: true }
    );
    filterLessonsByClass = computedFn(
        function (this: UntisStore, classId?: number): Lesson[] | undefined {
            if (!classId) {
                return;
            }
            return this.lessons.filter((lesson) => lesson.class_ids.includes(classId));
        },
        { keepAlive: true }
    );
    filterLessonsByTeacher = computedFn(
        function (this: UntisStore, teacherId?: number): Lesson[] | undefined {
            if (!teacherId) {
                return;
            }
            return this.lessons.filter((lesson) => lesson.teacher_ids.includes(teacherId));
        },
        { keepAlive: true }
    );
    findSubject = computedFn(
        function (this: UntisStore, id?: number): Subject | undefined {
            if (!id) {
                return;
            }
            return this.subjects.find((item) => item.id === id);
        },
        { keepAlive: true }
    );
    findTeacher = computedFn(
        function (this: UntisStore, id?: number): Teacher | undefined {
            if (!id) {
                return;
            }
            return this.teachers.find((item) => item.id === id);
        },
        { keepAlive: true }
    );
    findTeacherByShortName = computedFn(
        function (this: UntisStore, name?: string): Teacher | undefined {
            if (!name) {
                return;
            }
            return this.teachers.find((item) => item.name === name);
        },
        { keepAlive: true }
    );
    findDepartment = computedFn(
        function (this: UntisStore, id?: number): Department | undefined {
            if (!id) {
                return;
            }
            return this.deparments.find((item) => item.id === id);
        },
        { keepAlive: true }
    );

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
        // return fetchUntis(this.cancelToken)
        //     .then(
        //         action(({ data }) => {
        //             const sy = new Schoolyear(data.schoolyear);
        //             this.schoolyears.replace([sy]);
        //             this.classes.replace(data.classes.map((c) => new Klass(c, sy.id, this)));
        //             this.teachers.replace(data.teachers.map((t) => new Teacher(t, sy.id, this)));
        //             this.deparments.replace(
        //                 data.departments.map((dep) => new Department(dep, sy.id, this))
        //             );
        //             this.lessons.replace(data.lessons.map((l) => new Lesson(l, sy.id, this)));
        //             this.subjects.replace(data.subjects.map((s) => new Subject(s, sy.id, this)));
        //             return data;
        //         })
        //     )
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
        this.deparments.clear();
        this.classes.clear();
        this.lessons.clear();
        this.subjects.clear();
        this.teachers.clear();
        this.schoolyears.clear();
    }
}
