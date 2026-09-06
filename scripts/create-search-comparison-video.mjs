import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp");

const width = 1280;
const height = 720;
const outputDir = resolve("docs/videos/busca-assistida");
const framesDir = resolve(outputDir, "frames");
const productImagePaths = [
  "tenis-cinza.jpg",
  "tenis-vermelho.jpg",
  "tenis-azul-vans.jpg",
  "tenis-verde-nike.jpg",
  "tenis-amarelo-sneep.jpg",
  "tenis-colorido-nike.jpg",
].map((fileName) => resolve("docs/videos/assets", fileName));

await mkdir(framesDir, { recursive: true });

const productImageDataUris = await Promise.all(productImagePaths.map(async (imagePath) => {
  const imageBase64 = (await readFile(imagePath)).toString("base64");
  return `data:image/jpeg;base64,${imageBase64}`;
}));

const colors = {
  bg: "#171411",
  panel: "#231f1b",
  panel2: "#2c2621",
  border: "#5a4029",
  accent: "#ff9d4d",
  accentSoft: "#4a2f1a",
  text: "#fff8f0",
  muted: "#cdbfb2",
  success: "#8ed081",
  danger: "#ff806f",
};

const scenes = [
  {
    duration: 3.5,
    svg: titleScene(
      "Encontrar um produto",
      "não deveria exigir tantos passos.",
      "Busca tradicional × busca assistida",
    ),
  },
  {
    duration: 4,
    svg: traditionalScene(0, "Em um catálogo convencional…", "A intenção começa simples."),
  },
  {
    duration: 4,
    svg: traditionalScene(1, "Para refinar, surgem várias decisões", "Cada filtro adiciona mais um passo."),
  },
  {
    duration: 3.5,
    svg: frictionScene(),
  },
  {
    duration: 3,
    svg: titleScene(
      "E se bastasse escrever",
      "o que você realmente procura?",
      "Uma frase curta. Nenhum formulário de filtros.",
    ),
  },
  {
    duration: 5,
    svg: assistantScene(),
  },
  {
    duration: 4,
    svg: benefitsScene(),
  },
  {
    duration: 3,
    svg: titleScene(
      "Menos cliques.",
      "Mais intenção.",
      "Busca assistida para catálogos de produtos.",
    ),
  },
];

const timeline = [];

for (const [index, scene] of scenes.entries()) {
  const name = `scene-${String(index + 1).padStart(2, "0")}.png`;
  await sharp(Buffer.from(scene.svg))
    .png()
    .toFile(resolve(framesDir, name));
  timeline.push(`file 'frames/${name}'`, `duration ${scene.duration}`);
}

timeline.push(`file 'frames/scene-${String(scenes.length).padStart(2, "0")}.png'`);
await writeFile(resolve(outputDir, "timeline.txt"), timeline.join("\n") + "\n");

console.log(JSON.stringify({
  outputDir,
  scenes: scenes.length,
  durationSeconds: scenes.reduce((total, scene) => total + scene.duration, 0),
  resolution: `${width}x${height}`,
}));

function titleScene(line1, line2, subtitle) {
  return canvas(`
    <text x="90" y="240" class="eyebrow">DEMONSTRAÇÃO DE EXPERIÊNCIA</text>
    <text x="90" y="322" class="title">${escapeXml(line1)}</text>
    <text x="90" y="390" class="title accent">${escapeXml(line2)}</text>
    <text x="92" y="465" class="subtitle">${escapeXml(subtitle)}</text>
    <rect x="92" y="515" width="210" height="6" rx="3" fill="${colors.accent}"/>
  `, "CATALOG SEARCH IA");
}

