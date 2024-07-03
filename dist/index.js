"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { optimize, loadConfig } from "svgo";
import minimist from "minimist";

const config = await loadConfig();
const regSVGFile = /\.svg$/i;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = minimist(process.argv.slice(2), {
  string: ["input", "output"],
  alias: {
    i: "input",
    o: "output",
    s: "size",
  },
  default: {
    input: "./assets",
    output: "./resized",
    size: 24
  },
});

const checkIsDir = fs.existsSync(path);

const defaultFolder = (
type = "input",
path = defs.input,
defaultPath = defs.input) => {
  if (fs.existsSync(path)) {
    return defaultPath;
  }
};

const defSize = (defaultSize = defs.size) => {
  if (args.size === undefined || isNaN(args.size) || args.size <= 0) {
    // console.error(`Invalid size provided. Using default size: ${defaultSize}`);
    return defaultSize;
  }
  return args.size;
};

const inputFolder = defaultFolder("input", args.input, defs.input);
const outputFolder = defaultFolder("output", args.output, defs.output);
const size = defSize();

process.env.SIZE = size;

function terminalMsg(
    msg,
    fontStyle = 'Standard',
    HLayout = 'fitted',
    VLayout = 'fitted'
  ) {
  const terminalWidth = process.stdout.columns;
  console.log(
  figlet.textSync(msg, {
    font: fontStyle,
    horizontalLayout: HLayout,
    verticalLayout: VLayout,
    width: Math.ceil(terminalWidth * 0.8),
    whitespaceBreak: false,
  }));
}

const files = fs.readdirSync(inputFolder)
  .filter((name) => regSVGFile.test(name))
  .map((name) => ({
    input: path.resolve(inputFolder, name),
    output: path.resolve(outputFolder, `Resized_(${size}x${size})_${name}`),
    svgString: fs.readFileSync(path.resolve(inputFolder, name), "utf8")
}));

const totalNumber = files.length;
var counter = 0;

const svgCountMsg = (pre, count) => {
  const msg = `${pre}${count} out of ${totalNumber} SVG`;
  terminalMsg( totalNumber > 1 ? `${msg}s` : msg );
}

console.log(` This may take a while, please wait...\n`);
const resizedSvgsLog = [`\n Successfully resized ${svgCountMsg(totalNumber, counter)}! 🎉\n`];

files.forEach((file) => {
  const {
    data
  } = optimize(file.inputSvgFileString, {
    path: file.inputPath,
    ...config,
  });
  const completionLog = svgCountMsg(totalNumber, counter);
  svgCountMsg(' Resizing ', counter);
  counter++;
  fs.writeFileSync(file.outputPath, data, "utf8");
  resizedSvgsLog.push(` ✅️ ${counter}. ${path.basename(file.outputPath)}`);
});

delete process.env.SIZE;

// console.log(resizedSvgsLog.join('\n'));

// const files = fs.readdirSync(assetsDir)
// .filter(file => file.endsWith('.svg'));

// if (files.length === 0) {
// console.error('No SVG files found in the assets directory.');
// } else {
// files.forEach(file => {
// const svgFilePath = path.resolve(inputFolder, file);

// const outputFilename = path.basename(svgFilePath);
// const outputFilePath = path.resolve(outputFolder, outputFilename);
// const svgString = fs.readFileSync(svgFilePath, 'utf8');
// const {
// data
// } = optimize(svgString, {
// path: svgFilePath,
// ...config
// });

// fs.writeFileSync(outputFilePath, data, 'utf8');
// console.log(`Successfully resized: ${outputFilename}`);

// });
// };