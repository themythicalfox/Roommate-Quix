import { useState, useEffect, useMemo, useRef } from "react";

/* ───────────────────────── PATINA PROTOCOL palette ───────────────────────── */
const C = {
  void: "#090705", char: "#15110c", panel: "#1b1610", panel2: "#221b13",
  line: "#3a2a1c", lineSoft: "#2a2017",
  cream: "#e7d9bf", cream2: "#b6a585", cream3: "#7d6f57",
  rust: "#c66e3a", rustDeep: "#9c5128", copper: "#5e9296", verdigris: "#7fa07f",
  brass: "#c0974f", mauve: "#9a7397", terra: "#b85f33", olive: "#97a06a",
};
const SERIF = "'Iowan Old Style','Palatino Linotype',Palatino,'Book Antiqua',Georgia,serif";
const MONO = "'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace";
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const TYPE_KEYS = ["Homebody", "SocialButterfly", "NightOwl", "EarlyBird", "NeatFreak", "Chill"];

const CAT = {
  "Sleep & Schedule": C.copper, "Cleanliness & Order": C.verdigris,
  "Guests & Social Life": C.rust, "Noise & Atmosphere": C.mauve,
  "Money & Shared Goods": C.brass, "Communication & Conflict": C.terra,
};

/* intake option data */
const GENDERS = ["Woman", "Man", "Non-binary", "Prefer not to say"];
const MBTI_TYPES = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
const MBTI_NAME = { INTJ: "Architect", INTP: "Logician", ENTJ: "Commander", ENTP: "Debater", INFJ: "Advocate", INFP: "Mediator", ENFJ: "Protagonist", ENFP: "Campaigner", ISTJ: "Logistician", ISFJ: "Defender", ESTJ: "Executive", ESFJ: "Consul", ISTP: "Virtuoso", ISFP: "Adventurer", ESTP: "Entrepreneur", ESFP: "Entertainer" };
const ENN_NAME = { 1: "Reformer", 2: "Helper", 3: "Achiever", 4: "Individualist", 5: "Investigator", 6: "Loyalist", 7: "Enthusiast", 8: "Challenger", 9: "Peacemaker" };
const FAITHS = ["Christian", "Catholic", "Jewish", "Muslim", "Hindu", "Buddhist", "Spiritual", "Agnostic", "Atheist", "Other", "Prefer not to say"];

