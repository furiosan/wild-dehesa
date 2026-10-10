// Static site generator for wilddehesa.com. No dependencies. Run: node build.mjs
// Writes the finished site to /public, which Cloudflare Pages serves as is.
import { mkdirSync, rmSync, writeFileSync, readFileSync, copyFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, MONTHS, MONTH_DATA, SPECIES, ROUTES, SOURCES, COMING } from "./content.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "public");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "assets", "fonts"), { recursive: true });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (m) => m.toLowerCase();
const listJoin = (a) => (a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);

// Assets
copyFileSync(join(ROOT, "src", "site.js"), join(OUT, "assets", "site.js"));
copyFileSync(join(ROOT, "src", "site.css"), join(OUT, "assets", "site.css"));
for (const f of readdirSync(join(ROOT, "src", "fonts"))) copyFileSync(join(ROOT, "src", "fonts", f), join(OUT, "assets", "fonts", f));
const ver = (f) => createHash("md5").update(readFileSync(join(OUT, "assets", f))).digest("hex").slice(0, 8);
const CSS_V = ver("site.css");
const JS_V = ver("site.js");

const CRANE = `<svg viewBox="0 0 34 22" aria-hidden="true"><path d="M2 14 Q9 2 17 11 Q25 2 32 14"/></svg>`;
writeFileSync(join(OUT, "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 22"><path d="M2 14 Q9 2 17 11 Q25 2 32 14" fill="none" stroke="#0A7480" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

const NAV = [["Calendar", "/calendar/"], ["Sites", "/sites/"], ["Routes", "/routes/"], ["Guides", "/guides/"], ["Stay", "/stay/"]];
const pages = [];

function goLink(name) {
  if (/^Monfragüe/.test(name)) return "/sites/monfrague/";
  if (/^Tiétar/.test(name)) return "/sites/monfrague/#cranes";
  if (/^Sierra de Gata/.test(name)) return "/sites/sierra-de-gata/";
  if (/^Borbollón/.test(name)) return "/sites/sierra-de-gata/#borbollon";
  if (/^Alagón/.test(name)) return "/sites/sierra-de-gata/#alagon";
  if (/^Arrocampo/.test(name)) return "/sites/arrocampo/";
  return null;
}
const goItem = (name) => { const h = goLink(name); return h ? `<li><a href="${h}">${esc(name)}</a></li>` : `<li>${esc(name)}</li>`; };

function crumbs(items) {
  const html = items.map((c, i) => (i === items.length - 1 ? `<span aria-current="page">${esc(c[0])}</span>` : `<a href="${c[1]}">${esc(c[0])}</a><span aria-hidden="true">/</span>`)).join(" ");
  const ld = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: SITE.url + c[1] })) };
  return { html: `<nav class="crumbs mono wrap" aria-label="Breadcrumb">${html}</nav>`, ld };
}

