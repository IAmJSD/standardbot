import { StandardSchemaV1 } from "@standard-schema/spec";
import { createStandardSchema } from "../internalUtils";

export interface RegexSchema<Output extends string> extends StandardSchemaV1<Output> {
    type: "regex";
    message: string;
    regex: RegExp;
}

function _mkRegexSchema<Output extends string = string>(regex: RegExp, message: string, typeOf: string, bundleRegex: boolean): StandardSchemaV1<Output> {
    return createStandardSchema<any>(typeOf, message, bundleRegex ? { regex } : {}, (input) => {
        if (typeof input !== "string") {
            return { issues: [{ message }] };
        }
        if (!regex.test(input)) {
            return { issues: [{ message }] };
        }
        return { value: input as Output };
    });
}

/**
 * Creates a schema that validates that the input matches the given regular expression.
 * 
 * @param regex - The regular expression to match the input against.
 * @param message - The message to use if the input does not match the regular expression.
 * @returns A schema that validates that the input matches the given regular expression.
 */
export function regex<Output extends string>(regex: RegExp, message = "Not a valid string"): RegexSchema<Output> {
    return _mkRegexSchema(regex, message, "regex", true) as RegexSchema<Output>;
}

export interface EmailSchema extends StandardSchemaV1<string> {
    type: "email";
    message: string;
}

// https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address and Valibot's EMAIL_REGEX
// show that this is a valid email regex
const EMAIL_REGEX = /^[\w+-]+(?:\.[\w+-]+)*@[\da-z]+(?:[.-][\da-z]+)*\.[a-z]{2,}$/iu;

/**
 * Creates a schema that validates that the input is a valid email address.
 * 
 * @param message - The message to use if the input is not a valid email address.
 * @returns A schema that validates that the input is a valid email address.
 */
export function email(message = "Not a valid email address"): EmailSchema {
    return _mkRegexSchema(EMAIL_REGEX, message, "email", false) as EmailSchema;
}

export interface UuidV4Schema extends StandardSchemaV1<`${string}-${string}-${string}-${string}-${string}`> {
    type: "uuidV4";
    message: string;
}

// https://stackoverflow.com/questions/136505/searching-for-uuids-in-text-with-regex
const UUID_V4_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

/**
 * Creates a schema that validates that the input is a valid UUID v4.
 * 
 * @param message - The message to use if the input is not a valid UUID v4.
 * @returns A schema that validates that the input is a valid UUID v4.
 */
export function uuidV4(message = "Not a valid UUID v4"): UuidV4Schema {
    return _mkRegexSchema(UUID_V4_REGEX, message, "uuidV4", false) as UuidV4Schema;
}

export interface UuidV5Schema extends StandardSchemaV1<`${string}-${string}-${string}-${string}-${string}`> {
    type: "uuidV5";
    message: string;
}

const UUID_V5_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-5[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

/**
 * Creates a schema that validates that the input is a valid UUID v5.
 * 
 * @param message - The message to use if the input is not a valid UUID v5.
 * @returns A schema that validates that the input is a valid UUID v5.
 */
export function uuidV5(message = "Not a valid UUID v5"): UuidV5Schema {
    return _mkRegexSchema(UUID_V5_REGEX, message, "uuidV5", false) as UuidV5Schema;
}

export interface HexSchema extends StandardSchemaV1<string> {
    type: "hex";
    message: string;
}

const HEX_REGEX = /^[0-9a-fA-F]+$/;

/**
 * Creates a schema that validates that the input is a valid hex string.
 * 
 * @param message - The message to use if the input is not a valid hex string.
 * @returns A schema that validates that the input is a valid hex string.
 */
export function hex(message = "Not a valid hex string"): HexSchema {
    return _mkRegexSchema(HEX_REGEX, message, "hex", false) as HexSchema;
}

export interface Base64Schema extends StandardSchemaV1<string> {
    type: "base64";
    message: string;
}

const BASE64_REGEX = /^[A-Za-z0-9+/]+={0,2}$/;

/**
 * Creates a schema that validates that the input is a valid base64 string.
 * 
 * @param message - The message to use if the input is not a valid base64 string.
 * @returns A schema that validates that the input is a valid base64 string.
 */
export function base64(message = "Not a valid base64 string"): Base64Schema {
    return _mkRegexSchema(BASE64_REGEX, message, "base64", false) as Base64Schema;
}

// Emoji regex from [emoji-regex-xs](https://github.com/slevithan/emoji-regex-xs) v1.0.0 (MIT license).
const EMOJI_REGEX = /^(?:[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}))*)+$/u;

export interface EmojiSchema extends StandardSchemaV1<string> {
    type: "emoji";
    message: string;
}

/**
 * Creates a schema that validates that the input is a valid emoji.
 * 
 * @param message - The message to use if the input is not a valid emoji.
 * @returns A schema that validates that the input is a valid emoji.
 */
export function emoji(message = "Not a valid emoji"): EmojiSchema {
    return _mkRegexSchema(EMOJI_REGEX, message, "emoji", false) as EmojiSchema;
}
