import { sentryWebpackPlugin } from '@sentry/webpack-plugin';
import type { PluginConfig } from '@docusaurus/types';

export const sentryPluginConfig: PluginConfig = () => {
    const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;
    const SENTRY_ORG = process.env.SENTRY_ORG;
    const SENTRY_PROJECT = process.env.SENTRY_PROJECT;
    if (!SENTRY_AUTH_TOKEN || !SENTRY_ORG || !SENTRY_PROJECT) {
        return { name: 'sentry-configuration' };
    }
    return {
        name: 'sentry-configuration',
        configureWebpack(config, isServer, utils, content) {
            return {
                devtool: 'source-map',
                plugins: [
                    sentryWebpackPlugin({
                        authToken: SENTRY_AUTH_TOKEN,
                        org: SENTRY_ORG,
                        project: SENTRY_PROJECT,
                        sourcemaps: {
                            // As you're enabling client source maps, you probably want to delete them after they're uploaded to Sentry.
                            // Set the appropriate glob pattern for your output folder - some glob examples below:
                            filesToDeleteAfterUpload: ['./**/*.map', './build/**/*.map']
                        },
                        telemetry: false,
                        silent: true
                    })
                ]
            };
        }
    };
};
