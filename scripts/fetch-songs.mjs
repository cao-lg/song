import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ARTISTS = [
  "鄭秀文", "陳奕迅", "張敬軒", "Dear Jane", "容祖兒", "古巨基", "楊千嬅",
  "謝安琪", "林奕匡", "張學友", "李克勤", "衛蘭", "Gareth.T", "柳應廷",
  "MIRROR", "ERROR", "周國賢", "陳柏宇", "許廷鏗", "鄭欣宜", "連詩雅",
  "JW", "吳若希", "菊梓喬", "譚詠麟", "張國榮", "梅艷芳", "Beyond",
  "達明一派", "盧冠廷", "葉蒨文", "林憶蓮", "王菲", "劉德華", "黎明",
  "郭富城", "鄭中基", "方力申", "側田", "關心妍", "陳慧琳", "梁詠琪",
  "蔡卓妍", "鍾欣潼", "Twins", "Shine", "Boy'z", "陳曉東", "蘇永康",
  "許志安", "梁漢文", "陳百強", "羅文", "甄妮", "徐小鳳", "鄧麗君",
  "草蜢", "黃家駒", "黃耀明", "劉美君", "陳慧嫻", "關淑怡", "彭羚",
  "鄭伊健", "陳小春", "謝霆鋒", "張智霖", "林家謙", "張天賦", "陳蕾",
  "姜濤", "呂爵安", "盧瀚霆", "C AllStar", "Supper Moment", "RubberBand",
  "ToNick", "Kolor", "觸執毛", "朱豔強", "Serrini", "陳葦璇", "黃淑蔓",
  "鍾柔美", "姚焯菲", "炎明熹", "cantopop", "廣東歌", "hk pop",
];

const LIMIT = 50;
const seenIds = new Set();
const songs = [];

let done = 0;
for (const term of ARTISTS) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&country=hk&lang=zh_hk&limit=${LIMIT}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "YueGeZai/1.0" },
    });
    if (!res.ok) {
      console.warn(`  [${term}] HTTP ${res.status}`);
      continue;
    }
    const data = await res.json();
    const results = data.results ?? [];
    let added = 0;
    for (const r of results) {
      if (!r.trackId || !r.trackName || !r.artistName || !r.previewUrl) continue;
      if (r.kind && r.kind !== "song") continue;
      if (seenIds.has(r.trackId)) continue;
      seenIds.add(r.trackId);
      songs.push({
        trackId: r.trackId,
        trackName: r.trackName,
        artistName: r.artistName,
        previewUrl: r.previewUrl,
        artworkUrl100: r.artworkUrl100 ?? "",
        primaryGenreName: r.primaryGenreName ?? "",
        releaseDate: r.releaseDate,
        collectionName: r.collectionName,
        trackViewUrl: r.trackViewUrl,
      });
      added++;
    }
    done++;
    console.log(`[${done}/${ARTISTS.length}] ${term}: 返回 ${results.length} 首，新增 ${added} 首，累計 ${songs.length} 首`);
  } catch (e) {
    console.warn(`  [${term}] 請求失敗：${e.message}`);
  }
}

const outPath = join(__dirname, "..", "src", "data", "song-pool.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(songs, null, 2), "utf8");
console.log(`\n✓ 已保存 ${songs.length} 首歌到 ${outPath}`);
