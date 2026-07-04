// Cloudflare Pages Functions: /api/get-songs
// 代理 iTunes Search API，解决浏览器跨域问题
// 调用：/api/get-songs?term=鄭秀文&limit=25
//
// 部署到 Cloudflare Pages 后，functions/api/get-songs.ts 自动映射为 /api/get-songs

interface ItunesRawResult {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  previewUrl?: string;
  artworkUrl100?: string;
  primaryGenreName?: string;
  collectionName?: string;
  trackViewUrl?: string;
}

interface ItunesResponse {
  resultCount: number;
  results: ItunesRawResult[];
}

interface Env {
  // Cloudflare Pages Functions 标准环境
}

const ITUNES_ENDPOINT = "https://itunes.apple.com/search";
const CACHE_TTL = 3600; // 1 小时

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, wait } = context;
  const url = new URL(request.url);
  const term = url.searchParams.get("term")?.trim();
  const limitParam = url.searchParams.get("limit");
  const limit = Math.min(Math.max(parseInt(limitParam ?? "25", 10) || 25, 1), 50);

  if (!term) {
    return jsonError(400, "缺少 term 参数");
  }

  // 构造 iTunes 请求 URL
  const params = new URLSearchParams({
    term,
    media: "music",
    country: "hk",
    lang: "zh_hk",
    limit: String(limit),
  });
  const itunesUrl = `${ITUNES_ENDPOINT}?${params.toString()}`;

  // 1. 边缘缓存：同 term 1 小时内不重复调用 iTunes
  const cacheKey = new Request(itunesUrl, request);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) {
    return new Response(cached.body, cached);
  }

  // 2. 转发请求到 iTunes
  let itunesRes: Response;
  try {
    itunesRes = await fetch(itunesUrl, {
      headers: { "User-Agent": "CantoParty/1.0" },
    });
  } catch (e) {
    return jsonError(502, `iTunes 请求失败：${String(e)}`);
  }

  if (!itunesRes.ok) {
    return jsonError(itunesRes.status, `iTunes 返回 ${itunesRes.status}`);
  }

  const data = (await itunesRes.json()) as ItunesResponse;

  // 3. 清洗：只保留有效歌曲（有 previewUrl、trackName、artistName）
  const songs = (data.results ?? []).filter(
    (r): r is Required<Pick<ItunesRawResult, "trackId" | "trackName" | "artistName" | "previewUrl">> & ItunesRawResult =>
      !!r.trackId && !!r.trackName && !!r.artistName && !!r.previewUrl,
  );

  const body = JSON.stringify({ resultCount: songs.length, songs });

  // 4. 构造响应（带 CORS 头）
  const resHeaders = new Headers();
  resHeaders.set("Content-Type", "application/json; charset=utf-8");
  resHeaders.set("Access-Control-Allow-Origin", "*");
  resHeaders.set("Cache-Control", `public, max-age=${CACHE_TTL}`);

  const response = new Response(body, { status: 200, headers: resHeaders });

  // 5. 写入边缘缓存（wait 确保不阻塞响应）
  wait(
    cache.put(
      cacheKey,
      new Response(body, {
        status: 200,
        headers: resHeaders,
      }),
    ),
  );

  return response;
};

// 处理 CORS 预检
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
};

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
