const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const TOPLIST_CHANNEL_ID = process.env.TOPLIST_CHANNEL_ID;
const UPDATE_SECRET = process.env.UPDATE_SECRET;
const PORT = process.env.PORT || 3000;

if (!DISCORD_TOKEN || !TOPLIST_CHANNEL_ID || !UPDATE_SECRET) {
  console.error("DISCORD_TOKEN, TOPLIST_CHANNEL_ID och UPDATE_SECRET måste finnas som miljövariabler.");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const app = express();
app.use(express.text({ type: "*/*", limit: "200kb" }));

app.get("/", (req,res)=>res.send("Lanista Topplista Bot är online."));
app.get("/health", (req,res)=>res.json({ok:true, discordReady:client.isReady()}));

function fmt(n){ return new Intl.NumberFormat("sv-SE").format(Number(n)||0); }

function buildMessage(payload){
  const entries = Array.isArray(payload.entries) ? payload.entries : [];
  const lines = ["🏆 **JÄRNPAKTEN – DAGENS XP**", ""];
  if (!entries.length) {
    lines.push("_Ingen klanmedlem finns på Lanistas topp 20 just nu._");
  } else {
    entries.forEach((e,i)=>{
      const medal = ["🥇","🥈","🥉"][i] || `**${i+1}.**`;
      const level = e.level ? ` • Grad ${e.level}` : "";
      lines.push(`${medal} **${e.name}** — ${fmt(e.xp)} XP — **#${e.globalRank} totalt**${level}`);
    });
  }
  lines.push("");
  lines.push(`**${entries.length} klanmedlem${entries.length===1?"":"mar"} på Lanistas topp 20.**`);
  const d = new Date(payload.updatedAt || Date.now());
  if (!Number.isNaN(d.getTime())) {
    const stamp = new Intl.DateTimeFormat("sv-SE",{
      timeZone:"Europe/Stockholm",year:"numeric",month:"2-digit",day:"2-digit",
      hour:"2-digit",minute:"2-digit"
    }).format(d);
    lines.push(`_Senast uppdaterad: ${stamp}_`);
  }
  lines.push("_Visar endast klanmedlemmar som finns i Lanistas topp 20._");
  return lines.join("\n").slice(0,2000);
}

async function replaceToplistMessage(channel, content){
  const recent = await channel.messages.fetch({limit:100});
  const oldMessages = recent.filter(m =>
    m.author.id === client.user.id &&
    m.content.startsWith("🏆 **JÄRNPAKTEN – DAGENS XP**")
  );

  for (const message of oldMessages.values()) {
    await message.delete();
  }

  await channel.send({content, allowedMentions:{parse:[]}});
}

app.post("/update", async (req,res)=>{
  try{
    let payload;
    try{ payload = JSON.parse(req.body || "{}"); }
    catch{ return res.status(400).send("Ogiltig JSON"); }

    if(payload.secret !== UPDATE_SECRET) return res.status(403).send("Fel secret");
    if(!client.isReady()) return res.status(503).send("Discord är inte redo");
    if(!Array.isArray(payload.entries)) return res.status(400).send("entries saknas");

    const entries = payload.entries.slice(0,20).map(e=>({
      name:String(e.name||"").slice(0,80),
      xp:Number(e.xp||0),
      globalRank:Number(e.globalRank||0),
      level:String(e.level||"").slice(0,20)
    })).filter(e=>e.name && e.globalRank>0);

    const channel = await client.channels.fetch(TOPLIST_CHANNEL_ID);
    if(!channel || !channel.isTextBased()) return res.status(500).send("Fel kanal-ID");

    await replaceToplistMessage(channel, buildMessage({entries, updatedAt:payload.updatedAt}));
    console.log(`Topplistan uppdaterad: ${entries.length} klanmedlemmar.`);
    res.send("OK");
  }catch(e){
    console.error(e);
    res.status(500).send("Internt fel");
  }
});

client.once("ready", ()=>console.log(`Discord: inloggad som ${client.user.tag}`));
client.login(DISCORD_TOKEN);
app.listen(PORT, "0.0.0.0", ()=>console.log(`HTTP-server lyssnar på port ${PORT}`));
