import Excel, { ValueType } from 'exceljs';
import Event from "@site/src/models/Event";
import { translate } from '@docusaurus/Translate';
import Department from '@site/src/models/Department';

const DEP_ORDER = ['GBSL', 'GBSL/GBJB', 'GBJB', 'GBJB/GBSL', 'FMS', 'ECG', 'ECG/FMS', 'WMS', 'ESC', 'FMPäd', 'MSOP', 'Passerelle']

const toDate = (date: Date) => {
    return date.toISOString().slice(0, 10).split('-').reverse().join('.');
};

export const toExcel = async (events: Event[], departments: Department[]) => {
    const workbook = new Excel.Workbook();
    workbook.creator = 'Events-App';
    workbook.model.contentStatus = 'V1';

    const worksheet = workbook.addWorksheet(translate({id: 'xlsx.events', message: 'Termine'}));
    const _depNames = departments.map(d => d.name);
    const depNames = [...DEP_ORDER.filter(dep => _depNames.includes(dep)), ..._depNames.filter(dep => !_depNames.includes(dep)).sort()];

    translate({ id: 'kw', message: 'KW', description: 'Calendar week' });
    const columns = [
        { header: translate({id: 'xlsx.kw', message: 'KW'}), key: 'kw', width: 7, outlineLevel: 1 },
        { header: translate({id: 'xlsx.weekday', message: 'Wochentag'}), key: 'weekday', width: 15, outlineLevel: 1 },
        { header: translate({id: 'xlsx.description', message: 'Titel'}), key: 'description', width: 42, outlineLevel: 1 },
        { header: translate({id: 'xlsx.dateStart', message: 'Datum Beginn'}), key: 'date_s', width: 15, outlineLevel: 1 },
        { header: translate({id: 'xlsx.timeStart', message: 'Zeit Beginn'}), key: 'time_s', width: 12, outlineLevel: 1 },
        { header: translate({id: 'xlsx.dateEnd', message: 'Datum Ende'}), key: 'date_e', width: 15, outlineLevel: 1 },
        { header: translate({id: 'xlsx.timeEnd', message: 'Zeit Ende'}), key: 'time_e', width: 12, outlineLevel: 1 },
        { header: translate({id: 'xlsx.location', message: 'Ort'}), key: 'location', width: 20, outlineLevel: 1 },
        { header: translate({id: 'xlsx.descriptionLong', message: 'Beschreibung'}), key: 'location', width: 20, outlineLevel: 1 },
        ...depNames.map((dep) => ({ header: dep, key: dep, width: 4, outlineLevel: 1, alignment: {textRotation: 90}})),
        { header: translate({id: 'xlsx.bilingueLPsAffected', message: 'Bilingue LP\'s betroffen'})},
        { header: translate({id: 'xlsx.classes', message: 'Klassen'}), key: 'classes', width: 10, outlineLevel: 1 },
        { header: translate({id: 'xlsx.affects', message: 'Betrifft'}), key: 'audience', width: 10, outlineLevel: 1 },
        { header: translate({id: 'xlsx.teachingAffected', message: 'Unterricht Betroffen?'}), key: 'teachingAffected', width: 10, outlineLevel: 1 },
        { header: translate({id: 'xlsx.deletedAt', message: 'Gelöscht am'}), key: 'deletedAt', width: 15, outlineLevel: 1}
    ] satisfies typeof worksheet.columns;
    worksheet.addTable({
        name: translate({id: 'xlsx.events', message: 'Termine'}),
        ref: 'A1',
        headerRow: true,
        totalsRow: false,
        style: {
          theme: 'TableStyleMedium2',
          showRowStripes: true
        },
        columns: columns.map(c => ({ name: c.header, filterButton: true })),
        rows: events.sort((a, b) => a.start.getTime() - b.start.getTime()).map(e => {
            return [
                e.kw,
                e.dayStart,
                e.description,
                e.fStartDateLong,
                e.isAllDay ? '' : e.fStartTime.padStart(5, '0'),
                e.fEndDateLong,
                e.isAllDay ? '' : e.fEndTime.padStart(5, '0'),
                e.location, 
                e.descriptionLong,
                ...depNames.map((dep) => e.departments.find(d => d.name === dep) ? 1 : ''),
                e.affectsDepartment2 ? 1 : 0,
                [...[...e.classGroups].map(g => `${g}*`), ...e.classes].join(', '),
                e.audience,
                e.teachingAffected,
                e.deletedAt ? Event.fDate(e.deletedAt) : ''
            ]
        }),
      });
    worksheet.columns = columns;
    depNames.forEach((_, i) => {
        worksheet.getCell(1, 10 + i).alignment = { textRotation: -90, vertical: 'top', horizontal: 'left' }
    })
    return await workbook.xlsx.writeBuffer();
};