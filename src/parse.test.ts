import { expect, test } from "vitest";
import { custom, string } from "./schemas";
import { safeParse, safeParseAsync, ValidationError } from "./parse";

test("ValidationError shows message", () => {
    const err = new ValidationError([{ message: "a" }, { message: "b" }]);
    expect(err.message).toEqual("a, b");
});

test("wrong schema version", () => {
    const s = string();
    // @ts-expect-error: This should be an error
    s["~standard"].version = 2;
    expect(() => safeParse(s, "hello")).toThrow("Unsupported schema version");
});

const asyncSchema = custom(async (input) => {
    if (typeof input !== "string") {
        return { issues: [{ message: "Not a valid string" }] };
    }

    return { value: input };
});


test("sync safe parse", () => {
    const schema = string();
    expect(() => safeParse(asyncSchema, "hello")).toThrow("Schema validation is async");
    expect(safeParse(schema, "hello")).toEqual({ success: true, value: "hello" });
    expect(safeParse(schema, 1)).toEqual({ success: false, issues: [{ message: "Not a valid string" }] });
});

test("async safe parse", async () => {
    expect(await safeParseAsync(asyncSchema, "hello")).toEqual({ success: true, value: "hello" });
    expect(await safeParseAsync(asyncSchema, 1)).toEqual({ success: false, issues: [{ message: "Not a valid string" }] });
});
