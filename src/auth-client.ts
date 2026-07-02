import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { adminClient } from 'better-auth/client/plugins';
import { oneTimeTokenClient } from 'better-auth/client/plugins';
import { adminAc, userAc } from 'better-auth/plugins/admin/access';
import customFields from './components/shared/customFields';

export const { EVENTS_API } = customFields;

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: EVENTS_API,
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
