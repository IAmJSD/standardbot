<h1 align="center">standardbot</h1>

> **NOTE:** standardbot is still beta and the documentation reflects this. You will likely want to use TSDoc for understanding this.

standardbot is a validation library which is fully Standard Schema V1 compliant. Whereas libraries such as zod and valibot output Standard Schema V1 compliant schemas, they do not accept them inbound so you can't use them inside an object, tuple, or array. This can be annoying if you want to mix libraries and use many different libraries together in a spec compliant way. With this library, you can use many libraries together:

```ts
import { z } from "zod";
import { string } from "valibot";
import { uuidV4, clonedObject } from "standardbot";

const schema = clonedObject({
    name: string(),
    age: z.number(),
    id: uuidV4(),
});
```

You likely wouldn't do this in reality, but this is an example of how interoperable this library is. Much like other libraries, you pass the standard schema into `parse` / `parseAsync` / `safeParse` / `safeParseAsync`. In this library, if you get an error with `parse`, it will be a `ValidationError` which has `issues` in its root:

```ts
import { string, parse } from "standardbot";

try {
    parse(string(), 1);
} catch (e) {
    // e will be a ValidationError
}
```
