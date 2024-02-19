import type { Router } from "@repo/backend";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";

export const trpc = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: "http://localhost:3000",
		}),
	],
	transformer: superjson,
});
