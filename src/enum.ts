import { StandardSchemaV1 } from "@standard-schema/spec";
import { createStandardSchema } from "./internalUtils";

export interface TSEnumSchema<Key extends string | number | symbol, Output extends string | number | symbol>
    extends StandardSchemaV1<Output> {
    type: "tsEnum";
    message: string;
    values: Record<Key, Output>;
}

/**
 * Creates a schema that validates that the input is one of the values in the given native enum.
 *
 * @param values - The native enum to validate the input against.
 * @param message - The message to use if the input is not one of the values in the enum.
 * @returns A schema that validates that the input is one of the values in the given native enum.
 */
export function tsEnum<Key extends string | number | symbol, Output extends string | number | symbol>(
    values: Record<Key, Output>,
    message = "Not a valid enum value",
): TSEnumSchema<Key, Output> {
    const valuesArr = Object.values(values);
    return createStandardSchema("tsEnum", message, { values }, (input) => {
        if (!valuesArr.includes(input as Output)) {
            return { issues: [{ message }] };
        }
        return { value: input as Output };
    });
}

export interface EnumSchema<Output extends string | number | symbol> extends StandardSchemaV1<Output> {
    type: "enum";
    message: string;
    values: {
        [K in Output]: K;
    };
}

/**
 * Creates a schema that validates that the input is one of the values in the given array.
 *
 * @param items - The array to validate the input against.
 * @param message - The message to use if the input is not one of the values in the array.
 * @returns A schema that validates that the input is one of the values in the given array.
 */
export function enumSchema<Output extends string | number | symbol, Items extends readonly Output[]>(
    items: Items,
    message = "Not a valid enum value",
): EnumSchema<Items[number]> {
    const values = items.reduce(
        (acc, item) => {
            acc[item] = item;
            return acc;
        },
        {} as Record<Output, Output>,
    );
    return createStandardSchema("enum", message, { values: values as { [K in Items[number]]: K } }, (input) => {
        if (!((input as string) in values)) {
            return { issues: [{ message }] };
        }
        return { value: input as Output };
    });
}
