export enum DepartmentLetter {
    WMS = 'W',
    FMS = 'F',
    FMP = 'E',
    GYMD = 'G',
    ECG = 's',
    MSOP = 'e',
    PASSERELLE = 'p',
    ESC = 'c',
    GYMF = 'm'
}

export const Letter2Name: { [letter in DepartmentLetter]: string } = {
    [DepartmentLetter.WMS]: 'WMS',
    [DepartmentLetter.FMS]: 'FMS',
    [DepartmentLetter.FMP]: 'FMPäd',
    [DepartmentLetter.GYMD]: 'GBSL',
    [DepartmentLetter.ECG]: 'ECG',
    [DepartmentLetter.MSOP]: 'MSOP',
    [DepartmentLetter.PASSERELLE]: 'Passerelle',
    [DepartmentLetter.ESC]: 'ESC',
    [DepartmentLetter.GYMF]: 'GBJB'
};

export interface Department {
    id: string;
    name: string;
    color: string;
    letter: DepartmentLetter;
    displayLetter: DepartmentLetter | null;
    classLetters: string[];
    description: string;
    department1_Id: string | null;
    department2_Id: string | null;
    createdAt: string;
    updatedAt: string;
}
