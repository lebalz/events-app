import { useEffectEvent, useEffect } from 'react';

const MIN_PX = 16;
// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
    ref: React.RefObject<HTMLTextAreaElement | null>,
    value: string,
    rows?: number
) => {
    const adjustHeight = useEffectEvent(() => {
        const element = ref.current;
        if (!element) return;

        element.style.height = 'auto';
        const minPx = (rows ?? 1) * MIN_PX;
        element.style.height = `${Math.max(element.scrollHeight, minPx)}px`;
    });

    useEffect(() => {
        adjustHeight();
    }, [ref, value, rows]);

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        element.addEventListener('focus', adjustHeight);

        return () => {
            element.removeEventListener('focus', adjustHeight);
        };
    }, [ref]);
};

export default useAutosizeTextArea;
