import { useEffect, useRef } from 'react';

/**
 * 
 * @see https://codefrontend.com/resize-observer-react
 */
const useResizeObserver = <T extends HTMLElement>(
  callback: (target: T, entry: ResizeObserverEntry) => void
) => {
  const ref = useRef<T>(null)

  /**
   * in the blog post, a useLayoutEffect is proposed. However, this causes a warning hydration mismatch warning when building
   */
  useEffect(() => {
    const element = ref?.current;

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
  }, [callback, ref]);

  return ref
}

export default useResizeObserver;