import { expect, test } from "vitest";
import { parse, parseAsync, ValidationError } from "../parse";
import { custom } from "./custom";

test("custom sync", () => {
    const schema = custom<number>((x) => {
        if (x !== 69) {
            return { issues: [{ message: "not 69!!!" }] };
        }
        return { value: x };
    });
    expect(() => parse(schema, 1)).toThrow(ValidationError);
    expect(parse(schema, 69)).toEqual(69);
});

test("custom async", async () => {
    const schema = custom<number>(async (x) => {
        if (x !== 69) {
            return { issues: [{ message: "not 69!!!" }] };
        }
        return { value: x };
    });
    expect(() => parse(schema, 1)).toThrow("Schema validation is async");
    expect(await parseAsync(schema, 69)).toEqual(69);
});
