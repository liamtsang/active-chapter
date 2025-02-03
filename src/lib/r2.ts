import type { Env } from "@/types";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getR2(): Promise<R2Bucket> {
	const env = (await getCloudflareContext()).env as Env;
	const r2 = env.IMAGES;
	if (!r2) {
		throw new Error("R2 binding not found");
	}
	return r2;
}
