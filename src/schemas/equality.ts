import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createStandardSchema } from "../internalUtils";

export interface EqSchema<T> extends StandardSchemaV1<T> {
    type: "eq";
    message: string;
    value: T;
}

/** Create a schema that validates that the input is equal to the given value. */
export function eq<T>(value: T, message = "Not equal to value"): EqSchema<T> {
    return createStandardSchema("eq", message, { value }, (input) => {
        if (input !== value) {
            return { issues: [{ message }] };
        }
        return { value };
    });
}

export interface NotEqSchema<T> extends StandardSchemaV1<unknown> {
    type: "notEq";
    message: string;
    value: T;
}

/** Create a schema that validates that the input is not equal to the given value. */
export function notEq<T>(value: T, message = "Equal to value"): NotEqSchema<T> {
    return createStandardSchema("notEq", message, { value }, (input) => {
        if (input === value) {
            return { issues: [{ message }] };
        }
        return { value: input };
    });
}
