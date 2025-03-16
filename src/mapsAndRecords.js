function _apply(output, inKey, outKey, outValue, issues, isMap) {
    if (outKey.issues) {
        issues.push(...outKey.issues);
        return;
    }
    if (outValue.issues) {
        issues.push(...outValue.issues);
        return;
    }

    if (outKey.value !== inKey) {
        // Delete the inKey.
        isMap ? output.delete(inKey) : delete output[inKey];
    }

    if (isMap) return output.set(outKey.value, outValue.value);
    output[outKey.value] = outValue.value;
}

function _doIter(input, output, keySchema, valueSchema, isMap) {
    const promises = [];
    const issues = [];
    for (const [key, value] of isMap ? input.entries() : Object.entries(input)) {
        const keyRes = keySchema["~standard"].validate(key);
        const valueRes = valueSchema["~standard"].validate(value);
        if (keyRes instanceof Promise || valueRes instanceof Promise) {
            promises.push(
                Promise.all([keyRes, valueRes]).then(([outKey, outValue]) =>
                    _apply(output, key, outKey, outValue, issues, isMap),
                ),
            );
        } else {
            _apply(output, key, keyRes, valueRes, issues, isMap);
        }
    }

    if (promises.length > 0) {
        return Promise.all(promises).then(() => (issues.length > 0 ? { issues } : { value: output }));
    }

    return issues.length > 0 ? { issues } : { value: output };
}

export function clonedRecord(keySchema, valueSchema, message = "Invalid record") {
    return {
        type: "clonedRecord",
        keySchema,
        valueSchema,
        message,
        "~standard": {
            version: 1,
            vendor: "standardbot",
            validate: (input) => {
                if (typeof input !== "object" || input === null || Array.isArray(input)) {
                    return { issues: [{ message }] };
                }
                return _doIter(input, {}, keySchema, valueSchema);
            },
        },
    };
}

export function mutatedRecord(keySchema, valueSchema, message = "Invalid record") {
    return {
        type: "mutatedRecord",
        keySchema,
        valueSchema,
        message,
        "~standard": {
            version: 1,
            vendor: "standardbot",
            validate: (input) => {
                if (typeof input !== "object" || input === null || Array.isArray(input)) {
                    return { issues: [{ message }] };
                }
                return _doIter(input, input, keySchema, valueSchema);
            },
        },
    };
}

class MapLikeProxy {
    constructor(obj) {
        this.obj = obj;
    }

    entries() {
        return Object.entries(this.obj);
    }
}

export function clonedMap(keySchema, valueSchema, convertObjectToMap = false, message = "Invalid map") {
    return {
        type: "clonedMap",
        keySchema,
        valueSchema,
        convertObjectToMap,
        message,
        "~standard": {
            version: 1,
            vendor: "standardbot",
            validate: (input) => {
                let ok = true;
                if (!(input instanceof Map)) {
                    ok = false;
                    if (convertObjectToMap && typeof input === "object" && input !== null && !Array.isArray(input)) {
                        input = new MapLikeProxy(input);
                        ok = true;
                    }
                }
                if (!ok) {
                    return { issues: [{ message }] };
                }
                return _doIter(input, new Map(), keySchema, valueSchema, true);
            },
        },
    };
}

export function mutatedMap(keySchema, valueSchema, convertObjectToMap = false, message = "Invalid map") {
    return {
        type: "mutatedMap",
        keySchema,
        valueSchema,
        convertObjectToMap,
        message,
        "~standard": {
            version: 1,
            vendor: "standardbot",
            validate: (input) => {
                let ok = true;
                let makeNew = false;
                if (!(input instanceof Map)) {
                    ok = false;
                    if (convertObjectToMap && typeof input === "object" && input !== null && !Array.isArray(input)) {
                        input = new MapLikeProxy(input);
                        makeNew = true;
                        ok = true;
                    }
                }
                if (!ok) {
                    return { issues: [{ message }] };
                }
                return _doIter(input, makeNew ? new Map() : input, keySchema, valueSchema, true);
            },
        },
    };
}
