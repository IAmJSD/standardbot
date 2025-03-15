import type { StandardSchemaV1 } from "@standard-schema/spec";
import { GetSchemaOutput } from "../utils";

export interface ClonedRecordSchema<
    KeySchema extends StandardSchemaV1<any, string | number | symbol>,
    ValueSchema extends StandardSchemaV1,
> extends StandardSchemaV1<Record<GetSchemaOutput<KeySchema>, GetSchemaOutput<ValueSchema>>> {
    type: "clonedRecord";
    keySchema: KeySchema;
    valueSchema: ValueSchema;
    message: string;
}

/**
 * Creates a schema that validates and transforms the object into a cloned record.
 * 
 * @param keySchema - The schema for the keys of the record.
 * @param valueSchema - The schema for the values of the record.
 * @param message - The message to use if the schema is invalid.
 * @returns A schema that validates and transforms the object into a cloned record.
 */
export function clonedRecord<KeySchema extends StandardSchemaV1<any, string | number | symbol>, ValueSchema extends StandardSchemaV1>(keySchema: KeySchema, valueSchema: ValueSchema, message?: string): ClonedRecordSchema<KeySchema, ValueSchema>;

export interface MutatedRecordSchema<
    KeySchema extends StandardSchemaV1<any, string | number | symbol>,
    ValueSchema extends StandardSchemaV1,
> extends StandardSchemaV1<Record<GetSchemaOutput<KeySchema>, GetSchemaOutput<ValueSchema>>> {
    type: "mutatedRecord";
    keySchema: KeySchema;
    valueSchema: ValueSchema;
    message: string;
}

/**
 * Creates a schema that validates and mutates the object into a record.
 * 
 * @param keySchema - The schema for the keys of the record.
 * @param valueSchema - The schema for the values of the record.
 * @param message - The message to use if the schema is invalid.
 * @returns A schema that validates and mutates the object into a record.
 */
export function mutatedRecord<KeySchema extends StandardSchemaV1<any, string | number | symbol>, ValueSchema extends StandardSchemaV1>(keySchema: KeySchema, valueSchema: ValueSchema, message?: string): MutatedRecordSchema<KeySchema, ValueSchema>;

export interface ClonedMapSchema<
    KeySchema extends StandardSchemaV1,
    ValueSchema extends StandardSchemaV1,
> extends StandardSchemaV1<Map<GetSchemaOutput<KeySchema>, GetSchemaOutput<ValueSchema>>> {
    type: "clonedMap";
    keySchema: KeySchema;
    valueSchema: ValueSchema;
    convertObjectToMap: boolean;
    message: string;
}

/**
 * Creates a schema that validates and transforms the object into a cloned map.
 * 
 * @param keySchema - The schema for the keys of the map.
 * @param valueSchema - The schema for the values of the map.
 * @param convertObjectToMap - Whether to convert the object to a map.
 * @param message - The message to use if the schema is invalid.
 * @returns A schema that validates and transforms the object into a cloned map.
 */
export function clonedMap<KeySchema extends StandardSchemaV1<any, string | number | symbol>, ValueSchema extends StandardSchemaV1>(keySchema: KeySchema, valueSchema: ValueSchema, convertObjectToMap?: boolean, message?: string): ClonedMapSchema<KeySchema, ValueSchema>;

export interface MutatedMapSchema<
    KeySchema extends StandardSchemaV1,
    ValueSchema extends StandardSchemaV1,
> extends StandardSchemaV1<Map<GetSchemaOutput<KeySchema>, GetSchemaOutput<ValueSchema>>> {
    type: "mutatedMap";
    keySchema: KeySchema;
    valueSchema: ValueSchema;
    convertObjectToMap: boolean;
    message: string;
}

/**
 * Creates a schema that validates and mutates the object into a map.
 * 
 * @param keySchema - The schema for the keys of the map.
 * @param valueSchema - The schema for the values of the map.
 * @param convertObjectToMap - Whether to convert the object to a map.
 * @param message - The message to use if the schema is invalid.
 * @returns A schema that validates and mutates the object into a map.
 */
export function mutatedMap<KeySchema extends StandardSchemaV1<any, string | number | symbol>, ValueSchema extends StandardSchemaV1>(keySchema: KeySchema, valueSchema: ValueSchema, convertObjectToMap?: boolean, message?: string): MutatedMapSchema<KeySchema, ValueSchema>;
