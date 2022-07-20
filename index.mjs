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

const writeFileText = async (filepath, data) => {
  await makeDirectory(getDirectoryName(filepath));
  fs.writeFile(filepath, data, "utf8");
};

const writeFileBinary = async (filepath, data) => {
  await makeDirectory(getDirectoryName(filepath));
  fs.writeFile(filepath, data, "binary");
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
  getDirectoryName,
  getExtension,
  getFileName,
  getFilenameWithoutExtension,
};
