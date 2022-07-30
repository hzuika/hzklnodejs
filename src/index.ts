import { promises as fs } from "fs";
import Path from "path";
import { google } from "googleapis";
const youtube = google.youtube("v3");
import axios from "axios";
import assert from "node:assert/strict";
import { Client } from "@notionhq/client";

const existPath = async (filepath: string) => {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
};

const makeDirectory = async (dirpath: string) => {
  return fs.mkdir(dirpath, { recursive: true });
};

const readFileText = async (filepath: string) => {
  return fs.readFile(filepath, "utf8");
};

const readFileBinary = async (filepath: string) => {
  return fs.readFile(filepath, "binary");
};

// import jsonData from "./filepath.json" assert {type: "json"}
const readFileJson = async (filepath: string) => {
  return getJsonFromString(await readFileText(filepath));
};

const writeFileText = async (filepath: string, data: any) => {
  await makeDirectory(getDirectoryName(filepath));
  fs.writeFile(filepath, data, "utf8");
};

const writeFileBinary = async (filepath: string, data: any) => {
  await makeDirectory(getDirectoryName(filepath));
  fs.writeFile(filepath, data, "binary");
};

const getStringFromJson = (json: string) => {
  return JSON.stringify(json, null, 2);
};

const getJsonFromString = (string: string) => {
  return JSON.parse(string);
};

const writeFileJson = async (filepath: string, json: any) => {
  await makeDirectory(getDirectoryName(filepath));
  fs.writeFile(filepath, getStringFromJson(json), "utf8");
};

const getDirectoryName = (filepath: string) => {
  return Path.dirname(filepath);
};

const getExtension = (filepath: string) => {
  return Path.parse(filepath).ext;
};

const getFileName = (filepath: string) => {
  return Path.parse(filepath).base;
};

const getFileNameWithoutExtension = (filepath: string) => {
  return Path.parse(filepath).name;
};

// [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], 3 => [[1,2,3],[4,5,6],[7,8,9],[0]]
const getChunkFromArray = (array: any[], size: number) => {
  return array.reduce(
    (acc, _, index) =>
      index % size ? acc : [...acc, array.slice(index, index + size)],
    []
  );
};

const getHtmlFromUrl = async (url: string) => {
  const res = await axios.get(encodeURI(url));
  return res.data;
};

const replaceString = (inStr: string, n: number, newStr: string) => {
  return inStr.substring(0, n) + newStr + inStr.substring(n + 1);
};

// [ { a: 1, b: 2 }, { a: 3, b: 4 } ]
// a,b
// 1,2
// 3,4
const getTableFromJson = (json: any, delimiter: string) => {
  const header = Object.keys(json[0]).join(delimiter) + "\n";
  const body = json.map((d: any) => Object.values(d).join(delimiter)).join("\n");
  return header + body;
};

const getCsvFromJson = (json: any) => {
  return getTableFromJson(json, ",");
};
const getTsvFromJson = (json: any) => {
  return getTableFromJson(json, "\t");
};

const removeDuplicatesFromArray = (array: any[]) => {
  return [...new Set(array)];
};

const getMinuteFromHour = (hour: number) => {
  return hour * 60;
};

const getSecondFromMinute = (minute: number) => {
  return minute * 60;
};

const getSecondFromHour = (hour: number) => {
  return getSecondFromMinute(getMinuteFromHour(hour));
};

const getMillis = (val: number) => {
  return val * 1000;
};

const getMilliSecondFromHour = (hour: number) => {
  return getMillis(getSecondFromHour(hour));
};

const getSign = (num: number) => {
  if (num < 0) {
    return "-";
  } else {
    return "+";
  }
};

const getJapaneseIsoStringFromUtcIsoString = (utc: string) => {
  const timeZoneOffsetHour = {
    "Asia/Tokyo": +9,
  };
  const offset = timeZoneOffsetHour["Asia/Tokyo"];
  const dt = new Date(utc);
  const dt_offset = new Date(dt.getTime() + getMilliSecondFromHour(offset));
  const offsetString =
    getSign(offset) + String(offset).padStart(2, "0") + ":00";
  return dt_offset.toISOString().replace("Z", offsetString);
};

