import { eq, notEq } from "./equality";
import { expect, test } from "vitest";
import { parse, ValidationError } from "../parse";

test("eq", () => {
    const schema = eq(1);
    expect(parse(schema, 1)).toEqual(1);
    expect(() => parse(schema, 2)).toThrow(ValidationError);
});

test("notEq", () => {
    const schema = notEq(1);
    expect(parse(schema, 2)).toEqual(2);
    expect(() => parse(schema, 1)).toThrow(ValidationError);
});
