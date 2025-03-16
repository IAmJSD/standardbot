import { StandardSchemaV1 } from "@standard-schema/spec";
import type { GetSchemaInput, GetSchemaOutput } from "./utils";
import { createStandardSchema } from "./internalUtils";

function processResult<ChildSchema extends StandardSchemaV1>(
    result: StandardSchemaV1.Result<GetSchemaOutput<ChildSchema>>,
    s: Set<GetSchemaOutput<ChildSchema>>,
    issues: StandardSchemaV1.Issue[],
) {
    if (result.issues) {
        issues.push(...result.issues);
    } else {
        s.add(result.value);
    }
}

/** Defines the options for the set schema. */
export interface SetSchemaOpts<ChildSchema extends StandardSchemaV1, AcceptArrays extends boolean = false> {
    /** The child schema to validate the items of the set. */
    childSchema: ChildSchema;

    /** Defines if this validator accepts arrays as input. */
    acceptArrays?: AcceptArrays;
}

export interface SetSchema<ChildSchema extends StandardSchemaV1, AcceptArrays extends boolean = false>
    extends StandardSchemaV1<
        AcceptArrays extends true
            ? GetSchemaInput<ChildSchema>[] | Set<GetSchemaInput<ChildSchema>>
            : Set<GetSchemaInput<ChildSchema>>,
        Set<GetSchemaOutput<ChildSchema>>
    > {
    type: "set";
    message: string;
    opts: SetSchemaOpts<ChildSchema, AcceptArrays>;
}

/**
 * Validates that the input is a set.
 * @param opts - The options for the set schema.
 * @param message - The message to use if the input is not a set.
 * @returns A schema that validates a set and returns a set of the validated items schema.
 */
export function set<ChildSchema extends StandardSchemaV1, AcceptArrays extends boolean = false>(
    opts: SetSchemaOpts<ChildSchema, AcceptArrays>,
    message = "Not a valid set",
): SetSchema<ChildSchema, AcceptArrays> {
    return createStandardSchema<SetSchema<ChildSchema, AcceptArrays>>(
        "set",
        message,
        {
            opts,
        },
        (input) => {
            let ok = true;
            if (!(input instanceof Set)) {
                ok = false;
                if (opts.acceptArrays && Array.isArray(input)) {
                    ok = true;
                }
            }
            if (!ok) {
                return {
                    issues: [{ message }],
                };
            }

            const s: Set<GetSchemaOutput<ChildSchema>> = new Set();
            const promises: Promise<void>[] = [];
            const issues: StandardSchemaV1.Issue[] = [];
            for (const item of input as Set<GetSchemaInput<ChildSchema>> | GetSchemaInput<ChildSchema>[]) {
                const x = opts.childSchema["~standard"].validate(item);
                if (x instanceof Promise) {
                    // @ts-expect-error: Unknown result type is known to be our output type.
                    promises.push(x.then((y) => processResult(y, s, issues)));
                } else {
                    // @ts-expect-error: Unknown result type is known to be our output type.
                    processResult(x, s, issues);
                }
            }

            if (promises.length > 0) {
                return Promise.all(promises).then(() => (issues.length > 0 ? { issues } : { value: s }));
            }
            return issues.length > 0 ? { issues } : { value: s };
        },
    );
}