function traditionalScene(step, heading, subheading) {
  const filters = [
    ["Gênero", "Masculino"],
    ["Tamanho", "42"],
    ["Tipo", "Calçados"],
    ["Esporte", "Corrida"],
    ["Marca", "Selecionar"],
    ["Preço", "R$ 350–400"],
  ];

  const filterRows = filters.map(([label, value], index) => {
    const active = step === 1 && index < 5;
    return `
      <rect x="78" y="${190 + index * 62}" width="314" height="48" rx="12"
        fill="${active ? colors.accentSoft : colors.panel2}"
        stroke="${active ? colors.accent : colors.border}"/>
      <rect x="94" y="${205 + index * 62}" width="18" height="18" rx="4"
        fill="${active ? colors.accent : "none"}" stroke="${active ? colors.accent : colors.muted}"/>
      ${active ? `<path d="M98 ${214 + index * 62} l5 5 l9 -11" fill="none" stroke="${colors.bg}" stroke-width="3"/>` : ""}
      <text x="126" y="${220 + index * 62}" class="filter-label">${label}</text>
      <text x="374" y="${220 + index * 62}" class="filter-value" text-anchor="end">${value}</text>
    `;
  }).join("");

  const productCards = [0, 1, 2, 3, 4, 5].map((item) => {
    const x = 450 + (item % 3) * 250;
    const y = 190 + Math.floor(item / 3) * 215;
    const productNames = [
      "Adidas casual",
      "Nike de corrida",
      "Vans cano alto",
      "Nike esportivo",
      "Sneep Crew",
      "Nike Air Force",
    ];
    return `
      <defs>
        <clipPath id="catalog-product-${item}">
          <rect x="${x + 14}" y="${y + 14}" width="192" height="92" rx="12"/>
        </clipPath>
      </defs>
      <rect x="${x}" y="${y}" width="220" height="185" rx="18" fill="${colors.panel2}" stroke="${colors.border}"/>
      <image href="${productImageDataUris[item]}" x="${x + 14}" y="${y + 14}" width="192" height="92"
        preserveAspectRatio="xMidYMid slice" clip-path="url(#catalog-product-${item})"/>
      <rect x="${x + 14}" y="${y + 14}" width="192" height="92" rx="12"
        fill="none" stroke="${item === 1 ? colors.accent : colors.border}" stroke-width="${item === 1 ? 3 : 1}"/>
      <text x="${x + 16}" y="${y + 134}" class="card-title">${productNames[item]}</text>
      <text x="${x + 16}" y="${y + 160}" class="card-price">R$ ${[299, 369, 449, 579, 699, 899][item]},90</text>
    `;
  }).join("");

  return canvas(`
    <text x="64" y="92" class="eyebrow">BUSCA TRADICIONAL — EXEMPLO DE JORNADA</text>
    <text x="64" y="142" class="heading">${escapeXml(heading)}</text>
    <text x="1210" y="142" class="small" text-anchor="end">${escapeXml(subheading)}</text>
    <rect x="54" y="168" width="356" height="430" rx="24" fill="${colors.panel}" stroke="${colors.border}"/>
    <text x="78" y="626" class="small">${step === 0 ? "Abra e avalie cada grupo de filtros" : "5 seleções antes de comparar os resultados"}</text>
    ${filterRows}
    ${productCards}
    <text x="64" y="684" class="source">Referência pesquisada: catálogo Decathlon Brasil — gênero, idade, tamanho, tipo, esporte, marca e preço.</text>
  `, "COMPARATIVO");
}

function frictionScene() {
  const items = [
    ["01", "Abrir filtros"],
    ["02", "Escolher categoria"],
    ["03", "Selecionar esporte"],
    ["04", "Definir tamanho"],
    ["05", "Informar preço"],
    ["06", "Revisar resultados"],
  ];
  return canvas(`
    <text x="80" y="112" class="eyebrow">O CUSTO DA FRICÇÃO</text>
    <text x="80" y="178" class="title-small">Uma intenção simples vira uma sequência de decisões.</text>
    ${items.map(([n, label], i) => {
      const x = 80 + (i % 3) * 390;
      const y = 245 + Math.floor(i / 3) * 150;
      return `
        <rect x="${x}" y="${y}" width="350" height="112" rx="22" fill="${colors.panel}" stroke="${colors.border}"/>
        <text x="${x + 24}" y="${y + 48}" class="step">${n}</text>
        <text x="${x + 88}" y="${y + 66}" class="card-title">${label}</text>
      `;
    }).join("")}
    <text x="80" y="610" class="subtitle">Mais cliques aumentam o esforço e a chance de abandono.</text>
  `, "BUSCA TRADICIONAL");
}

function assistantScene() {
  return canvas(`
    <defs>
      <clipPath id="assistant-product-image">
        <rect x="190" y="360" width="250" height="218" rx="20"/>
      </clipPath>
    </defs>
    <text x="64" y="82" class="eyebrow">NOSSO CATÁLOGO — BUSCA ASSISTIDA</text>
    <text x="64" y="132" class="heading">Descreva o produto em poucas palavras.</text>
    <rect x="64" y="166" width="1152" height="82" rx="24" fill="${colors.panel}" stroke="${colors.accent}" stroke-width="2"/>
    <text x="96" y="218" class="query">Tênis de valor 369,90</text>
    <rect x="1028" y="180" width="168" height="54" rx="16" fill="${colors.accent}"/>
    <text x="1112" y="215" class="button" text-anchor="middle">Perguntar</text>
    <path d="M640 270 L640 310" stroke="${colors.accent}" stroke-width="4"/>
    <path d="M628 298 L640 312 L652 298" fill="none" stroke="${colors.accent}" stroke-width="4"/>
    <rect x="160" y="330" width="960" height="278" rx="28" fill="${colors.panel}" stroke="${colors.border}"/>
    <image href="${productImageDataUris[1]}" x="190" y="360" width="250" height="218"
      preserveAspectRatio="xMidYMid slice" clip-path="url(#assistant-product-image)"/>
    <rect x="190" y="360" width="250" height="218" rx="20" fill="none" stroke="${colors.accent}" stroke-width="2"/>
    <text x="486" y="384" class="eyebrow">1 RESULTADO EXATO</text>
    <text x="486" y="438" class="heading">Tênis para Corrida Urbana Premium</text>
    <text x="486" y="486" class="price">R$ 369,90</text>
    <text x="486" y="526" class="body">A intenção foi entendida: produto + preço.</text>
    <rect x="486" y="548" width="236" height="34" rx="17" fill="${colors.accentSoft}"/>
    <text x="604" y="571" class="pill" text-anchor="middle">PostgreSQL + IA</text>
    <text x="190" y="599" class="photo-credit">Foto: REVOLT / Unsplash</text>
  `, "CATALOG SEARCH IA");
}

