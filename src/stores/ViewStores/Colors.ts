import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { ViewStore } from '.';
import Color from 'color';
import _ from 'lodash';
import Storage, { StorageKey } from '../utils/Storage';
import { updateDOMColors } from '@site/src/components/ColorGenerator/colorUtils';

export type ColorState = {
    baseColor: string;
    background: string;
    shades: Shades;
};

export type Shades = {
    [cssVar: string]: {
        adjustment: number;
        adjustmentInput: string;
        displayOrder: number;
        codeOrder: number;
    };
};

export const COLOR_SHADES: Shades = {
    '--ifm-color-primary': {
        adjustment: 0,
        adjustmentInput: '0',
        displayOrder: 3,
        codeOrder: 0
    },
    '--ifm-color-primary-dark': {
        adjustment: 0.1,
        adjustmentInput: '10',
        displayOrder: 4,
        codeOrder: 1
    },
    '--ifm-color-primary-darker': {
        adjustment: 0.15,
        adjustmentInput: '15',
        displayOrder: 5,
        codeOrder: 2
    },
    '--ifm-color-primary-darkest': {
        adjustment: 0.3,
        adjustmentInput: '30',
        displayOrder: 6,
        codeOrder: 3
    },
    '--ifm-color-primary-light': {
        adjustment: -0.1,
        adjustmentInput: '-10',
        displayOrder: 2,
        codeOrder: 4
    },
    '--ifm-color-primary-lighter': {
        adjustment: -0.15,
        adjustmentInput: '-15',
        displayOrder: 1,
        codeOrder: 5
    },
    '--ifm-color-primary-lightest': {
        adjustment: -0.3,
        adjustmentInput: '-30',
        displayOrder: 0,
        codeOrder: 6
    }
};

export const LIGHT_PRIMARY_COLOR = '#232a40';
export const DARK_PRIMARY_COLOR = '#41b4ad';
export const LIGHT_BACKGROUND_COLOR = '#ffffff';
export const DARK_BACKGROUND_COLOR = '#181920';
export const LIGHT_NAV_BAR_BACKGROUND = '#ffffff';
export const DARK_NAV_BAR_BACKGROUND = '#242526';

const DEAFULT_COLORS = {
    light: {
        primary: LIGHT_PRIMARY_COLOR,
        background: LIGHT_BACKGROUND_COLOR,
        navBarBackground: LIGHT_NAV_BAR_BACKGROUND
    },
    dark: {
        primary: DARK_PRIMARY_COLOR,
        background: DARK_BACKGROUND_COLOR,
        navBarBackground: DARK_NAV_BAR_BACKGROUND
    }
};

const COLOR_VERSION = 'v1.2' as const;

interface ColorProps {
    version: typeof COLOR_VERSION;
    dark: {
        shades: typeof COLOR_SHADES;
        colors: typeof DEAFULT_COLORS.dark;
    };
    light: {
        shades: typeof COLOR_SHADES;
        colors: typeof DEAFULT_COLORS.light;
    };
}

const updateDom = _.debounce(
    (colorMode: 'dark' | 'light', data: ColorState) => {
        updateDOMColors(data, colorMode === 'dark');
    },
    100,
    { leading: false, trailing: true }
);

const setLocalStorage = _.debounce(
    (data: ColorProps) => {
        Storage.set(StorageKey.ColorPrefs, data);
        try {
            (window as any).umami.track('set-primary-color', {
                light: data.light.colors.primary,
                dark: data.dark.colors.primary
            });
        } catch (e) {
            // Ignore errors
        }
    },
    1000,
    { leading: false, trailing: true }
);

class Colors {
    private readonly store: ViewStore;

    @observable.deep accessor data: ColorProps = {
        version: COLOR_VERSION,
        dark: {
            colors: _.cloneDeep(DEAFULT_COLORS.dark),
            shades: _.cloneDeep(COLOR_SHADES)
        },
        light: {
            colors: _.cloneDeep(DEAFULT_COLORS.light),
            shades: _.cloneDeep(COLOR_SHADES)
        }
    };

    @observable.deep accessor inputColors = {
        light: _.cloneDeep(DEAFULT_COLORS.dark),
        dark: _.cloneDeep(DEAFULT_COLORS.dark)
    };

    constructor(store: ViewStore) {
        this.store = store;
        this.rehydrate();

        reaction(
            () => JSON.stringify(this.data),
            () => {
                setLocalStorage(this.data);
            }
        );
    }

    @action
    rehydrate() {
        const data = Storage.get<ColorProps>(StorageKey.ColorPrefs);
        if (data) {
            if (data.version !== COLOR_VERSION) {
                return setLocalStorage(this.data);
            }
            this.data = data;
            this.inputColors = {
                light: JSON.parse(JSON.stringify(data.light.colors)),
                dark: JSON.parse(JSON.stringify(data.light.colors))
            };
        }
    }

    @action
    setColor(color: keyof typeof DEAFULT_COLORS.dark, value: string, mode: 'dark' | 'light') {
        this.inputColors[mode][color] = value;
        // Only prepend # when there isn't one.
        // e.g. ccc -> #ccc, #ccc -> #ccc, ##ccc -> ##ccc,
        const colorValue = value.replace(/^(?=[^#])/, '#');
        try {
            const validColor = Color(colorValue).hex();
            this.data[mode].colors[color] = validColor;
            this.setDom(mode);
        } catch (e) {
            // Don't update the color if it's invalid
        }
    }

    @action
    setShades(shades: Shades, mode: 'dark' | 'light') {
        this.data[mode].shades = shades;
        this.setDom(mode);
    }

    @action
    reset(mode: 'dark' | 'light') {
        this.data = {
            version: COLOR_VERSION,
            dark: {
                colors: _.cloneDeep(DEAFULT_COLORS.dark),
                shades: _.cloneDeep(COLOR_SHADES)
            },
            light: {
                colors: _.cloneDeep(DEAFULT_COLORS.light),
                shades: _.cloneDeep(COLOR_SHADES)
            }
        };
        this.inputColors = {
            light: _.cloneDeep(DEAFULT_COLORS.dark),
            dark: _.cloneDeep(DEAFULT_COLORS.dark)
        };
        this.setDom(mode);
    }

    setDom(colorMode: 'dark' | 'light') {
        updateDom(colorMode, {
            background: this.data[colorMode].colors.background,
            shades: this.data[colorMode].shades,
            baseColor: this.data[colorMode].colors.primary
        });
    }
}

export default Colors;
