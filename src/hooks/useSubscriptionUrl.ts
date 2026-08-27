import _ from 'es-toolkit/compat';
import { useState, useEffect } from 'react';
import customFiels from '@site/src/components/utils/customFields';
const { EVENTS_API } = customFiels;

export const getIcsUrl = (locale: 'de' | 'fr', ics: string) => {
    return `${EVENTS_API}/ical/${locale}/${ics}${ics.endsWith('.ics') ? '' : '.ics'}`;
};
export const getSubscriptionUrl = (locale: 'de' | 'fr', ics: string, name: string) => {
    const url = encodeURIComponent(getIcsUrl(locale, ics));
    const nameEncoded = encodeURIComponent(name);
    return `https://outlook.office.com/calendar/0/addfromweb?url=${url}&name=${nameEncoded}`;
};

export const useIcsUrl = (locale: 'de' | 'fr', ics: string) => {
    const [url, setUrl] = useState(getIcsUrl(locale, ics));

    useEffect(() => {
        setUrl(getIcsUrl(locale, ics));
    }, [locale, ics]);

    return url;
};

export const useSubscriptionUrl = (locale: 'de' | 'fr', ics: string, name: string) => {
    const [url, setUrl] = useState(getSubscriptionUrl(locale, ics, name));

    useEffect(() => {
        setUrl(getSubscriptionUrl(locale, ics, name));
    }, [locale, ics, name]);

    return url;
};
