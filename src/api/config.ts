import siteConfig from '@generated/docusaurus.config';
const { BACKEND_URL } = siteConfig.customFields as {
    BACKEND_URL: string;
};

export { BACKEND_URL };
