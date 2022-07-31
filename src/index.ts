import { promises as fs } from "fs";
import Path from "path";
import { google, youtube_v3 } from "googleapis";
const youtube = google.youtube("v3");
import axios from "axios";
import { Client } from "@notionhq/client";
import { GaxiosPromise } from "googleapis/build/src/apis/abusiveexperiencereport";
import {
  CreateDatabaseParameters,
  CreateDatabaseResponse,
  CreatePageParameters,
  CreatePageResponse,
  GetDatabaseParameters,
  GetDatabaseResponse,
  GetPageParameters,
  GetPageResponse,
  UpdateDatabaseResponse,
  UpdatePageParameters,
  UpdatePageResponse,
} from "@notionhq/client/build/src/api-endpoints";

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

const writeFileText = async (filepath: string, data: string) => {
  await makeDirectory(getDirectoryName(filepath));
  fs.writeFile(filepath, data, "utf8");
};

const writeFileBinary = async (filepath: string, data: Buffer) => {
  await makeDirectory(getDirectoryName(filepath));
  fs.writeFile(filepath, data, "binary");
};

const getStringFromJson = (json: object) => {
  return JSON.stringify(json, null, 2);
};

const getJsonFromString = (string: string) => {
  return JSON.parse(string);
};

const writeFileJson = async (filepath: string, json: object) => {
  await makeDirectory(getDirectoryName(filepath));
  writeFileText(filepath, getStringFromJson(json));
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
const getChunkFromArray = <T>(array: T[], size: number): T[][] => {
  return array.reduce(
    (acc: T[][], _, index) =>
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
const getTableFromJson = (json: object[], delimiter: string) => {
  const header = Object.keys(json[0]).join(delimiter) + "\n";
  const body = json
    .map((d: object) => Object.values(d).join(delimiter))
    .join("\n");
  return header + body;
};

const getCsvFromJson = (json: object[]) => {
  return getTableFromJson(json, ",");
};
const getTsvFromJson = (json: object[]) => {
  return getTableFromJson(json, "\t");
};

const removeDuplicatesFromArray = <T>(array: T[]) => {
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

const equalArray = <T>(array1: T[], array2: T[]) => {
  return JSON.stringify(array1) === JSON.stringify(array2);
};

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const sortJson = (json: object) => {
  return Object.fromEntries(
    Object.entries(json).sort((a, b) => (a[0] < b[0] ? -1 : 1))
  );
};

class YoutubeVideoId {
  id: string;
  static #validLength = 11;
  static urlPrefix = "https://www.youtube.com/watch?v=";
  static shortUrlPrefix = "https://youtu.be/";

  constructor(id: string) {
    if (!YoutubeVideoId.isValid(id)) {
      throw new Error(`${id} length is not ${YoutubeVideoId.#validLength}.`);
    }
    this.id = id;
  }

  getId() {
    return this.id;
  }

  toUrl() {
    return `${YoutubeVideoId.urlPrefix}${this.getId()}`;
  }

  toShortUrl() {
    return `${YoutubeVideoId.shortUrlPrefix}${this.getId()}`;
  }

  toThumbnail() {
    return `https://i.ytimg.com/vi/${this.getId()}/hqdefault.jpg`;
  }

  static isValid(id: string) {
    return id.length === YoutubeVideoId.#validLength;
  }
}

class YoutubeChannelId {
  id: string;
  static #validLength = 24;
  static #prefix = "UC";
  static urlPrefix = "https://www.youtube.com/channel/";

  constructor(id: string) {
    if (!YoutubeChannelId.isValid(id)) {
      throw new Error(`${id} length is not ${YoutubeChannelId.#validLength}.`);
    }
    this.id = id;
  }

  getId() {
    return this.id;
  }

  toPlaylistId() {
    return replaceString(this.getId(), 1, "U");
  }

  toUrl() {
    return `${YoutubeChannelId.urlPrefix}${this.getId()}`;
  }

  static getIdFromUrl(url: string) {
    const prefix = YoutubeChannelId.urlPrefix;
    if (url.indexOf(prefix) == -1) {
      throw new Error(`${url} is not channel url.`);
    }
    return new YoutubeChannelId(url.split(prefix)[1]).getId();
  }

  static isValid(id: string) {
    return (
      id.substring(0, 2) === YoutubeChannelId.#prefix &&
      id.length === YoutubeChannelId.#validLength
    );
  }
}

class YoutubePlaylistId {
  id: string;
  static #uploadValidLength = 24;
  static #uploadPrefix = "UU";
  static #validLength = 34;
  static #prefix = "PL";
  static urlPrefix = "https://www.youtube.com/playlist?list=";

  constructor(id: string) {
    if (!YoutubePlaylistId.isValid(id)) {
      throw new Error(
        `${id} length is not ${YoutubePlaylistId.#validLength} or ${
          YoutubePlaylistId.#uploadValidLength
        }, or Prefix is not ${YoutubePlaylistId.#prefix} or ${
          YoutubePlaylistId.#uploadPrefix
        }.`
      );
    }
    this.id = id;
  }

  getId() {
    return this.id;
  }

  toChannelId() {
    if (YoutubePlaylistId.isUploadId(this.getId())) {
      return replaceString(this.getId(), 1, "C");
    } else {
      return "";
    }
  }

  toUrl() {
    return `${YoutubePlaylistId.urlPrefix}${this.getId()}`;
  }

  static isUploadId(id: string) {
    return (
      id.substring(0, 2) === YoutubePlaylistId.#uploadPrefix &&
      id.length === YoutubePlaylistId.#uploadValidLength
    );
  }

  static isRegularId(id: string) {
    return (
      id.substring(0, 2) === YoutubePlaylistId.#prefix &&
      id.length === YoutubePlaylistId.#validLength
    );
  }

  static isValid(id: string) {
    return (
      YoutubePlaylistId.isRegularId(id) || YoutubePlaylistId.isUploadId(id)
    );
  }
}

type YoutubeVideoApiData = youtube_v3.Schema$Video;

type YoutubeChannelApiData = youtube_v3.Schema$Channel;

type YoutubePlaylistApiData = youtube_v3.Schema$Playlist;

type YoutubePlaylistItemApiData = youtube_v3.Schema$PlaylistItem;

type YoutubeApiData =
  | YoutubeVideoApiData
  | YoutubeChannelApiData
  | YoutubePlaylistApiData
  | YoutubePlaylistItemApiData;

type YoutubeVideoApiParameter = youtube_v3.Params$Resource$Videos$List;
type YoutubeChannelApiParameter = youtube_v3.Params$Resource$Channels$List;
type YoutubePlaylistApiParameter = youtube_v3.Params$Resource$Playlists$List;
type YoutubePlaylistItemApiParameter =
  youtube_v3.Params$Resource$Playlistitems$List;
type YoutubeCommentThreadApiParameter =
  youtube_v3.Params$Resource$Commentthreads$List;

type YoutubeApiParametar =
  | YoutubeVideoApiParameter
  | YoutubeChannelApiParameter
  | YoutubePlaylistApiParameter
  | YoutubePlaylistItemApiParameter
  | YoutubeCommentThreadApiParameter;

type YoutubeVideoApiResponse = youtube_v3.Schema$VideoListResponse;
type YoutubeChannelApiResponse = youtube_v3.Schema$ChannelListResponse;
type YoutubePlaylistApiResponse = youtube_v3.Schema$PlaylistListResponse;
type YoutubePlaylistItemApiResponse =
  youtube_v3.Schema$PlaylistItemListResponse;
type YoutubeCommentThreadApiResponse =
  youtube_v3.Schema$CommentThreadListResponse;

type YoutubeApiResponse =
  | YoutubeVideoApiResponse
  | YoutubeChannelApiResponse
  | YoutubePlaylistApiResponse
  | YoutubePlaylistItemApiResponse
  | YoutubeCommentThreadApiResponse;

class YoutubeApiDataUtil {
  static getDescription(apiData: YoutubeVideoApiData | YoutubeChannelApiData) {
    return apiData.snippet?.description;
  }

  static getTitle(
    apiData:
      | YoutubeVideoApiData
      | YoutubeChannelApiData
      | YoutubePlaylistApiData
  ) {
    return apiData.snippet?.title;
  }

  static getPublishedAt(apiData: YoutubeVideoApiData | YoutubeChannelApiData) {
    return apiData.snippet?.publishedAt;
  }

  static getThumbnail(apiData: YoutubeVideoApiData | YoutubeChannelApiData) {
    return apiData.snippet?.thumbnails?.high?.url;
  }

  static getId(apiData: YoutubeApiData) {
    return apiData.id;
  }

  static getChannelId(apiData: YoutubeVideoApiData | YoutubePlaylistApiData) {
    return apiData.snippet?.channelId;
  }

  static getStartTime(apiData: YoutubeVideoApiData) {
    return apiData.liveStreamingDetails?.actualStartTime;
  }

  static getEndTime(apiData: YoutubeVideoApiData) {
    return apiData.liveStreamingDetails?.actualEndTime;
  }

  static getViewCount(apiData: YoutubeVideoApiData | YoutubeChannelApiData) {
    return apiData.statistics?.viewCount;
  }

  static getLikeCount(apiData: YoutubeVideoApiData) {
    return apiData.statistics?.likeCount;
  }

  static getVideoId(apiData: YoutubePlaylistItemApiData) {
    return apiData.contentDetails?.videoId;
  }

  static getVideoCount(apiData: YoutubeChannelApiData) {
    return apiData.statistics?.videoCount;
  }

  static getSubscriberCount(apiData: YoutubeChannelApiData) {
    return apiData.statistics?.subscriberCount;
  }

  static getBanner(apiData: YoutubeChannelApiData) {
    return apiData.brandingSettings?.image?.bannerExternalUrl;
  }
}

class Youtube {
  #YOUTUBE_API_KEY;

  constructor(apiKey: string) {
    this.#YOUTUBE_API_KEY = apiKey;
  }

  async #getApiData(
    params: YoutubeApiParametar,
    apiCallback: (p: YoutubeApiParametar) => GaxiosPromise<YoutubeApiResponse>
  ) {
    const dataList: YoutubeApiData[] = [];
    params.pageToken = undefined;
    do {
      const res = await apiCallback(params);
      Array.prototype.push.apply(
        dataList,
        res.data.items ? res.data.items : []
      );
      params.pageToken = res.data.nextPageToken
        ? res.data.nextPageToken
        : undefined;
    } while (params.pageToken);
    return dataList;
  }

  async #getApiDataFromIdList(
    idList: string[],
    params: YoutubeApiParametar,
    apiCallback: (p: YoutubeApiParametar) => GaxiosPromise<YoutubeApiResponse>
  ) {
    const youtubeApiData = await Promise.all(
      getChunkFromArray(idList, 50).map((idList50) => {
        params.id = idList50;
        return this.#getApiData(params, apiCallback);
      })
    );
    return youtubeApiData.flat();
  }

  async getCommentThreads(
    videoId: string,
    part = ["id", "snippet", "replies"]
  ) {
    const params: YoutubeCommentThreadApiParameter = {
      auth: this.#YOUTUBE_API_KEY,
      part: part,
      videoId: videoId,
      maxResults: 100,
    };
    return this.#getApiData(params, (p: YoutubeCommentThreadApiParameter) =>
      youtube.commentThreads.list(p)
    );
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
    const params = {
      auth: this.#YOUTUBE_API_KEY,
      part: part,
      maxResults: 50,
    };
    return this.#getApiDataFromIdList(
      videoIdList,
      params,
      (p: YoutubeVideoApiParameter) => youtube.videos.list(p)
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
    const params: YoutubeChannelApiParameter = {
      auth: this.#YOUTUBE_API_KEY,
      part: part,
      maxResults: 50,
    };
    return this.#getApiDataFromIdList(
      channelIdList,
      params,
      (p: YoutubeChannelApiParameter) => youtube.channels.list(p)
    );
  }

  async getPlaylistItems(
    playlistId: string,
    part = ["snippet", "contentDetails", "id", "status"]
  ) {
    const params: YoutubePlaylistItemApiParameter = {
      auth: this.#YOUTUBE_API_KEY,
      part: part,
      playlistId: playlistId,
      maxResults: 50,
    };
    return this.#getApiData(params, (p: YoutubePlaylistItemApiParameter) =>
      youtube.playlistItems.list(p)
    );
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
    const params: YoutubePlaylistApiParameter = {
      auth: this.#YOUTUBE_API_KEY,
      part: part,
      channelId: channelId,
      maxResults: 50,
    };
    return this.#getApiData(params, (params: YoutubePlaylistApiParameter) =>
      youtube.playlists.list(params)
    );
  }

  // Video API Data
  static getChannelIdFromVideoApiData(videoApiData: YoutubeVideoApiData) {
    return YoutubeApiDataUtil.getChannelId(videoApiData);
  }

  static getVideoIdFromVideoApiData(videoApiData: YoutubeVideoApiData) {
    return YoutubeApiDataUtil.getId(videoApiData);
  }

  static getTitleFromVideoApiData(videoApiData: YoutubeVideoApiData) {
    return YoutubeApiDataUtil.getTitle(videoApiData);
  }

  static getDescriptioFromVideoApiData(videoApiData: YoutubeVideoApiData) {
    return YoutubeApiDataUtil.getDescription(videoApiData);
  }

  static getPublishedAtFromVideoApiData(videoApiData: YoutubeVideoApiData) {
    return YoutubeApiDataUtil.getPublishedAt(videoApiData);
  }

  static getStartTimeFromVideoApiData(videoApiData: YoutubeVideoApiData) {
    return YoutubeApiDataUtil.getStartTime(videoApiData);
  }

  static getEndTimeFromVideoApiData(videoApiData: YoutubeVideoApiData) {
    return YoutubeApiDataUtil.getEndTime(videoApiData);
  }

  static getViewCountFromVideoApiData(videoApiData: YoutubeVideoApiData) {
    return YoutubeApiDataUtil.getViewCount(videoApiData);
  }

  static getLikeCountFromVideoApiData(videoApiData: YoutubeVideoApiData) {
    return YoutubeApiDataUtil.getLikeCount(videoApiData);
  }

  // Channel API Data
  static getChannelIdFromChannelApiData(channelApiData: YoutubeChannelApiData) {
    return YoutubeApiDataUtil.getId(channelApiData);
  }

  static getTitleFromChannelApiData(channelApiData: YoutubeChannelApiData) {
    return YoutubeApiDataUtil.getTitle(channelApiData);
  }

  static getPublishedAtFromChannelApiData(
    channelApiData: YoutubeChannelApiData
  ) {
    return YoutubeApiDataUtil.getPublishedAt(channelApiData);
  }

  static getThumbnailFromChannelApiData(channelApiData: YoutubeChannelApiData) {
    return YoutubeApiDataUtil.getThumbnail(channelApiData);
  }

  static getViewCountFromChannelApiData(channelApiData: YoutubeChannelApiData) {
    return YoutubeApiDataUtil.getViewCount(channelApiData);
  }

  static getVideoCountFromChannelApiData(
    channelApiData: YoutubeChannelApiData
  ) {
    return YoutubeApiDataUtil.getVideoCount(channelApiData);
  }

  static getSubscriberCountFromChannelApiData(
    channelApiData: YoutubeChannelApiData
  ) {
    return YoutubeApiDataUtil.getSubscriberCount(channelApiData);
  }

  static getBannerFromChannelApiData(channelApiData: YoutubeChannelApiData) {
    return YoutubeApiDataUtil.getBanner(channelApiData);
  }

  // Playlist API Data
  static getTitleFromPlaylistApiData(apiData: YoutubePlaylistApiData) {
    return YoutubeApiDataUtil.getTitle(apiData);
  }

  static getPlaylistIdFromPlaylistApiData(apiData: YoutubePlaylistApiData) {
    return YoutubeApiDataUtil.getId(apiData);
  }

  static getChannelIdFromPlaylistApiData(apiData: YoutubePlaylistApiData) {
    return YoutubeApiDataUtil.getChannelId(apiData);
  }

  // PlaylistItem API Data
  static getVideoIdFromPlaylistItemApiData(
    apiData: YoutubePlaylistItemApiData
  ) {
    return YoutubeApiDataUtil.getVideoId(apiData);
  }

  static getVideoUrlFromPlaylistItemsApiData(
    apiData: YoutubePlaylistItemApiData
  ) {
    const videoId = Youtube.getVideoIdFromPlaylistItemApiData(apiData);
    if (videoId == undefined) {
      return "";
    }
    return Youtube.getVideoUrlFromVideoId(videoId);
  }

  // Video ID
  static getThumbnailFromVideoId(videoId: string) {
    return new YoutubeVideoId(videoId).toThumbnail();
  }

  static getVideoIdFromVideoUrl(url: string) {
    return url.slice(-11);
  }

  static getVideoUrlFromVideoId(videoId: string) {
    return new YoutubeVideoId(videoId).toUrl();
  }

  // Channel ID
  static getChannelIdFromUrl(url: string) {
    return YoutubeChannelId.getIdFromUrl(url);
  }

  static getChannelIdFromUploadPlaylistId = (uploadPlaylistId: string) => {
    return new YoutubePlaylistId(uploadPlaylistId).toChannelId();
  };

  static getChannelUrlFromChannelId(channelId: string) {
    return new YoutubeChannelId(channelId).toUrl();
  }

  static searchChannelIdFromText(text: string) {
    const searchString = /https:\/\/www.youtube.com\/channel\/(.{24})/g;
    return removeDuplicatesFromArray(
      [...text.matchAll(searchString)].map((elem) => elem[1])
    );
  }

  static searchCustomUrlFromText(text: string) {
    const customUrl = /https:\/\/www.youtube.com\/c\/[^\r\n \u3000]+/g;
    const data = text.match(customUrl);
    if (data == null) {
      return [];
    }
    return data;
  }

  static getUploadPlaylistIdFromChannelId(channelId: string) {
    return new YoutubeChannelId(channelId).toPlaylistId();
  }

  // Playlist ID
  static getPlaylistUrlFromPlaylistId(playlistId: string) {
    return new YoutubePlaylistId(playlistId).toUrl();
  }

  static removeEtagFromApiData(apiData: YoutubeApiData) {
    delete apiData.etag;
    return apiData;
  }
}

