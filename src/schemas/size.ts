import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { GetSchemaInput, GetSchemaOutput } from "../utils";
import { createStandardSchema } from "../internalUtils";

const minOp = Symbol("min");
const maxOp = Symbol("max");
const eqOp = Symbol("eq");

function step2<
    ChildSchema extends StandardSchemaV1<any, number | { length: number }>
>(res: StandardSchemaV1.Result<GetSchemaOutput<ChildSchema>>, n: number, op: Symbol, message: string): StandardSchemaV1.Result<GetSchemaOutput<ChildSchema>> {
    if (res.issues) {
        return res;
    }
    const value = typeof res.value === "number" ? res.value : res.value.length;
    switch (op) {
        case minOp:
            if (value < n) {
                return { issues: [{ message }] };
            }
            break;
        case maxOp:
            if (value > n) {
                return { issues: [{ message }] };
            }
            break;
        case eqOp:
            if (value !== n) {
                return { issues: [{ message }] };
            }
            break;
    }
    return res;
}

function lengthHandler<ChildSchema extends StandardSchemaV1<any, number | { length: number }>>(
    childSchema: ChildSchema, input: unknown, op: Symbol, n: number, message: string,
): StandardSchemaV1.Result<GetSchemaOutput<ChildSchema>> | Promise<StandardSchemaV1.Result<GetSchemaOutput<ChildSchema>>> {
    const res = childSchema["~standard"].validate(input);
    if (res instanceof Promise) {
        // @ts-expect-error
        return res.then((res) => step2<ChildSchema>(res, n, op, message));
    }
    // @ts-expect-error
    return step2(res, n, op, message);
}

export interface MinSchema<ChildSchema extends StandardSchemaV1<any, number | { length: number }>> extends StandardSchemaV1<GetSchemaInput<ChildSchema>> {
    type: "min";
    message: string;
    childSchema: ChildSchema;
    min: number;
}

/**
 * Validates that the input is a string or array with a minimum length, or a number with a minimum value.
 * @param childSchema - The standard schema to validate the items of the array.
 * @param min - The minimum length or value of the input.
 * @param message - The message to use if the input is not a string or array or if the length is less than the minimum.
 * @returns A schema that validates a string or array with a minimum length, or a number with a minimum value.
 */
export function min<ChildSchema extends StandardSchemaV1<any, number | { length: number }>>(childSchema: ChildSchema, min: number, message = "Wrong length"): MinSchema<ChildSchema> {
    return createStandardSchema<MinSchema<ChildSchema>>(
        "min",
        message,
        {
            childSchema,
            min,
        },
        (input) => lengthHandler(childSchema, input, minOp, min, message),
    );
}

export interface MaxSchema<ChildSchema extends StandardSchemaV1<any, number | { length: number }>> extends StandardSchemaV1<GetSchemaInput<ChildSchema>> {
    type: "max";
    message: string;
    childSchema: ChildSchema;
    max: number;
}

/**
 * Validates that the input is a string or array with a maximum length, or a number with a maximum value.
 * @param childSchema - The standard schema to validate the items of the array.
 * @param max - The maximum length or value of the input.
 * @param message - The message to use if the input is not a string or array or if the length is greater than the maximum.
 * @returns A schema that validates a string or array with a maximum length, or a number with a maximum value.
 */
export function max<ChildSchema extends StandardSchemaV1<any, number | { length: number }>>(childSchema: ChildSchema, max: number, message = "Wrong length"): MaxSchema<ChildSchema> {
    return createStandardSchema<MaxSchema<ChildSchema>>(
        "max",
        message,
        {
            childSchema,
            max,
        },
        (input) => lengthHandler(childSchema, input, maxOp, max, message),
    );
}

export interface LengthEqSchema<ChildSchema extends StandardSchemaV1<any, { length: number }>> extends StandardSchemaV1<GetSchemaInput<ChildSchema>> {
    type: "lengthEq";
    message: string;
    childSchema: ChildSchema;
    length: number;
}

/**
 * Validates that the input is an array with a specific length.
 * @param childSchema - The standard schema to validate the items of the array.
 * @param eq - The specific length of the array.
 * @param message - The message to use if the input is not an array or if the length is not equal to the specific length.
 * @returns A schema that validates an array with a specific length.
 */
export function lengthEq<ChildSchema extends StandardSchemaV1<any, { length: number }>>(childSchema: ChildSchema, length: number, message = "Wrong length"): LengthEqSchema<ChildSchema> {
    return createStandardSchema<LengthEqSchema<ChildSchema>>(
        "lengthEq",
        message,
        {
            childSchema,
            length,
        },
        (input) => lengthHandler(childSchema, input, eqOp, length, message),
    );
}
