async function _continueIterAsAsync(v, i, schemas, issues, root, intersection) {
    if (v.issues) {
        issues.push(...v.issues);
    } else {
        if (!intersection) return { value: v.value };
        root = v.value;
    }

    for (; i < schemas.length; i++) {
        const schema = schemas[i];
        const res = await schema["~standard"].validate(root);
        if (res.issues) {
            issues.push(...res.issues);
        } else {
            if (!intersection) return { value: res.value };
            root = res.value;
        }
    }

    return issues.length > 0 ? { issues } : { value: root };
}

export function union(...schemas) {
    return {
        type: "union",
        schemas,
        "~standard": {
            version: 1,
            vendor: "standardbot",
            validate: (input) => {
                const issues = [];
                for (let i = 0; i < schemas.length; i++) {
                    const schema = schemas[i];
                    const res = schema["~standard"].validate(input);
                    if (res instanceof Promise) {
                        return res.then((v) => _continueIterAsAsync(v, i + 1, schemas, issues, input));
                    } else {
                        if (res.issues) {
                            issues.push(...res.issues);
                        } else {
                            return { value: res.value };
                        }
                    }
                }

                return { issues };
            },
        },
    };
}

export function intersection(...schemas) {
    return {
        type: "intersection",
        schemas,
        "~standard": {
            version: 1,
            vendor: "standardbot",
            validate: (input) => {
                const issues = [];
                for (let i = 0; i < schemas.length; i++) {
                    const schema = schemas[i];
                    const res = schema["~standard"].validate(input);
                    if (res instanceof Promise) {
                        return res.then((v) => _continueIterAsAsync(v, i + 1, schemas, issues, input, true));
                    } else {
                        if (res.issues) {
                            issues.push(...res.issues);
                        } else {
                            input = res.value;
                        }
                    }
                }
                return issues.length > 0 ? { issues } : { value: input };
            },
        },
    };
}
