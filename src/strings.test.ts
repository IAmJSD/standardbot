import { StandardSchemaV1 } from "@standard-schema/spec";
import { test, expect } from "vitest";
import { parse } from "./parse";
import { base64, email, emoji, hex, regex, uuidV4, uuidV5 } from "./strings";

function testGenericSchema(schema: StandardSchemaV1<string>, allowed: string[]) {
    for (const str of allowed) {
        const result = parse(schema, str);
        expect(result).toBe(str);
    }
    expect(() => parse(schema, 1)).toThrow();
    expect(() => parse(schema, "disallowed!!")).toThrow();
}

test("regex", () => {
    const schema = regex(/^[a-z]+$/, "Not a valid string");
    testGenericSchema(schema, ["hello", "world"]);
});

test("email", () =>
    testGenericSchema(email(), ["test@test.com", "test.test@test.com", "test+test@test.com", "test-test@test.com"]));

test("uuidV4", () =>
    testGenericSchema(uuidV4(), ["ab6fa8de-bc4c-4432-80d0-62cfbe9acbdc", "1cbcc3a7-73cf-4204-bca4-ff30dc2518a4"]));

test("uuidV5", () =>
    testGenericSchema(uuidV5(), ["49cd38c3-cb1f-5228-bc2c-2772a5d8afd4", "c2f87ef0-d5fe-56cf-95f3-92377ce50b66"]));

test("hex", () => testGenericSchema(hex(), ["1234567890abcdef", "1234567890abcdef1234567890abcdef"]));

test("base64", () => testGenericSchema(base64(), ["1234567890abcdef"]));

test("emoji", () => testGenericSchema(emoji(), ["😀", "🏳️‍🌈", "🏳️‍⚧️"]));
