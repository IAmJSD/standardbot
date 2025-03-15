import { clonedObject, mutatesObject } from "./object";
import { custom } from "./custom";
import { string } from "./baseTypes";
import { undefinedable } from "./shortcuts";
import { parse, parseAsync, ValidationError } from "../parse";
import { describe, it, expect } from "vitest";

const asyncString = custom<string>(async (input: unknown) => {
    if (typeof input !== "string") {
        return { issues: [{ message: "Not a string" }] };
    }

    return { value: input };
});

describe("clonedObject", () => {
    it("should sync validate as object without ignoring extra keys", () => {
        const schema = clonedObject({
            name: string(),
        });
        const obj1 = { name: "John" };
        const res = parse(schema, obj1);
        expect(res).toEqual({ name: "John" });
        res.name = "Jane";
        expect(obj1.name).toBe("John");
        expect(res.name).toBe("Jane");
        expect(() => parse(schema, [])).toThrow(ValidationError);
        expect(() => parse(schema, { name: 1 })).toThrow(ValidationError);
        expect(parse(schema, { name: "a", extra: "extra" })).toEqual({ name: "a", extra: "extra" });
    });

    it("should sync validate as object with ignoring extra keys", () => {
        const schema = clonedObject({
            name: string(),
        }, true);
        const obj1 = { name: "John" };
        const res = parse(schema, obj1);
        expect(res).toEqual({ name: "John" });
        res.name = "Jane";
        expect(obj1.name).toBe("John");
        expect(res.name).toBe("Jane");
        expect(() => parse(schema, [])).toThrow(ValidationError);
        expect(() => parse(schema, { name: 1 })).toThrow(ValidationError);
        expect(parse(schema, { name: "a", extra: "extra" })).toEqual({ name: "a" });
    });

    it("sync allows undefined keys", () => {
        const schema = clonedObject({
            name: string(),
            a: undefinedable(string()),
        });
        const obj1 = { name: "John" };
        const res = parse(schema, obj1);
        expect(res).toEqual({ name: "John" });
    });

    it("should async validate as object without ignoring extra keys", async () => {
        const schema = clonedObject({
            name: asyncString,
        });
        const obj1 = { name: "John" };
        const res = await parseAsync(schema, obj1);
        expect(res).toEqual({ name: "John" });
        res.name = "Jane";
        expect(obj1.name).toBe("John");
        expect(res.name).toBe("Jane");
        await expect(parseAsync(schema, [])).rejects.toThrow(ValidationError);
        await expect(parseAsync(schema, { name: 1 })).rejects.toThrow(ValidationError);
        await expect(parseAsync(schema, { name: "a", extra: "extra" })).resolves.toEqual({ name: "a", extra: "extra" });
    });

    it("should async validate as object with ignoring extra keys", async () => {
        const schema = clonedObject({
            name: asyncString,
        }, true);
        const obj1 = { name: "John" };
        const res = await parseAsync(schema, obj1);
        expect(res).toEqual({ name: "John" });
        res.name = "Jane";
        expect(obj1.name).toBe("John");
        expect(res.name).toBe("Jane");
        await expect(parseAsync(schema, [])).rejects.toThrow(ValidationError);
        await expect(parseAsync(schema, { name: 1 })).rejects.toThrow(ValidationError);
        await expect(parseAsync(schema, { name: "a", extra: "extra" })).resolves.toEqual({ name: "a" });
    });

    it("async allows undefined keys", async () => {
        const schema = clonedObject({
            name: string(),
            a: undefinedable(asyncString),
        });
        const obj1 = { name: "John" };
        const res = await parseAsync(schema, obj1);
        expect(res).toEqual({ name: "John" });
    });
});

describe("mutatesObject", () => {
    it("should sync validate as object without ignoring extra keys", () => {
        const schema = mutatesObject({
            name: string(),
        });
        const obj1 = { name: "John", a: "a" };
        const res = parse(schema, obj1);
        expect(res).toBe(obj1);
        expect(res).toEqual({ a: "a", name: "John" });
        expect(() => parse(schema, [])).toThrow(ValidationError);
        expect(() => parse(schema, { name: 1 })).toThrow(ValidationError);
        expect(parse(schema, { name: "a", extra: "extra" })).toEqual({ name: "a", extra: "extra" });
    });

    it("should sync validate as object with ignoring extra keys", () => {
        const schema = mutatesObject({
            name: string(),
        }, true);
        const obj1 = { name: "John", a: "a" };
        const res = parse(schema, obj1);
        expect(res).toBe(obj1);
        expect(res).toEqual({ name: "John" });
        expect(() => parse(schema, [])).toThrow(ValidationError);
        expect(() => parse(schema, { name: 1 })).toThrow(ValidationError);
    });

    it("sync allows undefined keys", () => {
        const schema = mutatesObject({
            name: string(),
            a: undefinedable(string()),
        });
        const obj1 = { name: "John" };
        const res = parse(schema, obj1);
        expect(res).toBe(obj1);
        expect(res).toEqual({ name: "John" });
    });

    it("should async validate as object without ignoring extra keys", async () => {
        const schema = mutatesObject({
            name: asyncString,
        });
        const obj1 = { name: "John", a: "a" };
        const res = await parseAsync(schema, obj1);
        expect(res).toBe(obj1);
        expect(res).toEqual({ a: "a", name: "John" });
        await expect(parseAsync(schema, [])).rejects.toThrow(ValidationError);
        await expect(parseAsync(schema, { name: 1 })).rejects.toThrow(ValidationError);
    });

    it("should async validate as object with ignoring extra keys", async () => {
        const schema = mutatesObject({
            name: asyncString,
        }, true);
        const obj1 = { name: "John", a: "a" };
        const res = await parseAsync(schema, obj1);
        expect(res).toBe(obj1);
        expect(res).toEqual({ name: "John" });
        await expect(parseAsync(schema, [])).rejects.toThrow(ValidationError);
        await expect(parseAsync(schema, { name: 1 })).rejects.toThrow(ValidationError);
    });

    it("async allows undefined keys", async () => {
        const schema = mutatesObject({
            name: string(),
            a: undefinedable(asyncString),
        });
        const obj1 = { name: "John" };
        const res = await parseAsync(schema, obj1);
        expect(res).toBe(obj1);
        expect(res).toEqual({ name: "John" });
    });
});
