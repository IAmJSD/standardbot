import { string, customAsync, boolean, number } from "valibot";
import { expect, test } from "vitest";
import { min, max, lengthEq } from "./size";
import { parse, parseAsync, ValidationError } from "./parse";
import { array } from "./array";

test("min string sync", () => {
    const schema = min(string(), 3);
    expect(parse(schema, "123") satisfies string).toEqual("123");
    expect(() => parse(schema, "12")).toThrow(ValidationError);
});

test("min string async", async () => {
    const schema = min(
        customAsync<string>(async (_) => true),
        3,
    );
    await expect(parseAsync(schema, "123") satisfies Promise<string>).resolves.toEqual("123");
    await expect(parseAsync(schema, "12")).rejects.toThrow(ValidationError);
});

test("min array sync", () => {
    const schema = min(array(string()), 3);
    expect(parse(schema, ["1", "2", "3"]) satisfies string[]).toEqual(["1", "2", "3"]);
    expect(() => parse(schema, ["1", "2"])).toThrow(ValidationError);
});

test("min array async", async () => {
    const schema = min(array(customAsync<string>(async (_) => true)), 3);
    await expect(parseAsync(schema, ["1", "2", "3"]) satisfies Promise<string[]>).resolves.toEqual(["1", "2", "3"]);
    await expect(parseAsync(schema, ["1", "2"])).rejects.toThrow(ValidationError);
});

test("min number sync", () => {
    const schema = min(number(), 3);
    expect(parse(schema, 3) satisfies number).toEqual(3);
    expect(() => parse(schema, 2)).toThrow(ValidationError);
});

test("min number async", async () => {
    const schema = min(number(), 3);
    await expect(parseAsync(schema, 3) satisfies Promise<number>).resolves.toEqual(3);
    await expect(parseAsync(schema, 2)).rejects.toThrow(ValidationError);
});

test("max string sync", () => {
    const schema = max(string(), 3);
    expect(parse(schema, "123") satisfies string).toEqual("123");
    expect(() => parse(schema, "1234")).toThrow(ValidationError);
});

test("max string async", async () => {
    const schema = max(
        customAsync<string>(async (_) => true),
        3,
    );
    await expect(parseAsync(schema, "123") satisfies Promise<string>).resolves.toEqual("123");
    await expect(parseAsync(schema, "1234")).rejects.toThrow(ValidationError);
});

test("max array sync", () => {
    const schema = max(array(string()), 3);
    expect(parse(schema, ["1", "2", "3"]) satisfies string[]).toEqual(["1", "2", "3"]);
    expect(() => parse(schema, ["1", "2", "3", "4"])).toThrow(ValidationError);
});

test("max array async", async () => {
    const schema = max(array(customAsync<string>(async (_) => true)), 3);
    await expect(parseAsync(schema, ["1", "2", "3"]) satisfies Promise<string[]>).resolves.toEqual(["1", "2", "3"]);
    await expect(parseAsync(schema, ["1", "2", "3", "4"])).rejects.toThrow(ValidationError);
});

test("max number sync", () => {
    const schema = max(number(), 3);
    expect(parse(schema, 3) satisfies number).toEqual(3);
    expect(() => parse(schema, 4)).toThrow(ValidationError);
});

test("max number async", async () => {
    const schema = max(number(), 3);
    await expect(parseAsync(schema, 3) satisfies Promise<number>).resolves.toEqual(3);
    await expect(parseAsync(schema, 4)).rejects.toThrow(ValidationError);
});

test("lengthEq string sync", () => {
    const schema = lengthEq(string(), 3);
    expect(parse(schema, "123") satisfies string).toEqual("123");
    expect(() => parse(schema, "1234")).toThrow(ValidationError);
});

test("lengthEq string async", async () => {
    const schema = lengthEq(
        customAsync<string>(async (_) => true),
        3,
    );
    await expect(parseAsync(schema, "123") satisfies Promise<string>).resolves.toEqual("123");
    await expect(parseAsync(schema, "1234")).rejects.toThrow(ValidationError);
});

test("lengthEq array sync", () => {
    const schema = lengthEq(array(string()), 3);
    expect(parse(schema, ["1", "2", "3"]) satisfies string[]).toEqual(["1", "2", "3"]);
    expect(() => parse(schema, ["1", "2"])).toThrow(ValidationError);
});

test("lengthEq array async", async () => {
    const schema = lengthEq(array(customAsync<string>(async (_) => true)), 3);
    await expect(parseAsync(schema, ["1", "2", "3"]) satisfies Promise<string[]>).resolves.toEqual(["1", "2", "3"]);
    await expect(parseAsync(schema, ["1", "2"])).rejects.toThrow(ValidationError);
});

// @ts-expect-error: This should be an error because boolean doesn't have a length property
max(boolean(), 1);

// @ts-expect-error: This should be an error because boolean doesn't have a length property
lengthEq(boolean(), 1);

// @ts-expect-error: This should be an error because boolean doesn't have a length property
min(boolean(), 1);
