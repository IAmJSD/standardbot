import type { StandardSchemaV1 } from "@standard-schema/spec";
import { GetSchemaOutput } from "./utils";

export interface UnionSchema<T extends readonly StandardSchemaV1[]>
    extends StandardSchemaV1<GetSchemaOutput<T[number]>> {
    type: "union";
    schemas: T;
}

/** Creates a union of the given schemas. */
export function union<Schemas extends readonly StandardSchemaV1[]>(...schemas: Schemas): UnionSchema<Schemas>;

type Intersection<T extends readonly StandardSchemaV1[]> = T extends []
    ? never
    : T extends [infer U extends StandardSchemaV1]
      ? GetSchemaOutput<U>
      : T extends [infer U extends StandardSchemaV1, ...infer Rest extends readonly StandardSchemaV1[]]
        ? GetSchemaOutput<U> & Intersection<Rest>
        : never;

export interface IntersectionSchema<T extends readonly StandardSchemaV1[]> extends StandardSchemaV1<Intersection<T>> {
    type: "intersection";
    schemas: T;
}

/** Creates an intersection of the given schemas. */
export function intersection<Schemas extends readonly StandardSchemaV1[]>(
    ...schemas: Schemas
): IntersectionSchema<Schemas>;
