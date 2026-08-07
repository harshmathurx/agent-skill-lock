export function stableStringify(value) {
    return `${JSON.stringify(sortKeys(value), null, 2)}\n`;
}
export function compareStrings(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
function sortKeys(value) {
    if (Array.isArray(value))
        return value.map(sortKeys);
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value)
            .sort(([a], [b]) => compareStrings(a, b))
            .map(([key, child]) => [key, sortKeys(child)]));
    }
    return value;
}
//# sourceMappingURL=stable.js.map