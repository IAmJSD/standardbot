import { StandardSchemaV1 } from "@standard-schema/spec";
import { createStandardSchema } from "./internalUtils";

function typeofAbstraction<Schema extends StandardSchemaV1 & { type: string; message: string }>(
    typeOf: Schema["type"],
    message: string,
) {
    // @ts-expect-error: It is mad about the object, but we know they are all like this here.
    return createStandardSchema<Schema>(typeOf, message, {}, (input) => {
        if (typeof input !== typeOf) {
            return {
                issues: [{ message }],
            };
        }
        return {
            value: input,
        };
    });
}

export interface StringSchema extends StandardSchemaV1<string> {
    type: "string";
    message: string;
}

/** Creates a schema that validates that the input is a string. */
export function string(message = "Not a valid string"): StringSchema {
    return typeofAbstraction<StringSchema>("string", message);
}

export interface BooleanSchema extends StandardSchemaV1<boolean> {
    type: "boolean";
    message: string;
}

/** Creates a schema that validates that the input is a boolean. */
export function boolean(message = "Not a valid boolean"): BooleanSchema {
    return typeofAbstraction<BooleanSchema>("boolean", message);
}

/** Defines options for the number schema. */
export interface NumberSchemaOpts {
    /** Defines if NaN is allowed. Defaults to false. */
    allowNaN?: boolean;

    /** Defines if Infinity is allowed. Defaults to false. */
    allowInfinity?: boolean;
}

export interface NumberSchema extends StandardSchemaV1<number> {
    type: "number";
    opts: NumberSchemaOpts;
    message: string;
}

/**
 * Creates a schema that validates that the input is a number.
 * @param opts - Options for the number schema.
 * @param message - The message to use if the input is not a number.
 * @returns A schema that validates that the input is a number.
 */
export function number(opts?: NumberSchemaOpts, message = "Not a valid number"): NumberSchema {
    return createStandardSchema<NumberSchema>("number", message, { opts: opts ?? {} }, (input) => {
        if (typeof input !== "number") {
            return {
                issues: [{ message }],
            };
        }
        if (!opts?.allowNaN && Number.isNaN(input)) {
            return {
                issues: [{ message }],
            };
        }
        if (!opts?.allowInfinity && (input === Infinity || input === -Infinity)) {
            return {
                issues: [{ message }],
            };
        }
        return {
            value: input,
        };
    });
}

export interface BigIntSchema extends StandardSchemaV1<bigint> {
    type: "bigint";
    message: string;
}

/** Creates a schema that validates that the input is a bigint. */
export function bigint(message = "Not a valid bigint"): BigIntSchema {
    return typeofAbstraction<BigIntSchema>("bigint", message);
}

export interface SymbolSchema extends StandardSchemaV1<symbol> {
    type: "symbol";
    message: string;
    content: string | symbol;
}

/** Creates a schema that validates that the input is a symbol. */
export function symbol(content: string | symbol, message = "Not a valid symbol"): SymbolSchema {
    return createStandardSchema<SymbolSchema>("symbol", message, { content }, (input) => {
        if (typeof input !== "symbol") {
            return {
                issues: [{ message }],
            };
        }
        if (typeof content === "string") {
            if (input.description !== content) {
                return {
                    issues: [{ message }],
                };
            }
        } else {
            if (input !== content) {
                return {
                    issues: [{ message }],
                };
            }
        }
        return {
            value: input,
        };
    });
}

export interface ArrayBufferSchema extends StandardSchemaV1<ArrayBuffer> {
    type: "arraybuffer";
    message: string;
}

/** Creates a schema that validates that the input is an ArrayBuffer. */
export function arrayBuffer(message = "Not a valid array buffer"): ArrayBufferSchema {
    return createStandardSchema<ArrayBufferSchema>("arraybuffer", message, {}, (input) => {
        if (!(input instanceof ArrayBuffer)) {
            return { issues: [{ message }] };
        }
        return { value: input };
    });
}

export interface Uint8ArraySchema extends StandardSchemaV1<Uint8Array> {
    type: "uint8array";
    message: string;
}

/** Creates a schema that validates that the input is a Uint8Array. */
export function uint8Array(message = "Not a valid uint8array"): Uint8ArraySchema {
    return createStandardSchema<Uint8ArraySchema>("uint8array", message, {}, (input) => {
        if (!(input instanceof Uint8Array)) {
            return { issues: [{ message }] };
        }
        return { value: input };
    });
}

export interface URLSchema extends StandardSchemaV1<URL | string, URL> {
    type: "url";
    message: string;
}

/** Creates a schema that validates that the input is a URL. */
export function url(message = "Not a valid URL"): URLSchema {
    return createStandardSchema<URLSchema>("url", message, {}, (input) => {
        if (input instanceof URL) {
            return { value: input };
        }
        if (typeof input !== "string") {
            return { issues: [{ message }] };
        }
        try {
            return { value: new URL(input) };
        } catch {
            return { issues: [{ message }] };
        }
    });
}
