import { array, tuple } from "./array";
import { parse, parseAsync, ValidationError } from "./parse";
import { string, number, customAsync } from "valibot";
import { expect, test } from "vitest";
import { custom } from "./custom";

const asyncString = custom<string>(async (value) => {
    if (typeof value !== "string") {
        return {
            issues: [{ message: "Not a string" }],
        };
    }
    return { value };
});

test("not an array", () => {
    expect(() => parse(array(string()), "not an array")).toThrow(ValidationError);
});

test("empty array", () => {
    const result = parse(array(string()), []);
    expect(result).toEqual([]);
});

test("sync has content", () => {
    const result = parse(array(string()), ["a", "b", "c"]);
    // @ts-expect-error: This should be an error since we expect a string
    const _: typeof result = [1];
    expect(result).toEqual(["a", "b", "c"]);
});

test("array has issues", () => {
    try {
        parse(array(string()), [1, 2, 3]);
    } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).issues.length).toBe(3);
    }
});

test("async has content", async () => {
    const asyncHandler = customAsync(async (value: unknown) => true);
    expect(() => parse(array(asyncHandler), ["a", "b", "c"])).toThrow("Schema validation is async");
    const result = await parseAsync(array(asyncHandler), ["a", "b", "c"]);
    expect(result).toEqual(["a", "b", "c"]);
});

test("async has issues", async () => {
    const asyncHandler = customAsync(async (value: unknown) => true);
    try {
        await parseAsync(array(asyncHandler), [1, 2, 3]);
    } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).issues.length).toBe(3);
    }
});

test("sync tuple", () => {
    const tupleSchema = tuple([string(), number()] as const);
    const result = parse(tupleSchema, ["a", 1]);
    expect(result).toEqual(["a", 1]);
    expect(() => parse(tupleSchema, [1, "a"])).toThrow(ValidationError);
    expect(() => parse(tupleSchema, 1)).toThrow(ValidationError);
    const __: typeof result = ["a", 1] as const;
    // @ts-expect-error: This should be an error since we expect a string
    const _: typeof result = [1, "a"] as const;
});

test("async tuple", async () => {
    const tupleSchema = tuple([asyncString, number()] as const);
    const result = await parseAsync(tupleSchema, ["a", 1]);
    expect(result).toEqual(["a", 1]);
    await expect(parseAsync(tupleSchema, [1, "a"])).rejects.toThrow(ValidationError);
    await expect(parseAsync(tupleSchema, ["a", 1, 2])).rejects.toThrow(ValidationError);
    await expect(parseAsync(tupleSchema, 1)).rejects.toThrow(ValidationError);
    const __: typeof result = ["a", 1] as const;
    // @ts-expect-error: This should be an error since we expect a string
    const _: typeof result = [1, "a"] as const;
});
