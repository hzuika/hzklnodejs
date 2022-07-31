"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notion = exports.Youtube = exports.sortJson = exports.sleep = exports.equalArray = exports.getJapaneseIsoStringFromUtcIsoString = exports.removeDuplicatesFromArray = exports.replaceString = exports.getTsvFromJson = exports.getCsvFromJson = exports.getChunkFromArray = exports.getHtmlFromUrl = exports.getJsonFromString = exports.getStringFromJson = exports.getFileNameWithoutExtension = exports.getFileName = exports.getExtension = exports.getDirectoryName = exports.writeFileJson = exports.writeFileBinary = exports.writeFileText = exports.readFileJson = exports.readFileBinary = exports.readFileText = exports.makeDirectory = exports.existPath = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const googleapis_1 = require("googleapis");
const youtube = googleapis_1.google.youtube("v3");
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@notionhq/client");
const existPath = async (filepath) => {
    try {
        await fs_1.promises.access(filepath);
        return true;
    }
    catch {
        return false;
    }
};
exports.existPath = existPath;
const makeDirectory = async (dirpath) => {
    return fs_1.promises.mkdir(dirpath, { recursive: true });
};
exports.makeDirectory = makeDirectory;
const readFileText = async (filepath) => {
    return fs_1.promises.readFile(filepath, "utf8");
};
exports.readFileText = readFileText;
const readFileBinary = async (filepath) => {
    return fs_1.promises.readFile(filepath, "binary");
};
exports.readFileBinary = readFileBinary;
// import jsonData from "./filepath.json" assert {type: "json"}
const readFileJson = async (filepath) => {
    return getJsonFromString(await readFileText(filepath));
};
exports.readFileJson = readFileJson;
const writeFileText = async (filepath, data) => {
    await makeDirectory(getDirectoryName(filepath));
    fs_1.promises.writeFile(filepath, data, "utf8");
};
exports.writeFileText = writeFileText;
const writeFileBinary = async (filepath, data) => {
    await makeDirectory(getDirectoryName(filepath));
    fs_1.promises.writeFile(filepath, data, "binary");
};
exports.writeFileBinary = writeFileBinary;
const getStringFromJson = (json) => {
    return JSON.stringify(json, null, 2);
};
exports.getStringFromJson = getStringFromJson;
const getJsonFromString = (string) => {
    return JSON.parse(string);
};
exports.getJsonFromString = getJsonFromString;
const writeFileJson = async (filepath, json) => {
    await makeDirectory(getDirectoryName(filepath));
    writeFileText(filepath, getStringFromJson(json));
};
exports.writeFileJson = writeFileJson;
const getDirectoryName = (filepath) => {
    return path_1.default.dirname(filepath);
};
exports.getDirectoryName = getDirectoryName;
const getExtension = (filepath) => {
    return path_1.default.parse(filepath).ext;
};
exports.getExtension = getExtension;
const getFileName = (filepath) => {
    return path_1.default.parse(filepath).base;
};
exports.getFileName = getFileName;
const getFileNameWithoutExtension = (filepath) => {
    return path_1.default.parse(filepath).name;
};
exports.getFileNameWithoutExtension = getFileNameWithoutExtension;
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], 3 => [[1,2,3],[4,5,6],[7,8,9],[0]]
const getChunkFromArray = (array, size) => {
    return array.reduce((acc, _, index) => index % size ? acc : [...acc, array.slice(index, index + size)], []);
};
exports.getChunkFromArray = getChunkFromArray;
const getHtmlFromUrl = async (url) => {
    const res = await axios_1.default.get(encodeURI(url));
    return res.data;
};
exports.getHtmlFromUrl = getHtmlFromUrl;
const replaceString = (inStr, n, newStr) => {
    return inStr.substring(0, n) + newStr + inStr.substring(n + 1);
};
exports.replaceString = replaceString;
// [ { a: 1, b: 2 }, { a: 3, b: 4 } ]
// a,b
// 1,2
// 3,4
const getTableFromJson = (json, delimiter) => {
    const header = Object.keys(json[0]).join(delimiter) + "\n";
    const body = json
        .map((d) => Object.values(d).join(delimiter))
        .join("\n");
    return header + body;
};
const getCsvFromJson = (json) => {
    return getTableFromJson(json, ",");
};
exports.getCsvFromJson = getCsvFromJson;
const getTsvFromJson = (json) => {
    return getTableFromJson(json, "\t");
};
exports.getTsvFromJson = getTsvFromJson;
const removeDuplicatesFromArray = (array) => {
    return [...new Set(array)];
};
exports.removeDuplicatesFromArray = removeDuplicatesFromArray;
const getMinuteFromHour = (hour) => {
    return hour * 60;
};
const getSecondFromMinute = (minute) => {
    return minute * 60;
};
const getSecondFromHour = (hour) => {
    return getSecondFromMinute(getMinuteFromHour(hour));
};
const getMillis = (val) => {
    return val * 1000;
};
const getMilliSecondFromHour = (hour) => {
    return getMillis(getSecondFromHour(hour));
};
const getSign = (num) => {
    if (num < 0) {
        return "-";
    }
    else {
        return "+";
    }
};
const getJapaneseIsoStringFromUtcIsoString = (utc) => {
    const timeZoneOffsetHour = {
        "Asia/Tokyo": +9,
    };
    const offset = timeZoneOffsetHour["Asia/Tokyo"];
    const dt = new Date(utc);
    const dt_offset = new Date(dt.getTime() + getMilliSecondFromHour(offset));
    const offsetString = getSign(offset) + String(offset).padStart(2, "0") + ":00";
    return dt_offset.toISOString().replace("Z", offsetString);
};
exports.getJapaneseIsoStringFromUtcIsoString = getJapaneseIsoStringFromUtcIsoString;
const equalArray = (array1, array2) => {
    return JSON.stringify(array1) === JSON.stringify(array2);
};
exports.equalArray = equalArray;
const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
exports.sleep = sleep;
const sortJson = (json) => {
    return Object.fromEntries(Object.entries(json).sort((a, b) => (a[0] < b[0] ? -1 : 1)));
};
exports.sortJson = sortJson;
class YoutubeVideoId {
    id;
    static #validLength = 11;
    static urlPrefix = "https://www.youtube.com/watch?v=";
    static shortUrlPrefix = "https://youtu.be/";
    constructor(id) {
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
    static isValid(id) {
        return id.length === YoutubeVideoId.#validLength;
    }
}
class YoutubeChannelId {
    id;
    static #validLength = 24;
    static #prefix = "UC";
    static urlPrefix = "https://www.youtube.com/channel/";
    constructor(id) {
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
    static getIdFromUrl(url) {
        const prefix = YoutubeChannelId.urlPrefix;
        if (url.indexOf(prefix) == -1) {
            throw new Error(`${url} is not channel url.`);
        }
        return new YoutubeChannelId(url.split(prefix)[1]).getId();
    }
    static getIdFromHtml(html) {
        const searchString = /<meta property="og:url" content="https:\/\/www.youtube.com\/channel\/(.{24})">/g;
        const res = [...html.matchAll(searchString)];
        if (res.length > 0) {
            return new YoutubeChannelId([...html.matchAll(searchString)][0][1]).getId();
        }
        return "";
    }
    static isValid(id) {
        return (id.substring(0, 2) === YoutubeChannelId.#prefix &&
            id.length === YoutubeChannelId.#validLength);
    }
}
class YoutubePlaylistId {
    id;
    static #uploadValidLength = 24;
    static #uploadPrefix = "UU";
    static #validLength = 34;
    static #prefix = "PL";
    static urlPrefix = "https://www.youtube.com/playlist?list=";
    constructor(id) {
        if (!YoutubePlaylistId.isValid(id)) {
            throw new Error(`${id} length is not ${YoutubePlaylistId.#validLength} or ${YoutubePlaylistId.#uploadValidLength}, or Prefix is not ${YoutubePlaylistId.#prefix} or ${YoutubePlaylistId.#uploadPrefix}.`);
        }
        this.id = id;
    }
    getId() {
        return this.id;
    }
    toChannelId() {
        if (YoutubePlaylistId.isUploadId(this.getId())) {
            return replaceString(this.getId(), 1, "C");
        }
        else {
            return "";
        }
    }
    toUrl() {
        return `${YoutubePlaylistId.urlPrefix}${this.getId()}`;
    }
    static isUploadId(id) {
        return (id.substring(0, 2) === YoutubePlaylistId.#uploadPrefix &&
            id.length === YoutubePlaylistId.#uploadValidLength);
    }
    static isRegularId(id) {
        return (id.substring(0, 2) === YoutubePlaylistId.#prefix &&
            id.length === YoutubePlaylistId.#validLength);
    }
    static isValid(id) {
        return (YoutubePlaylistId.isRegularId(id) || YoutubePlaylistId.isUploadId(id));
    }
}
class YoutubeApiDataUtil {
    static getDescription(apiData) {
        return apiData.snippet?.description;
    }
    static getTitle(apiData) {
        return apiData.snippet?.title;
    }
    static getPublishedAt(apiData) {
        return apiData.snippet?.publishedAt;
    }
    static getThumbnail(apiData) {
        return apiData.snippet?.thumbnails?.high?.url;
    }
    static getId(apiData) {
        return apiData.id;
    }
    static getChannelId(apiData) {
        return apiData.snippet?.channelId;
    }
    static getStartTime(apiData) {
        return apiData.liveStreamingDetails?.actualStartTime;
    }
    static getEndTime(apiData) {
        return apiData.liveStreamingDetails?.actualEndTime;
    }
    static getViewCount(apiData) {
        return apiData.statistics?.viewCount;
    }
    static getLikeCount(apiData) {
        return apiData.statistics?.likeCount;
    }
    static getVideoId(apiData) {
        return apiData.contentDetails?.videoId;
    }
    static getVideoCount(apiData) {
        return apiData.statistics?.videoCount;
    }
    static getSubscriberCount(apiData) {
        return apiData.statistics?.subscriberCount;
    }
    static getBanner(apiData) {
        return apiData.brandingSettings?.image?.bannerExternalUrl;
    }
}
class Youtube {
    #YOUTUBE_API_KEY;
    constructor(apiKey) {
        this.#YOUTUBE_API_KEY = apiKey;
    }
    async #getApiData(params, apiCallback) {
        const dataList = [];
        params.pageToken = undefined;
        do {
            const res = await apiCallback(params);
            Array.prototype.push.apply(dataList, res.data.items ? res.data.items : []);
            params.pageToken = res.data.nextPageToken
                ? res.data.nextPageToken
                : undefined;
        } while (params.pageToken);
        return dataList;
    }
    async #getApiDataFromIdList(idList, params, apiCallback) {
        const youtubeApiData = await Promise.all(getChunkFromArray(idList, 50).map((idList50) => {
            params.id = idList50;
            return this.#getApiData(params, apiCallback);
        }));
        return youtubeApiData.flat();
    }
    async getCommentThreads(videoId, part = ["id", "snippet", "replies"]) {
        const params = {
            auth: this.#YOUTUBE_API_KEY,
            part: part,
            videoId: videoId,
            maxResults: 100,
        };
        return this.#getApiData(params, (p) => youtube.commentThreads.list(p));
    }
    async getVideos(videoIdList, part = [
        "id",
        "liveStreamingDetails",
        "localizations",
        "player",
        "recordingDetails",
        "snippet",
        "statistics",
        "status",
        "topicDetails",
    ]) {
        const params = {
            auth: this.#YOUTUBE_API_KEY,
            part: part,
            maxResults: 50,
        };
        return this.#getApiDataFromIdList(videoIdList, params, (p) => youtube.videos.list(p));
    }
    async getChannels(channelIdList, part = [
        "brandingSettings",
        "contentDetails",
        "contentOwnerDetails",
        "id",
        "localizations",
        "snippet",
        "statistics",
        "status",
        "topicDetails",
    ]) {
        const params = {
            auth: this.#YOUTUBE_API_KEY,
            part: part,
            maxResults: 50,
        };
        return this.#getApiDataFromIdList(channelIdList, params, (p) => youtube.channels.list(p));
    }
    async getPlaylistItems(playlistId, part = ["snippet", "contentDetails", "id", "status"]) {
        const params = {
            auth: this.#YOUTUBE_API_KEY,
            part: part,
            playlistId: playlistId,
            maxResults: 50,
        };
        return this.#getApiData(params, (p) => youtube.playlistItems.list(p));
    }
    async getPlaylists(channelId, part = [
        "snippet",
        "contentDetails",
        "id",
        "status",
        "player",
        "localizations",
    ]) {
        const params = {
            auth: this.#YOUTUBE_API_KEY,
            part: part,
            channelId: channelId,
            maxResults: 50,
        };
        return this.#getApiData(params, (params) => youtube.playlists.list(params));
    }
    // Video API Data
    static getChannelIdFromVideoApiData(videoApiData) {
        return YoutubeApiDataUtil.getChannelId(videoApiData);
    }
    static getVideoIdFromVideoApiData(videoApiData) {
        return YoutubeApiDataUtil.getId(videoApiData);
    }
    static getTitleFromVideoApiData(videoApiData) {
        return YoutubeApiDataUtil.getTitle(videoApiData);
    }
    static getDescriptioFromVideoApiData(videoApiData) {
        return YoutubeApiDataUtil.getDescription(videoApiData);
    }
    static getPublishedAtFromVideoApiData(videoApiData) {
        return YoutubeApiDataUtil.getPublishedAt(videoApiData);
    }
    static getStartTimeFromVideoApiData(videoApiData) {
        return YoutubeApiDataUtil.getStartTime(videoApiData);
    }
    static getEndTimeFromVideoApiData(videoApiData) {
        return YoutubeApiDataUtil.getEndTime(videoApiData);
    }
    static getViewCountFromVideoApiData(videoApiData) {
        return YoutubeApiDataUtil.getViewCount(videoApiData);
    }
    static getLikeCountFromVideoApiData(videoApiData) {
        return YoutubeApiDataUtil.getLikeCount(videoApiData);
    }
    // Channel API Data
    static getChannelIdFromChannelApiData(channelApiData) {
        return YoutubeApiDataUtil.getId(channelApiData);
    }
    static getViewCountFromChannelApiData(channelApiData) {
        return YoutubeApiDataUtil.getViewCount(channelApiData);
    }
    static getVideoCountFromChannelApiData(channelApiData) {
        return YoutubeApiDataUtil.getVideoCount(channelApiData);
    }
    static getSubscriberCountFromChannelApiData(channelApiData) {
        return YoutubeApiDataUtil.getSubscriberCount(channelApiData);
    }
    static getBannerFromChannelApiData(channelApiData) {
        return YoutubeApiDataUtil.getBanner(channelApiData);
    }
    // Playlist API Data
    static getTitleFromPlaylistApiData(apiData) {
        return YoutubeApiDataUtil.getTitle(apiData);
    }
    static getPlaylistIdFromPlaylistApiData(apiData) {
        return YoutubeApiDataUtil.getId(apiData);
    }
    // PlaylistItem API Data
    static getVideoIdFromPlaylistItemApiData(apiData) {
        return YoutubeApiDataUtil.getVideoId(apiData);
    }
    static getVideoUrlFromPlaylistItemsApiData(apiData) {
        const videoId = Youtube.getVideoIdFromPlaylistItemApiData(apiData);
        if (videoId == undefined) {
            return "";
        }
        return Youtube.getVideoUrlFromVideoId(videoId);
    }
    // Video ID
    static getThumbnailFromVideoId(videoId) {
        return new YoutubeVideoId(videoId).toThumbnail();
    }
    static getVideoIdFromVideoUrl(url) {
        return url.slice(-11);
    }
    static getVideoUrlFromVideoId(videoId) {
        return new YoutubeVideoId(videoId).toUrl();
    }
    static async getGameTitleFromVideoId(videoId) {
        return Youtube.getGameTitleFromUrl(Youtube.getVideoUrlFromVideoId(videoId));
    }
    // Channel ID
    static async getChannelIdFromCustomUrl(url) {
        const html = await getHtmlFromUrl(url);
        return Youtube.getChannelIdFromHtml(html);
    }
    static getChannelIdFromHtml(html) {
        return YoutubeChannelId.getIdFromHtml(html);
    }
    static getChannelIdFromUrl(url) {
        return YoutubeChannelId.getIdFromUrl(url);
    }
    static getChannelIdFromUploadPlaylistId = (uploadPlaylistId) => {
        return new YoutubePlaylistId(uploadPlaylistId).toChannelId();
    };
    static getChannelUrlFromChannelId(channelId) {
        return new YoutubeChannelId(channelId).toUrl();
    }
    static searchChannelIdFromText(text) {
        const searchString = /https:\/\/www.youtube.com\/channel\/(.{24})/g;
        return removeDuplicatesFromArray([...text.matchAll(searchString)].map((elem) => elem[1]));
    }
    static searchCustomUrlFromText(text) {
        const customUrl = /https:\/\/www.youtube.com\/c\/[^\r\n \u3000]+/g;
        const data = text.match(customUrl);
        if (data == null) {
            return [];
        }
        return data;
    }
    static getUploadPlaylistIdFromChannelId(channelId) {
        return new YoutubeChannelId(channelId).toPlaylistId();
    }
    // Playlist ID
    static getPlaylistUrlFromPlaylistId(playlistId) {
        return new YoutubePlaylistId(playlistId).toUrl();
    }
    static removeEtagFromApiData(apiData) {
        delete apiData.etag;
        return apiData;
    }
    static getAtChannelIdListFromHtml(html) {
        const searchString = /\{"text":"@[^"]+","navigationEndpoint":\{"clickTrackingParams":"[^"]+","commandMetadata":\{"webCommandMetadata":\{"url":"\/channel\/(.{24})"/g;
        return removeDuplicatesFromArray([...html.matchAll(searchString)].map((elem) => elem[1]));
    }
    static getHashTagListFromHtml(html) {
        const searchString = /\{"text":"(#[^"]+)","navigationEndpoint":\{"clickTrackingParams":"[^"]+","commandMetadata":\{"webCommandMetadata":\{"url":"\/hashtag\//g;
        const hashTags = [...html.matchAll(searchString)].map((elem) => elem[1].replace(/[\u200B-\u200D\uFEFF]/g, ""));
        return removeDuplicatesFromArray(hashTags);
    }
    static getGameTitleFromHtml(text) {
        const searchString = /\{"richMetadataRenderer":\{"style":"RICH_METADATA_RENDERER_STYLE_BOX_ART","thumbnail":\{"thumbnails":\[\{"url":"[^"]+","width":[0-9]+,"height":[0-9]+\},\{"url":"[^"]+","width":[0-9]+,"height":[0-9]+\}\]\},"title":\{"simpleText":"([^"]+)"\},/g;
        const result = removeDuplicatesFromArray([...text.matchAll(searchString)].map((elem) => elem[1]));
        if (result.length > 0) {
            return result[0];
        }
        else {
            return "";
        }
    }
    static async getGameTitleFromUrl(url) {
        return Youtube.getGameTitleFromHtml(await getHtmlFromUrl(url));
    }
}
exports.Youtube = Youtube;
class Notion {
    #notion;
    constructor(apiKey) {
        this.#notion = new client_1.Client({
            auth: apiKey,
        });
    }
    async makeDatabase(query) {
        return this.#notion.databases.create(query);
    }
    async makePage(query) {
        return this.#notion.pages.create(query);
    }
    async getDatabase(query) {
        return this.#notion.databases.retrieve(query);
    }
    async getDatabaseFromId(id) {
        const query = {
            database_id: id,
        };
        return this.getDatabase(query);
    }
    async getPage(query) {
        return this.#notion.pages.retrieve(query);
    }
    async getPageFromId(id) {
        const query = {
            page_id: id,
        };
        return this.getPage(query);
    }
    async updatePage(query) {
        return this.#notion.pages.update(query);
    }
    static getIdFromUrl(urlString) {
        const idLength = 32;
        const url = new URL(urlString);
        const urlWithoutParameter = `${url.origin}${url.pathname}`;
        const id = urlWithoutParameter.slice(-idLength);
        return id;
    }
    static getIdFromApiResponse(response) {
        return response.id.replace(/-/g, "");
    }
}
exports.Notion = Notion;
