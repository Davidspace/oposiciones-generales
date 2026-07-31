import { readdir, readFile, writeFile } from "node:fs/promises";

const questionsDirectory = new URL("../content-source/questions/", import.meta.url);
const effectiveDate = process.env.REBALANCE_DATE ?? "2026-07-30";

function bumpPatch(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version ?? "");
  if (!match) return version;
  return `${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
}

const files = (await readdir(questionsDirectory))
  .filter((file) => file.endsWith(".json"))
  .sort();

let changed = 0;
const distribution = [0, 0, 0, 0];

for (const [index, file] of files.entries()) {
  const fileUrl = new URL(file, questionsDirectory);
  const question = JSON.parse(await readFile(fileUrl, "utf8"));
  const options = Array.isArray(question.options) ? [...question.options] : [];
  const currentCorrect = options.findIndex((option) => option?.isCorrect === true);
  if (currentCorrect < 0 || options.length !== 4) {
    throw new Error(`${question.id ?? file}: se esperaban cuatro opciones y un acierto`);
  }

  const targetPosition = index % 4;
  const [correctOption] = options.splice(currentCorrect, 1);
  options.splice(targetPosition, 0, correctOption);
  question.options = options;
  distribution[targetPosition] += 1;

  if (currentCorrect !== targetPosition) {
    const nextVersion = bumpPatch(question.version);
    question.version = nextVersion;
    question.provenance ??= {
      createdBy: "codex-assisted-editorial-draft",
      createdAt: effectiveDate,
      changeLog: [],
    };
    question.provenance.changeLog ??= [];
    question.provenance.changeLog.push({
      version: nextVersion,
      date: effectiveDate,
      changedBy: "codex-assisted-editorial-draft",
      summary: `Reordenación determinista de opciones; respuesta correcta en posición ${targetPosition + 1}.`,
    });
    changed += 1;
  }

  await writeFile(fileUrl, `${JSON.stringify(question, null, 2)}\n`, "utf8");
}

console.log(
  JSON.stringify(
    {
      questions: files.length,
      changed,
      correctPositionDistribution: distribution,
      effectiveDate,
    },
    null,
    2,
  ),
);
