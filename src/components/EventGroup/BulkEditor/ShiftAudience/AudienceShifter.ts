import { action, computed, observable } from 'mobx';

export default class AudienceShifter {
    audience = observable.map<string, string | null>();
    @observable accessor _currentShift = 0;
    @observable accessor shiftAudienceInText = true;
    @observable accessor shiftedEventIdx = 0;

    constructor(classes: string[], groups: string[], shiftAudienceInText: boolean, shiftedEventIdx: number) {
        this.audience.replace([...new Set([...classes, ...groups])].sort().map((c) => [c, c]));
        this.shiftAudienceInText = shiftAudienceInText;
        this.shiftedEventIdx = shiftedEventIdx;
    }

    @action
    shiftAudience(shift: number) {
        this._currentShift = shift;
        if (Math.floor(shift) !== shift) {
            console.warn('Shift must be an integer');
            return;
        }
        this.audience.forEach((val, key, map) => {
            if (!val) {
                return;
            }
            const current = parseInt(key.substring(0, 2), 10);
            map.set(key, `${current + shift}${key.substring(2)}`);
        });
    }

    @action
    setShiftAudienceInText(shift: boolean) {
        this.shiftAudienceInText = shift;
    }

    @action
    setShiftedEventIdx(idx: number) {
        this.shiftedEventIdx = idx;
    }

    @action
    setAudienceFor(klass: string, audience: string | null) {
        this.audience.set(klass, audience);
    }

    @action
    reset(klass: string) {
        const current = parseInt(klass.substring(0, 2), 10);
        const shifted = `${current + this._currentShift}${klass.substring(2)}`;
        this.audience.set(klass, shifted);
    }

    isCustom(klass: string) {
        const current = parseInt(klass.substring(0, 2), 10);
        const shifted = `${current + this._currentShift}${klass.substring(2)}`;
        return this.audience.get(klass) !== shifted;
    }

    @computed
    get hasShifts() {
        return this._currentShift !== 0 || Array.from(this.audience.keys()).some((v) => this.isCustom(v));
    }
}
