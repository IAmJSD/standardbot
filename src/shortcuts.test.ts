import { test, expect } from "vitest";
import { undefinedable, nullable } from "./shortcuts";
import { string } from "./baseTypes";
import { parse } from "./parse";

test("undefinedable", () => {
    const schema = undefinedable(string());
    expect(parse(schema, "hello")).toBe("hello");
    expect(parse(schema, undefined)).toBeUndefined();
    expect(() => parse(schema, 1)).toThrow();
});

test("nullable", () => {
    const schema = nullable(string());
    expect(parse(schema, "hello")).toBe("hello");
    expect(parse(schema, null)).toBeNull();
    expect(() => parse(schema, 1)).toThrow();
});
