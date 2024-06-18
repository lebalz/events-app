export interface RegistrationPeriod {
    id: string;
    name: string;
    description: string;
    start: string;
    end: string;
    eventRangeStart: string;
    eventRangeEnd: string;
    isOpen: boolean;
    departmentIds: string[];
    createdAt: string;
    updatedAt: string;
}
