import { boolean, string } from "valibot";
import { pipe } from "./pipe";
import { max, min } from "./size";
import { expect, test } from "vitest";
import { ValidationError, parse } from "./parse";

const stringSchema = pipe(string(), [min, 5], [max, 10]);

test("pipe flow", () => {
    expect(() => parse(stringSchema, 1)).toThrow(ValidationError);
    expect(() => parse(stringSchema, "hi") satisfies string).toThrow(ValidationError);
    expect(parse(stringSchema, "hello") satisfies string).toEqual("hello");
    expect(() => parse(stringSchema, "hello world") satisfies string).toThrow(ValidationError);
});

pipe(
    boolean(),
    // @ts-expect-error: This should be an error
    [min, 5],
);
