import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { adminClient } from 'better-auth/client/plugins';
import { oneTimeTokenClient } from 'better-auth/client/plugins';
import siteConfig from '@generated/docusaurus.config';
import { adminAc, userAc } from 'better-auth/plugins/admin/access';

interface AuthFields {
    BACKEND_URL: string;
}
export const { BACKEND_URL } = siteConfig.customFields as any as AuthFields;

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: BACKEND_URL,
    plugins: [
        adminClient({
            roles: {
                admin: adminAc,
                user: userAc
            }
        }),
        oneTimeTokenClient(),
        inferAdditionalFields({
            user: {
                firstName: {
                    type: 'string'
                },
                lastName: {
                    type: 'string'
                }
            }
        })
    ]
});
