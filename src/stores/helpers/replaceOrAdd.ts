/**
 * Replaces or adds an item to a list in place.
 */
export const replaceOrAdd = <T>(list: T[], item: T, compareFn: (a: T, b: T) => boolean): void => {
    const idx = list.findIndex((e) => compareFn(e, item));
    if (idx !== -1) {
        list.splice(idx, 1);
    }
    list.push(item);
};
