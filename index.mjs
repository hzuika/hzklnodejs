import { promises as fs } from "fs";
import Path from "path";
import { google } from "googleapis";
const youtube = google.youtube("v3");

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
  return Path.dirname(filepath)
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

// [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], 3 => [[1,2,3],[4,5,6],[7,8,9],[0]]
const getChunkFromArray = (array, size) => {
  return array.reduce(
    (acc, _, index) =>
      index % size ? acc : [...acc, array.slice(index, index + size)],
    []
  );
};

class Youtube {

  #YOUTUBE_API_KEY;

  constructor(apiKey) {
    this.#YOUTUBE_API_KEY = apiKey;
  }

  async #getApiData(params, apiCallback) {
    let dataList = [];
    params.pageToken = undefined;
    do {
      const res = await apiCallback(params);
      Array.prototype.push.apply(dataList, res.data.items);
      params.pageToken = res.data.nextPageToken;
    } while (params.pageToken);
    return dataList;
  }

  async #getApiDataFromIdList(idList, params, apiCallback) {
    // [1].flat() == [1]
    // [[1,2]].flat() == [1,2]
    idList = [idList].flat();
    const youtubeApiData = await Promise.all(
      getChunkFromArray(idList, 50).map((idList50) => {
        params.id = idList50.join(",");
        return this.#getApiData(params, apiCallback);
      })
    );
    return youtubeApiData.flat();
  }

  async getVideos(
    videoIdList,
    part = [
      "id",
      "liveStreamingDetails",
      "localizations",
      "player",
      "recordingDetails",
      "snippet",
      "statistics",
      "status",
      "topicDetails",
    ]
  ) {
    let params = {
      auth: this.#YOUTUBE_API_KEY,
      part: part.join(","),
      maxResults: 50,
    };
    return this.#getApiDataFromIdList(videoIdList, params, (p) =>
      youtube.videos.list(p)
    );
  }

  async getChannels(
    channelIdList,
    part = [
      "brandingSettings",
      "contentDetails",
      "contentOwnerDetails",
      "id",
      "localizations",
      "snippet",
      "statistics",
      "status",
      "topicDetails",
    ]
  ) {
    let params = {
      auth: this.#YOUTUBE_API_KEY,
      part: part.join(","),
      maxResults: 50,
    };
    return this.#getApiDataFromIdList(channelIdList, params, (p) =>
      youtube.channels.list(p)
    );
  }

  async getPlaylistItems(
    playlistId,
    part = ["snippet", "contentDetails", "id", "status"]
  ) {
    let params = {
      auth: this.#YOUTUBE_API_KEY,
      part: part.join(","),
      playlistId: playlistId,
      maxResults: 50,
    };
    return this.#getApiData(params, (p) =>
      youtube.playlistItems.list(p)
    );
  }

  async getPlaylists(
    channelId,
    part = [
      "snippet",
      "contentDetails",
      "id",
      "status",
      "player",
      "localizations",
    ]
  ) {
    let params = {
      auth: this.#YOUTUBE_API_KEY,
      part: part.join(","),
      channelId: channelId,
      maxResults: 50,
    };
    return this.#getApiData(params, (params) =>
      youtube.playlists.list(params)
    );
  }
}

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
  Youtube,
};