function layout({ path, title, description, body, ld = [], noindex = false, ogType = "website" }) {
  const url = SITE.url + path;
  const ldTags = ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n");
  const nav = NAV.map(([n, h]) => `<a href="${h}"${path.startsWith(h) ? ' aria-current="page"' : ""}>${n}</a>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#EDF0E8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E1913" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/bricolage-grotesque-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/source-serif-4-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=${CSS_V}">
${ldTags}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="wrap">
    <a class="brand" href="/">${CRANE}${SITE.name}</a>
    <nav class="nav" aria-label="Sections">${nav}</nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer>
  <div class="wrap">
    <div class="cols">
      <div>
        <a class="brand" href="/" style="margin-bottom:14px">${CRANE}${SITE.name}</a>
        <p>Birdwatching in Extremadura, Spain. Please keep your distance from nests in the breeding season, stay on tracks, and listen as much as you look, since many species are found by their calls.</p>
        <p style="margin-top:14px">Written from Hoyos, in the Sierra de Gata. Stay with us at <a href="${SITE.casaUrl}" target="_blank" rel="noopener">${SITE.casaName}</a>. Contact: <a href="mailto:${SITE.email}">${SITE.email}</a></p>
        <p class="mono" style="margin-top:18px"><a href="/privacy/">Privacy</a> · Facts are checked against official sources and are being reviewed with local guides.</p>
      </div>
      <div>
        <span class="mono">Sources</span>
        <ul>${SOURCES.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("")}</ul>
      </div>
    </div>
  </div>
</footer>
<script src="/assets/site.js?v=${JS_V}" defer></script>
</body>
</html>
`;
}

function addPage(p, lastmod = SITE.updated, inSitemap = true) {
  pages.push({ path: p.path, html: layout(p), lastmod, inSitemap });
}

const heatTable = ({ sel = null, live = false } = {}) => {
  const head = `<th><span class="sr">Species</span></th>` + MONTHS.map((m) => `<th scope="col"><abbr title="${m}">${m[0]}</abbr></th>`).join("");
  const rows = SPECIES.map(([n, l, lv]) => `<tr><th scope="row">${esc(n)}<span>${esc(l)}</span></th>` + lv.map((v, i) => `<td class="l${v}${sel === i ? " sel" : ""}" data-m="${i}"><span class="sr">${MONTHS[i]}: ${v === 2 ? "easy to see" : v === 1 ? "arriving, leaving or harder to find" : "not present"}</span></td>`).join("") + `</tr>`).join("");
  return `<div class="heatwrap"><table class="heat"${live ? " data-live" : ""}><caption class="sr">When eight key species are present in Extremadura, by month</caption><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>
<div class="legend mono"><span><i class="l2"></i>Easy to see</span><span><i class="l1"></i>Arriving, leaving or harder to find</span><span><i></i>Not present</span></div>
<p class="mono note">Timings move with weather and year. Always check recent sightings with a local guide.</p>`;
};

// ---------- Home ----------
const ART = `<svg class="art" viewBox="0 0 1200 360" preserveAspectRatio="xMidYMax slice" role="img" aria-label="Dawn over open oak woodland with cranes flying in a V">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky1)"/><stop offset="1" style="stop-color:var(--sky2)"/></linearGradient><path id="bird" d="M-14 0 Q-7 -9 0 -2 Q7 -9 14 0"/></defs>
<rect width="1200" height="360" fill="url(#sky)"/>
<circle cx="860" cy="212" r="56" style="fill:var(--sun)"/>
<path d="M0 270 C200 230 380 250 560 235 C760 218 960 250 1200 225 L1200 360 L0 360 Z" style="fill:var(--hill1)"/>
<path d="M0 305 C240 280 460 300 700 288 C900 278 1040 296 1200 284 L1200 360 L0 360 Z" style="fill:var(--hill2)"/>
<g style="fill:var(--oak)">
${[[140, 300, 1], [340, 294, 0.8], [610, 290, 1.1], [1010, 292, 0.9], [1135, 302, 1.2]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="-38" width="6" height="38"/><ellipse cx="0" cy="-56" rx="46" ry="22"/><ellipse cx="-24" cy="-46" rx="28" ry="15"/><ellipse cx="26" cy="-48" rx="30" ry="16"/></g>`).join("\n")}
</g>
<g style="fill:none;stroke:var(--ink);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round">
<use href="#bird" x="420" y="62"/><use href="#bird" x="394" y="76"/><use href="#bird" x="368" y="90"/><use href="#bird" x="342" y="104"/><use href="#bird" x="446" y="76"/><use href="#bird" x="472" y="90"/><use href="#bird" x="498" y="104"/>
<use href="#bird" x="930" y="108"/><use href="#bird" x="912" y="118"/><use href="#bird" x="948" y="120"/>
</g></svg>`;

const monthsJson = esc(JSON.stringify(MONTHS.map((m, i) => [m, slug(m), MONTH_DATA[i].h])));
const monthGrid = `<div class="mgrid">${MONTHS.map((m, i) => `<a href="/calendar/${slug(m)}/" data-i="${i}"><strong>${m}</strong><span>${esc(MONTH_DATA[i].h)}</span></a>`).join("")}</div>`;

addPage({
  path: "/",
  title: "Wild Dehesa | Birdwatching in Extremadura, Spain",
  description: "A month-by-month guide to birdwatching in Extremadura: cranes, vultures, bustards and storks, with site guides and routes written from the Sierra de Gata.",
  ld: [{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url, description: "Birdwatching in Extremadura, Spain" }],
  body: `<div class="hero">
  <div class="wrap">
    <a class="chip" id="nowchip" href="/calendar/" data-months="${monthsJson}">See what is flying this month</a>
    <h1>Cranes in the cork oaks. Vultures on the cliffs.</h1>
    <p class="lede">Wild Dehesa is a month-by-month guide to birdwatching in Extremadura, written from a village in the Sierra de Gata.</p>
    <div class="row">
      <a class="btn primary" href="/calendar/">Open the bird calendar</a>
      <a class="btn ghost" href="/routes/">See three-day routes</a>
    </div>
    <p class="mono facts">Up to 385 bird species recorded in Extremadura, 104 of them winter visitors</p>
  </div>
  ${ART}
</div>
<section>
  <div class="wrap">
    <p class="mono kicker">Calendar</p>
    <h2>What is flying, month by month</h2>
    <p class="sub">Pick a month to see what to look for and where to go.</p>
    ${monthGrid}
  </div>
