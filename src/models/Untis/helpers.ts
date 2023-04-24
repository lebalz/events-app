import { DepartmentLetter } from "../Department";

const getLastMonday = (date: Date = new Date()) => {
    const dateCopy = new Date(date.getTime());
    dateCopy.setUTCHours(0, 0, 0, 0);
    const nextMonday = new Date(
        dateCopy.setUTCDate(dateCopy.getUTCDate() - dateCopy.getUTCDay() + 1),
    );

    return nextMonday;
}

const mapLegacyClassName: (name: string) => `${number}${DepartmentLetter}${string}` = (name: string) => {
    const year = Number.parseInt(name.slice(0, 2), 10);
    const id = name.slice(2);
    if (id.charAt(id.length - 1) < 'a') { // Means it is an upper case letter
        if (['M', 'L'].includes(id)) {
            // MSOP french --> 27sP (P-S)
            // M = P, L = Q
            const newLetter = String.fromCharCode(id.charCodeAt(0) + 3);
            return `${year}${DepartmentLetter.ECG}${newLetter}`;
        }
        if (['U', 'V', 'X'].includes(id)) {
            // ESC/WMS --> 27wD (D, E...)
            // U = D, V = E, X = F...
            const newLetter = String.fromCharCode(id.charCodeAt(0) - 17);
            return `${year}${DepartmentLetter.ESC}${newLetter}`;
        }
        if (['Y', 'Z'].includes(id)) {
            // Passerelle --> 27pA (A, B...)
            const newLetter = String.fromCharCode(id.charCodeAt(0) - 24);
            return `${year}${DepartmentLetter.PASSERELLE}${newLetter}`;
        }
        if (['K', 'L'].includes(id)) {
            // Maturité Bili --> 27mT (T-V)
            // K = T, L = U, M = V...
            const newLetter = String.fromCharCode(id.charCodeAt(0) + 9);
            return `${year}${DepartmentLetter.MATURITE}${newLetter}`;
        }
        if (['msA', 'msB'].includes(id)) {
            // spécialisé??
            const newLetter = id.charAt(2);
            return `${year}${DepartmentLetter.ECG}${newLetter}`;
        }
        if (['R', 'S', 'T'].includes(id)) {
            // FMS/ECG
            const newLetter = String.fromCharCode(id.charCodeAt(0) + 2);
            return `${year}${DepartmentLetter.ECG}${newLetter}`;
        }
        
        return `${year}${DepartmentLetter.MATURITE}${id}`;
    }
    if (['m', 'l'].includes(id)) {
        // FMS german --> 27Fp (p-s)
        const newLetter = String.fromCharCode(id.charCodeAt(0) - 4);
        return `${year}${DepartmentLetter.FMS}${newLetter}`;
    }
    if (['n', 'o'].includes(id)) {
        // GYM bili --> 27Gw (w-y)
        const newLetter = String.fromCharCode(id.charCodeAt(0) + 9);
        return `${year}${DepartmentLetter.GYM}${newLetter}`;
    }
    if (id < 'r') { // GYM
        return `${year}${DepartmentLetter.GYM}${id}`;
    } else if (id === 'w') { // WMS --> (a-c)
        const newLetter = String.fromCharCode(id.charCodeAt(0) - 22);
        return `${year}${DepartmentLetter.WMS}${newLetter}`;
    } else { // FMS --> (a-o)
        const newLetter = String.fromCharCode(id.charCodeAt(0) - 17);
        return `${year}${DepartmentLetter.FMS}${newLetter}`;
    }
  }

export {getLastMonday, mapLegacyClassName}