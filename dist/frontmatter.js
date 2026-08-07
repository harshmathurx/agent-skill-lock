import YAML from 'yaml';
export function parseFrontmatter(text) {
    if (!text.startsWith('---\n'))
        return {};
    const end = text.indexOf('\n---', 4);
    if (end === -1)
        return {};
    const raw = text.slice(4, end);
    const parsed = YAML.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}
export function stringArray(value) {
    if (!Array.isArray(value))
        return [];
    return value.filter((item) => typeof item === 'string').sort();
}
//# sourceMappingURL=frontmatter.js.map