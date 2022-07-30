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
const strict_1 = __importDefault(require("node:assert/strict"));
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
    fs_1.promises.writeFile(filepath, getStringFromJson(json), "utf8");
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
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
};
exports.sleep = sleep;
const sortJson = (json) => {
    return Object.fromEntries(Object.entries(json).sort((a, b) => (a[0] < b[0] ? -1 : 1)));
};
exports.sortJson = sortJson;
class Youtube {
    #YOUTUBE_API_KEY;
    #channel_id_length = 24;
    #video_id_length = 11;
    constructor(apiKey) {
        this.#YOUTUBE_API_KEY = apiKey;
    }
    static removeEtagFromApiData(apiData) {
        const { etag, ...rest } = apiData;
        return rest;
    }
    static getDescriptionFromApiData(apiData) {
        return apiData.snippet.description;
    }
    static getTitleFromApiData(apiData) {
        return apiData.snippet.title;
    }
    static getPublishedAtFromApiData(apiData) {
        return apiData.snippet.publishedAt;
    }
    static getThumbnailFromApiData(apiData) {
        return apiData.snippet.thumbnails.high.url;
    }
    static getThumbnailFromChannelApiData(channelApiData) {
        return Youtube.getThumbnailFromApiData(channelApiData);
    }
    static getThumbnailFromVideoApiData(videoApiData) {
        return Youtube.getThumbnailFromApiData(videoApiData);
    }
    static getThumbnailFromVideoId(videoId) {
        return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    }
    static #getIdFromApiData(apiData) {
        return apiData.id;
    }
    static getChannelIdFromChannelApiData(channelApiData) {
        return Youtube.#getIdFromApiData(channelApiData);
    }
    static getChannelIdFromVideoApiData(videoApiData) {
        return videoApiData.snippet.channelId;
    }
    static async getChannelIdFromCustomUrl(url) {
        const html = await getHtmlFromUrl(url);
        return Youtube.getChannelIdFromHtml(html);
    }
    static getChannelIdFromHtml(html) {
        const searchString = /<meta property=\"og:url\" content=\"https:\/\/www.youtube.com\/channel\/(.{24})\">/g;
        const res = [...html.matchAll(searchString)];
        if (res.length > 0) {
            return [...html.matchAll(searchString)][0][1];
        }
        return "";
    }
    static getChannelIdFromUrl(url) {
        const prefix = "https://www.youtube.com/channel/";
        strict_1.default.notStrictEqual(url.indexOf(prefix), -1);
        return url.split(prefix)[1];
    }
    static getChannelIdFromUploadPlaylistId = (uploadPlaylistId) => {
        return replaceString(uploadPlaylistId, 1, "C");
    };
    static getVideoIdFromVideoApiData(videoApiData) {
        return Youtube.#getIdFromApiData(videoApiData);
    }
    static getVideoIdFromPlaylistItemsApiData(apiData) {
        return apiData.snippet.resourceId.videoId;
    }
    static getVideoIdFromVideoUrl(url) {
        return url.slice(-11);
    }
    static getTitleFromVideoApiData(videoApiData) {
        return Youtube.getTitleFromApiData(videoApiData);
    }
    static getPublishedAtFromVideoApiData(videoApiData) {
        return Youtube.getPublishedAtFromApiData(videoApiData);
    }
    static getStartTimeFromVideoApiData(videoApiData) {
        return videoApiData.liveStreamingDetails
            ? videoApiData.liveStreamingDetails.actualStartTime
            : null;
    }
    static getEndTimeFromVideoApiData(videoApiData) {
        return videoApiData.liveStreamingDetails
            ? videoApiData.liveStreamingDetails.actualEndTime
            : null;
    }
    static #getViewCountFromApiData(apiData) {
        return apiData.statistics.viewCount;
    }
    static getViewCountFromVideoApiData(videoApiData) {
        return Youtube.#getViewCountFromApiData(videoApiData);
    }
    static getViewCountFromChannelApiData(channelApiData) {
        return Youtube.#getViewCountFromApiData(channelApiData);
    }
    static #getLikeCountFromApiData(ApiData) {
        return ApiData.statistics.likeCount;
    }
    static getLikeCountFromVideoApiData(videoApiData) {
        return Youtube.#getLikeCountFromApiData(videoApiData);
    }
    static #getVideoCountFromApiData(apiData) {
        return apiData.statistics.videoCount;
    }
    static getVideoCountFromChannelApiData(channelApiData) {
        return Youtube.#getVideoCountFromApiData(channelApiData);
    }
    static #getSubscriberCountFromApiData(apiData) {
        return apiData.statistics.subscriberCount;
    }
    static getSubscriberCountFromChannelApiData(channelApiData) {
        return Youtube.#getSubscriberCountFromApiData(channelApiData);
    }
    static #getBannerFromApiData(apiData) {
        return apiData.brandingSettings.image.bannerExternalUrl;
    }
    static getBannerFromChannelApiData(channelApiData) {
        return Youtube.#getBannerFromApiData(channelApiData);
    }
    static getVideoUrlFromPlaylistItemsApiData(apiData) {
        return Youtube.getVideoUrlFromVideoId(Youtube.getVideoIdFromPlaylistItemsApiData(apiData));
    }
    static searchChannelIdFromText(text) {
        const searchString = /https:\/\/www.youtube.com\/channel\/(.{24})/g;
        return removeDuplicatesFromArray([...text.matchAll(searchString)].map((elem) => elem[1]));
    }
    static searchCustomUrlFromText(text) {
        const customUrl = /https:\/\/www.youtube.com\/c\/[^\r\n 　]+/g;
        const data = text.match(customUrl);
        if (data == null) {
            return [];
        }
        return data;
    }
    static getUploadPlaylistIdFromChannelId = (channelId) => {
        return replaceString(channelId, 1, "U");
    };
    static getChannelUrlFromChannelId(channelId) {
        strict_1.default.strictEqual(channelId.length, 24);
        return `https://www.youtube.com/channel/${channelId}`;
    }
    static getVideoUrlFromVideoId(videoId) {
        strict_1.default.strictEqual(videoId.length, 11);
        return `https://www.youtube.com/watch?v=${videoId}`;
    }
    static getAtChannelIdListFromHtml(html) {
        const searchString = /\{\"text\":\"@[^\"]+\",\"navigationEndpoint\":\{\"clickTrackingParams\":\"[^\"]+\",\"commandMetadata\":\{\"webCommandMetadata\":\{\"url\":\"\/channel\/(.{24})\"/g;
        return removeDuplicatesFromArray([...html.matchAll(searchString)].map((elem) => elem[1]));
    }
    static getHashTagListFromHtml(html) {
        const searchString = /\{\"text\":\"(#[^\"]+)\",\"navigationEndpoint\":\{\"clickTrackingParams\":\"[^"]+\",\"commandMetadata\":\{\"webCommandMetadata\":\{\"url\":\"\/hashtag\//g;
        const hashTags = [...html.matchAll(searchString)].map((elem) => elem[1].replace(/[\u200B\u200C\u200D\uFEFF]/g, ""));
        return removeDuplicatesFromArray(hashTags);
    }
    static getGameTitleFromHtml(text) {
        const searchString = /\{\"richMetadataRenderer\":\{\"style\":\"RICH_METADATA_RENDERER_STYLE_BOX_ART\",\"thumbnail\":\{\"thumbnails\":\[\{\"url\":\"[^\"]+\",\"width\":[0-9]+,\"height\":[0-9]+\},\{\"url\":\"[^\"]+\",\"width\":[0-9]+,\"height\":[0-9]+\}\]\},\"title\":\{\"simpleText\":\"([^\"]+)\"\},/g;
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
    static async getGameTitleFromVideoId(videoId) {
        return Youtube.getGameTitleFromUrl(Youtube.getVideoUrlFromVideoId(videoId));
    }
    async #getApiData(params, apiCallback) {
        const dataList = [];
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
        const youtubeApiData = await Promise.all(getChunkFromArray(idList, 50).map((idList50) => {
            params.id = idList50.join(",");
            return this.#getApiData(params, apiCallback);
        }));
        return youtubeApiData.flat();
    }
    async getCommentThreads(videoId, part = ["id", "snippet", "replies"]) {
        const params = {
            auth: this.#YOUTUBE_API_KEY,
            part: part.join(","),
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
            part: part.join(","),
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
            part: part.join(","),
            maxResults: 50,
        };
        return this.#getApiDataFromIdList(channelIdList, params, (p) => youtube.channels.list(p));
    }
    async getPlaylistItems(playlistId, part = ["snippet", "contentDetails", "id", "status"]) {
        const params = {
            auth: this.#YOUTUBE_API_KEY,
            part: part.join(","),
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
            part: part.join(","),
            channelId: channelId,
            maxResults: 50,
        };
        return this.#getApiData(params, (params) => youtube.playlists.list(params));
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
