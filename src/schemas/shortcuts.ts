import { StandardSchemaV1 } from "@standard-schema/spec";
import { union } from "./unionsAndIntersections";
import { eq } from "./equality";

/** Defines when a schema is "undefine-able". */
export const undefinedable = <T extends StandardSchemaV1>(schema: T) =>
    union(schema, eq(undefined));

/** Defines when a schema is "nullable". */
export const nullable = <T extends StandardSchemaV1>(schema: T) =>
    union(schema, eq(null));