/* ───────────────────────────────── 30 questions ───────────────────────────────── */
const questions = [
  // Sleep & Schedule
  { id: 1, category: "Sleep & Schedule", emoji: "🌙", question: "What's your ideal bedtime on a weeknight?",
    options: [{ text: "Before 10pm", scores: { EarlyBird: 3 } }, { text: "10pm–midnight", scores: { EarlyBird: 1, Chill: 1 } }, { text: "Midnight–2am", scores: { NightOwl: 3 } }, { text: "Whenever, I'm flexible", scores: { Chill: 3 } }] },
  { id: 2, category: "Sleep & Schedule", emoji: "☀️", question: "How do you feel about noise before 9am on weekends?",
    options: [{ text: "Please, no.", scores: { NightOwl: 2, Homebody: 1 } }, { text: "I don't mind light noise", scores: { Chill: 2 } }, { text: "I'm already up making noise", scores: { EarlyBird: 3 } }, { text: "Don't care either way", scores: { Chill: 2, SocialButterfly: 1 } }] },
  { id: 13, category: "Sleep & Schedule", emoji: "⏰", question: "What time do you usually wake up on workdays?",
    options: [{ text: "Before 6:30am", scores: { EarlyBird: 3 } }, { text: "6:30–8am", scores: { EarlyBird: 1, Chill: 1 } }, { text: "8–10am", scores: { Chill: 2 } }, { text: "After 10am, or it varies", scores: { NightOwl: 3 } }] },
  { id: 14, category: "Sleep & Schedule", emoji: "😴", question: "What's your relationship with napping?",
    options: [{ text: "Religiously, every chance I get", scores: { Chill: 2, Homebody: 1 } }, { text: "Sometimes on weekends", scores: { Chill: 1, Homebody: 1 } }, { text: "Rarely — it wrecks my night", scores: { EarlyBird: 2 } }, { text: "Never, I'm up late anyway", scores: { NightOwl: 2 } }] },
  { id: 15, category: "Sleep & Schedule", emoji: "🔁", question: "How consistent is your daily routine?",
    options: [{ text: "Clockwork — same every day", scores: { EarlyBird: 3, NeatFreak: 1 } }, { text: "Mostly consistent", scores: { EarlyBird: 1, Chill: 1 } }, { text: "Depends on the day", scores: { Chill: 2 } }, { text: "Routine? I run on vibes", scores: { NightOwl: 2, SocialButterfly: 1 } }] },
  // Cleanliness & Order
  { id: 3, category: "Cleanliness & Order", emoji: "🧹", question: "How often do you clean common areas?",
    options: [{ text: "Daily", scores: { NeatFreak: 3 } }, { text: "A few times a week", scores: { NeatFreak: 2, EarlyBird: 1 } }, { text: "Once a week or so", scores: { Chill: 2 } }, { text: "When it really needs it", scores: { Chill: 1, NightOwl: 1 } }] },
  { id: 4, category: "Cleanliness & Order", emoji: "🍽️", question: "How long can dirty dishes sit in the sink?",
    options: [{ text: "Zero minutes — wash immediately", scores: { NeatFreak: 3 } }, { text: "A few hours", scores: { NeatFreak: 1, Chill: 1 } }, { text: "A day or two", scores: { Chill: 2 } }, { text: "Until someone cleans them", scores: { SocialButterfly: 1, NightOwl: 1 } }] },
  { id: 16, category: "Cleanliness & Order", emoji: "🧼", question: "A roommate leaves a mess in shared space. You…",
    options: [{ text: "Genuinely stressed by it", scores: { NeatFreak: 3 } }, { text: "Notice, but can let it slide a bit", scores: { NeatFreak: 1, Chill: 1 } }, { text: "Don't really mind", scores: { Chill: 2 } }, { text: "Probably won't even notice", scores: { NightOwl: 1, SocialButterfly: 1 } }] },
  { id: 17, category: "Cleanliness & Order", emoji: "🛏️", question: "Your own bedroom on a normal day is…",
    options: [{ text: "Spotless and organized", scores: { NeatFreak: 3 } }, { text: "Tidy enough", scores: { NeatFreak: 1, EarlyBird: 1 } }, { text: "Lived-in", scores: { Chill: 2 } }, { text: "A creative disaster zone", scores: { NightOwl: 2, SocialButterfly: 1 } }] },
  { id: 18, category: "Cleanliness & Order", emoji: "🗑️", question: "Trash and chores — your style?",
    options: [{ text: "On it before it's a problem", scores: { NeatFreak: 2, EarlyBird: 1 } }, { text: "My share, on a rough schedule", scores: { Chill: 2 } }, { text: "I'll do it when reminded", scores: { Chill: 1, NightOwl: 1 } }, { text: "Honestly, it piles up on me", scores: { NightOwl: 1, SocialButterfly: 1 } }] },
  // Guests & Social Life
  { id: 5, category: "Guests & Social Life", emoji: "🎉", question: "How often do you have friends over?",
    options: [{ text: "Rarely or never", scores: { Homebody: 3 } }, { text: "Once or twice a month", scores: { Homebody: 1, Chill: 1 } }, { text: "Every weekend", scores: { SocialButterfly: 2 } }, { text: "Multiple times a week", scores: { SocialButterfly: 3 } }] },
  { id: 6, category: "Guests & Social Life", emoji: "🛋️", question: "How do you feel about a partner/friend staying over regularly?",
    options: [{ text: "Totally fine", scores: { SocialButterfly: 2, Chill: 1 } }, { text: "Fine occasionally", scores: { Chill: 2 } }, { text: "Prefer a heads-up first", scores: { Homebody: 2, NeatFreak: 1 } }, { text: "Would need a serious talk", scores: { Homebody: 3 } }] },
  { id: 19, category: "Guests & Social Life", emoji: "🌃", question: "Your ideal Friday night at home?",
    options: [{ text: "Quiet night in, just me", scores: { Homebody: 3 } }, { text: "Low-key hang with one or two people", scores: { Chill: 2, Homebody: 1 } }, { text: "People over, music, food", scores: { SocialButterfly: 3 } }, { text: "Out late, home whenever", scores: { NightOwl: 2, SocialButterfly: 1 } }] },
  { id: 20, category: "Guests & Social Life", emoji: "👥", question: "A roommate brings their friend group over unannounced. You feel…",
    options: [{ text: "Ambushed — I need warning", scores: { Homebody: 2, NeatFreak: 1 } }, { text: "Fine if it's not constant", scores: { Chill: 2 } }, { text: "The more the merrier", scores: { SocialButterfly: 3 } }, { text: "Depends on my mood that day", scores: { Chill: 1, NightOwl: 1 } }] },
  { id: 21, category: "Guests & Social Life", emoji: "🏠", question: "How social do you want home to feel day-to-day?",
    options: [{ text: "A calm, private retreat", scores: { Homebody: 3 } }, { text: "Friendly but independent", scores: { Chill: 2 } }, { text: "Buzzing and full of life", scores: { SocialButterfly: 3 } }, { text: "Whatever the night brings", scores: { NightOwl: 2 } }] },
  // Noise & Atmosphere
  { id: 7, category: "Noise & Atmosphere", emoji: "🎵", question: "What's the vibe you bring to a shared home?",
    options: [{ text: "Dead quiet — this is my sanctuary", scores: { Homebody: 3, NeatFreak: 1 } }, { text: "Background music or TV is fine", scores: { Chill: 2 } }, { text: "I like it lively and loud", scores: { SocialButterfly: 3 } }, { text: "Depends on the day", scores: { Chill: 2, NightOwl: 1 } }] },
  { id: 8, category: "Noise & Atmosphere", emoji: "📞", question: "How do you handle long phone/video calls at home?",
    options: [{ text: "In my room, door closed", scores: { Homebody: 2, NeatFreak: 1 } }, { text: "Wherever, but I try to be quiet", scores: { Chill: 2 } }, { text: "Anywhere, don't think about it", scores: { SocialButterfly: 2, NightOwl: 1 } }, { text: "I barely talk on the phone", scores: { Homebody: 2 } }] },
  { id: 22, category: "Noise & Atmosphere", emoji: "🎧", question: "Your relationship with headphones at home?",
    options: [{ text: "Always on — I keep sound to myself", scores: { Homebody: 2, NeatFreak: 1 } }, { text: "On when others are around", scores: { Chill: 2 } }, { text: "Speakers out, I like sharing music", scores: { SocialButterfly: 2 } }, { text: "Depends, I'm not precious about it", scores: { Chill: 1, NightOwl: 1 } }] },
  { id: 23, category: "Noise & Atmosphere", emoji: "🔊", question: "Late-night noise — TV, gaming, cooking?",
    options: [{ text: "Would keep me up, keep it down", scores: { EarlyBird: 2, Homebody: 1 } }, { text: "Fine within reason", scores: { Chill: 2 } }, { text: "I'm usually the one making it", scores: { NightOwl: 3 } }, { text: "I sleep through anything", scores: { Chill: 2 } }] },
  { id: 24, category: "Noise & Atmosphere", emoji: "🌡️", question: "Your preferred home environment?",
    options: [{ text: "Cool, dim, and quiet", scores: { Homebody: 2, NightOwl: 1 } }, { text: "Whatever's comfortable, I adapt", scores: { Chill: 3 } }, { text: "Bright, warm, lively", scores: { SocialButterfly: 2, EarlyBird: 1 } }, { text: "I have strong opinions and a system", scores: { NeatFreak: 2, EarlyBird: 1 } }] },
  // Money & Shared Goods
  { id: 9, category: "Money & Shared Goods", emoji: "🛒", question: "How do you prefer to handle household supplies?",
    options: [{ text: "Split a shared list evenly", scores: { NeatFreak: 2, EarlyBird: 1 } }, { text: "Buy your own stuff separately", scores: { Homebody: 2 } }, { text: "Take turns buying", scores: { Chill: 2 } }, { text: "Figure it out as we go", scores: { SocialButterfly: 1, Chill: 1 } }] },
  { id: 10, category: "Money & Shared Goods", emoji: "🥫", question: "Are you okay with a roommate borrowing your food?",
    options: [{ text: "Yes, what's mine is yours", scores: { SocialButterfly: 3, Chill: 1 } }, { text: "Only if they ask first", scores: { Chill: 2 } }, { text: "Only pantry/shelf-stable stuff", scores: { Homebody: 1, NeatFreak: 1 } }, { text: "Please don't touch my food", scores: { Homebody: 3 } }] },
  { id: 25, category: "Money & Shared Goods", emoji: "💸", question: "Splitting shared costs should be…",
    options: [{ text: "Tracked precisely, settled on time", scores: { NeatFreak: 2, EarlyBird: 1 } }, { text: "Roughly even, no nitpicking", scores: { Chill: 2 } }, { text: "Whoever's around grabs it, evens out", scores: { SocialButterfly: 1, Chill: 1 } }, { text: "I'd rather keep most things separate", scores: { Homebody: 2 } }] },
  { id: 26, category: "Money & Shared Goods", emoji: "💵", question: "A roommate is short on rent this month. You…",
    options: [{ text: "Need a clear repayment plan first", scores: { NeatFreak: 1, EarlyBird: 1, Homebody: 1 } }, { text: "Can help once if they communicate", scores: { Chill: 2 } }, { text: "Cover them, we'll sort it later", scores: { SocialButterfly: 2, Chill: 1 } }, { text: "That makes me really uneasy", scores: { Homebody: 2 } }] },
  { id: 27, category: "Money & Shared Goods", emoji: "🪑", question: "Shared furniture and decor for common areas?",
    options: [{ text: "Let's plan and coordinate it", scores: { NeatFreak: 2, EarlyBird: 1 } }, { text: "We can split a few key things", scores: { Chill: 2, SocialButterfly: 1 } }, { text: "Whatever, I'm easy", scores: { Chill: 2 } }, { text: "I'll keep my stuff in my room", scores: { Homebody: 3 } }] },
  // Communication & Conflict
  { id: 11, category: "Communication & Conflict", emoji: "💬", question: "If something bothers you about a roommate, you…",
    options: [{ text: "Bring it up directly and quickly", scores: { NeatFreak: 2, EarlyBird: 1 } }, { text: "Wait a bit, then mention it", scores: { Chill: 2 } }, { text: "Drop hints and hope they notice", scores: { Homebody: 1, NightOwl: 1 } }, { text: "Avoid it and stew internally", scores: { NightOwl: 2, Homebody: 1 } }] },
  { id: 12, category: "Communication & Conflict", emoji: "🤝", question: "How much do you want to socialize with your roommate?",
    options: [{ text: "Best friends who hang out daily", scores: { SocialButterfly: 3 } }, { text: "Friendly but independent", scores: { Chill: 3 } }, { text: "Cordial and polite", scores: { Homebody: 2, EarlyBird: 1 } }, { text: "Ships in the night is fine", scores: { NightOwl: 2, Homebody: 1 } }] },
  { id: 28, category: "Communication & Conflict", emoji: "📅", question: "How often should roommates check in?",
    options: [{ text: "Regular scheduled check-ins", scores: { NeatFreak: 1, EarlyBird: 2 } }, { text: "Now and then, when needed", scores: { Chill: 2 } }, { text: "Casually, as we cross paths", scores: { SocialButterfly: 1, Chill: 1 } }, { text: "As little as possible, honestly", scores: { Homebody: 2, NightOwl: 1 } }] },
  { id: 29, category: "Communication & Conflict", emoji: "🧠", question: "When you're stressed at home, you…",
    options: [{ text: "Retreat to my room and decompress alone", scores: { Homebody: 3 } }, { text: "Stay quiet but stick around", scores: { Chill: 2 } }, { text: "Talk it out — I process out loud", scores: { SocialButterfly: 2 } }, { text: "Go quiet and stay up late", scores: { NightOwl: 2 } }] },
  { id: 30, category: "Communication & Conflict", emoji: "🗣️", question: "A roommate gives you direct feedback. Your gut reaction?",
    options: [{ text: "Appreciate it — just tell me straight", scores: { NeatFreak: 2, EarlyBird: 1 } }, { text: "Fine, I can roll with it", scores: { Chill: 3 } }, { text: "Prefer it framed gently", scores: { Homebody: 1, SocialButterfly: 1 } }, { text: "I'd need a minute, then I'm okay", scores: { Homebody: 1, NightOwl: 1 } }] },
];

