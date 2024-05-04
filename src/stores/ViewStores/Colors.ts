
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { ViewStore } from '.';
import Department from '@site/src/models/Department';
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
    },
};

export const LIGHT_PRIMARY_COLOR = '#7b2e85';
export const DARK_PRIMARY_COLOR = '#ed67fe';
export const LIGHT_BACKGROUND_COLOR = '#ffffff';
export const DARK_BACKGROUND_COLOR = '#181920';

interface ColorProps {
    dark: {
        primary: string;
        background: string;
        shades: typeof COLOR_SHADES;
    }
    light: {
        primary: string;
        background: string;
        shades: typeof COLOR_SHADES;
    }
}

class Colors {
    private readonly store: ViewStore;

    @observable.deep
    data: ColorProps = {
        dark: {
            primary: DARK_PRIMARY_COLOR,
            background: DARK_BACKGROUND_COLOR,
            shades: JSON.parse(JSON.stringify(COLOR_SHADES)),
        },
        light: {
            primary: LIGHT_PRIMARY_COLOR,
            background: LIGHT_BACKGROUND_COLOR,
            shades: JSON.parse(JSON.stringify(COLOR_SHADES)),
        }
    };

    @observable.deep
    inputColor = {
        light: LIGHT_PRIMARY_COLOR,
        dark: DARK_PRIMARY_COLOR,
    };
    @observable.deep
    inputBackgroundColor = {
        light: LIGHT_BACKGROUND_COLOR,
        dark: DARK_BACKGROUND_COLOR,
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
            this.inputColor.light = data.light.primary;
            this.inputColor.dark = data.dark.primary;
            this.inputBackgroundColor.light = data.light.background;
            this.inputBackgroundColor.dark = data.dark.background;
        }
    }

    @action
    setPrimaryColor(color: string, mode: 'dark' | 'light') {
        this.inputColor[mode] = color;
        // Only prepend # when there isn't one.
        // e.g. ccc -> #ccc, #ccc -> #ccc, ##ccc -> ##ccc,
        const colorValue = color.replace(/^(?=[^#])/, '#');
        try {
            const validColor = Color(colorValue).hex();
            this.data[mode].primary = validColor;
            this.updateDom(mode);
        } catch (e) {
            // Don't update the color if it's invalid
        }
    }

    @action
    setBackgroundColor(color: string, mode: 'dark' | 'light') {
        this.inputBackgroundColor[mode] = color;
        // Only prepend # when there isn't one.
        // e.g. ccc -> #ccc, #ccc -> #ccc, ##ccc -> ##ccc,
        const colorValue = color.replace(/^(?=[^#])/, '#');
        try {
            const validColor = Color(colorValue).hex();
            this.data[mode].background = validColor;
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
        this.data.dark.background = DARK_BACKGROUND_COLOR;
        this.data.dark.primary = DARK_PRIMARY_COLOR;
        this.data.dark.shades = JSON.parse(JSON.stringify(COLOR_SHADES));
        this.data.light.background = LIGHT_BACKGROUND_COLOR;
        this.data.light.primary = LIGHT_PRIMARY_COLOR;
        this.data.light.shades = JSON.parse(JSON.stringify(COLOR_SHADES));
        this.updateDom(mode);
    }

    updateDom(colorMode: 'dark' | 'light') {
        updateDOMColors(
            {
                background: this.data[colorMode].background,
                shades: this.data[colorMode].shades,
                baseColor: this.data[colorMode].primary,
            },
            colorMode === 'dark'
        )
    }
}

export default Colors;