import { union, intersection } from "./unionsAndIntersections";
import { string, number } from "./baseTypes";
import { custom } from "./custom";
import { describe, it, expect } from "vitest";
import { parse, parseAsync, ValidationError } from "../parse";
import { GetSchemaOutput } from "../utils";
import { clonedObject } from "./object";

const asyncString = custom(async (input) => {
    if (typeof input === "string") {
        return { value: input };
    }

    return { issues: [{ message: "Expected a string" }] };
});

describe("union", () => {
    it("sync should validate the input against the schemas", () => {
        const schema = union(string(), number());
        expect(parse(schema, "hello")).toEqual("hello");
        expect(parse(schema, 1)).toEqual(1);
        expect(() => parse(schema, true)).toThrow(ValidationError);

        const _: GetSchemaOutput<typeof schema> = 1;
        // @ts-expect-error: This should be rejected
        const __: GetSchemaOutput<typeof schema> = true;
    });

    it("async should validate the input against the schemas", async () => {
        const schema = union(asyncString, number());
        await expect(parseAsync(schema, "hello")).resolves.toEqual("hello");
        await expect(parseAsync(schema, 1)).resolves.toEqual(1);
        await expect(parseAsync(schema, true)).rejects.toThrow(ValidationError);
    });
});

describe("intersection", () => {
    it("sync should validate the input against the schemas", () => {
        const schema = intersection(clonedObject({ a: number() }), clonedObject({ b: string() }));
        expect(parse(schema, { a: 1, b: "b" })).toEqual({ a: 1, b: "b" });
        expect(() => parse(schema, { a: "a" })).toThrow(ValidationError);
        expect(() => parse(schema, { b: "b" })).toThrow(ValidationError);

        const _: GetSchemaOutput<typeof schema> = { a: 1, b: "b" };
        // @ts-expect-error: This should be rejected
        const __: GetSchemaOutput<typeof schema> = { a: "a" };
        // @ts-expect-error: This should be rejected
        const ___: GetSchemaOutput<typeof schema> = { a: "a", b: "b" };
    });

    it("async should validate the input against the schemas", async () => {
        const schema = intersection(clonedObject({ b: asyncString }), clonedObject({ a: number() }));
        await expect(parseAsync(schema, { a: 1, b: "b" })).resolves.toEqual({ a: 1, b: "b" });
        await expect(parseAsync(schema, { a: "a" })).rejects.toThrow(ValidationError);
        await expect(parseAsync(schema, { b: "b" })).rejects.toThrow(ValidationError);
    });
});