/* ───────────────────────────────── archetypes ───────────────────────────────── */
const roommateTypes = {
  Homebody: { emoji: "🏡", label: "The Homebody", color: C.copper, tagline: "Home is a sanctuary, not a social hub.",
    description: "You treat your home as your personal retreat. You value quiet, your own space, and predictable routines. You're not antisocial — you just recharge in solitude and prefer knowing what to expect.",
    strengths: ["Respectful of personal space", "Low drama, low noise", "Consistent and reliable"], watchOut: "May find it hard to speak up when boundaries are crossed.",
    compatibility: { Homebody: { score: 5, note: "Two homebodies create a peaceful, low-key haven. You'll rarely clash." }, EarlyBird: { score: 4, note: "Both value quiet and routines. Small schedule adjustments go a long way." }, NeatFreak: { score: 4, note: "You share a love of order and calm. Just align on cleanliness standards upfront." }, Chill: { score: 3, note: "The Chill type respects your space. Watch for casualness about shared rules." }, NightOwl: { score: 2, note: "Late-night energy can disrupt your sanctuary. Set clear quiet hours early." }, SocialButterfly: { score: 1, note: "A frequent stream of guests will stress you out. Requires serious negotiation." } } },
  SocialButterfly: { emoji: "🦋", label: "The Social Butterfly", color: C.rust, tagline: "The more the merrier — always.",
    description: "Your home is a hub, not a hideout. You love having people over, a buzzing atmosphere, and a roommate who's also a friend. Shared spaces should feel alive.",
    strengths: ["Fun and welcoming energy", "Great at building community", "Easy-going about sharing"], watchOut: "Can underestimate how draining a busy home is for others.",
    compatibility: { SocialButterfly: { score: 5, note: "A non-stop social home — you'll love it. Just make sure you both recharge somehow!" }, Chill: { score: 4, note: "Chill types enjoy your energy without adding drama. They'll flow with you." }, NightOwl: { score: 3, note: "Night owls appreciate late gatherings. Align on daytime expectations." }, EarlyBird: { score: 2, note: "Your late-night guests vs. their 7am alarm. Needs clear house rules." }, Homebody: { score: 1, note: "Your liveliness is their nightmare. Only works with very clear, respected boundaries." }, NeatFreak: { score: 2, note: "Your guests + their standards = friction. A chore chart and guest policy is essential." } } },
  NightOwl: { emoji: "🦉", label: "The Night Owl", color: C.mauve, tagline: "The world is quieter after midnight.",
    description: "You come alive after dark. Late nights are your peak hours — whether that's work, gaming, socializing, or just existing. Mornings are not your thing.",
    strengths: ["Won't bother anyone in the morning", "Usually fine with evening noise", "Self-sufficient and independent"], watchOut: "Late-night habits can disrupt lighter sleepers.",
    compatibility: { NightOwl: { score: 5, note: "Synchronized schedules mean zero conflict. The place is yours after midnight." }, SocialButterfly: { score: 3, note: "You share love of late nights. Watch for late guest frequency." }, Chill: { score: 4, note: "Chill types roll with your schedule. They won't guilt you for sleeping till noon." }, Homebody: { score: 2, note: "Your active hours are their quiet hours. Coordinate intentionally." }, EarlyBird: { score: 1, note: "Almost opposite schedules. Can work — but clashes will happen." }, NeatFreak: { score: 2, note: "Late-night snacks and messes conflict with high standards. Night routines need structure." } } },
  EarlyBird: { emoji: "🌅", label: "The Early Bird", color: C.brass, tagline: "Up at 6, done by 10. That's just facts.",
    description: "You're a morning person through and through. Your day is planned, your routines are sacred, and you probably meal-prep on Sundays. Structure feels like freedom to you.",
    strengths: ["Reliable and consistent", "Proactive about shared responsibilities", "Low conflict when routines are respected"], watchOut: "Can come across as rigid or judgmental of different lifestyles.",
    compatibility: { EarlyBird: { score: 5, note: "In sync from sunrise. You'll co-exist with total harmony." }, NeatFreak: { score: 4, note: "Shared values around structure and responsibility. A natural pair." }, Homebody: { score: 4, note: "Both value quiet and calm. Complementary energy." }, Chill: { score: 3, note: "Chill types won't disrupt your mornings intentionally. Set expectations early." }, SocialButterfly: { score: 2, note: "Late guests are a problem for early risers. House rules matter a lot here." }, NightOwl: { score: 1, note: "Nearly opposite schedules. Works only if you barely interact." } } },
  NeatFreak: { emoji: "✨", label: "The Neat Freak", color: C.verdigris, tagline: "A clean space is a clear mind.",
    description: "You have standards — and they're non-negotiable. Dishes go in the dishwasher, counters get wiped, and common areas should always be guest-ready. You just know how a home should function.",
    strengths: ["Keeps shared spaces spotless", "Takes initiative on chores", "Sets a high bar everyone benefits from"], watchOut: "Can create tension if you expect others to match your exact standards.",
    compatibility: { NeatFreak: { score: 5, note: "The apartment will look incredible. You'll never fight over the sink." }, EarlyBird: { score: 4, note: "Both value responsibility and structure. Chore charts get followed." }, Homebody: { score: 4, note: "Homebodies are low-mess and appreciate a clean space. Great fit." }, Chill: { score: 3, note: "Chill types aren't messy on purpose. A clear standard + gentle reminders works." }, NightOwl: { score: 2, note: "Late-night dishes and messiness will test you. Expectations up front are key." }, SocialButterfly: { score: 1, note: "Frequent guests + your standards = daily stress. Needs strict shared rules." } } },
  Chill: { emoji: "😌", label: "The Chill Roommate", color: C.olive, tagline: "Go with the flow — it works out.",
    description: "You're the roommate everyone gets along with. Adaptable, low-drama, and genuinely easy to live with. You don't sweat the small stuff and you're good at finding middle ground.",
    strengths: ["Adapts to almost any living style", "Rarely causes conflict", "Great at compromise"], watchOut: "May avoid hard conversations, letting small issues build up.",
    compatibility: { Chill: { score: 5, note: "Zero drama. A truly harmonious home. The rare roommate unicorn pair." }, SocialButterfly: { score: 4, note: "You enjoy the energy without needing to be the center of it." }, Homebody: { score: 3, note: "You'll respect their space. Just speak up if something bugs you." }, NeatFreak: { score: 3, note: "You'll follow their lead on cleanliness — as long as it isn't policing." }, NightOwl: { score: 4, note: "Their schedule doesn't faze you. You roll with it." }, EarlyBird: { score: 3, note: "Flexible enough to work around morning routines. Just don't be loud at night." } } },
};