class Notion {
  #notion;

  constructor(apiKey: string) {
    this.#notion = new Client({
      auth: apiKey,
    });
  }

  async makeDatabase(query: CreateDatabaseParameters) {
    return this.#notion.databases.create(query);
  }

  async makePage(query: CreatePageParameters) {
    return this.#notion.pages.create(query);
  }

  async getDatabase(query: GetDatabaseParameters) {
    return this.#notion.databases.retrieve(query);
  }

  async getDatabaseFromId(id: string) {
    const query = {
      database_id: id,
    };
    return this.getDatabase(query);
  }

  async getPage(query: GetPageParameters) {
    return this.#notion.pages.retrieve(query);
  }

  async getPageFromId(id: string) {
    const query = {
      page_id: id,
    };
    return this.getPage(query);
  }

  async updatePage(query: UpdatePageParameters) {
    return this.#notion.pages.update(query);
  }

  static getIdFromUrl(urlString: string) {
    const idLength = 32;
    const url = new URL(urlString);
    const urlWithoutParameter = `${url.origin}${url.pathname}`;
    const id = urlWithoutParameter.slice(-idLength);
    return id;
  }

  static getIdFromApiResponse(
    response:
      | GetPageResponse
      | GetDatabaseResponse
      | CreatePageResponse
      | CreateDatabaseResponse
      | UpdatePageResponse
      | UpdateDatabaseResponse
  ) {
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
