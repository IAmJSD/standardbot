import type { StandardSchemaV1 } from "@standard-schema/spec";

/** Get the input type of a schema. */
export type GetSchemaInput<T extends StandardSchemaV1> = T extends StandardSchemaV1<infer I>
    ? I
    : never;

/** Get the output type of a schema. */
export type GetSchemaOutput<T extends StandardSchemaV1> = T extends StandardSchemaV1<infer _, infer O>
    ? O
    : never;
