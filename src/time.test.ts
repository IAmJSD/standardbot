import { test, expect } from "vitest";
import { parse } from "./parse";
import { date, duration, DateSchema, DurationSchema } from "./time";

function testGenericSchema(schema: DateSchema | DurationSchema, allowed: any[]) {
    for (const value of allowed) {
        const result = parse(schema, value);
        if (value instanceof Date) {
            expect(result).toEqual(value);
        } else if (typeof value === "string") {
            if (schema.type === "date") {
                const dateResult = result as Date;
                expect(dateResult).toBeInstanceOf(Date);
                expect(dateResult.toISOString()).toMatch(/^\d{4}-\d{2}-\d{2}/); // Should start with YYYY-MM-DD
            } else {
                expect(result).toMatchObject({
                    years: expect.any(Number),
                    months: expect.any(Number),
                    days: expect.any(Number),
                    hours: expect.any(Number),
                    minutes: expect.any(Number),
                    seconds: expect.any(Number),
                    milliseconds: expect.any(Number),
                });
            }
        }
    }
    expect(() => parse(schema, 1)).toThrow();
    expect(() => parse(schema, "invalid!!")).toThrow();
}

test("date", () => {
    const now = new Date();
    testGenericSchema(date(), [
        now, // Direct Date object
        "2024-03-20", // ISO date string
        "2024-03-20T15:30:00Z", // ISO datetime string
        "2024-03-20T15:30:00.123Z", // ISO datetime with milliseconds
        "2024-03-20T15:30:00+01:00", // ISO datetime with timezone
    ]);

    // Test invalid dates
    expect(() => parse(date(), "2024-13-01")).toThrow(); // Invalid month
    expect(() => parse(date(), "not a date")).toThrow(); // Invalid format
    expect(() => parse(date(), null)).toThrow(); // Invalid type
});

test("duration", () => {
    testGenericSchema(duration(), [
        "1y", // 1 year
        "2mo", // 2 months
        "3d", // 3 days
        "4h", // 4 hours
        "5m", // 5 minutes
        "6s", // 6 seconds
        "7ms", // 7 milliseconds
        "1y2mo3d", // Combined duration
        "1y2mo3d4h5m6s7ms", // Full duration
    ]);

    // Test specific duration parsing
    const result = parse(duration(), "1y2mo3d4h5m6s7ms");
    expect(result).toEqual({
        years: 1,
        months: 2,
        days: 3,
        hours: 4,
        minutes: 5,
        seconds: 6,
        milliseconds: 7,
    });

    // Test invalid durations
    expect(() => parse(duration(), "1x")).toThrow(); // Invalid unit
    expect(() => parse(duration(), "year")).toThrow(); // Invalid format
    expect(() => parse(duration(), "")).toThrow(); // Empty string
});
