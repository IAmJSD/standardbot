import type { StandardSchemaV1 } from "@standard-schema/spec";

export interface CustomSchema<Input, Output> extends StandardSchemaV1<Input, Output> {
    type: "custom";
}

export function custom<Input, Output = Input>(
    handler: (input: unknown) => StandardSchemaV1.Result<Output> | Promise<StandardSchemaV1.Result<Output>>,
): CustomSchema<Input, Output> {
    return {
        type: "custom",
        "~standard": {
            version: 1,
            vendor: "standardbot",
            validate: handler,
        },
    };
}
