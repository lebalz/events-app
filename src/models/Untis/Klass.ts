import { UntisStore } from '@site/src/stores/UntisStore';
import { computed } from 'mobx';
import { UntisClassWithTeacher } from '../../api/untis';
import Department, { Duration4Years } from '../Department';
import { KlassName } from '../helpers/klassNames';
import { toDepartmentName } from '../helpers/departmentNames';
import { DepartmentLetter } from '@site/src/api/department';
import _ from 'lodash';
import { currentGradeYear } from '../helpers/time';

const CURRENT_GRADE_YEAR = currentGradeYear();

export default class Klass {
    readonly id: number;
    readonly name: KlassName;
    readonly _displayName?: string;
    readonly sf: string;
    readonly year: number;
    readonly departmentId: string;
    readonly teacherIds: number[];
    readonly lessonIds: number[];
    private readonly store: UntisStore;

    constructor(props: UntisClassWithTeacher, store: UntisStore) {
        this.store = store;
        this.id = props.id;
        this.name = props.name;
        this._displayName = props.displayName;

        this.sf = props.sf;
        this.year = props.year;
        this.departmentId = props.departmentId ?? '';
        this.teacherIds = props.teacherIds;
        this.lessonIds = props.lessonIds;
    }

    @computed
    get departmentLetter(): DepartmentLetter {
        return this.name.slice(2, 3) as DepartmentLetter;
    }

    @computed
    get displayDepartmentLetter(): DepartmentLetter {
        return this.displayName.slice(2, 3) as DepartmentLetter;
    }

    @computed
    get isLegacyFormat() {
        return this.displayName?.length < 4;
    }

    @computed
    get displayName() {
        return this._displayName || this.name;
    }

    @computed
    get letter() {
        if (this.isLegacyFormat) {
            return this.displayName.slice(2);
        }
        return this.name.slice(3);
    }

    @computed
    get departmentName(): string {
        if (this.department?.name) {
            return this.department.name;
        }
        return toDepartmentName(this.name);
    }

    @computed
    get teachers() {
        return this.teacherIds.map((t) => this.store.findTeacher(t));
    }

    @computed
    get lessons() {
        const current = this.store.currentSemester;
        return this.lessonIds
            .map((t) => this.store.findLesson(t))
            .filter((l) => l?.semesterId === current?.id);
    }

    @computed
    get department(): Department | undefined {
        return this.store.findDepartment(this.departmentId);
    }

    @computed
    get color() {
        return this.department?.color || 'var(--ifm-color-secondary)';
    }

    /**
     * the group name
     * @example '25Gh' -> '25G'
     *          '23Gh' -> '23G'
     */
    @computed
    get groupName(): string {
        return this.name.slice(0, 3);
    }

    /**
     * the grade year name, for 2025
     * @example '25Gh' -> 'GYM 4'
     *          '28Gj' -> 'GYM 1'
     *          '26Fa' -> 'FMS 2'
     *          '28Fp' -> 'FMPäd' (only one year degree)
     */
    @computed
    get gradeYearName(): string {
        if (this.department.isOneYearDegree) {
            return this.departmentName;
        }
        const duration = this.department.schoolYears || (Duration4Years.has(this.departmentLetter) ? 4 : 3);
        return `${this.departmentName} ${duration - (this.year - CURRENT_GRADE_YEAR)}`;
    }

    /**
     * @param gradeYear number, e.g. 2028
     * @param range number that specifies, how much the schoolYears can be exceeded on the end.
     * @returns wheter this class is active for the given school year
     * @example gradeYear=2028 means in this school year, the 2028er classes will do their grades.
     */
    isActiveIn(gradeYear: number, range: number) {
        return this.year >= gradeYear && this.year < gradeYear + this.department.schoolYears + range;
    }
}
