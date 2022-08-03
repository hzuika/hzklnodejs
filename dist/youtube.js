"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Youtube = void 0;
const googleapis_1 = require("googleapis");
const youtube = googleapis_1.google.youtube("v3");
const _1 = require(".");
var Youtube;
(function (Youtube) {
    Youtube.VideoId = {
        urlPrefix: "https://www.youtube.com/watch?v=",
        shortUrlPrefix: "https://youtu.be/",
        new: (id) => {
            if (!Youtube.VideoId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.length === 11;
        },
        toUrl: (id) => {
            return `${Youtube.VideoId.urlPrefix}${id}`;
        },
        toShortUrl: (id) => {
            return `${Youtube.VideoId.shortUrlPrefix}${id}`;
        },
        toThumbnail: (id) => {
            return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        },
    };
    Youtube.ChannelId = {
        urlPrefix: "https://www.youtube.com/channel/",
        new: (id) => {
            if (!Youtube.ChannelId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.substring(0, 2) === "UC" && id.length === 24;
        },
        toUrl: (id) => {
            return `${Youtube.ChannelId.urlPrefix}${id}`;
        },
        toPlaylistId: (id) => {
            return Youtube.UploadPlaylistId.new((0, _1.replaceString)(id, 1, "U"));
        },
    };
    Youtube.UploadPlaylistId = {
        new: (id) => {
            if (!Youtube.UploadPlaylistId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.substring(0, 2) === "UU" && id.length === 24;
        },
        toChannelId: (id) => {
            return Youtube.ChannelId.new((0, _1.replaceString)(id, 1, "C"));
        },
    };
    Youtube.RegularPlaylistId = {
        urlPrefix: "https://www.youtube.com/playlist?list=",
        new: (id) => {
            if (!Youtube.RegularPlaylistId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.substring(0, 2) === "PL" && id.length === 34;
        },
    };
    Youtube.PlaylistId = {
        urlPrefix: "https://www.youtube.com/playlist?list=",
        toUrl: (id) => {
            return `${Youtube.PlaylistId.urlPrefix}${id}`;
        },
    };
    class Api {
        apiKey;
        constructor(apiKey) {
            this.apiKey = apiKey;
        }
        async getData(params, apiFunction) {
            const dataList = [];
            params.pageToken = undefined;
            do {
                const res = await apiFunction(params);
                Array.prototype.push.apply(dataList, res.data.items ? res.data.items : []);
                params.pageToken = res.data.nextPageToken
                    ? res.data.nextPageToken
                    : undefined;
            } while (params.pageToken);
            return dataList;
        }
        async getDataFromIdList(idList, params, apiFunction) {
            const youtubeApiData = await Promise.all((0, _1.getChunkFromArray)(idList, 50).map((idList50) => {
                params.id = idList50;
                return this.getData(params, apiFunction);
            }));
            return youtubeApiData.flat();
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
                auth: this.apiKey,
                part: part,
                maxResults: 50,
            };
            return this.getDataFromIdList(videoIdList, params, (p) => youtube.videos.list(p));
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
                auth: this.apiKey,
                part: part,
                maxResults: 50,
            };
            return this.getDataFromIdList(channelIdList, params, (p) => youtube.channels.list(p));
        }
        async getPlaylistItems(playlistId, part = [
            "snippet",
            "contentDetails",
            "id",
            "status",
        ]) {
            const params = {
                auth: this.apiKey,
                part: part,
                playlistId: playlistId,
                maxResults: 50,
            };
            return this.getData(params, (p) => youtube.playlistItems.list(p));
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
                auth: this.apiKey,
                part: part,
                channelId: channelId,
                maxResults: 50,
            };
            return this.getData(params, (params) => youtube.playlists.list(params));
        }
        async getCommentThreads(videoId, part = ["id", "snippet", "replies"]) {
            const params = {
                auth: this.apiKey,
                part: part,
                videoId: videoId,
                maxResults: 100,
            };
            return this.getData(params, (p) => youtube.commentThreads.list(p));
        }
    }
    Youtube.Api = Api;
})(Youtube = exports.Youtube || (exports.Youtube = {}));
