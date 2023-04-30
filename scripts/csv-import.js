import { parse } from "csv-parse";
import { readFile } from "fs/promises";

const inputFile = process.argv[2];

console.log(`Reading file ${inputFile}`);
const raw = await readFile(inputFile);
const parser = parse(raw);

let lines = 0;

for await (const record of parser) {
  if (lines > 0) {
    const [title, description] = record;
    await fetch("http://localhost:3000/tasks", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
      }),
    });
  }
  lines++;
}
console.log(`${lines - 1} lines imported`);