const equalArray = (array1: any[], array2: any[]) => {
  return JSON.stringify(array1) === JSON.stringify(array2);
};

const sleep = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};

const sortJson = (json: any) => {
  return Object.fromEntries(
    Object.entries(json).sort((a, b) => (a[0] < b[0] ? -1 : 1))
  );
};

class Youtube {
  #YOUTUBE_API_KEY;
  #channel_id_length = 24;
  #video_id_length = 11;

  constructor(apiKey: string) {
    this.#YOUTUBE_API_KEY = apiKey;
  }

  static removeEtagFromApiData(apiData: any) {
    let { etag, ...rest } = apiData;
    return rest;
  }

  static getDescriptionFromApiData(apiData: any) {
    return apiData.snippet.description;
  }

  static getTitleFromApiData(apiData: any) {
    return apiData.snippet.title;
  }

  static getPublishedAtFromApiData(apiData: any) {
    return apiData.snippet.publishedAt;
  }

  static getThumbnailFromApiData(apiData: any) {
    return apiData.snippet.thumbnails.high.url;
  }

  static getThumbnailFromChannelApiData(channelApiData: any) {
    return Youtube.getThumbnailFromApiData(channelApiData);
  }

  static getThumbnailFromVideoApiData(videoApiData: any) {
    return Youtube.getThumbnailFromApiData(videoApiData);
  }

  static getThumbnailFromVideoId(videoId: string) {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }

  static #getIdFromApiData(apiData: any) {
    return apiData.id;
  }

  static getChannelIdFromChannelApiData(channelApiData: any) {
    return Youtube.#getIdFromApiData(channelApiData);
  }

  static getChannelIdFromVideoApiData(videoApiData: any) {
    return videoApiData.snippet.channelId;
  }

  static async getChannelIdFromCustomUrl(url: any) {
    const html = await getHtmlFromUrl(url);
    return Youtube.getChannelIdFromHtml(html);
  }

  static getChannelIdFromHtml(html: string) {
    const searchString =
      /<meta property=\"og:url\" content=\"https:\/\/www.youtube.com\/channel\/(.{24})\">/g;
    const res = [...html.matchAll(searchString)];
    if (res.length > 0) {
      return [...html.matchAll(searchString)][0][1];
    }
    return "";
  }

  static getChannelIdFromUrl(url: string) {
    const prefix = "https://www.youtube.com/channel/";
    assert.notStrictEqual(url.indexOf(prefix), -1);
    return url.split(prefix)[1];
  }

  static getChannelIdFromUploadPlaylistId = (uploadPlaylistId: string) => {
    return replaceString(uploadPlaylistId, 1, "C");
  };

  static getVideoIdFromVideoApiData(videoApiData: any) {
    return Youtube.#getIdFromApiData(videoApiData);
  }

  static getVideoIdFromPlaylistItemsApiData(apiData: any) {
    return apiData.snippet.resourceId.videoId;
  }

  static getVideoIdFromVideoUrl(url: string) {
    return url.slice(-11);
  }

  static getTitleFromVideoApiData(videoApiData: any) {
    return Youtube.getTitleFromApiData(videoApiData);
  }

  static getPublishedAtFromVideoApiData(videoApiData: any) {
    return Youtube.getPublishedAtFromApiData(videoApiData);
  }

  static getStartTimeFromVideoApiData(videoApiData: any) {
    return videoApiData.liveStreamingDetails
      ? videoApiData.liveStreamingDetails.actualStartTime
      : null;
  }

  static getEndTimeFromVideoApiData(videoApiData: any) {
    return videoApiData.liveStreamingDetails
      ? videoApiData.liveStreamingDetails.actualEndTime
      : null;
  }

  static #getViewCountFromApiData(apiData: any) {
    return apiData.statistics.viewCount;
  }

  static getViewCountFromVideoApiData(videoApiData: any) {
    return Youtube.#getViewCountFromApiData(videoApiData);
  }

  static getViewCountFromChannelApiData(channelApiData: any) {
    return Youtube.#getViewCountFromApiData(channelApiData);
  }

  static #getLikeCountFromApiData(ApiData: any) {
    return ApiData.statistics.likeCount;
  }

  static getLikeCountFromVideoApiData(videoApiData: any) {
    return Youtube.#getLikeCountFromApiData(videoApiData);
  }

  static #getVideoCountFromApiData(apiData: any) {
    return apiData.statistics.videoCount;
  }

  static getVideoCountFromChannelApiData(channelApiData: any) {
    return Youtube.#getVideoCountFromApiData(channelApiData);
  }

  static #getSubscriberCountFromApiData(apiData: any) {
    return apiData.statistics.subscriberCount;
  }

  static getSubscriberCountFromChannelApiData(channelApiData: any) {
    return Youtube.#getSubscriberCountFromApiData(channelApiData);
  }

  static #getBannerFromApiData(apiData: any) {
    return apiData.brandingSettings.image.bannerExternalUrl;
  }

  static getBannerFromChannelApiData(channelApiData: any) {
    return Youtube.#getBannerFromApiData(channelApiData);
  }

  static getVideoUrlFromPlaylistItemsApiData(apiData: any) {
    return Youtube.getVideoUrlFromVideoId(
      Youtube.getVideoIdFromPlaylistItemsApiData(apiData)
    );
  }

  static searchChannelIdFromText(text: string) {
    const searchString = /https:\/\/www.youtube.com\/channel\/(.{24})/g;
    return removeDuplicatesFromArray(
      [...text.matchAll(searchString)].map((elem) => elem[1])
    );
  }

  static searchCustomUrlFromText(text: string) {
    const customUrl = /https:\/\/www.youtube.com\/c\/[^\r\n 　]+/g;
    const data = text.match(customUrl);
    if (data == null) {
      return [];
    }
    return data;
  }

  static getUploadPlaylistIdFromChannelId = (channelId: string) => {
    return replaceString(channelId, 1, "U");
  };

  static getChannelUrlFromChannelId(channelId: string) {
    assert.strictEqual(channelId.length, 24);
    return `https://www.youtube.com/channel/${channelId}`;
  }

  static getVideoUrlFromVideoId(videoId: string) {
    assert.strictEqual(videoId.length, 11);
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  static getAtChannelIdListFromHtml(html: string) {
    const searchString =
      /\{\"text\":\"@[^\"]+\",\"navigationEndpoint\":\{\"clickTrackingParams\":\"[^\"]+\",\"commandMetadata\":\{\"webCommandMetadata\":\{\"url\":\"\/channel\/(.{24})\"/g;
    return removeDuplicatesFromArray(
      [...html.matchAll(searchString)].map((elem) => elem[1])
    );
  }

  static getHashTagListFromHtml(html: string) {
    const searchString =
      /\{\"text\":\"(#[^\"]+)\",\"navigationEndpoint\":\{\"clickTrackingParams\":\"[^"]+\",\"commandMetadata\":\{\"webCommandMetadata\":\{\"url\":\"\/hashtag\//g;
    const hashTags = [...html.matchAll(searchString)].map((elem) =>
      elem[1].replace(/[\u200B\u200C\u200D\uFEFF]/g, "")
    );
    return removeDuplicatesFromArray(hashTags);
  }

  static getGameTitleFromHtml(text: string) {
    const searchString =
      /\{\"richMetadataRenderer\":\{\"style\":\"RICH_METADATA_RENDERER_STYLE_BOX_ART\",\"thumbnail\":\{\"thumbnails\":\[\{\"url\":\"[^\"]+\",\"width\":[0-9]+,\"height\":[0-9]+\},\{\"url\":\"[^\"]+\",\"width\":[0-9]+,\"height\":[0-9]+\}\]\},\"title\":\{\"simpleText\":\"([^\"]+)\"\},/g;
    const result = removeDuplicatesFromArray(
      [...text.matchAll(searchString)].map((elem) => elem[1])
    );
    if (result.length > 0) {
      return result[0];
    } else {
      return "";
    }
  }

  static async getGameTitleFromUrl(url: string) {
    return Youtube.getGameTitleFromHtml(await getHtmlFromUrl(url));
  }

  static async getGameTitleFromVideoId(videoId: string) {
    return Youtube.getGameTitleFromUrl(Youtube.getVideoUrlFromVideoId(videoId));
  }

  async #getApiData(params: any, apiCallback: any) {
    let dataList: any[] = [];
    params.pageToken = undefined;
    do {
      const res = await apiCallback(params);
      Array.prototype.push.apply(dataList, res.data.items);
      params.pageToken = res.data.nextPageToken;
    } while (params.pageToken);
    return dataList;
  }

  async #getApiDataFromIdList(idList: string[], params: any, apiCallback: any) {
    // [1].flat() == [1]
    // [[1,2]].flat() == [1,2]
    idList = [idList].flat();
    const youtubeApiData = await Promise.all(
      getChunkFromArray(idList, 50).map((idList50: any[]) => {
        params.id = idList50.join(",");
        return this.#getApiData(params, apiCallback);
      })
    );
    return youtubeApiData.flat();
  }

  async getCommentThreads(videoId: string, part = ["id", "snippet", "replies"]) {
    let params = {
      auth: this.#YOUTUBE_API_KEY,
      part: part.join(","),
      videoId: videoId,
      maxResults: 100,
    };
    return this.#getApiData(params, (p: any) => youtube.commentThreads.list(p));
  }

  async getVideos(
    videoIdList: string[],
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
    return this.#getApiDataFromIdList(videoIdList, params, (p: any) =>
      youtube.videos.list(p)
    );
  }

  async getChannels(
    channelIdList: string[],
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
    return this.#getApiDataFromIdList(channelIdList, params, (p: any) =>
      youtube.channels.list(p)
    );
  }

  async getPlaylistItems(
    playlistId: string[],
    part = ["snippet", "contentDetails", "id", "status"]
  ) {
    let params = {
      auth: this.#YOUTUBE_API_KEY,
      part: part.join(","),
      playlistId: playlistId,
      maxResults: 50,
    };
    return this.#getApiData(params, (p: any) => youtube.playlistItems.list(p));
  }

  async getPlaylists(
    channelId: string,
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
    return this.#getApiData(params, (params: any) => youtube.playlists.list(params));
  }
}