</section>
<section class="tint">
  <div class="wrap">
    <p class="mono kicker">Sites</p>
    <h2>Where to go</h2>
    <p class="sub">Three full guides to start, with more sites on the way.</p>
    <div class="sites">
      <article class="site"><h3><a href="/sites/monfrague/">Monfragüe National Park</a></h3><p>Cliffs, vultures and nesting Black Storks where the Tagus meets the Tiétar. The best single day in the region.</p><div class="meta"><span class="mono">Cáceres · Mar to May</span><a class="tag full" href="/sites/monfrague/" style="text-decoration:none">Read the guide</a></div></article>
      <article class="site"><h3><a href="/sites/sierra-de-gata/">Sierra de Gata and Borbollón</a></h3><p>Wintering cranes at the reservoir, oak and olive woods, and quiet stone villages on the official route.</p><div class="meta"><span class="mono">Cáceres · Nov to Feb</span><a class="tag full" href="/sites/sierra-de-gata/" style="text-decoration:none">Read the guide</a></div></article>
      <article class="site"><h3><a href="/sites/arrocampo/">Arrocampo reservoir</a></h3><p>Reedbeds where swamphens, herons and bitterns give close views, with otters at dawn.</p><div class="meta"><span class="mono">Cáceres · Spring, autumn, winter</span><a class="tag full" href="/sites/arrocampo/" style="text-decoration:none">Read the guide</a></div></article>
    </div>
    <p style="margin-top:22px"><a href="/sites/">All sites, including those coming soon</a></p>
  </div>
</section>
<section>
  <div class="wrap">
    <div class="split">
      <div>
        <p class="mono kicker">Routes</p>
        <h2>Three days, two ways</h2>
        <p class="sub">A winter plan built around the cranes and a spring plan for raptors, steppe and reedbeds.</p>
        <p style="margin-top:20px"><a class="btn primary" href="/routes/">See the routes</a></p>
      </div>
      <div class="callout">
        <h3>Stay in the Sierra de Gata</h3>
        <p>${SITE.casaName} sits on the edge of Hoyos, a village on the official Sierra de Gata birding route.</p>
        <p><a href="/stay/">About the stay</a> · <a href="/guides/">Local guides</a></p>
      </div>
    </div>
  </div>
</section>`,
});

// ---------- Calendar ----------
{
  const c = crumbs([["Home", "/"], ["Calendar", "/calendar/"]]);
  addPage({
    path: "/calendar/",
    title: "Extremadura bird calendar by month | Wild Dehesa",
    description: "When to see cranes, vultures, storks, bustards and bee-eaters in Extremadura. Pick a month for what to look for, where to go and what to expect.",
    ld: [c.ld],
    body: `${c.html}
<div class="wrap pagehead"><h1>The Extremadura bird calendar</h1><p class="lede">What is flying in each month, and where to find it. Choose a month, or scan the chart below.</p></div>
<section style="padding-top:24px"><div class="wrap">${monthGrid}${heatTable({ live: true })}</div></section>`,
  });
}

// ---------- Month pages ----------
MONTHS.forEach((m, i) => {
  const d = MONTH_DATA[i];
  const easy = SPECIES.filter((s) => s[2][i] === 2).map((s) => s[0]);
  const harder = SPECIES.filter((s) => s[2][i] === 1).map((s) => s[0]);
  const prev = MONTHS[(i + 11) % 12];
  const next = MONTHS[(i + 1) % 12];
  const c = crumbs([["Home", "/"], ["Calendar", "/calendar/"], [m, `/calendar/${slug(m)}/`]]);
  const sentence = `${listJoin(easy)} ${easy.length > 1 ? "are" : "is"} easy to see in ${m}.` + (harder.length ? ` ${listJoin(harder)} ${harder.length > 1 ? "are" : "is"} arriving, leaving or harder to find.` : "");
  addPage({
    path: `/calendar/${slug(m)}/`,
    title: `Birdwatching in Extremadura in ${m}: what to see`,
    description: `${d.h}. What to look for in Extremadura in ${m}: ${d.look.slice(0, 2).join(", ")}. Where to go and what to expect.`,
    ld: [c.ld],
    body: `${c.html}
