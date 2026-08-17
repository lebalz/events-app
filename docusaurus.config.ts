// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require('dotenv').config();
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;
import ConfigLocalized from './docusaurus.config.localized.json';
import strongPlugin, { transformer as captionVisitor } from './src/plugins/remark-strong/plugin';
import deflistPlugin from './src/plugins/remark-deflist/plugin';
import mdiPlugin from './src/plugins/remark-mdi/plugin';
import dynamicRouterPlugin, { Config as DynamicRouteConfig} from './src/plugins/plugin-dynamic-routes';
import imagePlugin, { CaptionVisitor } from './src/plugins/remark-images/plugin';
import { sentryPluginConfig } from './src/plugins/sentry-plugin';
import type { EventsCustomFields } from './src/types/eventsCustomFields';


const envs = process.env as {
    [key: string]: string | undefined;
};
const defaultLocale = 'de';

function getLocale(): 'de' | 'fr' {
    return (envs.DOCUSAURUS_CURRENT_LOCALE && envs.DOCUSAURUS_CURRENT_LOCALE !== 'undefined')
        ? envs.DOCUSAURUS_CURRENT_LOCALE as 'de' | 'fr'
        : defaultLocale;
}

function getLocalizedConfigValue(key: keyof typeof ConfigLocalized) {
    const values = ConfigLocalized[key];
    if (!values) {
        throw new Error(`Localized config key=${key} not found`);
    }
    const currentLocale = getLocale() as 'de' | 'fr';
    const value = values[currentLocale] ?? values[defaultLocale];
    if (!value) {
        throw new Error(
            `Localized value for config key=${key} not found for both currentLocale=${currentLocale} or defaultLocale=${defaultLocale}`,
        );
    }
    return value;
}

function getTranslator() {
    const currentLocale = getLocale();
    return `<span class="translator-${currentLocale}">${getLocalizedConfigValue('translated_by')} G. Andonie</span><br />`
}

function getLocalizedCopyright() {
    return `Copyright © ${new Date().getFullYear()} B. Hofer <br />
          ${getTranslator()}
          <a class="badge badge--primary" href="https://github.com/lebalz/events-app/commit/${GIT_COMMIT_SHA}">
            ᚶ ${GIT_COMMIT_SHA.substring(0, 7)}
          </a>
          `;
}


/** @type { (string
    | {
        src: string;
        [key: string]: string | boolean | undefined;
      }
  )[]} */
const scripts = [
]

// if (envs.NODE_ENV === 'production') {
//     scripts.push(
//         {
//             src: 'https://app.ruttl.com/plugin.js?id=zkNcmoSeOgS1ykIZJ5fl&e=1',
//             ['id']: 'ruttl-site-embed-script',
//             async: true,
//             defer: true
//         });
// }

if (envs.UMAMI_SRC && envs.UMAMI_ID) {
    scripts.push(
        {
            src: envs.UMAMI_SRC,
            ['data-website-id']: envs.UMAMI_ID,
            ['data-domains']: (envs.APP_URL || 'http://localhost:3000').split('/').filter(w => !!w)[1],
            async: true,
            defer: true
        }
    )
}


const GIT_COMMIT_SHA = envs.DRONE_COMMIT_SHA || Math.random().toString(36).substring(7);

