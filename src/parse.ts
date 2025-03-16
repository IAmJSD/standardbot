import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { GetSchemaOutput } from "./utils";

/** Defines the class used for validation errors. */
export class ValidationError extends Error {
    constructor(public issues: readonly StandardSchemaV1.Issue[]) {
        super();
    }

    override get message() {
        return this.issues.map((issue) => issue.message).join(", ");
    }
}

function getHandler<T extends StandardSchemaV1>(schema: T, input: unknown) {
    if (schema["~standard"].version !== 1) {
        throw new Error("Unsupported schema version");
    }

    return schema["~standard"].validate(input);
}

/**
 * Parses the input against the schema.
 * @param schema - The schema to parse the input against.
 * @param input - The input to parse.
 * @returns The parsed output.
 */
export function parse<T extends StandardSchemaV1>(schema: T, input: unknown): GetSchemaOutput<T> {
    const result = getHandler(schema, input);
    if (result instanceof Promise) {
        throw new Error("Schema validation is async");
    }

    if (result.issues) {
        throw new ValidationError(result.issues);
    }

    return result.value as GetSchemaOutput<T>;
}

/**
 * Parses the input against the schema, supporting async validation.
 * @param schema - The schema to parse the input against.
 * @param input - The input to parse.
 * @returns The parsed output.
 */
export async function parseAsync<T extends StandardSchemaV1>(schema: T, input: unknown): Promise<GetSchemaOutput<T>> {
    const result = await getHandler(schema, input);
    if (result.issues) {
        throw new ValidationError(result.issues);
    }

    return result.value as GetSchemaOutput<T>;
}

/** Defines the result of a safe parse. */
export type SafeParseResult<T extends StandardSchemaV1> =
    | {
          success: true;
          value: GetSchemaOutput<T>;
      }
    | {
          success: false;
          issues: readonly StandardSchemaV1.Issue[];
      };

/**
 * Parses the input against the schema, returning a object instead of throwing an error.
 * @param schema - The schema to parse the input against.
 * @param input - The input to parse.
 * @returns The parsed output.
 */
export function safeParse<T extends StandardSchemaV1>(schema: T, input: unknown): SafeParseResult<T> {
    const result = getHandler(schema, input);
    if (result instanceof Promise) {
        throw new Error("Schema validation is async");
    }

    if (result.issues) {
        return { success: false, issues: result.issues };
    }

    return { success: true, value: result.value as GetSchemaOutput<T> };
}

/**
 * Parses the input against the schema asynchronously, returning a object instead of throwing an error.
 * @param schema - The schema to parse the input against.
 * @param input - The input to parse.
 * @returns The parsed output.
 */
export async function safeParseAsync<T extends StandardSchemaV1>(
    schema: T,
    input: unknown,
): Promise<SafeParseResult<T>> {
    const result = await getHandler(schema, input);
    if (result.issues) {
        return { success: false, issues: result.issues };
    }

    return { success: true, value: result.value as GetSchemaOutput<T> };
}
