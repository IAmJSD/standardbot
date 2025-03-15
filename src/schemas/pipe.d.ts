import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { GetSchemaInput, GetSchemaOutput } from "../utils";

type Last<T extends StandardSchemaV1[]> = T extends [...infer _, infer L] ? L : never;

// Represents a single pipe transformation tuple like [min, 5]
type PipeConstructorFlattened<Input, Param1 = any, Param2 = any> = [
    (schema: Input, ...args: any[]) => StandardSchemaV1,
    Param1?,
    Param2?
];

// Recursively computes the final schema type after running through all transformations
type RunThroughSchemas<
    Schema extends StandardSchemaV1,
    Transformers extends readonly PipeConstructorFlattened<any, any, any>[]
> = Transformers extends []
    ? Schema
    : Transformers extends readonly [infer First, ...infer Rest]
    ? First extends PipeConstructorFlattened<Schema, any, any>
        ? RunThroughSchemas<ReturnType<First[0]>, Rest extends readonly PipeConstructorFlattened<any, any, any>[] ? Rest : []>
        : never
    : never;

export interface PipeSchema<
    RootSchema extends StandardSchemaV1,
    RawSchemas extends readonly PipeConstructorFlattened<any, any, any>[],
    EndSchema extends StandardSchemaV1
> extends StandardSchemaV1<
    GetSchemaInput<RootSchema>,
    GetSchemaOutput<EndSchema>
> {
    type: "pipe";
    root: RootSchema;
    schemas: RawSchemas;
}

/**
 * Pipe a schema through a series of schemas.
 * @param root - The root schema to pipe.
 * @param schemas - The schemas to pipe into the root schema.
 * @returns A new schema that is the result of piping the root schema through the schemas.
 */
export function pipe<
    RootSchema extends StandardSchemaV1,
    RawSchemas extends readonly PipeConstructorFlattened<RootSchema, any, any>[]
>(
    root: RootSchema,
    ...schemas: RawSchemas
): PipeSchema<RootSchema, RawSchemas, RunThroughSchemas<RootSchema, RawSchemas>>;
