import { clonedRecord, mutatedRecord, clonedMap, mutatedMap } from "./mapsAndRecords";
import { describe, it, expect, test } from "vitest";
import { string, number } from "./baseTypes";
import { parse, parseAsync } from "../parse";
import { custom } from "./custom";

const asyncString = custom<string>(async (input: unknown) => {
    if (typeof input !== "string") {
        return { issues: [{ message: "not a string" }] };
    }
    return { value: input };
});

describe("clonedRecord", () => {
    it("sync should validate and transform a record", () => {
        const schema = clonedRecord(string(), number());
        const input = { a: 1, b: 2 };
        const r2 = parse(schema, input);
        expect(r2).toEqual(input);
        expect(r2).not.toBe(input);
        expect(parse(schema, {})).toEqual({});
        expect(() => parse(schema, "not a record")).toThrow();
        expect(() => parse(schema, [])).toThrow();
        expect(() => parse(schema, { a: "not a number", b: 2 })).toThrow();
    });

    it("async should validate and transform a record", async () => {
        const schema = clonedRecord(asyncString, number());
        const input = { a: 1, b: 2 };
        const r2 = await parseAsync(schema, input);
        expect(r2).toEqual(input);
        expect(r2).not.toBe(input);
        await expect(parseAsync(schema, {})).resolves.toEqual({});
        await expect(parseAsync(schema, "not a record")).rejects.toThrow();
        await expect(parseAsync(schema, [])).rejects.toThrow();
        await expect(parseAsync(schema, { a: "not a number", b: 2 })).rejects.toThrow();
    });
});

describe("mutatedRecord", () => {
    it("sync should validate and transform a record", () => {
        const schema = mutatedRecord(string(), number());
        const input = { a: 1, b: 2 };
        const r2 = parse(schema, input);
        expect(r2).toEqual(input);
        expect(r2).toBe(input);
        expect(parse(schema, {})).toEqual({});
        expect(() => parse(schema, "not a record")).toThrow();
        expect(() => parse(schema, [])).toThrow();
        expect(() => parse(schema, { a: "not a number", b: 2 })).toThrow();
    });

    it("async should validate and transform a record", async () => {
        const schema = mutatedRecord(asyncString, number());
        const input = { a: 1, b: 2 };
        const r2 = await parseAsync(schema, input);
        expect(r2).toEqual(input);
        expect(r2).toBe(input);
        await expect(parseAsync(schema, {})).resolves.toEqual({});
        await expect(parseAsync(schema, "not a record")).rejects.toThrow();
        await expect(parseAsync(schema, [])).rejects.toThrow();
        await expect(parseAsync(schema, { a: "not a number", b: 2 })).rejects.toThrow();
    });
});

describe("clonedMap", () => {
    it("sync should validate and transform a map", () => {
        const schema = clonedMap(string(), number());
        const input = new Map([["a", 1], ["b", 2]]);
        const r2 = parse(schema, input);
        expect(r2).toEqual(input);
        expect(r2).not.toBe(input);
        expect(() => parse(schema, {})).toThrow();
        expect(() => parse(schema, "not a map")).toThrow();
        expect(() => parse(schema, [])).toThrow();
    });

    it("sync should convert an object to a map when convertObjectToMap is true", () => {
        const schema = clonedMap(string(), number(), true);
        const input = { a: 1, b: 2 };
        const r2 = parse(schema, input);
        expect(r2).toEqual(new Map([["a", 1], ["b", 2]]));
        expect(r2).not.toBe(input);
    });

    it("async should validate and transform a map", async () => {
        const schema = clonedMap(asyncString, number());
        const input = new Map([["a", 1], ["b", 2]]);
        const r2 = await parseAsync(schema, input);
        expect(r2).toEqual(input);
        expect(r2).not.toBe(input);
    });
});

describe("mutatedMap", () => {
    it("sync should validate and transform a map", () => {
        const schema = mutatedMap(string(), number());
        const input = new Map([["a", 1], ["b", 2]]);
        const r2 = parse(schema, input);
        expect(r2).toEqual(input);
        expect(r2).toBe(input);
        expect(() => parse(schema, {})).toThrow();
        expect(() => parse(schema, "not a map")).toThrow();
        expect(() => parse(schema, [])).toThrow();
        expect(() => parse(schema, new Map([[1, 2]]))).toThrow();
    });

    it("sync should convert an object to a map when convertObjectToMap is true", () => {
        const schema = mutatedMap(string(), number(), true);
        const input = { a: 1, b: 2 };
        const r2 = parse(schema, input);
        expect(r2).toEqual(new Map([["a", 1], ["b", 2]]));
        expect(r2).not.toBe(input);
    });

    it("async should validate and transform a map", async () => {
        const schema = mutatedMap(asyncString, number());
        const input = new Map([["a", 1], ["b", 2]]);
        const r2 = await parseAsync(schema, input);
        expect(r2).toEqual(input);
        expect(r2).toBe(input);
    });

    it("async should convert an object to a map when convertObjectToMap is true", async () => {
        const schema = mutatedMap(asyncString, number(), true);
        const input = { a: 1, b: 2 };
        const r2 = await parseAsync(schema, input);
        expect(r2).toEqual(new Map([["a", 1], ["b", 2]]));
    });
});

test("handle if a object key mutates", () => {
    const mutator = custom<string>((input) => {
        if (typeof input !== "string") {
            return { issues: [{ message: "not a string" }] };
        }
        return { value: input.toUpperCase() };
    });
    const o = { a: 1 };
    const schema = mutatedRecord(mutator, number());
    const r = parse(schema, o);
    expect(r).toEqual({ A: 1 });
    expect(r).toBe(o);
});

test("handle if a map key mutates", () => {
    const mutator = custom<string>((input) => {
        if (typeof input !== "string") {
            return { issues: [{ message: "not a string" }] };
        }
        return { value: input.toUpperCase() };
    });
    const o = new Map([["a", 1]]);
    const schema = mutatedMap(mutator, number());
    const r = parse(schema, o);
    expect(r).toEqual(new Map([["A", 1]]));
    expect(r).toBe(o);
});
