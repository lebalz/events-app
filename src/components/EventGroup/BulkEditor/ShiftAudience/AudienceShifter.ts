import { action, observable } from 'mobx';

export default class AudienceShifter {
    audience = observable.map<string, string>();

    constructor(classes: string[], groups: string[]) {
        this.audience.replace([...new Set([...classes, ...groups])].sort().map((c) => [c, c]));
    }

    @action
    shiftAudience(shift: number) {
        if (Math.floor(shift) !== shift) {
            console.warn('Shift must be an integer');
            return;
        }
        this.audience.forEach((_, key, map) => {
            const current = parseInt(key.substring(0, 2), 10);
            map.set(key, `${current + shift}${key.substring(2)}`);
        });
    }
}
