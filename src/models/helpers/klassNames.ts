/**
 * MUST BE IN SYNC WITH THE CLIENT SIDE
 */

import { DepartmentLetter } from "@site/src/api/department";
import { ECGBilingual_Letter, ECG_Letter, ESC_Letter, FMPaed_Letter, FMSBilingual_Letter, FMS_Letter, GYMDBilingual_Letter, GYMD_Letter, GYMFBilingual_Letter, GYMF_Letter, MSOP_Letter, PASSERELLE_Letter, WMS_Letter } from "./departmentNames";

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type GYM = `${Digit}${Digit}${DepartmentLetter.GYMD}${GYMD_Letter}`;
type GYMBilingual = `${Digit}${Digit}${DepartmentLetter.GYMD}${GYMDBilingual_Letter}`;
type FMS = `${Digit}${Digit}${DepartmentLetter.FMS}${FMS_Letter}`;
type FMPaed = `${Digit}${Digit}${DepartmentLetter.FMS}${FMPaed_Letter}`;
type FMSBilingual = `${Digit}${Digit}${DepartmentLetter.FMS}${FMSBilingual_Letter}`;
type WMS = `${Digit}${Digit}${DepartmentLetter.WMS}${WMS_Letter}`;

type Maturite = `${Digit}${Digit}${DepartmentLetter.GYMF}${GYMF_Letter}`;
type MaturiteBilingual = `${Digit}${Digit}${DepartmentLetter.GYMF}${GYMFBilingual_Letter}`;
type ECG = `${Digit}${Digit}${DepartmentLetter.ECG}${ECG_Letter}`;
type ECGBilingual = `${Digit}${Digit}${DepartmentLetter.ECG}${ECGBilingual_Letter}`;
type MSOP = `${Digit}${Digit}${DepartmentLetter.ECG}${MSOP_Letter}`;
type Passerelle = `${Digit}${Digit}${DepartmentLetter.PASSERELLE}${PASSERELLE_Letter}`;
type ESC = `${Digit}${Digit}${DepartmentLetter.ESC}${ESC_Letter}`;

export type KlassName = GYM | GYMBilingual | FMS | FMPaed | FMSBilingual | WMS | Maturite | MaturiteBilingual | ECG | ECGBilingual | MSOP | Passerelle | ESC;