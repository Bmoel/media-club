import { useCallback } from "react";

const SAFE_URL = 'https://anilist.co/home';

function useSafeAnilistUrl() {
    const isSafeAnilistUrl = useCallback((urlString: string | undefined) => {
        try {
            if (typeof urlString !== 'string') {
                throw new Error('invalid url string');
            }
            const url = new URL(urlString);

            if (url.protocol !== 'https:') {
                throw new Error('url string must be https');
            };

            const trustedHost = 'anilist.co';
            if (url.hostname === trustedHost || url.hostname.endsWith(`.${trustedHost}`)) {
                return urlString;
            }
            return SAFE_URL;
        } catch {
            return SAFE_URL;
        }
    }, []);

    return isSafeAnilistUrl;
}

export default useSafeAnilistUrl;