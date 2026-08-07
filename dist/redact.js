const SECRETISH = /token|api[-_]?key|secret|password|passwd|authorization/i;
export function redactArgs(args) {
    const redacted = [];
    let redactNext = false;
    for (const arg of args) {
        if (redactNext) {
            redacted.push('<redacted>');
            redactNext = false;
            continue;
        }
        if (SECRETISH.test(arg)) {
            if (/^(--?[^=]+|authorization)$/i.test(arg))
                redactNext = true;
            if (arg.includes('=')) {
                const [key] = arg.split('=', 1);
                redacted.push(`${key}=<redacted>`);
            }
            else {
                redacted.push(arg);
            }
            continue;
        }
        redacted.push(arg);
    }
    return redacted;
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