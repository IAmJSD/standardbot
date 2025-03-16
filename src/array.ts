import { StandardSchemaV1 } from "@standard-schema/spec";
import type { GetSchemaInput, GetSchemaOutput } from "./utils";
import { createStandardSchema } from "./internalUtils";

export interface ArraySchema<ChildSchema extends StandardSchemaV1>
    extends StandardSchemaV1<GetSchemaInput<ChildSchema>[]> {
    type: "array";
    message: string;
    childSchema: ChildSchema;
}

function pipeResults<T extends { issues: readonly StandardSchemaV1.Issue[] } | { value: any; issues: undefined }>(
    results: T[],
): StandardSchemaV1.Result<(T extends { value: any } ? T["value"] : never)[]> {
    const issues: StandardSchemaV1.Issue[] = [];
    let positive = true;
    const positiveArr = results.map((result) => {
        if (result.issues) {
            positive = false;
            issues.push(...result.issues);
            return undefined;
        }
        return result.value;
    });
    if (positive) {
        return {
            value: positiveArr,
        };
    }
    return {
        issues,
    };
}

/**
 * Validates that the input is an array.
 * @param childSchema - The standard schema to validate the items of the array.
 * @param message - The message to use if the input is not an array.
 * @returns A schema that validates an array and returns an array of the validated items schema.
 */
export function array<ChildSchema extends StandardSchemaV1>(
    childSchema: ChildSchema,
    message = "Not a valid array",
): ArraySchema<ChildSchema> {
    return createStandardSchema<ArraySchema<ChildSchema>>(
        "array",
        message,
        {
            childSchema,
        },
        (input) => {
            if (!Array.isArray(input)) {
                return {
                    issues: [{ message }],
                };
            }

            // The as here is a lie, but we do also split out the promise case below.
            // This is because typescript doesn't understand what we are doing at runtime her
            let anyPromise = false;
            const output = input.map((item) => {
                const result = childSchema["~standard"].validate(item);
                if (result instanceof Promise) {
                    anyPromise = true;
                }
                return result;
            }) as StandardSchemaV1.Result<GetSchemaOutput<ChildSchema>>[];

            if (anyPromise) {
                return Promise.all(output).then(pipeResults);
            }
            return pipeResults(output);
        },
    );
}

type RemapSchemas<ChildSchemas extends readonly StandardSchemaV1[]> = {
    [K in keyof ChildSchemas]: GetSchemaOutput<ChildSchemas[K]>;
};

export interface TupleSchema<ChildSchemas extends readonly StandardSchemaV1[]>
    extends StandardSchemaV1<RemapSchemas<ChildSchemas>> {
    type: "tuple";
    message: string;
    childSchemas: ChildSchemas;
}

/**
 * Validates that the input is a tuple of the given schemas.
 * @param childSchemas - The standard schemas to validate the items of the tuple.
 * @param message - The message to use if the input is not a tuple.
 * @returns A schema that validates a tuple and returns an array of the validated items schemas.
 */
export function tuple<ChildSchemas extends readonly StandardSchemaV1[]>(
    childSchemas: ChildSchemas,
    message = "Not a valid tuple",
): TupleSchema<ChildSchemas> {
    return createStandardSchema<TupleSchema<ChildSchemas>>(
        "tuple",
        message,
        {
            childSchemas,
        },
        (input) => {
            if (!Array.isArray(input)) {
                return {
                    issues: [{ message }],
                };
            }
            if (input.length !== childSchemas.length) {
                return {
                    issues: [{ message }],
                };
            }
            let promises = false;
            const issues: StandardSchemaV1.Issue[] = [];
            const output = input.map((item, index) => {
                const result = childSchemas[index]["~standard"].validate(item);
                if (result instanceof Promise) {
                    promises = true;
                    return result.then((result) => {
                        if (result.issues) {
                            issues.push(...result.issues);
                        }
                        // @ts-expect-error: This is okay, we check this at runtime.
                        return result.value;
                    });
                }
                if (result.issues) {
                    issues.push(...result.issues);
                }
                // @ts-expect-error: This is okay, we check this at runtime.
                return result.value;
            });
            if (promises) {
                return Promise.all(output).then((results) =>
                    issues.length > 0 ? { issues } : { value: results as RemapSchemas<ChildSchemas> },
                );
            }
            return issues.length > 0 ? { issues } : { value: output as RemapSchemas<ChildSchemas> };
        },
    );
}
