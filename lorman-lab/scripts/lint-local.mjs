import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [
  "client/src/App.tsx",
  "client/src/pages/home.tsx",
  "client/src/pages/c2-home.tsx",
  "client/src/lib/lab-analytics.ts",
  "telegram/bot.mjs",
  "content/c2/piloto/preguntas.json",
];
const forbidden = /(Lorman2026!|FwfxmfB42jd9MXarWLGJnNlp3|gho_[A-Za-z0-9]+|TELEGRAM_BOT_TOKEN\s*=\s*[^\s#]+)/;
const problems = [];

for (const relative of files) {
  const filePath = path.join(root, relative);
  const text = fs.readFileSync(filePath, "utf8");
  if (forbidden.test(text)) problems.push(`${relative}: posible secreto`);
  if (relative.endsWith("preguntas.json")) {
    const data = JSON.parse(text);
    if (data.questions.length < 30 || data.questions.length > 50) problems.push(`${relative}: número de preguntas fuera del piloto`);
    for (const question of data.questions) {
      for (const field of ["answer", "explanation", "source", "reviewDate", "reviewStatus", "difficulty", "category"]) {
        if (question[field] === undefined || question[field] === "") problems.push(`${relative}: ${question.id} no tiene ${field}`);
      }
    }
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(`lint-local ok (${files.length} archivos comprobados)`);
