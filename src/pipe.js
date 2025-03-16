export function pipe(root, ...schemas) {
    const rootCpy = root;
    for (const schema of schemas) {
        const [schemaConstructor, ...rest] = schema;
        root = schemaConstructor(root, ...rest);
    }

    /** @type {import("@standard-schema/spec").StandardSchemaV1} */
    return {
        type: "pipe",
        root: rootCpy,
        schemas,
        "~standard": {
            version: 1,
            vendor: "standardbot",
            validate: (input) => root["~standard"].validate(input),
        },
    };
}
