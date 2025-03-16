import { describe, expect, it } from "vitest";
import { set } from "./set";
import { string } from "./baseTypes";
import { custom } from "./custom";
import { parse, parseAsync, ValidationError } from "./parse";

const asyncCustom = custom<string>(async (input: unknown) => {
    if (typeof input !== "string") {
        return {
            issues: [{ message: "Not a string" }],
        };
    }
    return { value: input };
});

describe("set", () => {
    it("sync should validate a set", () => {
        const schema = set({
            childSchema: string(),
        });
        expect(parse(schema, new Set(["a", "b", "c"]))).toEqual(new Set(["a", "b", "c"]));
        expect(() => parse(schema, ["a", "b", "c"])).toThrow(ValidationError);
        expect(() => parse(schema, "a")).toThrow(ValidationError);
        expect(() => parse(schema, new Set([1, 2, 3]))).toThrow(ValidationError);
    });

    it("sync should accept arrays when acceptArrays is true", () => {
        const schema = set({
            childSchema: string(),
            acceptArrays: true,
        });
        expect(parse(schema, ["a", "b", "c"])).toEqual(new Set(["a", "b", "c"]));
        expect(parse(schema, ["a", "a", "b", "c"])).toEqual(new Set(["a", "b", "c"]));
        expect(parse(schema, new Set(["a", "b", "c"]))).toEqual(new Set(["a", "b", "c"]));
        expect(() => parse(schema, "a")).toThrow(ValidationError);
        expect(() => parse(schema, new Set([1, 2, 3]))).toThrow(ValidationError);
        expect(() => parse(schema, [1, 2, 3])).toThrow(ValidationError);
    });

    it("async should validate a set", async () => {
        const schema = set({
            childSchema: asyncCustom,
        });
        expect(await parseAsync(schema, new Set(["a", "b", "c"]))).toEqual(new Set(["a", "b", "c"]));
        await expect(parseAsync(schema, ["a", "b", "c"])).rejects.toThrow(ValidationError);
        await expect(parseAsync(schema, "a")).rejects.toThrow(ValidationError);
        await expect(parseAsync(schema, new Set([1, 2, 3]))).rejects.toThrow(ValidationError);
    });

    it("async should accept arrays when acceptArrays is true", async () => {
        const schema = set({
            childSchema: asyncCustom,
            acceptArrays: true,
        });
        expect(await parseAsync(schema, ["a", "b", "c"])).toEqual(new Set(["a", "b", "c"]));
        expect(await parseAsync(schema, ["a", "a", "b", "c"])).toEqual(new Set(["a", "b", "c"]));
        expect(await parseAsync(schema, new Set(["a", "b", "c"]))).toEqual(new Set(["a", "b", "c"]));
        await expect(parseAsync(schema, "a")).rejects.toThrow(ValidationError);
        await expect(parseAsync(schema, new Set([1, 2, 3]))).rejects.toThrow(ValidationError);
        await expect(parseAsync(schema, [1, 2, 3])).rejects.toThrow(ValidationError);
    });
});
