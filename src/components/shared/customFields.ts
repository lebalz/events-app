import siteConfig from '@generated/docusaurus.config';
import { EventsCustomFields } from '@site/src/types/eventsCustomFields';

const customFields = (siteConfig.customFields ?? {}) as unknown as EventsCustomFields;

export default { ...customFields, NO_AUTH: false };