const config: Config = {
    title: getLocalizedConfigValue('title'),
    tagline: getLocalizedConfigValue('tagline'),
    url: envs.APP_URL || 'http://localhost:3000',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    favicon: 'img/favicon.ico',
    deploymentBranch: 'gh-pages',
    trailingSlash: false,

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'lebalz', // Usually your GitHub org/user name.
    projectName: 'events-app', // Usually your repo name.
    customFields: {
        /** Use Testuser in local dev: set TEST_USERNAME to the test users email adress*/
        TEST_USERNAME: envs.TEST_USERNAME,
        NO_AUTH: envs.NODE_ENV !== 'production' && (envs.TEST_USERNAME?.length ?? 0) > 0,
        /** The Domain Name where the api is running */
        APP_URL: envs.NETLIFY
            ? envs.DEPLOY_PRIME_URL!
            : envs.APP_URL || 'http://localhost:3000',
        /** The Domain Name of this app */
        EVENTS_API: envs.BACKEND_URL || 'http://localhost:3002',
        /** The application id generated in https://portal.azure.com */
        SENTRY_DSN: envs.SENTRY_DSN,
        GIT_COMMIT_SHA: envs.DRONE_COMMIT_SHA || Math.random().toString(36).substring(7),
        CURRENT_LOCALE: getLocale()
    } satisfies EventsCustomFields,
    markdown: {
        mermaid: true,
        hooks: {    
            onBrokenMarkdownLinks: 'warn',
            onBrokenMarkdownImages: 'warn'
        }
    },

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'de',
        locales: ['de', 'fr'],
        localeConfigs: {
            de: {
                htmlLang: 'de-CH',
                label: 'Deutsch',

            },
            fr: {
                htmlLang: 'fr-CH',
                label: 'Français'
            },
        },
    },
    future: {
      v4: true,
      faster: {
        /**
         * no config options for swcJsLoader so far. 
         * Instead configure it over the jsLoader in the next step 
         */
        swcJsLoader: false, 
        lightningCssMinimizer: true,
        mdxCrossCompilerCache: true,
        rspackBundler: true,
        swcHtmlMinimizer: true,
        swcJsMinimizer: true,
        rspackPersistentCache: false, // TODO: turn it on when rspack persistent cache is stable
        ssgWorkerThreads: true
      },
      experimental_vcs: 'default-v2'
    },
    webpack: {
      jsLoader: (isServer) => {
        const defaultOptions = require("@docusaurus/faster").getSwcLoaderOptions({isServer});
        return {
          loader: 'builtin:swc-loader', // (only works with Rspack)
          options: {
            ...defaultOptions,
            jsc: {
              parser: {
                ...defaultOptions.jsc.parser,
                decorators: true
              },
              transform: {
                ...defaultOptions.jsc.transform,
                decoratorVersion: '2022-03'
              }
            }
          },
        }
      },
    },
    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: 'sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: (params) => {
                        if (params.locale === 'fr') {
                            return `https://github.com/lebalz/events-app/edit/main/i18n/fr/docusaurus-plugin-content-docs/current/${params.docPath}`
                        }
                        return `https://github.com/lebalz/events-app/edit/main/${params.docPath}`
                    },
                    beforeDefaultRemarkPlugins: [
                        [
                            imagePlugin,
                            { 
                              tagNames: { 
                                sourceRef: 'SourceRef', 
                                figure: 'Figure'
                              },
                              captionVisitors: [
                                (ast, caption) => captionVisitor(ast, caption, (children) => {
                                            return {
                                                type: 'mdxJsxTextElement',
                                                name: 'strong',
                                                attributes: [{ type: 'mdxJsxAttribute', name: 'className', value: 'boxed' }],
                                                children: children
                                            };
                                        })
                              ] satisfies CaptionVisitor[]
                            }
                          ],
                    ],
                    remarkPlugins: [
                        [strongPlugin, { className: 'boxed' }],
                        [
                            deflistPlugin,
                            {
                                tagNames: {
                                    dl: 'Dl',
                                },
                            }
                        ],
                        [
                            mdiPlugin,
                            {
                                colorMapping: {
                                    green: 'var(--ifm-color-success)',
                                    red: 'var(--ifm-color-danger)',
                                    orange: 'var(--ifm-color-warning)',
                                    info: 'var(--ifm-color-info)',
                                    yellow: '#edcb5a',
                                    blue: '#3578e5',
                                    cyan: '#01f0bc'
                                },
                                defaultSize: '1.25em'
                            }
                        ],
                    ]
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/lebalz/events-app/edit/main/',
                },
                theme: {
                    customCss: [
                        './src/css/custom.scss'
                    ],
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        docs: {
            sidebar: {
                hideable: true,
            }
        },
        navbar: {
            title: 'Events',
            logo: {
                alt: 'Events App',
                src: 'img/logo.svg',
                className: 'logo',
            },
            hideOnScroll: false,
            items: [
                { to: '/calendar', label: 'Kalender', position: 'left' },
                { to: '/table', label: 'Tabelle', position: 'left' },
                { to: '/gantt', label: 'Zeitachse', position: 'left' },
                { to: '/subscribe', label: 'Abonnieren', position: 'left' },
                {
                    type: 'custom-myEventsLink',
                    position: 'left',
                },
                {
                    type: 'custom-adminLink',
                    position: 'left'
                },
                { to: '/docs', label: '?', position: 'right' },
                {
                    type: 'localeDropdown',
                    position: 'right',
                },
                {
                    type: 'custom-semesterSelector',
                    position: 'right'
                },
                {
                    type: 'custom-colorPicker',
                    position: 'right'
                },
                {
                    type: 'custom-userBadge',
                    position: 'right'
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Events',
                    items: [
                        {
                            label: 'Kalender',
                            to: '/calendar',
                        },
                        {
                            label: 'Tabelle',
                            to: '/table',
                        },
                        {
                            label: 'Gantt',
                            to: '/gantt',
                        },
                    ],
                },
                {
                    title: 'Admin',
                    items: [
                        {
                            label: 'Dashboard',
                            to: '/admin',
                        },
                        {
                            label: 'Import',
                            to: '/import',
                        },
                        {
                            label: 'Dokumentation',
                            to: '/docs',
                        },
                    ],
                },
                {
                    title: 'Links',
                    items: [
                        {
                            label: 'GBSL',
                            href: 'https://www.gbsl.ch',
                        },
                        {
                            label: 'GBJB',
                            href: 'https://gbjb.ch',
                        },
                        {
                            label: 'GitHub',
                            href: 'https://github.com/lebalz/events-app',
                        },
                        {
                            label: 'Socket.IO Dashboard',
                            href: 'https://admin.socket.io/',
                        },
                    ],
                },
            ],
            copyright: getLocalizedCopyright(),
        },
        prism: {
            theme: lightCodeTheme,
            darkTheme: darkCodeTheme,
            additionalLanguages: ['bash', 'diff', 'json']
        },
        zoom: {
            selector: '.markdown :not(em) > img',
            background: {
                light: 'rgba(255, 255, 255, 0.9)',
                dark: 'rgba(50, 50, 50, 0.9)'
            },
            config: {
                margin: 4,
              // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
            }
          }
    } satisfies Preset.ThemeConfig,
    scripts: [
        ...scripts
    ],
    plugins: [
        'docusaurus-plugin-sass',
        require.resolve('docusaurus-plugin-image-zoom'),
        [
            '@docusaurus/plugin-pwa',
            {
              debug: envs.NODE_ENV === 'development',
              offlineModeActivationStrategies: [
                'appInstalled',
                'standalone',
                'queryString',
              ],
              pwaHead: [
                {
                  tagName: 'link',
                  rel: 'icon',
                  href: '/img/logo.png',
                },
                {
                  tagName: 'link',
                  rel: 'manifest',
                  href: '/manifest.json', // your PWA manifest
                },
                {
                  tagName: 'meta',
                  name: 'theme-color',
                  content: 'rgb(0, 20, 117)',
                },
                {
                  tagName: 'meta',
                  name: 'apple-mobile-web-app-capable',
                  content: 'yes',
                },
                {
                  tagName: 'meta',
                  name: 'apple-mobile-web-app-status-bar-style',
                  content: '#000',
                },
                {
                  tagName: 'link',
                  rel: 'apple-touch-icon',
                  href: '/img/icon_x512.png',
                },
                {
                  tagName: 'link',
                  rel: 'mask-icon',
                  href: '/img/logo-light.svg',
                  color: 'rgb(0, 20, 117)',
                },
                {
                  tagName: 'meta',
                  name: 'msapplication-TileImage',
                  content: '/img/icon_x512.png',
                },
                {
                  tagName: 'meta',
                  name: 'msapplication-TileColor',
                  content: '#000',
                },
              ],
            },
        ],
        [
            dynamicRouterPlugin,
            {
                routes: [
                    {
                        path: '/unsubscribe/',
                        component: '@site/src/components/Unsubscribe',
                    }
                ]
            } satisfies DynamicRouteConfig
        ],
        () => {
            return {
                name: 'socketio-no-dep-warnings',
                configureWebpack(config, isServer, { currentBundler }) {
                    return {
                        plugins: [
                            new currentBundler.instance.DefinePlugin({
                                'envs.WS_NO_BUFFER_UTIL': JSON.stringify('true'),
                                'envs.WS_NO_UTF_8_VALIDATE': JSON.stringify('true')
                            })
                        ]
                    };
                }
            };
        },
        sentryPluginConfig
    ],
    themes: ['@docusaurus/theme-mermaid'],
};

export default config
