export interface EventsCustomFields {
    /** Use Testuser in local dev: set TEST_USERNAME to the test users email adress*/
    TEST_USERNAME?: string;
    NO_AUTH: boolean;
    /** The Domain Name of this app */
    APP_URL: string;
    /** The Domain Name where the api is running */
    EVENTS_API: string;
    /** The application id generated in https://portal.azure.com */
    SENTRY_DSN?: string;
    GIT_COMMIT_SHA: string;
    CURRENT_LOCALE: 'de' | 'fr';
}
