export enum DepartmentLetter {
    WMS = 'W',
    FMS = 'F',
    GYMD = 'G',
    ECG = 's',
    PASSERELLE = 'p',
    ESC = 'c',
    GYMF = 'm',
}

export const Letter2Name: {[letter in DepartmentLetter]: string} = {
    [DepartmentLetter.WMS]: 'WMS',
    [DepartmentLetter.FMS]: 'FMS',
    [DepartmentLetter.GYMD]: 'GBSL',
    [DepartmentLetter.ECG]: 'ECG',
    [DepartmentLetter.PASSERELLE]: 'Passerelle',
    [DepartmentLetter.ESC]: 'ESC',
    [DepartmentLetter.GYMF]: 'GBJB'
}


export interface Department {
    id: string;
    name: string;
    color: string;
    letter: DepartmentLetter;
    classLetters: string[]
    description: string;
    department1_Id: string | null;
    department2_Id: string | null;
    createdAt: string;
    updatedAt: string;
}