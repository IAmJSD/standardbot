import { StandardSchemaV1 } from "@standard-schema/spec";
import type { GetSchemaOutput } from "./utils";

export function createStandardSchema<T extends StandardSchemaV1 & { type: string; message: string }>(
    typeOf: T["type"],
    message: T["message"],
    otherOptions: Omit<T, "type" | "message" | "~standard">,
    handler: (input: unknown) => StandardSchemaV1.Result<GetSchemaOutput<T>> | Promise<StandardSchemaV1.Result<GetSchemaOutput<T>>>,
): T {
    // @ts-expect-error: This is a hack to get the type to work
    return {
        type: typeOf,
        message,
        ...otherOptions,
        "~standard": {
            version: 1,
            vendor: "standardbot",
            validate: handler,
        },
    };
}
