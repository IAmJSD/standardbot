import { parse, ValidationError } from "../parse";
import { boolean, number, string, bigint, symbol, arrayBuffer, uint8Array, url } from "./baseTypes";
import { expect, test, describe, it } from "vitest";

test("boolean", () => {
    const schema = boolean();
    expect(parse(schema, true)).toEqual(true);
    expect(() => parse(schema, "true")).toThrow(ValidationError);
});

describe("number", () => {
    it("should validate numbers", () => {
        const schema = number();
        expect(parse(schema, 1)).toEqual(1);
        expect(() => parse(schema, "1")).toThrow(ValidationError);
    });

    it("by default disallows NaN", () => {
        const schema = number();
        expect(() => parse(schema, NaN)).toThrow(ValidationError);
    });
    it("by default disallows Infinity", () => {
        const schema = number();
        expect(() => parse(schema, Infinity)).toThrow(ValidationError);
    });

    it("allows NaN if allowNaN is true", () => {
        const schema = number({ allowNaN: true });
        expect(parse(schema, NaN)).toEqual(NaN);
    });
    it("allows Infinity if allowInfinity is true", () => {
        const schema = number({ allowInfinity: true });
        expect(parse(schema, Infinity)).toEqual(Infinity);
    });
});

test("string", () => {
    const schema = string();
    expect(parse(schema, "hello")).toEqual("hello");
    expect(() => parse(schema, 1)).toThrow(ValidationError);
});

test("bigint", () => {
    const schema = bigint();
    expect(parse(schema, BigInt(1))).toEqual(BigInt(1));
    expect(() => parse(schema, "1")).toThrow(ValidationError);
});

test("symbol", () => {
    const schema = symbol("hello");
    expect(() => parse(schema, 1)).toThrow(ValidationError);
    expect(() => parse(schema, Symbol("hello"))).not.toThrow();
    expect(() => parse(schema, Symbol("world"))).toThrow(ValidationError);
    const symSchema = symbol(Symbol("hello"));
    expect(() => parse(symSchema, Symbol("hello"))).toThrow(ValidationError);
});

test("arraybuffer", () => {
    const schema = arrayBuffer();
    expect(() => parse(schema, new ArrayBuffer(1))).not.toThrow();
    expect(() => parse(schema, new Uint8Array(1))).toThrow(ValidationError);
});

test("uint8array", () => {
    const schema = uint8Array();
    expect(() => parse(schema, new Uint8Array(1))).not.toThrow();
    expect(() => parse(schema, new ArrayBuffer(1))).toThrow(ValidationError);
});

test("url", () => {
    const schema = url();
    expect(parse(schema, new URL("https://example.com"))).toEqual(new URL("https://example.com"));
    expect(() => parse(schema, "not a url")).toThrow(ValidationError);
    expect(() => parse(schema, 1)).toThrow(ValidationError);
});
