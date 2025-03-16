import { enumSchema, tsEnum } from "./enum";
import { parse } from "./parse";
import { test, expect } from "vitest";

enum TestEnum {
    Foo = "foo",
    Bar = "bar",
    Baz = "baz",
}

test("enumSchema", () => {
    const schema = tsEnum(TestEnum);
    expect(parse(schema, "foo")).toEqual("foo");
    expect(() => parse(schema, "qux")).toThrow();
});

test("enumSchema", () => {
    const schema = enumSchema(["foo", "bar", "baz"]);
    expect(parse(schema, "foo")).toEqual("foo");
    expect(() => parse(schema, "qux")).toThrow();

    expect(schema.values.foo).toEqual("foo");
    // @ts-expect-error: This should be an error
    expect(schema.values.qux).toBeUndefined();
});
