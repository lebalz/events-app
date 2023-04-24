import { computed, makeObservable, observable, override } from "mobx";
import { Department as DepartmentProps } from "../api/department";
import { DepartmentStore } from "../stores/DepartmentStore";
import Event from '../models/Event';
import ApiModel, { UpdateableProps } from "./ApiModel";
import _ from "lodash";
import { ApiAction } from "../stores/iStore";
import { KlassName } from "./Untis/Klass";


const GYM = ['a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' , 'n' , 'o' , 'p' , 'q' , 'r' , 's'] as const;
export type GYM_Letter = typeof GYM[number];
const GYMBilingual = ['t' , 'u' , 'v'] as const;
export type GYMBilingual_Letter = typeof GYMBilingual[number];
const FMS = ['a' , 'b' , 'c' , 'd' , 'e' , 'f' , 'g' , 'h' , 'i' , 'j' , 'k' , 'l' , 'm' , 'n' , 'o'] as const;
export type FMS_Letter = typeof FMS[number];
const FMSBilingual = ['w' , 'x' , 'y'] as const;
export type FMSBilingual_Letter = typeof FMSBilingual[number];
const FMPaed = ['p' , 'q' , 'r' , 's'] as const;
export type FMPaed_Letter = typeof FMPaed[number];
const WMS = ['a' , 'b' , 'c'] as const;
export type WMS_Letter = typeof WMS[number];
const MAT = ['A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' , 'N' , 'O' , 'P' , 'Q' , 'R' , 'S'] as const;
export type MAT_Letter = typeof MAT[number];
const MATBilingual = ['T' , 'U' , 'V'] as const;
export type MATBilingual_Letter = typeof MATBilingual[number];
const ECG = ['A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' , 'N' , 'O'] as const;
export type ECG_Letter = typeof ECG[number];
const MSOP = ['P' , 'Q' , 'R' , 'S'] as const;
export type MSOP_Letter = typeof MSOP[number];
const ECGBilingual = ['T' , 'U' , 'V'] as const;
export type ECGBilingual_Letter = typeof ECGBilingual[number];
const PASSERELLE = ['A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' , 'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z'] as const;
export type PASSERELLE_Letter = typeof PASSERELLE[number];
const ESC = ['D' , 'E' , 'F' , 'G'] as const;
export type ESC_Letter = typeof ESC[number];

type Letter = GYM_Letter | GYMBilingual_Letter | FMS_Letter | FMSBilingual_Letter | FMPaed_Letter | WMS_Letter | MAT_Letter | MATBilingual_Letter | ECG_Letter | MSOP_Letter | ECGBilingual_Letter | PASSERELLE_Letter | ESC_Letter;

export enum DepartmentLetter {
    WMS = 'W',
    FMS = 'F',
    GYM = 'G',
    ECG = 's',
    PASSERELLE = 'p',
    ESC = 'c',
    MATURITE = 'm',
}

export const toDepartmentName = (name: KlassName) => {
    const [department, letter] = name.slice(2).split('') as [DepartmentLetter, Letter];
    switch (department) {
        case DepartmentLetter.WMS:
            return 'WMS';
        case DepartmentLetter.FMS:
            if (letter in FMPaed) {
                return 'FMPäd';
            }
            if (letter in FMSBilingual) {
                return 'FMS/ECG zweisprachig';
            }
            return 'FMS';
        case DepartmentLetter.GYM:
            if (letter in GYMBilingual) {
                return 'GYM zweisprachig';
            }
            return 'GYM einsprachig D';
        case DepartmentLetter.MATURITE:
            if (letter in MATBilingual) {
                return 'GYM bilingue';
            }
            return 'GYM monolingue F';
        case DepartmentLetter.ECG:
            if (letter in ECGBilingual) {
                return 'FMS/ECG bilingue';
            }
            if (letter in MSOP) {
                return 'MSOP';
            }
            return 'ECG';
        case DepartmentLetter.PASSERELLE:
            return'Passerelle';
        case DepartmentLetter.ESC:
            return 'ESC';
    }
}

export default class Department extends ApiModel<DepartmentProps, ApiAction> {
    readonly UPDATEABLE_PROPS: UpdateableProps<DepartmentProps>[] = ['description'];
    readonly store: DepartmentStore;
    readonly _pristine: DepartmentProps;
    readonly id: string;
    readonly name: string;
    readonly createdAt: Date;
    @observable.ref
    updatedAt: Date;

    @observable
    description: string;

    constructor(props: DepartmentProps, store: DepartmentStore) {
        super();
        this.store = store;
        this._pristine = props;
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }

    @computed
    get events(): Event[] {
        return this.store.getEvents(this);
    }

    @override
    get props(): DepartmentProps {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }
}