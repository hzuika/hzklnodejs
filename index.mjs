import { promises as fs } from "fs";
import Path from "path";
import { google } from "googleapis";
const youtube = google.youtube("v3");
import axios from "axios";
import assert from "node:assert/strict";

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
  return Path.dirname(filepath);
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

const getHtmlFromUrl = async (url) => {
  const res = await axios.get(url);
  return res.data;
};

const replaceString = (inStr, n, newStr) => {
  return inStr.substring(0, n) + newStr + inStr.substring(n + 1);
};

// [ { a: 1, b: 2 }, { a: 3, b: 4 } ]
// a,b
// 1,2
// 3,4
const getTableFromJson = (json, delimiter) => {
  const header = Object.keys(json[0]).join(delimiter) + "\n";
  const body = json.map((d) => Object.values(d).join(delimiter)).join("\n");
  return header + body;
};

const getCsvFromJson = (json) => {
  return getTableFromJson(json, ",");
};
const getTsvFromJson = (json) => {
  return getTableFromJson(json, "\t");
};

const removeDuplicatesFromArray = (array) => {
  return [...new Set(array)];
};

class Youtube {
  #YOUTUBE_API_KEY;
  #channel_id_length = 24;
  #video_id_length = 11;

  constructor(apiKey) {
    this.#YOUTUBE_API_KEY = apiKey;
  }

  static getDescriptionFromApiData(apiData) {
    return apiData.snippet.description;
  }

  static getTitleFromApiData(apiData) {
    return apiData.snippet.title;
  }

  static getVideoIdFromPlaylistItemsApiData(apiData) {
    return apiData.snippet.resourceId.videoId;
  }

  static getVideoUrlFromPlaylistItemsApiData(apiData) {
    return Youtube.getUrlFromVideoId(
      Youtube.getVideoIdFromPlaylistItemsApiData(apiData)
    );
  }

  static searchChannelIdFromText(description) {
    const prefix = /https:\/\/www.youtube.com\/channel\/.{24}/g;
    return description.match(prefix);
  }

  static searchCustomUrlFromText(text) {
    const customUrl = /https:\/\/www.youtube.com\/c\/[^\r\n 　]+/g;
    return text.match(customUrl);
  }

  static async getChannelIdFromCustomUrl(url) {
    const html = await getHtmlFromUrl(url);
    return Youtube.getChannelIdFromHtml(html);
  }

  static getChannelIdFromHtml(html) {
    const searchString =
      /<meta property=\"og:url\" content=\"https:\/\/www.youtube.com\/channel\/(.{24})\">/g;
    const res = [...html.matchAll(searchString)];
    if (res.length > 0) {
      return [...html.matchAll(searchString)][0][1];
    }
    return "";
  }

  static getChannelIdFromUrl(url) {
    const prefix = "https://www.youtube.com/channel/";
    assert.notStrictEqual(url.indexOf(prefix), -1);
    return url.split(prefix)[1];
  }

  static getUploadPlaylistIdFromChannelId = (channelId) => {
    return replaceString(channelId, 1, "U");
  };
  static getChannelIdFromUploadPlaylistId = (uploadPlaylistId) => {
    return replaceString(uploadPlaylistId, 1, "C");
  };

  static getUrlFromChannelId(channelId) {
    assert.strictEqual(channelId.length, 24);
    return `https://www.youtube.com/channel/${channelId}`;
  }

  static getUrlFromVideoId(videoId) {
    assert.strictEqual(videoId.length, 11);
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  static getAtChannelIdListFromHtml(html) {
    const searchString =
      /\{\"text\":\"@[^\"]+\",\"navigationEndpoint\":\{\"clickTrackingParams\":\"[^\"]+\",\"commandMetadata\":\{\"webCommandMetadata\":\{\"url\":\"\/channel\/(.{24})\"/g;
    return removeDuplicatesFromArray(
      [...html.matchAll(searchString)].map((elem) => elem[1])
    );
  }

  static getHashTagListFromHtml(html) {
    const searchString =
      /\{\"text\":\"(#[^\"]+)\",\"navigationEndpoint\":\{\"clickTrackingParams\":\"[^"]+\",\"commandMetadata\":\{\"webCommandMetadata\":\{\"url\":\"\/hashtag\//g;
    return removeDuplicatesFromArray(
      [...html.matchAll(searchString)].map((elem) => elem[1])
    );
  }

  static getGameTitleFromHtml(html) {
    const prefix = '}]},"title":{"simpleText":"';
    if (html.indexOf(prefix) > 0) {
      return html.split(prefix)[1].split('"')[0];
    }
    return "";
  }

  static async getGameTitleFromUrl(url) {
    return getGameTitleFromHtml(await getHtmlFromUrl(url));
  }

  static async getGameTitleFromVideoId(videoId) {
    return getGameTitleFromUrl(getUrlFromVideoId(videoId));
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
    return this.#getApiData(params, (p) => youtube.playlistItems.list(p));
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
    return this.#getApiData(params, (params) => youtube.playlists.list(params));
  }
}

export {
  existPath,
  makeDirectory,
  readFileText,
  readFileBinary,
  readFileJson,
  writeFileText,
  writeFileBinary,
  writeFileJson,
  getDirectoryName,
  getExtension,
  getFileName,
  getFilenameWithoutExtension,
  getStringFromJson,
  getJsonFromString,
  getHtmlFromUrl,
  getChunkFromArray,
  getCsvFromJson,
  getTsvFromJson,
  replaceString,
  removeDuplicatesFromArray,
  Youtube,
};
