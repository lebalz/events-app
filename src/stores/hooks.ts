import React from 'react';
import { rootStore, storesContext } from './stores';

export const useStores = () => React.useContext(storesContext);

export const useStore = <T extends keyof typeof rootStore>(store: T): (typeof rootStore)[T] =>
    React.useContext(storesContext)[store];

// Hook
export const useOnScreen = (
    ref: React.RefObject<HTMLDivElement | null>,
    rootSelector: string | undefined = undefined,
    rootMargin: string = '0px'
) => {
    const [isIntersecting, setIntersecting] = React.useState(false);
    React.useEffect(() => {
        const currentRef = ref?.current;
        if (!currentRef) {
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update our state when observer callback fires
                setIntersecting(entry.isIntersecting);
            },
            {
                rootMargin,
                root: rootSelector ? currentRef.closest(rootSelector) : undefined
            }
        );
        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => {
            observer.disconnect();
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return isIntersecting;
};
