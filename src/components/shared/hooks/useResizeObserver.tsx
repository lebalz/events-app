import { useCallback, useEffect, useState } from 'react';

/**
 *
 * @see https://codefrontend.com/resize-observer-react
 */
const useResizeObserver = <T extends HTMLElement>(
    callback: (target: T, entry: ResizeObserverEntry) => void
) => {
    /**
     * a plain `useRef` does not trigger a re-render/effect when the underlying DOM node is
     * swapped out (e.g. when a `Popup` unmounts/remounts its content on open/close). Using a
     * state-backed callback ref ensures the effect below re-runs for every newly mounted node.
     */
    const [element, setElement] = useState<T | null>(null);
    const ref = useCallback((node: T | null) => {
        setElement(node);
    }, []);

    /**
     * in the blog post, a useLayoutEffect is proposed. However, this causes a warning hydration mismatch warning when building
     */
    useEffect(() => {
        if (!element) {
            return;
        }

        const observer = new ResizeObserver((entries) => {
            /** fix nasty layout error: "Error: React Resizeobserver-loop completed with undelivered notifications"
             * @see https://stackoverflow.com/questions/76187282/react-resizeobserver-loop-completed-with-undelivered-notifications/76714495#76714495
             */
            window.requestAnimationFrame((): void | undefined => {
                if (!Array.isArray(entries) || !entries.length) {
                    return;
                }
                callback(element, entries[0]);
            });
        });

        observer.observe(element);
        return () => {
            observer.disconnect();
        };
    }, [callback, element]);

    return ref;
};

export default useResizeObserver;
