import React from 'react';
import { rootStore, storesContext } from './stores';

export const useStores = () => React.useContext(storesContext);

export const useStore = <T extends keyof typeof rootStore>(store: T): typeof rootStore[T] =>
    React.useContext(storesContext)[store];

// Hook
export const useOnScreen = (ref: React.MutableRefObject<HTMLDivElement>, rootSelector: string = undefined, rootMargin: string = "0px") => {
    const [isIntersecting, setIntersecting] = React.useState(false);
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update our state when observer callback fires
                setIntersecting(entry.isIntersecting);
            },
            {
                rootMargin,
                root: rootSelector ? ref.current.closest(rootSelector) : undefined,
            }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            observer.disconnect();
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return isIntersecting;
}