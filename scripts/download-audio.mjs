// 下载 iTunes 30 秒预览音频到 public/audio/
// 策略：每歌手下载前 3 首热门歌曲，避免仓库过大
// 运行：node scripts/download-audio.mjs
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SINGERS = [
  "鄭秀文", "陳奕迅", "張敬軒", "Dear Jane", "容祖兒", "古巨基", "楊千嬅",
  "謝安琪", "林奕匡", "張學友", "李克勤", "衛蘭", "Gareth.T", "柳應廷",
  "MIRROR", "ERROR", "周國賢", "陳柏宇", "許廷鏗", "鄭欣宜", "連詩雅",
  "JW", "吳若希", "菊梓喬", "譚詠麟", "張國榮", "梅艷芳", "Beyond",
  "達明一派", "盧冠廷", "葉蒨文", "林憶蓮", "王菲", "劉德華", "黎明",
  "郭富城", "鄭中基", "方力申", "側田", "關心妍", "陳慧琳", "梁詠琪",
  "蔡卓妍", "鍾欣潼", "Twins", "Shine", "Boy'z", "陳曉東", "蘇永康",
  "梁漢文", "陳百強", "羅文", "甄妮", "鄧麗君", "草蜢", "黃耀明",
  "陳慧嫻", "關淑怡", "鄭伊健", "陳小春", "謝霆鋒", "張智霖", "林家謙",
  "陳蕾", "姜濤", "盧瀚霆", "Supper Moment", "ToNick", "Kolor",
  "鍾柔美", "姚焯菲", "炎明熹",
];

const PER_SINGER = 3; // 每位歌手下载前 3 首
const LIMIT = 50; // 搜索返回数量

const audioDir = join(__dirname, "..", "public", "audio");
mkdirSync(audioDir, { recursive: true });

// 读取现有 song-pool.json
const poolPath = join(__dirname, "..", "public", "data", "song-pool.json");
const pool = JSON.parse(readFileSync(poolPath, "utf8"));

// 用 trackId 做 index，方便后面回写 localAudio
const poolIndex = new Map();
for (const s of pool) poolIndex.set(s.trackId, s);

let downloaded = 0;
let skipped = 0;
let failed = 0;

for (const singer of SINGERS) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(singer)}&media=music&country=hk&lang=zh_hk&limit=${LIMIT}`;
  let results = [];
  try {
    const res = await fetch(url, { headers: { "User-Agent": "CantoParty/1.0" } });
    if (!res.ok) {
      console.warn(`  [${singer}] HTTP ${res.status}`);
      continue;
    }
    const data = await res.json();
    results = (data.results ?? []).filter(
      (r) => r.trackId && r.trackName && r.artistName && r.previewUrl && r.kind === "song",
    );
  } catch (e) {
    console.warn(`  [${singer}] 搜索失败：${e.message}`);
    continue;
  }

  // 取前 PER_SINGER 首
  const top = results.slice(0, PER_SINGER);
  for (const r of top) {
    const safeName = `${r.trackId}_${(r.artistName || "").replace(/[\\/:*?"<>|]/g, "_")}_${(r.trackName || "").replace(/[\\/:*?"<>|]/g, "_")}`.slice(0, 80);
    const filename = `${safeName}.m4a`;
    const savePath = join(audioDir, filename);

    if (existsSync(savePath)) {
      skipped++;
      // 回写 localAudio
      if (poolIndex.has(r.trackId)) {
        poolIndex.get(r.trackId).localAudio = `audio/${filename}`;
      }
      continue;
    }

    try {
      const audioRes = await fetch(r.previewUrl);
      if (!audioRes.ok) throw new Error(`HTTP ${audioRes.status}`);
      const buf = Buffer.from(await audioRes.arrayBuffer());
      writeFileSync(savePath, buf);
      downloaded++;
      // 回写 localAudio
      if (poolIndex.has(r.trackId)) {
        poolIndex.get(r.trackId).localAudio = `audio/${filename}`;
      }
      process.stdout.write(`✓ ${r.artistName} - ${r.trackName} (${(buf.length / 1024).toFixed(0)}KB)\n`);
    } catch (e) {
      failed++;
      console.warn(`  ✗ 下载失败：${r.trackName} - ${e.message}`);
    }
    // 放慢请求，避免被限流
    await new Promise((r) => setTimeout(r, 200));
  }
}

// 保存更新后的 song-pool.json
writeFileSync(poolPath, JSON.stringify(pool, null, 2), "utf8");

const localCount = pool.filter((s) => s.localAudio).length;
console.log(`\n===== 完成 =====`);
console.log(`下载：${downloaded} 首，跳过：${skipped} 首，失败：${failed} 首`);
console.log(`song-pool.json 中带 localAudio 的歌曲：${localCount} 首`);
console.log(`音频目录：${audioDir}`);