<div class="wrap pagehead"><h1>Birdwatching in Extremadura in ${m}</h1><p class="lede">${esc(d.h)}.</p></div>
<section style="padding-top:24px"><div class="wrap">
  <div class="body-text"><p>${esc(d.note)}</p><p>${esc(sentence)}</p></div>
  <div class="mcols">
    <div><span class="mono">Look for</span><ul>${d.look.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><span class="mono">Where to go</span><ul>${d.go.map(goItem).join("")}</ul></div>
  </div>
  ${heatTable({ sel: i })}
  <div class="pager"><a href="/calendar/${slug(prev)}/">&larr; ${prev}</a><a href="/calendar/">All months</a><a href="/calendar/${slug(next)}/">${next} &rarr;</a></div>
  <p class="body-text" style="margin-top:28px">Planning a trip? See the <a href="/routes/">three-day routes</a> or the <a href="/stay/">base in the Sierra de Gata</a>.</p>
</div></section>`,
  });
});

// ---------- Sites index ----------
{
  const c = crumbs([["Home", "/"], ["Sites", "/sites/"]]);
  addPage({
    path: "/sites/",
    title: "Birdwatching sites in Extremadura | Wild Dehesa",
    description: "The best places for birdwatching in Extremadura: Monfragüe National Park, the Sierra de Gata and Borbollón reservoir, with more sites coming soon.",
    ld: [c.ld],
    body: `${c.html}
<div class="wrap pagehead"><h1>Where to go birdwatching in Extremadura</h1><p class="lede">Sites that cover the region's main habitats. Each guide has what to see, when to go and how to plan the day.</p></div>
<section style="padding-top:24px"><div class="wrap"><div class="sites">
<article class="site"><h3><a href="/sites/monfrague/">Monfragüe National Park</a></h3><p>Cliffs, vultures and nesting Black Storks where the Tagus meets the Tiétar. The best single day in the region.</p><div class="meta"><span class="mono">Cáceres · Mar to May</span><span class="tag full">Guide</span></div></article>
<article class="site"><h3><a href="/sites/sierra-de-gata/">Sierra de Gata and Borbollón</a></h3><p>Wintering cranes at the reservoir, oak and olive woods, and quiet stone villages on the official route.</p><div class="meta"><span class="mono">Cáceres · Nov to Feb</span><span class="tag full">Guide</span></div></article>
<article class="site"><h3><a href="/sites/arrocampo/">Arrocampo reservoir</a></h3><p>Reedbeds beside the Almaraz power station, where warm, steady water draws swamphens, herons and bitterns.</p><div class="meta"><span class="mono">Cáceres · Spring, autumn, winter</span><span class="tag full">Guide</span></div></article>
${COMING.map(([n, t, meta]) => `<article class="site"><h3>${esc(n)}</h3><p>${esc(t)}</p><div class="meta"><span class="mono">${esc(meta)}</span><span class="tag">Coming soon</span></div></article>`).join("\n")}
</div></div></section>`,
  });
}

// ---------- Monfragüe ----------
{
  const c = crumbs([["Home", "/"], ["Sites", "/sites/"], ["Monfragüe", "/sites/monfrague/"]]);
  addPage({
    path: "/sites/monfrague/",
    title: "Birdwatching in Monfragüe National Park: a guide | Wild Dehesa",
    description: "How to birdwatch in Monfragüe: the two viewpoints to start with, vultures and Black Storks, winter cranes, the best months and planning tips.",
    ogType: "article",
    ld: [c.ld, { "@context": "https://schema.org", "@type": "Article", headline: "Birdwatching in Monfragüe National Park", dateModified: SITE.updated, author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url }, mainEntityOfPage: SITE.url + "/sites/monfrague/" }],
    body: `${c.html}
<div class="wrap pagehead"><h1>Birdwatching in Monfragüe National Park</h1><p class="lede">The best single day of birding in Extremadura, and the first place most visitors go.</p></div>
<section style="padding-top:24px"><div class="wrap"><div class="article">
<div class="prose">
<h2>The park in brief</h2>
<p>Monfragüe sits in the centre of Cáceres province, at the point where the Tagus and Tiétar rivers meet. It is the only national park in Extremadura, a UNESCO biosphere reserve, and a protected area for birds. More than 280 species have been recorded here.</p>
<p>The draw is the rock. Parallel ridges and river gorges make cliffs that hold large colonies of Griffon and Black Vultures, with Egyptian Vulture, Peregrine, Bonelli's Eagle, Eagle Owl and the rare Spanish Imperial Eagle among the species birders come for.</p>
<h2>Start at the two viewpoints</h2>
<p>Salto del Gitano faces the rock face of Peñafalcón, and this is where most visitors begin. Griffon Vultures wheel along the cliff, and Blue Rock Thrush and Crag Martin work the same rocks. Black Storks nest here, and tour operators count it among the easiest places in Europe to watch them at the nest.</p>
<h2 id="cranes">Cranes in winter</h2>
<p>From autumn into late winter, Common Cranes use the park. A regional guide points to the Tiétar river near the Bazagona bridge as a roosting area and calls it the most intimate place to see them, which suits anyone who prefers a quiet spot to a crowded one.</p>
<h2>When to go</h2>
<p>Spring brings the greatest variety. Autumn and winter add cranes and other non-breeding visitors, and the cliffs hold vultures through every season. See the <a href="/calendar/">bird calendar</a> for month-by-month detail.</p>
<h2>Planning tips</h2>
<p>The park has marked trails, hides, parking areas, picnic spots and toilets, so a self-guided day works well. Start early, because the light is best and the cliffs are quieter. In the breeding season keep your distance from nests and use a telescope instead of walking closer. A local guide makes a real difference for the eagles.</p>
<h2>Where to base yourself</h2>
<p>Many visitors stay near Plasencia, Navalmoral de la Mata or Trujillo. The <a href="/sites/sierra-de-gata/">Sierra de Gata</a>, further north-west, gives you a different set of habitats and a quieter evening, and it pairs well with a day trip to the park. See <a href="/stay/">where to stay</a>.</p>
<div class="faq">
<h2>Questions</h2>
<h3>When is the best time to visit Monfragüe for birds?</h3>
<p>Spring gives the greatest variety. Autumn and winter add Common Cranes and other non-breeding visitors, and vultures can be seen all year.</p>
<h3>Which birds can I see in Monfragüe?</h3>
<p>Griffon, Black and Egyptian Vultures, Black Stork, Spanish Imperial Eagle, Bonelli's Eagle, Peregrine, Eagle Owl and Blue Rock Thrush are the headline species.</p>
<h3>Do I need a guide?</h3>
<p>Not for the vultures and storks at the main viewpoints, because the trails and hides make a self-guided day easy. A guide helps most with the eagles and with finding the right spot for the season.</p>
<h3>Can I see cranes in Monfragüe?</h3>
<p>Yes, in autumn and winter. The Tiétar river near the Bazagona bridge is described as a roosting area.</p>
</div>
</div>
<aside class="glance">
<h2>At a glance</h2>
<dl>
<div><dt class="mono">Where</dt><dd>Tagus and Tiétar confluence, Cáceres</dd></div>
<div><dt class="mono">Status</dt><dd>National park and UNESCO biosphere reserve</dd></div>
<div><dt class="mono">Species recorded</dt><dd>More than 280</dd></div>
<div><dt class="mono">Best months</dt><dd>March to May for variety, November to February for cranes</dd></div>
<div><dt class="mono">Star birds</dt><dd>Spanish Imperial Eagle, Black Vulture, Black Stork, Bonelli's Eagle, Eagle Owl</dd></div>
<div><dt class="mono">Facilities</dt><dd>Trails, hides, parking, picnic areas</dd></div>
</dl>
</aside>
</div></div></section>`,
  });
}

// ---------- Sierra de Gata ----------
{
  const c = crumbs([["Home", "/"], ["Sites", "/sites/"], ["Sierra de Gata", "/sites/sierra-de-gata/"]]);
  addPage({
    path: "/sites/sierra-de-gata/",
    title: "Birdwatching in the Sierra de Gata, Extremadura | Wild Dehesa",
    description: "Birdwatching in the Sierra de Gata: wintering cranes at Borbollón reservoir, resident raptors, oak and olive woods and the stone villages of the official route.",
    ogType: "article",
    ld: [c.ld, { "@context": "https://schema.org", "@type": "Article", headline: "Birdwatching in the Sierra de Gata", dateModified: SITE.updated, author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url }, mainEntityOfPage: SITE.url + "/sites/sierra-de-gata/" }],
    body: `${c.html}
<div class="wrap pagehead"><h1>Birdwatching in the Sierra de Gata</h1><p class="lede">The range lies in the north-west of Cáceres province, beside the Salamanca border. It is a protected bird area and one of the routes in the official Birding in Extremadura network.</p></div>
<section style="padding-top:24px"><div class="wrap"><div class="article">
<div class="prose">
<h2 id="birds">Birds of the range</h2>
<p>The eastern range is an Important Bird Area for resident raptors, including the Spanish Imperial Eagle. The official route lists Black-winged Kite, Griffon Vulture, Black Stork and Nightingale. The landscape mixes pine, heather and broom on the high ground with oak and olive woods, tobacco-drying sheds and open dehesa lower down.</p>
<h2 id="borbollon">Cranes at Borbollón reservoir</h2>
<p>The regional guide estimates about 4,000 Common Cranes winter around the Borbollón reservoir, though it gives no date for the count. Treat it as a scale and ask a local guide for recent numbers. The island also holds heron and egret colonies in the breeding season.</p>
<h2 id="alagon">Alagón valley fields</h2>
<p>Cranes feed by day in open farmland and dehesa near Moraleja, in the Alagón valley close to the Sierra de Gata. Binoculars are enough, and no hide is needed. Late afternoon is when cranes typically return to their roost sites.</p>
<h2 id="villages">Villages, crafts and trees</h2>
<p>Robledillo de Gata, Hoyos, Trevejo, San Martín de Trevejo and Gata are the stone villages on the route, and Robledillo de Gata is a protected historic ensemble. Local crafts include the lacework of Hoyos, the goldsmiths of Gata and the basketwork of San Martín de Trevejo. The Cedro de Gata is a protected singular tree.</p>
<h2>When to go</h2>
<p>November to February is crane season. Spring brings woodland song and raptors over the ridges. See the <a href="/calendar/">bird calendar</a> and the <a href="/routes/#winter-cranes">winter crane route</a>, which starts here.</p>
<h2>Where to stay</h2>
<p>${SITE.casaName} is on the edge of Hoyos, one of the villages on the route. <a href="/stay/">About the stay</a>.</p>
</div>
<aside class="glance">
<h2>At a glance</h2>
<dl>
<div><dt class="mono">Where</dt><dd>North-west Cáceres, beside the Salamanca border</dd></div>
<div><dt class="mono">Status</dt><dd>Special protection area for birds and special conservation area</dd></div>
<div><dt class="mono">Best months</dt><dd>November to February for cranes, spring for woodland birds</dd></div>
<div><dt class="mono">Star birds</dt><dd>Common Crane, Spanish Imperial Eagle, Black-winged Kite, Black Stork</dd></div>
<div><dt class="mono">Villages</dt><dd>Robledillo de Gata, Hoyos, Trevejo, San Martín de Trevejo, Gata</dd></div>
</dl>
</aside>
</div></div></section>`,
  });
}

// ---------- Arrocampo ----------
{
  const c = crumbs([["Home", "/"], ["Sites", "/sites/"], ["Arrocampo", "/sites/arrocampo/"]]);
  const src = [
    ["Arrocampo Reservoir, BirdForum Opus", "https://www.birdforum.net/opus/Arrocampo_Reservoir"],
    ["Parque Periurbano Almaraz, Birding Places", "https://www.birdingplaces.eu/en/birdingplaces/spain/parque-periurbano-almaraz"],
    ["Embalse de Arrocampo, Turismo Extremadura", "https://admin.turismoextremadura.juntaex.es/en/explora/Embalse-de-Arrocampo-00001"],
    ["Squacco Heron, Birding in Extremadura", "https://birdinginextremadura.com/en/ave/garcilla-cangrejera-en/"],
  ];
  addPage({
    path: "/sites/arrocampo/",
    title: "Birdwatching at Arrocampo reservoir, Extremadura | Wild Dehesa",
    description: "Birdwatching at Arrocampo reservoir: reedbed herons, swamphens and bitterns, hides, easy trails, otters at dawn, and the best months to go.",
    ogType: "article",
    ld: [c.ld, { "@context": "https://schema.org", "@type": "Article", headline: "Birdwatching at Arrocampo reservoir", dateModified: SITE.updated, author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url }, mainEntityOfPage: SITE.url + "/sites/arrocampo/" }],
    body: `${c.html}
<div class="wrap pagehead"><h1>Birdwatching at Arrocampo reservoir</h1><p class="lede">A reedbed reservoir in the Tagus valley where herons, swamphens and bitterns give close views, and otters sometimes appear at dawn.</p></div>
<section style="padding-top:24px"><div class="wrap"><div class="article">
<div class="prose">
<h2>The reservoir in brief</h2>
<p>Arrocampo is a dam on the Arrocampo river in Cáceres province, near where the river meets the Tagus, between the Campo Arañuelo region and <a href="/sites/monfrague/">Monfragüe National Park</a>. It was built to supply cooling water for the Almaraz nuclear power plant and was completed in 1983. It does not generate power or irrigate fields.</p>
<p>That origin shapes the birding. The water level is held unusually steady and the water runs warmer than normal, which suits large reedbeds and birds that are hard to find elsewhere in the interior of the peninsula. The reservoir and its surroundings are a protected Special Protection Area within the Natura 2000 network. A meadow of holm oaks beside the water adds dehesa species to the wetland list.</p>
<h2>What to see</h2>
<h3>Spring and summer</h3>
<p>The Western Swamphen breeds here in fairly large numbers and often gives close views. Purple Heron, Squacco Heron and Little Bittern are regular summer visitors, and the Squacco Heron is one of the breeding birds the regional guide names for Arrocampo. Savi's Warbler and Great Reed Warbler sing from the reeds. Black-winged Kite and European Bee-eater are also on the site list.</p>
<h3>Autumn and winter</h3>
<p>Great Bittern regularly overwinters, as does Bluethroat. Great White Egret has become fairly common in recent years. Grebes, Great Cormorant, Eurasian Spoonbill and Osprey add variety through the cooler months.</p>
<h3>Otters</h3>
<p>Otters are commonly seen, especially early in the morning from Hide 2.</p>
<h2>Hides and access</h2>
<p>There are several bird hides on the reservoir. One birder's guide describes five hides along the shore, with a visitors centre that issues the key and site maps and is closed on Sundays, when the key can be collected from a café by the municipal pool. It adds that the hides sit well back from the water, so much of the birding happens from the ramps leading up to them, and that Hide 2 is probably the best of the five.</p>
<p>Another site describes easy, flat, mostly unpaved paths with a circular trail, ample parking, and access on foot, by bicycle or by wheelchair. It rates the site as good for families. A telescope is useful. Nearby Saucedilla has an ornithology park with information on routes in the area.</p>
<p>These details come from published guides, one of them last updated in 2022. Opening arrangements change, so confirm the key and hours locally before you go.</p>
<h2>When to go</h2>
<p>Spring, autumn and winter are all recommended, with the spring and autumn migrations the best moments, and the site can be birded all year. Go early for otters. Summer suits swamphens and nesting herons, and winter suits bitterns. See the <a href="/calendar/april/">April</a>, <a href="/calendar/may/">May</a> and <a href="/calendar/december/">December</a> pages for what else is moving.</p>
<h2>Combine it with</h2>
<p>Arrocampo sits close to Monfragüe, so the two work well together. The <a href="/routes/#raptors-and-steppe">spring route</a> ends a day at Arrocampo before returning along the Sierra de Gata.</p>
<div class="faq">
<h2>Questions</h2>
<h3>Is Arrocampo good for birdwatching in winter?</h3>
<p>Yes. Great Bittern and Bluethroat regularly overwinter, and Great White Egret has become fairly common.</p>
<h3>Can children or wheelchair users visit?</h3>
<p>Birding Places describes flat, wide, mostly unpaved paths, a circular trail and wheelchair access, and calls the site suitable for families. Check current conditions locally.</p>
<h3>Do I need a guide?</h3>
<p>Not for a first visit, since the paths are easy and the hides are clearly set out. A guide helps with the reedbed species, which are often heard before they are seen.</p>
</div>
<h2>Sources</h2>
<ul class="plain">${src.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("")}</ul>
</div>
<aside class="glance">
<h2>At a glance</h2>
<dl>
<div><dt class="mono">Where</dt><dd>Arrocampo river reservoir, Cáceres, near the Tagus</dd></div>
<div><dt class="mono">Status</dt><dd>Special protection area, Natura 2000</dd></div>
<div><dt class="mono">Best months</dt><dd>Spring and autumn migration, winter for bitterns, summer for herons</dd></div>
<div><dt class="mono">Star birds</dt><dd>Western Swamphen, Purple Heron, Squacco Heron, Little Bittern, Great Bittern</dd></div>
<div><dt class="mono">Facilities</dt><dd>Several hides, flat easy paths, parking</dd></div>
<div><dt class="mono">Also</dt><dd>Otters at dawn from Hide 2</dd></div>
</dl>
</aside>
</div></div></section>`,
  });
}

// ---------- Routes ----------
{
  const c = crumbs([["Home", "/"], ["Routes", "/routes/"]]);
  addPage({
    path: "/routes/",
    title: "Birdwatching routes in Extremadura: 3-day plans | Wild Dehesa",
    description: "Two three-day birdwatching plans for Extremadura: winter cranes around the Sierra de Gata and Monfragüe, and spring raptors, steppe and reedbeds.",
    ld: [c.ld],
    body: `${c.html}
<div class="wrap pagehead"><h1>Three-day birdwatching routes in Extremadura</h1><p class="lede">Two starting points for a short trip. Driving times and opening details get added once each route has been tested on the ground.</p></div>
<section style="padding-top:24px"><div class="wrap">
${ROUTES.map((r) => `<div class="route" id="${r.slug}"><h2>${esc(r.title)}</h2><p class="sub">${esc(r.intro)}</p><div class="days">${r.days.map((x, k) => `<div class="day"><span class="mono">Day ${k + 1}</span><div><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></div></div>`).join("")}</div></div>`).join("\n")}
</div></section>`,
  });
}

// ---------- Guides ----------
{
  const c = crumbs([["Home", "/"], ["Guides", "/guides/"]]);
  const mail = (subject) => `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
  addPage({
    path: "/guides/",
    title: "Local birdwatching guides in Extremadura | Wild Dehesa",
    description: "Find a local birdwatching guide for Extremadura and the Sierra de Gata, or tell us you guide birders and want to be listed.",
    ld: [c.ld],
    body: `${c.html}
<div class="wrap pagehead"><h1>Local guides, on request</h1><p class="lede">A guide finds the Spanish Imperial Eagle faster than any app, knows which fields the cranes used this week, and keeps you at a respectful distance from nests.</p></div>
<section style="padding-top:24px"><div class="wrap"><div class="split">
<div class="callout"><h2>Looking for a guide?</h2><p>We are building a small directory of licensed local guides. Email us your dates, group size and what you most want to see, and we will do our best to connect you with someone suitable.</p><p><a class="btn primary" href="${mail("Guide request")}">Email ${SITE.email}</a></p></div>
<div class="callout"><h2>Are you a guide?</h2><p>If you guide birders in Extremadura or the Sierra de Gata, we would like to hear from you. Tell us your languages, your species focus, your group sizes and the areas you cover.</p><p><a class="btn ghost" href="${mail("Guide listing")}">Get listed</a></p></div>
</div></div></section>`,
  });
}

