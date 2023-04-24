import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable } from 'mobx';
import { UntisClassWithTeacher } from '../../api/untis';
import Department, { DepartmentLetter, ECGBilingual_Letter, ECG_Letter, ESC_Letter, FMPaed_Letter, FMSBilingual_Letter, FMS_Letter, GYMBilingual_Letter, GYM_Letter, MATBilingual_Letter, MAT_Letter, MSOP_Letter, PASSERELLE_Letter, WMS_Letter, toDepartmentName } from '../Department';
import { mapLegacyClassName } from './helpers';

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type GYM = `${Digit}${Digit}${DepartmentLetter.GYM}${GYM_Letter}`;
type GYMBilingual = `${Digit}${Digit}${DepartmentLetter.GYM}${GYMBilingual_Letter}`;
type FMS = `${Digit}${Digit}${DepartmentLetter.FMS}${FMS_Letter}`;
type FMPaed = `${Digit}${Digit}${DepartmentLetter.FMS}${FMPaed_Letter}`;
type FMSBilingual = `${Digit}${Digit}${DepartmentLetter.FMS}${FMSBilingual_Letter}`;
type WMS = `${Digit}${Digit}${DepartmentLetter.WMS}${WMS_Letter}`;

type Maturite = `${Digit}${Digit}${DepartmentLetter.MATURITE}${MAT_Letter}`;
type MaturiteBilingual = `${Digit}${Digit}${DepartmentLetter.MATURITE}${MATBilingual_Letter}`;
type ECG = `${Digit}${Digit}${DepartmentLetter.ECG}${ECG_Letter}`;
type ECGBilingual = `${Digit}${Digit}${DepartmentLetter.ECG}${ECGBilingual_Letter}`;
type MSOP = `${Digit}${Digit}${DepartmentLetter.ECG}${MSOP_Letter}`;
type Passerelle = `${Digit}${Digit}${DepartmentLetter.PASSERELLE}${PASSERELLE_Letter}`;
type ESC = `${Digit}${Digit}${DepartmentLetter.ESC}${ESC_Letter}`;

export type KlassName = GYM | GYMBilingual | FMS | FMPaed | FMSBilingual | WMS | Maturite | MaturiteBilingual | ECG | ECGBilingual | MSOP | Passerelle | ESC;



export default class Klass {
    readonly id: number
    readonly _name: string
    readonly sf: string
    readonly year: number
    readonly departmentId: string
    readonly teacherIds: number[]
    readonly lessonIds: number[]
    private readonly store: UntisStore;

    constructor(props: UntisClassWithTeacher, store: UntisStore) {
        this.store = store;
        this.id = props.id;
        this._name = props.name;
        this.sf = props.sf;
        this.year = props.year;
        this.departmentId = props.departmentId ?? '';
        this.teacherIds = props.teachers.map(t => t.id);
        this.lessonIds = props.lessons.map(t => t.id);

        makeObservable(this);
    }

    @computed
    get name(): KlassName {
        if (this.graduationYear > 2026) {
            return this._name as KlassName;
        }
        return mapLegacyClassName(this._name) as KlassName;
    }

    @computed
    get departmentLetter(): DepartmentLetter {
        return this.name.slice(2, 3) as DepartmentLetter;
    }

    @computed
    get departmentName(): string {
        return toDepartmentName(this.name);
    }

    @computed
    get graduationYear() {
        return parseInt(this._name.slice(0, 2), 10) + 2000;
    }

    @computed
    get letter() {
        return this.name.slice(2);
    }

    @computed
    get teachers() {
        return this.teacherIds.map(t => this.store.findTeacher(t));
    }

    @computed
    get lessons() {
        const current = this.store.currentSemester;
        return this.lessonIds.map(t => this.store.findLesson(t)).filter(l => l?.semesterName === current.semesterName);
    }

    @computed
    get department(): Department | undefined {
        return this.store.findDepartment(this.departmentId);
    }

}
