import { StandardSchemaV1 } from "@standard-schema/spec";
import { createStandardSchema } from "./internalUtils";

export interface DateSchema extends StandardSchemaV1<string | Date, Date> {
    type: "date";
    message: string;
}

/**
 * Creates a schema that validates that the input is a valid date.
 *
 * @param message - The message to use if the input is not a valid date.
 * @returns A schema that validates that the input is a valid date.
 */
export function date(message = "Not a valid date"): DateSchema {
    return createStandardSchema("date", message, {}, (input) => {
        if (input instanceof Date) {
            return { value: input };
        }
        if (typeof input !== "string") {
            return { issues: [{ message }] };
        }
        const date = new Date(input);
        if (isNaN(date.getTime())) {
            return { issues: [{ message }] };
        }
        return { value: date };
    });
}

type Duration = {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
};

function parseDuration(input: string): Duration | null {
    const regex = /(-?\d+)(y|mo|ms|d|h|m|s)/g;
    const matches = Array.from(input.matchAll(regex));
    if (matches.length === 0) {
        return null;
    }
    const duration: Duration = {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
    };
    for (const match of matches) {
        const [_, amount, unit] = match;
        const number = parseInt(amount);
        switch (unit) {
            case "y":
                duration.years = number;
                break;
            case "mo":
                duration.months = number;
                break;
            case "d":
                duration.days = number;
                break;
            case "h":
                duration.hours = number;
                break;
            case "m":
                duration.minutes = number;
                break;
            case "s":
                duration.seconds = number;
                break;
            case "ms":
                duration.milliseconds = number;
                break;
        }
    }
    return duration;
}

export interface DurationSchema extends StandardSchemaV1<string, Duration> {
    type: "duration";
    message: string;
}

/**
 * Creates a schema that validates that the input is a valid duration.
 *
 * @param message - The message to use if the input is not a valid duration.
 * @returns A schema that validates that the input is a valid duration.
 */
export function duration(message = "Not a valid duration"): DurationSchema {
    return createStandardSchema("duration", message, {}, (input) => {
        if (typeof input !== "string") {
            return { issues: [{ message }] };
        }
        const duration = parseDuration(input);
        if (duration === null) {
            return { issues: [{ message }] };
        }
        return { value: duration };
    });
}