// ---------- Stay ----------
{
  const c = crumbs([["Home", "/"], ["Stay", "/stay/"]]);
  addPage({
    path: "/stay/",
    title: "Where to stay for birdwatching in the Sierra de Gata | Wild Dehesa",
    description: `${SITE.casaName}: a rural house on the edge of Hoyos, on the official Sierra de Gata birding route. Sleeps up to 10, with garden, pool and fireplace lounge.`,
    ld: [c.ld],
    body: `${c.html}
<div class="wrap pagehead"><h1>A quiet base in the Sierra de Gata</h1><p class="lede">${SITE.casaName} sits on the edge of Hoyos, one of the villages on the official Sierra de Gata birding route.</p></div>
<section style="padding-top:24px"><div class="wrap"><div class="split">
<div class="body-text">
<p>The house sleeps up to 10 in five bedrooms, or 12 with the sofa bed, so it suits a small birding group as well as a couple.</p>
<p>After a day in the field there is a lounge with a fireplace, a library, and a garden of olive and fruit trees with a pool and a shaded barbecue patio. Nearby villages include Robledillo de Gata, Trevejo and San Martín de Trevejo, with hiking trails through forests and mountains.</p>
<p>Staying for the birds? Tell us what you want to see and we will help you plan the days. See the <a href="/routes/">three-day routes</a> and the <a href="/sites/sierra-de-gata/">Sierra de Gata guide</a>.</p>
</div>
<div class="callout"><h2>Book direct</h2><p>Availability, rates and booking are on the casa's own site.</p><p><a class="btn primary" href="${SITE.casaUrl}" target="_blank" rel="noopener">Visit casasierradegata.com</a></p><p>Questions about birding trips: <a href="mailto:${SITE.email}">${SITE.email}</a></p></div>
</div></div></section>`,
  });
}