/* ───────────────────────────────── scoring engine ───────────────────────────────── */
function computeTotals(answers) {
  const totals = {}; TYPE_KEYS.forEach(k => (totals[k] = 0));
  questions.forEach(q => { const i = answers[q.id]; if (i === undefined) return; Object.entries(q.options[i].scores).forEach(([t, p]) => (totals[t] += p)); });
  return totals;
}
function computeType(answers) { return Object.entries(computeTotals(answers)).sort((a, b) => b[1] - a[1])[0][0]; }
function vec(scores) { return TYPE_KEYS.map(k => scores[k] || 0); }
function cosine(a, b) { let d = 0, na = 0, nb = 0; for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; } if (!na || !nb) return 0; return d / (Math.sqrt(na) * Math.sqrt(nb)); }
function categoryAlignment(a1, a2) {
  const byCat = {}, counts = {}; let sum = 0, n = 0;
  questions.forEach(q => { const i1 = a1[q.id], i2 = a2[q.id]; if (i1 === undefined || i2 === undefined) return; const s = Math.max(0, cosine(vec(q.options[i1].scores), vec(q.options[i2].scores))); byCat[q.category] = (byCat[q.category] || 0) + s; counts[q.category] = (counts[q.category] || 0) + 1; sum += s; n++; });
  Object.keys(byCat).forEach(c => (byCat[c] = byCat[c] / counts[c]));
  return { byCat, overall: n ? sum / n : 0 };
}
function levelFor(p) {
  if (p >= 85) return { label: "EXCEPTIONAL MATCH", color: C.verdigris, blurb: "Rare. Sign the lease." };
  if (p >= 70) return { label: "STRONG MATCH", color: C.copper, blurb: "This works. Lock it in." };
  if (p >= 55) return { label: "SOLID MATCH", color: C.brass, blurb: "Good footing — a few talks needed." };
  if (p >= 40) return { label: "WORKABLE", color: C.rust, blurb: "Possible, with clear rules." };
  return { label: "HIGH FRICTION", color: C.mauve, blurb: "Proceed only with a written agreement." };
}
function buildResult(p1, p2) {
  const t1 = roommateTypes[p1.type], t2 = roommateTypes[p2.type];
  const pair = t1.compatibility[p2.type];
  const align = categoryAlignment(p1.answers, p2.answers);
  const typePct = pair.score * 20;
  const alignPct = Math.round(align.overall * 100);
  const finalPct = Math.round(0.55 * alignPct + 0.45 * typePct);
  const level = levelFor(finalPct);
  const cats = Object.entries(align.byCat).map(([c, v]) => ({ cat: c, pct: Math.round(v * 100) })).sort((a, b) => b.pct - a.pct);
  return { t1, t2, pair, typePct, alignPct, finalPct, level, cats };
}

/* ───────────────────────────────── atoms ───────────────────────────────── */
const rise = (delay = 0) => ({ animation: "pp-rise .6s cubic-bezier(.16,1,.3,1) both", animationDelay: `${delay}s` });
const inputStyle = () => ({ width: "100%", boxSizing: "border-box", background: C.void, border: `1px solid ${C.line}`, borderRadius: 4, padding: "12px 14px", color: C.cream, fontFamily: MONO, fontSize: 14, outline: "none" });
const mkBlank = () => ({ name: "", age: "", gender: null, mbti: null, enneagram: null, faith: "", answers: {}, type: null });
const nm = (p, i) => (p.name && p.name.trim()) || `Subject 0${i}`;

function Scramble({ text, delay = 0, speed = 30, revealEvery = 3, charset = "#*/[]<>=+%@&·:8x", onDone, style }) {
  const [display, setDisplay] = useState(text.replace(/\S/g, "#"));
  const doneRef = useRef(false);
  useEffect(() => {
    doneRef.current = false; setDisplay(text.replace(/\S/g, "#"));
    let frame = 0, revealed = 0, id = null;
    const run = () => {
      id = setInterval(() => {
        frame++; if (frame % revealEvery === 0) revealed++;
        let out = "";
        for (let i = 0; i < text.length; i++) { const ch = text[i]; if (ch === " ") { out += " "; continue; } out += i < revealed ? ch : charset[(Math.random() * charset.length) | 0]; }
        setDisplay(out);
        if (revealed >= text.length) { clearInterval(id); setDisplay(text); if (!doneRef.current) { doneRef.current = true; onDone && onDone(); } }
      }, speed);
    };
    const t = setTimeout(run, delay);
    return () => { clearTimeout(t); if (id) clearInterval(id); };
    // eslint-disable-next-line
  }, [text]);
  return <span style={style}>{display}</span>;
}

function DustField({ hashes = false }) {
  const dots = useMemo(() => Array.from({ length: 34 }).map(() => ({ left: Math.random() * 100, top: Math.random() * 100, size: Math.random() * 2 + 0.6, delay: Math.random() * 7, dur: 8 + Math.random() * 9, op: 0.05 + Math.random() * 0.18, drift: Math.random() * 48 - 24 })), []);
  const marks = useMemo(() => hashes ? Array.from({ length: 12 }).map(() => ({ left: Math.random() * 100, top: Math.random() * 100, delay: Math.random() * 5, size: 10 + Math.random() * 8 })) : [], [hashes]);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {dots.map((d, i) => (<span key={"d" + i} style={{ position: "absolute", left: d.left + "%", top: d.top + "%", width: d.size, height: d.size, borderRadius: "50%", background: C.cream, opacity: d.op, animation: `pp-dust ${d.dur}s ease-in-out ${d.delay}s infinite`, ["--drift"]: d.drift + "px" }} />))}
      {marks.map((m, i) => (<span key={"h" + i} style={{ position: "absolute", left: m.left + "%", top: m.top + "%", fontFamily: MONO, fontSize: m.size, color: C.cream3, animation: `pp-flicker 4s ease-in-out ${m.delay}s infinite` }}>#</span>))}
    </div>
  );
}

function Corner({ pos }) {
  const map = { tl: { top: 10, left: 10, borderTop: `1px solid ${C.cream3}`, borderLeft: `1px solid ${C.cream3}` }, tr: { top: 10, right: 10, borderTop: `1px solid ${C.cream3}`, borderRight: `1px solid ${C.cream3}` }, bl: { bottom: 10, left: 10, borderBottom: `1px solid ${C.cream3}`, borderLeft: `1px solid ${C.cream3}` }, br: { bottom: 10, right: 10, borderBottom: `1px solid ${C.cream3}`, borderRight: `1px solid ${C.cream3}` } };
  return <span style={{ position: "absolute", width: 12, height: 12, opacity: 0.4, ...map[pos] }} />;
}

function Card({ children, footer, accent = C.rust }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 600, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6, padding: "42px 36px 28px", zIndex: 1, boxShadow: "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(231,217,191,0.05)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.55 }} />
      <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
      {children}
      {footer && (<div style={{ marginTop: 26, paddingTop: 14, borderTop: `1px solid ${C.lineSoft}`, fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, color: C.cream3, display: "flex", justifyContent: "space-between" }}><span>PATINA PROTOCOL · v1.0</span><span>{footer}</span></div>)}
    </div>
  );
}

function Section({ title, accent, children, style }) {
  return (<div style={style}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 2, color: accent || C.cream2 }}>{title}</span><span style={{ flex: 1, borderTop: `1px dashed ${C.lineSoft}` }} /></div>{children}</div>);
}

