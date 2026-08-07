export function redactArgs(args) {
    return args.map((arg) => (/token|key|secret|password|passwd/i.test(arg) ? '<redacted>' : arg));
}
export function redactUrl(raw) {
    if (!raw)
        return null;
    try {
        const url = new URL(raw);
        url.username = '';
        url.password = '';
        for (const key of [...url.searchParams.keys()]) {
            if (/token|key|secret|password|passwd/i.test(key))
                url.searchParams.set(key, '<redacted>');
        }
        return url.toString();
    }
    catch {
        return '<unparseable-url>';
    }
}
//# sourceMappingURL=redact.js.map