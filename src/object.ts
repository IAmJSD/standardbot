import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createStandardSchema } from "./internalUtils";

function pushResult<T extends Record<string, StandardSchemaV1>>(
    res: StandardSchemaV1.Result<any>,
    clone: Partial<Resolved<T>>,
    key: keyof T,
    issues: StandardSchemaV1.Issue[],
) {
    if (res.issues) {
        issues.push(...res.issues);
    } else {
        clone[key] = res.value as Resolved<T>[keyof T];
    }
}

type Resolved<T> = {
    [K in keyof T]: T[K] extends StandardSchemaV1<infer _, infer O> ? O : never;
};

export interface ClonedObjectSchema<T extends Record<string, StandardSchemaV1>> extends StandardSchemaV1<Resolved<T>> {
    type: "clonedObject";
    properties: T;
    message: string;
    ignoreExtraKeys: boolean;
}

/**
 * Creates a schema that validates that the input is an object with the given properties. Clones the input rather than mutate it.
 * @param properties - The properties of the object.
 * @param ignoreExtraKeys - Whether to ignore extra keys.
 * @param message - The message to display if the input is not a valid object.
 * @returns A schema that validates that the input is an object with the given properties.
 */
export function clonedObject<T extends Record<string, StandardSchemaV1>>(
    properties: T,
    ignoreExtraKeys = false,
    message = "Not a valid object",
): ClonedObjectSchema<T> {
    return createStandardSchema(
        "clonedObject",
        message,
        {
            properties,
            ignoreExtraKeys,
        },
        (input) => {
            if (typeof input !== "object" || input === null || Array.isArray(input)) {
                return { issues: [{ message }] };
            }

            const clone: Partial<Resolved<T>> = {};
            const promises: Promise<void>[] = [];
            const issues: StandardSchemaV1.Issue[] = [];
            const keysSet = new Set<string>(Object.keys(properties));
            for (const [key, value] of Object.entries(input)) {
                const delRes = keysSet.delete(key);
                if (!delRes) {
                    if (!ignoreExtraKeys) {
                        // Put this into the clone.
                        // @ts-expect-error: This is validated at runtime.
                        clone[key] = value;
                    }
                    continue;
                }

                const schema = properties[key];
                // @ts-ignore: This is validated at runtime.
                const res = schema["~standard"].validate(input[key]);
                if (res instanceof Promise) {
                    promises.push(res.then((v) => pushResult(v, clone, key, issues)));
                } else {
                    pushResult(res, clone, key, issues);
                }
            }

            if (keysSet.size > 0) {
                for (const key of keysSet) {
                    const schema = properties[key];
                    const res = schema["~standard"].validate(undefined);
                    if (res instanceof Promise) {
                        promises.push(res.then((v) => pushResult(v, clone, key, issues)));
                    } else {
                        pushResult(res, clone, key, issues);
                    }
                }
            }

            if (promises.length > 0) {
                return Promise.all(promises).then(() =>
                    issues.length > 0 ? { issues } : { value: clone as Resolved<T> },
                );
            }

            return issues.length > 0 ? { issues } : { value: clone as Resolved<T> };
        },
    );
}

export interface MutatesObjectSchema<T extends Record<string, StandardSchemaV1>> extends StandardSchemaV1<Resolved<T>> {
    type: "mutatesObject";
    properties: T;
    ignoreExtraKeys: boolean;
    message: string;
}

/**
 * Creates a schema that validates that the input is an object with the given properties. Mutates the input.
 * @param properties - The properties of the object.
 * @param ignoreExtraKeys - Whether to ignore extra keys.
 * @param message - The message to display if the input is not a valid object.
 * @returns A schema that validates that the input is an object with the given properties.
 */
export function mutatesObject<T extends Record<string, StandardSchemaV1>>(
    properties: T,
    ignoreExtraKeys = false,
    message = "Not a valid object",
): MutatesObjectSchema<T> {
    return createStandardSchema("mutatesObject", message, { properties, ignoreExtraKeys }, (input) => {
        if (typeof input !== "object" || input === null || Array.isArray(input)) {
            return { issues: [{ message }] };
        }

        const keysSet = new Set<string>(Object.keys(properties));
        const promises: Promise<void>[] = [];
        const issues: StandardSchemaV1.Issue[] = [];
        for (const [key, value] of Object.entries(input)) {
            const delRes = keysSet.delete(key);
            if (!delRes) {
                // @ts-ignore: This is validated at runtime.
                if (ignoreExtraKeys) delete input[key];
                continue;
            }
            const schema = properties[key];
            const res = schema["~standard"].validate(value);
            if (res instanceof Promise) {
                promises.push(res.then((v) => pushResult(v, input, key, issues)));
            } else {
                pushResult(res, input, key, issues);
            }
        }

        if (keysSet.size > 0) {
            for (const key of keysSet) {
                const schema = properties[key];
                const res = schema["~standard"].validate(undefined);
                if (res instanceof Promise) {
                    promises.push(res.then((v) => pushResult(v, input, key, issues)));
                } else {
                    pushResult(res, input, key, issues);
                }
            }
        }

        if (promises.length > 0) {
            return Promise.all(promises).then(() => (issues.length > 0 ? { issues } : { value: input as Resolved<T> }));
        }

        return issues.length > 0 ? { issues } : { value: input as Resolved<T> };
    });
}
