import { all as KnownCssProperties } from 'known-css-properties';
import { MdxJsxAttribute, MdxJsxExpressionAttribute } from 'mdast-util-mdx';
import type {Directive, MemberExpression, ObjectExpression} from 'estree-jsx'
// matches options in strings: "--width=200px --height=20%" -> {width: '20px', height='20%'}
const OPTION_REGEX = /(^|\s+)--(?<key>[a-zA-Z\-]+)\s*=\s*(?<value>[\d\S-]+)/
const BOOLEAN_REGEX = /(^|\s+)--(?<key>[a-zA-Z\-]+)\s*/


const ALIASES = {
    width: 'minWidth',
    min: 'minWidth',
    align: 'alignItems',
    grow: 'flexGrow',
    cols: 'columns',
    basis: 'flexBasis',
    justify: 'justifyContent',
    class: 'className',
    classes: 'className'
};

export const captialize = (s: string) => {
    if (!s) {
        return s;
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
}

type ExpressionType = 
    { type: string, value: any, raw: string } |
    { type: 'Identifier', name: string } |
    Directive['expression'] |
    MemberExpression |
    ObjectExpression;

export const toMdxJsxExpressionAttribute = (
    key: string,
    value: number | boolean | string | Object,
    expression: ExpressionType
): MdxJsxAttribute => {
    return {
        type: 'mdxJsxAttribute',
        name: key,
        value: {
            type: 'mdxJsxAttributeValueExpression',
            value: typeof value === 'object' ? JSON.stringify(value) : `${value}`,
            data: {
                estree: {
                    type: 'Program',
                    body: [
                        {
                            type: 'ExpressionStatement',
                            expression: expression as unknown as any
                        }
                    ],
                    sourceType: 'module',
                    comments: []
                }
            }
        }
    }
}


export const toJsxAttribute = (key: string, value: string | number | boolean | Object): MdxJsxAttribute => {
    if (Number.isFinite(value)) {
        return toMdxJsxExpressionAttribute(
            key,
            `${value}`,
            {
                type: 'Literal',
                value: value,
                raw: `${value}`
            }
        );
    }
    if (typeof value === 'boolean') {
        if (value) {
            return {
                type: "mdxJsxAttribute",
                name: key,
                value: null
            };
        }
        return toMdxJsxExpressionAttribute(
            key,
            `${value}`,
            {
                type: 'Literal',
                value: value,
                raw: `${value}`
            }
        );
    }
    if (typeof value === 'object') {
        const expression: ObjectExpression = {
            type: 'ObjectExpression',
            properties: Object.entries(value).map(([k, v]) => ({
                type: 'Property',
                method: false,
                shorthand: false,
                computed: false,
                key: {
                    type: 'Identifier',
                    name: k
                },
                value: {
                    type: 'Literal',
                    value: v,
                    raw: JSON.stringify(v)
                },
                kind: 'init'
            }))
        } 
        return toMdxJsxExpressionAttribute(
            key,
            value,
            expression
        );
    }
    return {
        type: "mdxJsxAttribute",
        name: key,
        value: value === '' ? null : `${value}`
    };
}

/**
 * 
 * @param dashed dashed string, e.g. hello-bello
 * @returns camelCased string, e.g. helloBello
 */
export const camelCased = (dashed: string): string => {
    return dashed.replace(/-([a-zA-Z])/g, (g) => g[1].toUpperCase()).replace(/-/g, '');
}

/**
 * @param camelCased dashed string, e.g. hellBello
 * @returns dashed string, e.g. hello-bello
 */
export const dashedString = (camelCased: string): string => {
    const match = camelCased.match(/[A-Z]/g);
    if (!match) {
        return camelCased;
    }
    return match.reduce((acc, c) => {
        return acc.replace(c, `-${c.toLowerCase()}`);
    }, camelCased);
}

export interface Options {
    style: { [key: string]: string | boolean };
    className: string;
    attributes: { [key: string]: string | number | boolean };
}

/**
 * 
 * @param attributes 
 * @param keyAliases
 */
export const transformAttributes = (
    attributes: { [key: string]: string },
    keyAliases: { [key: string]: string } = ALIASES
) => {
    const options: Options = {
        style: {},
        className: '',
        attributes: {},
    };
    for (const [key, value] of Object.entries(attributes)) {
        let k = key;
        if (k in keyAliases) {
            k = keyAliases[k];
        }
        if (KnownCssProperties.includes(dashedString(k))) {
            options.style[camelCased(k)] = value === '' ? true : value;
        } else if (k === 'className') {
            options.className = value;
        }
        options.attributes[k] = value === 'true' ? true 
                                : value === 'false' ? false
                                : value === '' ? ''
                                : !Number.isNaN(Number(value)) ? Number(value)
                                : value;
    }
    return options;
}

/**
 * transforms 'path/to/file' to `require('path/to/file').defaut` to mdast
 * @param src path to require
 */
export const requireDefaultMdastNode = (key: string, src: string) => {
    return toMdxJsxExpressionAttribute(
        key,
        `require('${src}').default`,
        {
            type: 'MemberExpression',
            object: {
                type: 'CallExpression',
                callee: {
                    type: 'Identifier',
                    name: 'require'
                },
                arguments: [
                    {
                    type: 'Literal',
                    value: src,
                    raw: `'${src}'`
                    }
                ],
                optional: false
            },
            property: {
                type: 'Identifier',
                name: 'default'
            },
            computed: false,
            optional: false
        }
    )
}

export const cleanedText = (rawText: string) => {
    return rawText.replace(new RegExp(OPTION_REGEX, 'g'), '').replace(new RegExp(BOOLEAN_REGEX, 'g'), '').trim();
}

export const parseOptions = (rawText: string, transform2CamelCase = false, keyAliases: {[key: string]: string} = {}) => {
    const css = {}
    let raw = rawText;
    const optKey = (key: string) => {
        let k = key;
        if (k in keyAliases) {
            k = keyAliases[k];
        }
        if (transform2CamelCase) {
            k = camelCased(k);
        }
        return k;
    }
    while (OPTION_REGEX.test(raw)) {
        const match = raw.match(OPTION_REGEX);
        raw = raw.replace(OPTION_REGEX, '');
        const { key, value } = match.groups;
        if (key) {
            css[optKey(key)] = value;
        }
    }
    while (BOOLEAN_REGEX.test(raw)) {
        const match = raw.match(BOOLEAN_REGEX);
        raw = raw.replace(BOOLEAN_REGEX, '');
        const { key } = match.groups;
        if (key) {
            css[optKey(key)] = true;
        }
    }
    return css;
}