// ---------- Privacy ----------
{
  const c = crumbs([["Home", "/"], ["Privacy", "/privacy/"]]);
  addPage({
    path: "/privacy/",
    title: "Privacy | Wild Dehesa",
    description: "How Wild Dehesa handles personal data: no cookies, no trackers, and email used only to reply.",
    ld: [c.ld],
    body: `${c.html}
<div class="wrap pagehead"><h1>Privacy</h1><p class="lede">Last updated ${SITE.updated}.</p></div>
<section style="padding-top:24px"><div class="wrap"><div class="prose">
<h2>Who we are</h2>
<p>Wild Dehesa (wilddehesa.com) is a birdwatching guide run from Hoyos, Cáceres, Spain. Contact: <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<h2>What this site collects</h2>
<p>This site does not set cookies and does not use third-party trackers. Fonts are served from this site, not from a third party. Our host, Cloudflare, processes visitors' IP addresses to deliver pages and protect the site from abuse.</p>
<h2>Email</h2>
<p>If you email us, we use your message and address only to reply and to arrange what you asked for, such as a guide introduction. We keep it as long as the conversation needs it and do not sell or share it for marketing.</p>
<h2>Your rights</h2>
<p>You can ask us to show, correct or delete the personal data we hold about you by emailing us. If you are unhappy with how we handle it, you can complain to the Spanish data protection authority, the AEPD.</p>
<h2>Links to other sites</h2>
<p>This site links to the casa's own site and to official tourism and conservation sources. Their privacy practices are their own.</p>
</div></div></section>`,
  });
}

// ---------- 404 ----------
pages.push({ path: "/404.html", html: layout({ path: "/404.html", title: "Page not found | Wild Dehesa", description: "This page does not exist.", noindex: true, body: `<div class="wrap pagehead"><h1>Page not found</h1><p class="lede">Try the <a href="/calendar/">bird calendar</a> or the <a href="/sites/">list of sites</a>.</p></div>` }), inSitemap: false, raw: true });

// ---------- Write ----------
for (const p of pages) {
  if (p.redirect) continue;
  const file = p.raw ? join(OUT, p.path) : join(OUT, p.path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, p.html);
}
const urls = pages.filter((p) => p.inSitemap !== false && !p.redirect);
writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((p) => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${p.lastmod}</lastmod></url>`).join("\n")}\n</urlset>\n`);
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
writeFileSync(join(OUT, "_headers"), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n\n/assets/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n`);
console.log(`Built ${urls.length} pages to /public`);