class Notion {
  #notion;

  constructor(apiKey: string) {
    this.#notion = new Client({
      auth: apiKey,
    });
  }

  async makeDatabase(query: any) {
    return this.#notion.databases.create(query);
  }

  async makePage(query: any) {
    return this.#notion.pages.create(query);
  }

  async getDatabase(query: any) {
    return this.#notion.databases.retrieve(query);
  }

  async getDatabaseFromId(id: string) {
    const query = {
      database_id: id,
    };
    return this.getDatabase(query);
  }

  async getPage(query: any) {
    return this.#notion.pages.retrieve(query);
  }

  async getPageFromId(id: string) {
    const query = {
      page_id: id,
    };
    return this.getPage(query);
  }

  async updatePage(query: any) {
    return this.#notion.pages.update(query);
  }

  static getIdFromUrl(urlString: string) {
    const idLength = 32;
    const url = new URL(urlString);
    const urlWithoutParameter = `${url.origin}${url.pathname}`;
    const id = urlWithoutParameter.slice(-idLength);
    return id;
  }

  static getIdFromApiResponse(response: any) {
    return response.id.replace(/-/g, "");
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
  getFileNameWithoutExtension,
  getStringFromJson,
  getJsonFromString,
  getHtmlFromUrl,
  getChunkFromArray,
  getCsvFromJson,
  getTsvFromJson,
  replaceString,
  removeDuplicatesFromArray,
  getJapaneseIsoStringFromUtcIsoString,
  equalArray,
  sleep,
  sortJson,
  Youtube,
  Notion,
};
