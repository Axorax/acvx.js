import fs from "fs";
import clsx from "clsx";
import { cva } from "class-variance-authority";
import { ax, av } from "./dist/acvx.js";

const TIMES = 1000;
const ITERATIONS = 10;

const buttonVariantsAv = av("btn", {
  variants: {
    size: { small: "text-sm", medium: "text-base", large: "text-lg" },
    color: { primary: "text-blue-500", secondary: "text-gray-500" },
  },
  defaultVariants: { size: "medium", color: "primary" },
});

const buttonVariantsCva = cva("btn", {
  variants: {
    size: { small: "text-sm", medium: "text-base", large: "text-lg" },
    color: { primary: "text-blue-500", secondary: "text-gray-500" },
  },
  defaultVariants: { size: "medium", color: "primary" },
});

const benchmark = (fn) => {
  const start = performance.now();
  for (let i = 0; i < TIMES; i++) fn();
  return performance.now() - start;
};

const results = [];

for (let i = 0; i < ITERATIONS; i++) {
  const clsxTime = benchmark(() => clsx("btn", generateString(10)));
  const axTime = benchmark(() => ax("btn", generateString(10)));
  const cvaTime = benchmark(() => buttonVariantsCva({ size: "large", color: "secondary" }));
  const avTime = benchmark(() => buttonVariantsAv({ size: "large", color: "secondary" }));

  console.log(`\x1b[34mIteration ${i + 1}/${ITERATIONS}\x1b[0m`);
  console.log(`  \x1b[32mclsx:\x1b[0m ${clsxTime.toFixed(2)}ms`);
  console.log(`  \x1b[32mcva:\x1b[0m ${cvaTime.toFixed(2)}ms`);
  console.log(`  \x1b[32max:\x1b[0m ${axTime.toFixed(2)}ms`);
  console.log(`  \x1b[32mav:\x1b[0m ${avTime.toFixed(2)}ms`);

  results.push({ clsx: clsxTime, cva: cvaTime, ax: axTime, av: avTime });
}

fs.writeFileSync("benchmarks.json", JSON.stringify(results, null, 2));

const averages = results.reduce((acc, run) => {
  for (const key in run) acc[key] = (acc[key] || 0) + run[key];
  return acc;
}, {});

for (const key in averages) averages[key] /= ITERATIONS;

console.log("\n\x1b[36m------- Average Time -------\x1b[0m");
for (const key in averages) console.log(`\x1b[32m${key}:\x1b[0m ${averages[key].toFixed(2)}ms`);

const axToClsx = (averages.clsx / averages.ax).toFixed(2);
const avToCva = (averages.cva / averages.av).toFixed(2);

console.log(`\n\x1b[33max\x1b[0m was \x1b[31m${axToClsx}x\x1b[0m faster than clsx`);
console.log(`\x1b[33mav\x1b[0m was \x1b[31m${avToCva}x\x1b[0m faster than cva`);

function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  }