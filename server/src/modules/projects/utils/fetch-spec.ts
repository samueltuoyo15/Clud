import { BadRequestException, PayloadTooLargeException } from "@nestjs/common";

export type SpecAuth = {
    type: "none" | "basic";
    username?: string;
    password?: string;
};

const MAX_SPEC_SIZE_BYTES = 10 * 1024 * 1024;
const BLOCKED_CONTENT_TYPES = [
    "video/",
    "audio/",
    "image/",
    "application/zip",
    "application/pdf",
    "application/octet-stream"
];

export type FetchSpecResult = {
    spec: unknown;
    etag: string | null;
};

export async function fetchSpec(url: string, auth: SpecAuth): Promise<unknown> {
    const result = await _doFetch(url, auth, null);
    return (result as FetchSpecResult).spec;
}

export async function fetchSpecForPoll(
    url: string,
    auth: SpecAuth,
    knownEtag: string | null,
): Promise<FetchSpecResult | null> {
    return _doFetch(url, auth, knownEtag);
}

async function _doFetch(
    url: string,
    auth: SpecAuth,
    knownEtag: string | null,
): Promise<FetchSpecResult | null> {
    const headers: Record<string, string> = {};

    if (auth.type === "basic") {
        const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString("base64");
        headers.Authorization = `Basic ${credentials}`;
    }

    if (knownEtag) {
        headers["If-None-Match"] = knownEtag;
    }

    let response: Response;

    try {
        response = await fetch(url, {
            headers,
            signal: AbortSignal.timeout(20000)
        });
    } catch {
        throw new BadRequestException(`Could not reach spec URL: ${url}`);
    }

    if (response.status === 304) {
        return null;
    }

    if (!response.ok) {
        throw new BadRequestException(`Spec URL returned HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (BLOCKED_CONTENT_TYPES.some((blocked) => contentType.startsWith(blocked))) {
        throw new BadRequestException(`Invalid content type "${contentType}". Spec must be a JSON document.`);
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_SPEC_SIZE_BYTES) {
        throw new PayloadTooLargeException("Spec file exceeds the 10MB limit. Contact support for enterprise scale.");
    }

    if (!response.body) {
        throw new BadRequestException("Empty response received from spec URL");
    }

    const etag = response.headers.get("etag");

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.length;
        if (totalBytes > MAX_SPEC_SIZE_BYTES) {
            await reader.cancel();
            throw new PayloadTooLargeException("Spec file exceeds the 10MB limit. Contact support for enterprise scale.");
        }
        chunks.push(value);
    }

    const body = Buffer.concat(chunks).toString("utf8");

    try {
        return { spec: JSON.parse(body), etag };
    } catch {
        throw new BadRequestException("Spec URL did not return valid JSON");
    }
}