function Meter({ pct, color, height = 8 }) {
  return (<div style={{ position: "relative", height, background: "#120d08", border: `1px solid ${C.lineSoft}`, borderRadius: 2, overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${pct}%`, background: color, transition: "width 1.05s cubic-bezier(.16,1,.3,1)", boxShadow: `0 0 12px ${color}66` }} /><div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 9px, rgba(0,0,0,0.45) 9px 11px)", pointerEvents: "none" }} /></div>);
}

function Eyebrow({ children, color = C.rust }) { return <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 3, color, marginBottom: 14, textTransform: "uppercase" }}>{children}</div>; }
function Label({ children }) { return <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: C.cream3, marginBottom: 8 }}>{children}</div>; }
function Inp({ value, onChange, placeholder, accent, inputMode }) { return <input inputMode={inputMode} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle()} onFocus={e => (e.target.style.borderColor = accent)} onBlur={e => (e.target.style.borderColor = C.line)} />; }

function ChipGroup({ options, value, onChange, accent, cols }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 6 }}>
      {options.map(o => {
        const sel = value === o.value;
        return (<button key={o.value} onClick={() => onChange(sel ? null : o.value)} style={{ background: sel ? accent + "1e" : "#1c150e", border: `1px solid ${sel ? accent : C.line}`, borderRadius: 4, padding: "9px 4px", fontFamily: MONO, fontSize: 12, letterSpacing: 0.3, color: sel ? accent : C.cream2, cursor: "pointer", transition: "all .15s", textAlign: "center", lineHeight: 1.25 }} onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = accent; }} onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = C.line; }}>{o.label}</button>);
      })}
    </div>
  );
}

function Dropdown({ value, onChange, options, placeholder, accent }) {
  const [open, setOpen] = useState(false); const ref = useRef(null);
  useEffect(() => { function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); } document.addEventListener("mousedown", onDoc); return () => document.removeEventListener("mousedown", onDoc); }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{ ...inputStyle(), display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", borderColor: open ? accent : C.line }}>
        <span style={{ color: value ? C.cream : C.cream3 }}>{value || placeholder}</span>
        <span style={{ color: C.cream3, fontSize: 11 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 30, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 4, maxHeight: 220, overflowY: "auto", boxShadow: "0 16px 34px rgba(0,0,0,0.6)" }}>
          {options.map(o => (<div key={o} onClick={() => { onChange(o === value ? "" : o); setOpen(false); }} style={{ padding: "10px 12px", fontFamily: MONO, fontSize: 13, color: o === value ? accent : C.cream2, cursor: "pointer", background: o === value ? accent + "14" : "transparent" }} onMouseEnter={e => (e.currentTarget.style.background = accent + "14")} onMouseLeave={e => (e.currentTarget.style.background = o === value ? accent + "14" : "transparent")}>{o}</div>))}
        </div>
      )}
    </div>
  );
}

function PrimaryBtn({ accent, children, onClick, full = true }) {
  return (<button onClick={onClick} style={{ width: full ? "100%" : "auto", background: accent, color: C.void, border: "none", borderRadius: 4, padding: "14px 26px", fontFamily: MONO, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, cursor: "pointer", boxShadow: `0 6px 18px ${accent}44, inset 0 1px 0 rgba(255,255,255,0.18)`, transition: "transform .12s, box-shadow .2s" }} onMouseDown={e => (e.currentTarget.style.transform = "translateY(1px)")} onMouseUp={e => (e.currentTarget.style.transform = "translateY(0)")} onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>{children}</button>);
}
function GhostBtn({ children, onClick }) {
  return (<button onClick={onClick} style={{ width: "100%", background: "transparent", color: C.cream2, border: `1px solid ${C.line}`, borderRadius: 4, padding: "13px 20px", fontFamily: MONO, fontSize: 12, letterSpacing: 1.5, cursor: "pointer", transition: "all .18s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = C.cream3; e.currentTarget.style.color = C.cream; }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.cream2; }}>{children}</button>);
}

/* ───────────────────────────────── main ───────────────────────────────── */
export default function RoommateProtocol() {
  const [phase, setPhase] = useState("intro"); // intro | intake | quiz | solo | measuring | compat
  const [player, setPlayer] = useState(1);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [p1, setP1] = useState(mkBlank());
  const [p2, setP2] = useState(mkBlank());
  const [bodyIn, setBodyIn] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);
  const [revealMeters, setRevealMeters] = useState(false);
  const [copied, setCopied] = useState(false);

  const q = questions[current];
  const cur = player === 1 ? p1 : p2;
  const setCur = (patch) => (player === 1 ? setP1 : setP2)(p => ({ ...p, ...patch }));
  const result = useMemo(() => (p1.type && p2.type ? buildResult(p1, p2) : null), [p1, p2]);

  useEffect(() => { if (phase === "intro") setBodyIn(false); }, [phase]);
  useEffect(() => {
    if (phase !== "compat" || !result) return;
    setRevealMeters(false); setDisplayPct(0); setCopied(false);
    let raf; const start = performance.now(); const dur = 1100; const target = result.finalPct;
    const tick = (t) => { const k = Math.min(1, (t - start) / dur); const eased = 1 - Math.pow(1 - k, 3); setDisplayPct(Math.round(eased * target)); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const m = setTimeout(() => setRevealMeters(true), 140);
    return () => { cancelAnimationFrame(raf); clearTimeout(m); };
  }, [phase, result]);

  /* flow */
  function startProtocol() { setPlayer(1); setPhase("intake"); }
  function startAssessment() { setAnswers({}); setCurrent(0); setSelected(null); setPhase("quiz"); }
  function addRoommate() { setPlayer(2); setPhase("intake"); }
  function testAnother() { setP2(mkBlank()); setPlayer(2); setPhase("intake"); }
  function startOver() { setP1(mkBlank()); setP2(mkBlank()); setAnswers({}); setCurrent(0); setSelected(null); setPlayer(1); setPhase("intro"); }
  function handleSelect(i) { setSelected(i); }
  function handleNext() {
    if (selected === null) return;
    const updated = { ...answers, [q.id]: selected }; setAnswers(updated); setSelected(null);
    if (current + 1 < questions.length) { setCurrent(current + 1); return; }
    const type = computeType(updated);
    if (player === 1) { setP1(p => ({ ...p, answers: updated, type })); setPhase("solo"); }
    else { setP2(p => ({ ...p, answers: updated, type })); setPhase("measuring"); }
  }
  function handleBack() {
    if (current === 0) { setPhase("intake"); return; }
    const prev = questions[current - 1]; setSelected(answers[prev.id] ?? null); setCurrent(current - 1);
  }
  function copyReport() {
    if (!result) return;
    const pl = (p, i) => { const out = [`${nm(p, i)} — ${roommateTypes[p.type].label}`]; const bits = []; if (p.age) bits.push(`age ${p.age}`); if (p.gender) bits.push(p.gender); if (p.mbti) bits.push(p.mbti); if (p.enneagram) bits.push(`Enn ${p.enneagram}`); if (p.faith) bits.push(p.faith); if (bits.length) out.push(`  ${bits.join(" · ")}`); return out.join("\n"); };
    const lines = ["ROOMMATE // PROTOCOL — COMPATIBILITY REPORT", "", pl(p1, 1), pl(p2, 2), "", `OVERALL COMPATIBILITY: ${result.finalPct}% (${result.level.label})`, result.level.blurb, "", `TYPE DYNAMIC: ${result.pair.note}`, "", "ALIGNMENT BY DOMAIN:", ...result.cats.map(c => `  ${String(c.pct).padStart(3, " ")}%  ${c.cat}`)];
    navigator.clipboard.writeText(lines.join("\n")); setCopied(true); setTimeout(() => setCopied(false), 1800);
  }

  const cardAccent = phase === "quiz" ? (CAT[q?.category] || C.rust) : phase === "solo" && p1.type ? roommateTypes[p1.type].color : phase === "compat" && result ? result.level.color : C.rust;
  const showDust = phase !== "quiz";
  const intakeAccent = C.rust;

  return (
    <div style={{ minHeight: "100vh", background: C.char, color: C.cream, fontFamily: SERIF, position: "relative", display: "flex", justifyContent: "center", alignItems: (phase === "quiz" || phase === "intake") ? "flex-start" : "center", padding: "44px 18px", overflow: "hidden" }}>
      <style>{`
        @keyframes pp-dust { 0%{transform:translate(0,0)} 50%{transform:translate(var(--drift,0px),-24px)} 100%{transform:translate(0,0)} }
        @keyframes pp-flicker { 0%,100%{opacity:.06} 50%{opacity:.2} }
        @keyframes pp-rise { from{opacity:0; transform:translateY(14px)} to{opacity:1; transform:none} }
        @keyframes pp-pulse { 0%,100%{opacity:.45} 50%{opacity:1} }
      `}</style>

      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(60% 50% at 50% 18%, rgba(198,110,58,0.06), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      {showDust && <DustField hashes={phase === "intro" || phase === "measuring"} />}
      <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, backgroundSize: "140px 140px", opacity: 0.045, mixBlendMode: "overlay", pointerEvents: "none", zIndex: 3 }} />
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(120% 90% at 50% 30%, transparent 42%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none", zIndex: 3 }} />

      {/* ───────── INTRO ───────── */}
      {phase === "intro" && (
        <Card accent={C.rust} footer={bodyIn ? "STANDING BY" : "INITIALIZING…"}>
          <div style={{ textAlign: "center", paddingTop: 6 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 4, color: C.cream3, marginBottom: 18 }}>// COMPATIBILITY INSTRUMENT</div>
            <Scramble text="ROOMMATE // PROTOCOL" delay={450} onDone={() => setTimeout(() => setBodyIn(true), 150)} style={{ display: "inline-block", fontFamily: MONO, fontWeight: 700, color: C.cream, fontSize: "clamp(24px,6.5vw,40px)", letterSpacing: 1, lineHeight: 1.15, textShadow: `0 1px 0 #000, 0 0 26px ${C.rust}2e` }} />
            <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${C.line},transparent)`, margin: "20px auto 0", maxWidth: 280 }} />
          </div>
          {bodyIn && (
            <div>
              <div style={{ ...rise(0), textAlign: "center", fontFamily: MONO, fontSize: 10.5, letterSpacing: 2, color: C.cream2, marginTop: 16 }}>THIRTY QUESTIONS · SIX ARCHETYPES · ONE VERDICT</div>
              <p style={{ ...rise(0.08), color: C.cream2, fontSize: 15, lineHeight: 1.75, textAlign: "center", margin: "24px 0 26px" }}>Most roommate disasters were visible from the start. This is the instrument that sees them. One subject completes the protocol — then you add a second. The system measures where two lives align, and exactly where they'll grind.</p>
              <div style={{ ...rise(0.16), display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 30 }}>
                {TYPE_KEYS.map(k => { const t = roommateTypes[k]; return (<span key={k} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 1, color: t.color, border: `1px solid ${t.color}44`, background: t.color + "12", borderRadius: 3, padding: "5px 10px" }}>[ {t.emoji} {t.label.replace("The ", "").toUpperCase()} ]</span>); })}
              </div>
              <div style={rise(0.24)}><PrimaryBtn accent={C.rust} onClick={startProtocol}>[ BEGIN PROTOCOL ]</PrimaryBtn></div>
            </div>
          )}
        </Card>
      )}

      {/* ───────── INTAKE / PROFILE ───────── */}
      {phase === "intake" && (
        <Card accent={intakeAccent} footer={`CONFIGURING SUBJECT 0${player}`}>
          <Eyebrow color={intakeAccent}>// SUBJECT 0{player} · PROFILE</Eyebrow>
          <p style={{ color: C.cream2, fontSize: 13, lineHeight: 1.7, margin: "0 0 22px" }}>Everything below is <span style={{ color: C.cream }}>optional</span> — it colors your report but is never factored into the behavioral score. Add as much or as little as you like.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 12, marginBottom: 18 }}>
            <div><Label>DESIGNATION (NAME)</Label><Inp value={cur.name} accent={intakeAccent} placeholder="enter name…" onChange={e => setCur({ name: e.target.value.slice(0, 20) })} /></div>
            <div><Label>AGE</Label><Inp value={cur.age} accent={intakeAccent} inputMode="numeric" placeholder="e.g. 24" onChange={e => setCur({ age: e.target.value.replace(/[^0-9]/g, "").slice(0, 2) })} /></div>
          </div>

          <div style={{ marginBottom: 18 }}><Label>GENDER</Label><ChipGroup cols={2} accent={intakeAccent} value={cur.gender} onChange={v => setCur({ gender: v })} options={GENDERS.map(g => ({ value: g, label: g }))} /></div>

          <div style={{ marginBottom: 18 }}>
            <Label>PERSONALITY TYPE (MBTI)</Label>
            <ChipGroup cols={4} accent={intakeAccent} value={cur.mbti} onChange={v => setCur({ mbti: v })} options={MBTI_TYPES.map(m => ({ value: m, label: m }))} />
            {cur.mbti && <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 11, color: intakeAccent }}>{cur.mbti} · {MBTI_NAME[cur.mbti]}</div>}
          </div>

          <div style={{ marginBottom: 18 }}>
            <Label>ENNEAGRAM</Label>
            <ChipGroup cols={9} accent={intakeAccent} value={cur.enneagram} onChange={v => setCur({ enneagram: v })} options={[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => ({ value: String(n), label: String(n) }))} />
            {cur.enneagram && <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 11, color: intakeAccent }}>TYPE {cur.enneagram} · {ENN_NAME[cur.enneagram]}</div>}
          </div>

          <div style={{ marginBottom: 26, position: "relative", zIndex: 5 }}><Label>FAITH</Label><Dropdown value={cur.faith} accent={intakeAccent} placeholder="select (optional)…" options={FAITHS} onChange={v => setCur({ faith: v })} /></div>

          <PrimaryBtn accent={intakeAccent} onClick={startAssessment}>[ BEGIN ASSESSMENT · 30 Q ]</PrimaryBtn>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <button onClick={() => setPhase(player === 1 ? "intro" : "solo")} style={{ background: "transparent", border: "none", color: C.cream3, fontFamily: MONO, fontSize: 11, letterSpacing: 1, cursor: "pointer" }}>← BACK</button>
          </div>
        </Card>
      )}

      {/* ───────── QUIZ ───────── */}
      {phase === "quiz" && (
        <Card accent={cardAccent} footer={`SUBJECT 0${player} IN PROGRESS`}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 1.5, color: cardAccent }}>[ {nm(cur, player).toUpperCase()} ]</span>
            <span style={{ flex: 1, borderTop: `1px dashed ${C.lineSoft}` }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 1, color: C.cream3 }}>{String(current + 1).padStart(2, "0")} / {questions.length}</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: C.cream2, textTransform: "uppercase", marginBottom: 4 }}><span style={{ color: cardAccent }}>#</span> {q.category}</div>
          <div style={{ display: "flex", gap: 3, marginTop: 12, marginBottom: 30 }}>
            {questions.map((_, i) => (<div key={i} style={{ flex: 1, height: 4, borderRadius: 1, background: i <= current ? cardAccent : C.lineSoft, opacity: i <= current ? 1 : 0.6, transition: "background .3s" }} />))}
          </div>

          <div key={`q-${player}-${current}`} style={rise(0)}>
            <h2 style={{ color: C.cream, fontSize: 21, lineHeight: 1.45, fontWeight: "normal", margin: "0 0 26px" }}><span style={{ marginRight: 10 }}>{q.emoji}</span>{q.question}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {q.options.map((opt, idx) => {
                const isSel = selected === idx;
                return (<button key={idx} onClick={() => handleSelect(idx)} style={{ position: "relative", width: "100%", textAlign: "left", cursor: "pointer", background: isSel ? cardAccent + "1e" : "linear-gradient(180deg,#211a12 0%,#181209 100%)", border: `1px solid ${isSel ? cardAccent : C.line}`, borderRadius: 8, padding: "14px 16px 14px 46px", color: isSel ? C.cream : C.cream2, fontFamily: SERIF, fontSize: 15.5, transition: "all .16s", boxShadow: isSel ? `inset 0 1px 0 rgba(231,217,191,0.06), 0 0 16px ${cardAccent}33` : "inset 0 1px 0 rgba(231,217,191,0.05), 0 2px 6px rgba(0,0,0,0.5)" }} onMouseDown={e => (e.currentTarget.style.transform = "translateY(1px)")} onMouseUp={e => (e.currentTarget.style.transform = "translateY(0)")} onMouseEnter={e => { if (!isSel) { e.currentTarget.style.borderColor = cardAccent; e.currentTarget.style.color = C.cream; } }} onMouseLeave={e => { if (!isSel) { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.cream2; } e.currentTarget.style.transform = "translateY(0)"; }}>
                  <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontFamily: MONO, fontSize: 14, letterSpacing: 1, color: isSel ? cardAccent : C.cream3 }}>[{isSel ? "▪" : " "}]</span>
                  {opt.text}
                </button>);
              })}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={handleBack} style={{ background: "transparent", color: C.cream3, border: "none", fontFamily: MONO, fontSize: 12, letterSpacing: 1, cursor: "pointer" }}>← BACK</button>
            <button onClick={handleNext} disabled={selected === null} style={{ background: selected !== null ? cardAccent : C.lineSoft, color: selected !== null ? C.void : C.cream3, border: "none", borderRadius: 4, padding: "12px 26px", fontFamily: MONO, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, cursor: selected !== null ? "pointer" : "not-allowed", transition: "all .2s", boxShadow: selected !== null ? `0 6px 16px ${cardAccent}44` : "none" }}>{current + 1 === questions.length ? (player === 1 ? "CLASSIFY →" : "MEASURE →") : "NEXT →"}</button>
          </div>
        </Card>
      )}

      {/* ───────── SOLO RESULT ───────── */}
      {phase === "solo" && p1.type && (() => {
        const t = roommateTypes[p1.type];
        const pills = []; if (p1.age) pills.push(`AGE ${p1.age}`); if (p1.gender) pills.push(p1.gender); if (p1.mbti) pills.push(p1.mbti); if (p1.enneagram) pills.push(`ENN ${p1.enneagram}`); if (p1.faith) pills.push(p1.faith);
        return (
          <Card accent={t.color} footer="01 / 02 SUBJECTS RECORDED">
            <div style={rise(0)}><Eyebrow color={t.color}>// SUBJECT 01 · CLASSIFIED</Eyebrow></div>
            <div style={{ ...rise(0.05), textAlign: "center", border: `1px solid ${t.color}44`, background: t.color + "12", borderRadius: 6, padding: "26px 22px", marginBottom: 18 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{t.emoji}</div>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 2, color: C.cream3, marginBottom: 6 }}>{nm(p1, 1).toUpperCase()}</div>
              <h2 style={{ color: C.cream, fontSize: 26, margin: "0 0 8px" }}>{t.label}</h2>
              <div style={{ color: t.color, fontStyle: "italic", fontSize: 15, marginBottom: 14 }}>"{t.tagline}"</div>
              <p style={{ color: C.cream2, fontSize: 14, lineHeight: 1.75, margin: 0 }}>{t.description}</p>
            </div>

            {pills.length > 0 && (<div style={{ ...rise(0.08), display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 22 }}>{pills.map((p, i) => (<span key={i} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1, color: C.cream2, border: `1px solid ${C.lineSoft}`, borderRadius: 3, padding: "4px 9px" }}>{p}</span>))}</div>)}

            <div style={{ ...rise(0.1), display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 26 }}>
              <div style={{ background: C.panel2, border: `1px solid ${C.lineSoft}`, borderRadius: 6, padding: 16 }}><div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, color: C.verdigris, marginBottom: 10 }}>[ + ] STRENGTHS</div>{t.strengths.map((s, i) => <div key={i} style={{ color: C.cream2, fontSize: 13, lineHeight: 1.6, marginBottom: 5 }}>· {s}</div>)}</div>
              <div style={{ background: C.panel2, border: `1px solid ${C.lineSoft}`, borderRadius: 6, padding: 16 }}><div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, color: C.rust, marginBottom: 10 }}>[ ! ] WATCH OUT</div><div style={{ color: C.cream2, fontSize: 13, lineHeight: 1.7 }}>{t.watchOut}</div></div>
            </div>

            <div style={rise(0.16)}>
              <Section title="ADD A SECOND SUBJECT" accent={t.color} style={{ marginBottom: 16 }}>
                <p style={{ color: C.cream2, fontSize: 13.5, lineHeight: 1.7, margin: "0 0 16px" }}>One subject recorded. Add a roommate to run the protocol on them and measure your compatibility.</p>
                <PrimaryBtn accent={t.color} onClick={addRoommate}>[ + ADD ROOMMATE ]</PrimaryBtn>
              </Section>
              <div style={{ marginTop: 12 }}><GhostBtn onClick={() => { setPlayer(1); setPhase("intake"); }}>↺ EDIT / RETAKE SUBJECT 01</GhostBtn></div>
            </div>
          </Card>
        );
      })()}

      {/* ───────── MEASURING ───────── */}
      {phase === "measuring" && (
        <Card accent={C.rust} footer="SYNCING…">
          <div style={{ textAlign: "center", padding: "30px 0 22px" }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 3, color: C.cream3, marginBottom: 22 }}>// RUNNING COMPATIBILITY ENGINE</div>
            <Scramble text="MEASURING COMPATIBILITY" delay={150} speed={26} revealEvery={2} onDone={() => setTimeout(() => setPhase("compat"), 650)} style={{ display: "inline-block", fontFamily: MONO, fontWeight: 700, color: C.cream, fontSize: "clamp(18px,4.6vw,26px)", letterSpacing: 1, textShadow: `0 0 22px ${C.rust}33` }} />
            <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 11, letterSpacing: 1.5, color: C.cream2, animation: "pp-pulse 1.4s ease-in-out infinite" }}>{nm(p1, 1).toUpperCase()} ⟶ {nm(p2, 2).toUpperCase()}</div>
          </div>
        </Card>
      )}

      {/* ───────── COMPATIBILITY REPORT ───────── */}
      {phase === "compat" && result && (() => {
        const prof = [];
        const addP = (label, v1, v2, match) => { if (v1 || v2) prof.push({ label, v1: v1 || "—", v2: v2 || "—", match: !!match }); };
        addP("Age", p1.age, p2.age, false);
        addP("Gender", p1.gender, p2.gender, p1.gender && p1.gender === p2.gender);
        addP("Personality", p1.mbti, p2.mbti, p1.mbti && p1.mbti === p2.mbti);
        addP("Enneagram", p1.enneagram ? `${p1.enneagram} · ${ENN_NAME[p1.enneagram]}` : "", p2.enneagram ? `${p2.enneagram} · ${ENN_NAME[p2.enneagram]}` : "", p1.enneagram && p1.enneagram === p2.enneagram);
        addP("Faith", p1.faith, p2.faith, p1.faith && p1.faith === p2.faith && p1.faith !== "Prefer not to say");
        const common = [];
        if (p1.mbti && p1.mbti === p2.mbti) common.push(`both ${p1.mbti}`);
        if (p1.enneagram && p1.enneagram === p2.enneagram) common.push(`both Type ${p1.enneagram}`);
        if (p1.faith && p1.faith === p2.faith && p1.faith !== "Prefer not to say") common.push(`shared faith (${p1.faith})`);
        const subj = (idx, p, t) => (
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>{t.emoji}</div>
            <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: 1.5, color: C.cream3, marginBottom: 4 }}>SUBJECT 0{idx}</div>
            <div style={{ color: C.cream, fontSize: 15, marginBottom: 3 }}>{nm(p, idx)}</div>
            <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: 1, color: t.color, textTransform: "uppercase" }}>{t.label.replace("The ", "")}</div>
          </div>
        );
        return (
          <Card accent={result.level.color} footer="REPORT COMPLETE">
            <div style={rise(0)}><Eyebrow color={result.level.color}>// COMPATIBILITY REPORT</Eyebrow></div>

            <div style={{ ...rise(0.05), display: "flex", alignItems: "center", gap: 8, background: C.panel2, border: `1px solid ${C.lineSoft}`, borderRadius: 6, padding: "20px 14px", marginBottom: 22 }}>
              {subj(1, p1, result.t1)}
              <div style={{ display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 20, color: C.cream3 }}>✕</div>
              {subj(2, p2, result.t2)}
            </div>

            <div style={{ ...rise(0.1), textAlign: "center", margin: "8px 0 12px" }}>
              <div style={{ fontFamily: MONO, fontSize: 62, fontWeight: 700, color: C.cream, lineHeight: 1, textShadow: `0 0 30px ${result.level.color}55` }}>{displayPct}<span style={{ fontSize: 26, color: C.cream2 }}>%</span></div>
              <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: result.level.color, marginTop: 10 }}>{result.level.label}</div>
              <div style={{ color: C.cream2, fontStyle: "italic", fontSize: 14, marginTop: 6 }}>{result.level.blurb}</div>
            </div>
            <div style={rise(0.14)}><Meter pct={revealMeters ? result.finalPct : 0} color={result.level.color} height={10} /></div>

            <div style={rise(0.18)}><Section title="TYPE DYNAMIC" accent={result.level.color} style={{ marginTop: 26 }}><p style={{ color: C.cream2, fontSize: 14, lineHeight: 1.75, margin: 0 }}>{result.pair.note}</p></Section></div>

            <div style={rise(0.22)}>
              <Section title="ALIGNMENT BY DOMAIN" accent={C.cream2} style={{ marginTop: 26 }}>
                {result.cats.map((c, idx) => {
                  const accent = CAT[c.cat] || C.cream2; const mark = c.pct >= 70 ? "✓" : c.pct >= 40 ? "~" : "!"; const markColor = c.pct >= 70 ? C.verdigris : c.pct >= 40 ? C.brass : C.mauve; const tag = idx === 0 ? "STRONGEST" : idx === result.cats.length - 1 ? "FLASHPOINT" : null;
                  return (<div key={c.cat} style={{ marginBottom: 13 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span style={{ fontFamily: MONO, fontSize: 12, color: markColor }}>[{mark}]</span><span style={{ color: C.cream, fontSize: 13.5, flex: 1 }}>{c.cat}</span>{tag && <span style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: 1, color: markColor, border: `1px solid ${markColor}55`, borderRadius: 2, padding: "2px 5px" }}>{tag}</span>}<span style={{ fontFamily: MONO, fontSize: 12, color: C.cream2, minWidth: 38, textAlign: "right" }}>{revealMeters ? c.pct : 0}%</span></div><Meter pct={revealMeters ? c.pct : 0} color={accent} height={6} /></div>);
                })}
              </Section>
            </div>

            {prof.length > 0 && (
              <div style={rise(0.26)}>
                <Section title="PROFILE" accent={C.cream2} style={{ marginTop: 26 }}>
                  <div style={{ fontFamily: MONO, fontSize: 9.5, color: C.cream3, marginBottom: 12 }}>Context only — not part of the score above.</div>
                  <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1fr 1fr", gap: "8px 10px", alignItems: "center" }}>
                    <span />
                    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1, color: C.cream3, textAlign: "center" }}>{nm(p1, 1).toUpperCase()}</span>
                    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1, color: C.cream3, textAlign: "center" }}>{nm(p2, 2).toUpperCase()}</span>
                    {prof.map((r, i) => (
                      <div key={i} style={{ display: "contents" }}>
                        <span style={{ fontFamily: MONO, fontSize: 11, color: C.cream3 }}>{r.label}</span>
                        <span style={{ fontSize: 12.5, textAlign: "center", color: r.match ? C.verdigris : C.cream }}>{r.v1}</span>
                        <span style={{ fontSize: 12.5, textAlign: "center", color: r.match ? C.verdigris : C.cream }}>{r.v2}{r.match ? " ✓" : ""}</span>
                      </div>
                    ))}
                  </div>
                  {common.length > 0 && (<div style={{ marginTop: 14, fontFamily: MONO, fontSize: 11.5, color: C.verdigris }}>↳ Common ground: {common.join(" · ")}</div>)}
                </Section>
              </div>
            )}

            <div style={{ ...rise(0.3), marginTop: 22, background: C.void, border: `1px solid ${C.lineSoft}`, borderLeft: `2px solid ${result.level.color}`, borderRadius: 4, padding: "14px 16px" }}>
              <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: 1.5, color: C.cream3, marginBottom: 8 }}>// VERDICT</div>
              <p style={{ color: C.cream2, fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>Sharpest alignment is <span style={{ color: CAT[result.cats[0].cat] || C.cream }}>{result.cats[0].cat}</span> ({result.cats[0].pct}%). Likeliest friction is <span style={{ color: CAT[result.cats[result.cats.length - 1].cat] || C.cream }}>{result.cats[result.cats.length - 1].cat}</span> ({result.cats[result.cats.length - 1].pct}%) — settle expectations there before you share a lease.</p>
            </div>

            <div style={{ ...rise(0.34), display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
              <PrimaryBtn accent={result.level.color} onClick={testAnother}>[ + TEST ANOTHER ROOMMATE ]</PrimaryBtn>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}><GhostBtn onClick={copyReport}>{copied ? "✓ COPIED" : "⧉ COPY REPORT"}</GhostBtn></div>
                <div style={{ flex: 1 }}><GhostBtn onClick={startOver}>↺ START OVER</GhostBtn></div>
              </div>
            </div>
          </Card>
        );
      })()}
    </div>
  );
}