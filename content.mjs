// All site content lives here. Edit this file and run `node build.mjs` to regenerate /public.

export const SITE = {
  url: "https://wilddehesa.com",
  name: "Wild Dehesa",
  tagline: "Birdwatching in Extremadura, Spain",
  email: "caceresruralhoyos@gmail.com",
  casaUrl: "https://casasierradegata.com/en",
  casaName: "Casa Rural Jardín de la Sierra de Gata",
  updated: "2026-10-10",
};

export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export const MONTH_DATA = [
  { h: "Cranes at full strength", look: ["Common Crane", "Great Bustard flocks", "Griffon Vulture over the cliffs"], go: ["Borbollón reservoir", "Alagón valley fields", "Llanos de Cáceres"], note: "Cold, clear mornings. Cranes fly out at dawn and back in at dusk." },
  { h: "Late winter, early nesting", look: ["Common Crane, thinning out", "Spanish Imperial Eagle pairs", "Vultures on cliff ledges"], go: ["Monfragüe", "Sierra de Gata"], note: "Nesting begins. Keep well back from any nest you find." },
  { h: "The changeover", look: ["First Black Kites and Egyptian Vultures", "Black Storks at the nest", "Bustards displaying"], go: ["Monfragüe", "Llanos de Cáceres and Trujillo"], note: "Weather swings between sun and rain, so pack both." },
  { h: "Spring arrivals", look: ["Bee-eaters and hoopoes arriving", "Nightingales in song", "Raptors over the dehesa"], go: ["Sierra de Gata woods", "Arrocampo reedbeds", "Monfragüe"], note: "Song is the easiest way to find woodland birds." },
  { h: "The month of most species", look: ["Bee-eaters, orioles and warblers", "Herons nesting in the reedbeds", "Little Bustard and sandgrouse on the steppe"], go: ["La Serena", "Arrocampo", "Monfragüe"], note: "Peak season. Book rooms and guides early." },
  { h: "Breeding season", look: ["Fledging chicks", "Raptors at the cliffs", "Bee-eaters feeding young"], go: ["Monfragüe", "Reservoir edges"], note: "Heat builds by midday. Go at first light and rest after lunch." },
  { h: "Hot and quiet", look: ["Vultures riding thermals", "Herons and egrets at reservoirs", "Bee-eaters over open ground"], go: ["Borbollón reservoir", "Arrocampo"], note: "Dawn only, and carry plenty of water." },
  { h: "Heat and early migrants", look: ["Waterbirds gathering", "First southbound raptors and storks", "Vultures at carcass sites"], go: ["Reservoirs", "Ridge viewpoints"], note: "Still hot. Mornings and evenings repay the effort." },
  { h: "Autumn passage", look: ["Raptors and storks heading south", "Late bee-eaters", "Warblers in the scrub"], go: ["Ridge viewpoints", "Reservoir edges"], note: "Cooler weather returns and the sites are quiet." },
  { h: "Cranes arrive", look: ["First Common Cranes from northern Europe", "Autumn colour in the oaks", "Acorn season in the dehesa"], go: ["Borbollón reservoir", "Alagón valley fields"], note: "Arrival dates vary by year. Dusk roost flights are the best show." },
  { h: "Cranes settle in", look: ["Cranes feeding in fields and dehesa", "Great Bustard flocks", "Wintering raptors"], go: ["Borbollón reservoir", "Tiétar near the Bazagona bridge", "Alagón valley fields"], note: "Mild days and low crowds make this an easy month." },
  { h: "Winter on the plains", look: ["Common Crane", "Bustard flocks", "Raptors over open ground"], go: ["Llanos de Cáceres", "Sierra de Gata", "Monfragüe"], note: "Short days and frosty starts. Bring layers." },
];

// level: 2 easy to see, 1 arriving, leaving or harder to find, 0 not present. Jan to Dec.
export const SPECIES = [
  ["Common Crane", "Grus grus", [2,2,1,0,0,0,0,0,0,1,2,2]],
  ["Griffon Vulture", "Gyps fulvus", [2,2,2,2,2,2,2,2,2,2,2,2]],
  ["Spanish Imperial Eagle", "Aquila adalberti", [2,2,2,2,2,2,2,2,2,2,2,2]],
  ["Great Bustard", "Otis tarda", [2,2,2,2,1,1,1,1,1,1,2,2]],
  ["Black Stork", "Ciconia nigra", [0,1,2,2,2,2,2,1,0,0,0,0]],
  ["Black Kite", "Milvus migrans", [0,1,2,2,2,2,2,2,1,0,0,0]],
  ["Egyptian Vulture", "Neophron percnopterus", [0,0,1,2,2,2,2,2,1,0,0,0]],
  ["European Bee-eater", "Merops apiaster", [0,0,0,1,2,2,2,2,1,0,0,0]],
];

export const ROUTES = [
  { slug: "winter-cranes", title: "Winter cranes, November to February", intro: "Three days built around the cranes, starting from the Sierra de Gata.", days: [
    ["Sierra de Gata and Borbollón", "Spend the morning in the oak and olive woods around Hoyos, then go to the Borbollón reservoir, the area's best-known crane site. The island is a heron and egret colony in spring, so winter belongs to the cranes."],
    ["Alagón valley fields", "Look for cranes feeding in open farmland and dehesa near Moraleja. Late afternoon is when cranes typically return to their roost sites."],
    ["Monfragüe", "A longer outing. Start at Salto del Gitano for the vultures at Peñafalcón, then finish at the Tiétar river near the Bazagona bridge, a crane roosting area."],
  ]},
  { slug: "raptors-and-steppe", title: "Raptors and steppe, April to May", intro: "Three days that cover cliffs, plains and reedbeds in the main spring window.", days: [
    ["Monfragüe", "Salto del Gitano and Peñafalcón for vultures and nesting Black Storks, then the marked trails and hides for Spanish Imperial Eagle and Bonelli's Eagle."],
    ["The steppe", "Llanos de Cáceres and Trujillo for bustards and larks. La Serena lies further south, so plan it as its own day or an overnight."],
    ["Arrocampo and home", "Reedbeds at Arrocampo for herons, then back along the Sierra de Gata route for woodland species."],
  ]},
];

export const SOURCES = [
  ["Birding in Extremadura, Junta de Extremadura", "https://www.birdinginextremadura.com/en/"],
  ["Sierra de Gata route, Birding in Extremadura", "https://www.birdinginextremadura.com/en/extremadura-aves/detalles/25e30725-df2b-11e3-9bf9-e41f13b8b5fa"],
  ["Monfragüe, Birding Places", "https://www.birdingplaces.eu/birdingplaces/spain/parque-nacional-de-monfrague"],
  ["East Gata mountain range, BirdLife IBA factsheet", "https://datazone.birdlife.org/site/factsheet/east-gata-mountain-range-iba-spain"],
  ["Cranes in Extremadura, PlanVex", "https://planvex.es/web/2015/11/cranes-extremadura/"],
];

// Sites that do not have a page yet. They appear on the sites index as "coming soon".
export const COMING = [
  ["Llanos de Cáceres and Trujillo", "Wide steppe plains for bustards, larks and raptors, with the old town of Trujillo close by.", "Cáceres · Mar to May, winter"],
  ["La Serena", "Treeless grassland that tour operators rank among the best places in the world for steppe birds such as Little Bustard and sandgrouse.", "Badajoz · Apr to Jun"],
  ["Arrocampo reservoir", "Reedbeds beside the Almaraz power station, where warm outflow draws a wide range of waterbirds and herons.", "Cáceres · Apr to Jun"],
];
