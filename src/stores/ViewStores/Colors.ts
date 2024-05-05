
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
        codeOrder: 0,
    },
    '--ifm-color-primary-dark': {
        adjustment: 0.1,
        adjustmentInput: '10',
        displayOrder: 4,
        codeOrder: 1,
    },
    '--ifm-color-primary-darker': {
        adjustment: 0.15,
        adjustmentInput: '15',
        displayOrder: 5,
        codeOrder: 2,
    },
    '--ifm-color-primary-darkest': {
        adjustment: 0.3,
        adjustmentInput: '30',
        displayOrder: 6,
        codeOrder: 3,
    },
    '--ifm-color-primary-light': {
        adjustment: -0.1,
        adjustmentInput: '-10',
        displayOrder: 2,
        codeOrder: 4,
    },
    '--ifm-color-primary-lighter': {
        adjustment: -0.15,
        adjustmentInput: '-15',
        displayOrder: 1,
        codeOrder: 5,
    },
    '--ifm-color-primary-lightest': {
        adjustment: -0.3,
        adjustmentInput: '-30',
        displayOrder: 0,
        codeOrder: 6,
    }
};

export const LIGHT_PRIMARY_COLOR = '#7b2e85';
export const DARK_PRIMARY_COLOR = '#ed67fe';
export const LIGHT_BACKGROUND_COLOR = '#ffffff';
export const DARK_BACKGROUND_COLOR = '#181920';
export const LIGHT_NAV_BAR_BACKGROUND = '#ffffff';
export const DARK_NAV_BAR_BACKGROUND = '#242526';

const DEAFULT_COLORS = {
    light: {
        primary: LIGHT_PRIMARY_COLOR,
        background: LIGHT_BACKGROUND_COLOR,
        navBarBackground: LIGHT_NAV_BAR_BACKGROUND,
    },
    dark: {
        primary: DARK_PRIMARY_COLOR,
        background: DARK_BACKGROUND_COLOR,
        navBarBackground: DARK_NAV_BAR_BACKGROUND,
    }
};

interface ColorProps {
    version: 'v1',
    dark: {
        shades: typeof COLOR_SHADES;
        colors: typeof DEAFULT_COLORS.dark;
    }
    light: {
        shades: typeof COLOR_SHADES;
        colors: typeof DEAFULT_COLORS.light;
    }
}

class Colors {
    private readonly store: ViewStore;

    @observable.deep
    data: ColorProps = {
        version: 'v1',
        dark: {
            colors: _.cloneDeep(DEAFULT_COLORS.dark),
            shades: _.cloneDeep(COLOR_SHADES),
        },
        light: {
            colors: _.cloneDeep(DEAFULT_COLORS.light),
            shades: _.cloneDeep(COLOR_SHADES),
        }
    };

    @observable.deep
    inputColors = {
        light: _.cloneDeep(DEAFULT_COLORS.dark),
        dark: _.cloneDeep(DEAFULT_COLORS.dark),
    };

    constructor(store: ViewStore) {
        this.store = store;
        this.rehydrate();
        makeObservable(this);
        reaction(
            () => JSON.stringify(this.data),
            () => {
                // console.log(this.data.light.primary)
                Storage.set(
                    StorageKey.ColorPrefs,
                    this.data
                );
            }
        )
    }

    @action
    rehydrate() {
        const data = Storage.get<ColorProps>(StorageKey.ColorPrefs);
        if (data) {
            this.data = data;
            this.inputColors = {
                light: JSON.parse(JSON.stringify(data.light.colors)),
                dark: JSON.parse(JSON.stringify(data.light.colors)),
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
            this.updateDom(mode);
        } catch (e) {
            // Don't update the color if it's invalid
        }
    }

    @action
    setShades(shades: Shades, mode: 'dark' | 'light') {
        this.data[mode].shades = shades;
        this.updateDom(mode);
    }

    @action
    reset(mode: 'dark' | 'light') {
        this.data = {
            version: 'v1',
            dark: {
                colors: _.cloneDeep(DEAFULT_COLORS.dark),
                shades: _.cloneDeep(COLOR_SHADES),
            },
            light: {
                colors: _.cloneDeep(DEAFULT_COLORS.light),
                shades: _.cloneDeep(COLOR_SHADES),
            }
        };
        this.inputColors = {
            light: _.cloneDeep(DEAFULT_COLORS.dark),
            dark: _.cloneDeep(DEAFULT_COLORS.dark),
        }
        this.updateDom(mode);
    }

    updateDom(colorMode: 'dark' | 'light') {
        updateDOMColors(
            {
                background: this.data[colorMode].colors.background,
                navBarBackground: this.data[colorMode].colors.navBarBackground,
                shades: this.data[colorMode].shades,
                baseColor: this.data[colorMode].colors.primary,
            },
            colorMode === 'dark'
        )
    }
}

export default Colors;