function benefitsScene() {
  const cards = [
    ["1 frase", "O usuário descreve a intenção naturalmente."],
    ["1 resultado", "A busca combina nome e preço com precisão."],
    ["Menos esforço", "Sem percorrer vários grupos de filtros."],
  ];
  return canvas(`
    <text x="76" y="120" class="eyebrow">VANTAGEM DA BUSCA ASSISTIDA</text>
    <text x="76" y="184" class="title-small">O sistema traduz intenção em critérios de busca.</text>
    ${cards.map(([title, body], i) => {
      const x = 76 + i * 390;
      return `
        <rect x="${x}" y="252" width="350" height="235" rx="28" fill="${colors.panel}" stroke="${i === 1 ? colors.accent : colors.border}" stroke-width="${i === 1 ? 2 : 1}"/>
        <circle cx="${x + 50}" cy="305" r="22" fill="${colors.accentSoft}"/>
        <path d="M${x + 40} 305 l7 7 l14 -17" fill="none" stroke="${colors.accent}" stroke-width="4"/>
        <text x="${x + 30}" y="374" class="heading">${title}</text>
        <foreignObject x="${x + 30}" y="400" width="290" height="70">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font: 22px Ubuntu, sans-serif; line-height:1.35; color:${colors.muted}">${body}</div>
        </foreignObject>
      `;
    }).join("")}
    <text x="76" y="580" class="subtitle">Filtros continuam úteis. O assistente reduz o trabalho para quem já sabe o que procura.</text>
  `, "RESULTADO");
}

function canvas(content, badge) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="1280" height="720" fill="${colors.bg}"/>
    <circle cx="1160" cy="90" r="260" fill="${colors.accent}" opacity=".035"/>
    <circle cx="90" cy="700" r="240" fill="${colors.accent}" opacity=".025"/>
    <style>
      text { font-family: Ubuntu, DejaVu Sans, sans-serif; fill: ${colors.text}; }
      .eyebrow { font-size: 18px; font-weight: 700; letter-spacing: 4px; fill: ${colors.accent}; }
      .title { font-size: 58px; font-weight: 700; letter-spacing: -2px; }
      .title-small { font-size: 42px; font-weight: 700; letter-spacing: -1px; }
      .heading { font-size: 32px; font-weight: 700; }
      .subtitle { font-size: 26px; fill: ${colors.muted}; }
      .body { font-size: 22px; fill: ${colors.muted}; }
      .small { font-size: 18px; fill: ${colors.muted}; }
      .source { font-size: 15px; fill: #9f9184; }
      .photo-credit { font-size: 13px; fill: #9f9184; }
      .accent { fill: ${colors.accent}; }
      .filter-label { font-size: 18px; font-weight: 700; }
      .filter-value { font-size: 16px; fill: ${colors.muted}; }
      .card-title { font-size: 20px; font-weight: 700; }
      .card-price { font-size: 17px; fill: ${colors.accent}; }
      .step { font-size: 30px; font-weight: 700; fill: ${colors.accent}; }
      .query { font-size: 28px; }
      .button { font-size: 20px; font-weight: 700; fill: ${colors.bg}; }
      .price { font-size: 36px; font-weight: 700; fill: ${colors.accent}; }
      .pill { font-size: 16px; font-weight: 700; fill: ${colors.accent}; }
      .badge { font-size: 15px; font-weight: 700; letter-spacing: 2px; fill: ${colors.muted}; }
    </style>
    <rect x="1040" y="32" width="190" height="38" rx="19" fill="${colors.panel}" stroke="${colors.border}"/>
    <text x="1135" y="57" class="badge" text-anchor="middle">${badge}</text>
    ${content}
  </svg>`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
