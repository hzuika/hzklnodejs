import { promises as fs } from "fs";
import Path from "path";

const existPath = async (filepath) => {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
};

const makeDirectory = async (dirpath) => {
  return fs.mkdir(dirpath, { recursive: true });
};

const readFileText = async (filepath) => {
  return fs.readFile(filepath, "utf8");
};

const readFileBinary = async (filepath) => {
  return fs.readFile(filepath, "binary");
};

// import jsonData from "./filepath.json" assert {type: "json"}
const readFileJson = async (filepath) => {
  return getJsonFromString(await readFileText(filepath));
};

const writeFileText = async (filepath, data) => {
  await makeDirectory(getDirectoryName(filepath));
  fs.writeFile(filepath, data, "utf8");
};

const writeFileBinary = async (filepath, data) => {
  await makeDirectory(getDirectoryName(filepath));
  fs.writeFile(filepath, data, "binary");
};

const getStringFromJson = (json) => {
  return JSON.stringify(json, null, 2);
};

const getJsonFromString = (string) => {
  return JSON.parse(string);
};

const writeFileJson = async (filepath, json) => {
  makeDirectory(getDirectoryName(filepath));
  fs.writeFile(filepath, getStringFromJson(json), "utf8");
};

const getDirectoryName = (filepath) => {
  return Path.parse(filepath).dir;
};

const getExtension = (filepath) => {
  return Path.parse(filepath).ext;
};

const getFileName = (filepath) => {
  return Path.parse(filepath).base;
};

const getFilenameWithoutExtension = (filepath) => {
  return Path.parse(filepath).name;
};

export {
  existPath,
  makeDirectory,
  readFileText,
  readFileBinary,
  writeFileText,
  writeFileBinary,
  writeFileJson,
  getDirectoryName,
  getExtension,
  getFileName,
  getFilenameWithoutExtension,
  getStringFromJson,
  getJsonFromString,
};
