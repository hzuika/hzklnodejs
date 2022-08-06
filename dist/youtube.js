"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Youtube = void 0;
const youtube_1 = require("@googleapis/youtube");
const client = (0, youtube_1.youtube)("v3");
const _1 = require(".");
var Youtube;
(function (Youtube) {
    Youtube.VideoId = {
        urlPrefix: "https://www.youtube.com/watch?v=",
        shortUrlPrefix: "https://youtu.be/",
        validLength: 11,
        new: (id) => {
            if (!Youtube.VideoId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.length === Youtube.VideoId.validLength;
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
        validLength: 24,
        new: (id) => {
            if (!Youtube.ChannelId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.substring(0, 2) === "UC" && id.length === Youtube.ChannelId.validLength;
        },
        toUrl: (id) => {
            return `${Youtube.ChannelId.urlPrefix}${id}`;
        },
        toPlaylistId: (id) => {
            return Youtube.UploadPlaylistId.new((0, _1.replaceString)(id, 1, "U"));
        },
        searchFromText(text) {
            const searchString = /https:\/\/www.youtube.com\/channel\/(.{24})/g;
            return (0, _1.removeDuplicatesFromArray)([...text.matchAll(searchString)].map((elem) => Youtube.ChannelId.new(elem[1])));
        },
    };
    Youtube.UploadPlaylistId = {
        validLength: 24,
        new: (id) => {
            if (!Youtube.UploadPlaylistId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return (id.substring(0, 2) === "UU" &&
                id.length === Youtube.UploadPlaylistId.validLength);
        },
        toChannelId: (id) => {
            return Youtube.ChannelId.new((0, _1.replaceString)(id, 1, "C"));
        },
    };
    Youtube.PlaylistItemId = {
        validLength: 48,
    };
    Youtube.RegularPlaylistId = {
        validLength: 34,
        new: (id) => {
            if (!Youtube.RegularPlaylistId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return (id.substring(0, 2) === "PL" &&
                id.length === Youtube.RegularPlaylistId.validLength);
        },
    };
    Youtube.PlaylistId = {
        urlPrefix: "https://www.youtube.com/playlist?list=",
        toUrl: (id) => {
            return `${Youtube.PlaylistId.urlPrefix}${id}`;
        },
    };
    Youtube.VideoApiData = {
        partList: [
            "id",
            "snippet",
            "contentDetails",
            "status",
            "statistics",
            "player",
            "topicDetails",
            "recordingDetails",
            "liveStreamingDetails",
            "localizations",
        ],
        apiFunction: (params) => client.videos.list(params),
        getId: (data) => data.id,
        getTitle: (data) => data.snippet?.title,
        getDescription: (data) => data.snippet?.description,
        getChannelId: (data) => data.snippet?.channelId,
        getChannelTitle: (data) => data.snippet?.channelTitle,
        getPublishedAt: (data) => data.snippet?.publishedAt,
        getThumbnail: (data) => data.snippet?.thumbnails?.high?.url,
        getStartTime: (data) => data.liveStreamingDetails?.actualStartTime,
        getEndTime: (data) => data.liveStreamingDetails?.actualEndTime,
        getDuration: (data) => data.contentDetails?.duration,
        getViewCount: (data) => data.statistics?.viewCount,
        getLikeCount: (data) => data.statistics?.likeCount,
        getCommentCount: (data) => data.statistics?.commentCount,
        getCategoryId: (data) => data.snippet?.categoryId,
        getTagList: (data) => data.snippet?.tags,
        getIsLive: (data) => data.snippet?.liveBroadcastContent,
        getHasCaption: (data) => data.contentDetails?.caption,
        getTopicIdList: (data) => data.topicDetails?.topicIds,
        getTopicCategoryList: (data) => data.topicDetails?.topicCategories,
    };
    Youtube.ChannelApiData = {
        partList: [
            "id",
            "snippet",
            "contentDetails",
            "statistics",
            "topicDetails",
            "status",
            "brandingSettings",
            "contentOwnerDetails",
            "localizations",
        ],
        apiFunction: (params) => client.channels.list(params),
        getId: (data) => data.id,
        getTitle: (data) => data.snippet?.title,
        getDescription: (data) => data.snippet?.description,
        getCustomUrl: (data) => data.snippet?.customUrl,
        getPublishedAt: (data) => data.snippet?.publishedAt,
        getThumbnail: (data) => data.snippet?.thumbnails?.high?.url,
        getViewCount: (data) => data.statistics?.viewCount,
        getSubscriberCount: (data) => data.statistics?.subscriberCount,
        getVideoCount: (data) => data.statistics?.videoCount,
        getBanner: (data) => data.brandingSettings?.image?.bannerExternalUrl,
    };
    Youtube.PlaylistApiData = {
        partList: [
            "id",
            "snippet",
            "status",
            "contentDetails",
            "player",
            "localizations",
        ],
        apiFunction: (params) => client.playlists.list(params),
        getId: (data) => data.id,
        getPublishedAt: (data) => data.snippet?.publishedAt,
        getChannelId: (data) => data.snippet?.channelId,
        getTitle: (data) => data.snippet?.title,
        getDescription: (data) => data.snippet?.description,
        getChannelTitle: (data) => data.snippet?.channelTitle,
        getVideoCount: (data) => data.contentDetails?.itemCount,
    };
    Youtube.PlaylistItemApiData = {
        partList: ["id", "snippet", "contentDetails", "status"],
        apiFunction: (params) => client.playlistItems.list(params),
        getId: (data) => data.id,
        getVideoId: (data) => data.contentDetails?.videoId,
        getVideoChannelId: (data) => data.snippet?.videoOwnerChannelId,
        getVideoChannelTitle: (data) => data.snippet?.videoOwnerChannelTitle,
        getVideoPublishedAt: (data) => data.contentDetails?.endAt,
        getTitle: (data) => data.snippet?.title,
        getDescription: (data) => data.snippet?.description,
        getThumbnail: (data) => data.snippet?.thumbnails?.high?.url,
        getChannelId: (data) => data.snippet?.channelId,
        getChannelTitle: (data) => data.snippet?.channelTitle,
        getPublishedAt: (data) => data.snippet?.publishedAt,
        getPlaylistId: (data) => data.snippet?.playlistId,
    };
    const ApiResponse = {
        // ApiResponse<T>["items"]型がApiData<T>[]であることを認識させる．
        getDataList: (response) => {
            return response.items ? response.items : [];
        },
    };
    class Api {
        #apiKey;
        constructor(apiKey) {
            this.#apiKey = apiKey;
        }
        // Gen([apiData, ... 50], [apiData, ... 50], ...)
        // apiのresponse data配列単位のGenerator
        async *#getDataListAsyncGenerator(apiFunction, params) {
            let nextPageToken = params.pageToken;
            do {
                const response = await apiFunction({
                    ...params,
                    pageToken: nextPageToken,
                });
                yield ApiResponse.getDataList(response.data);
                nextPageToken = response.data.nextPageToken;
            } while (nextPageToken);
        }
        // PlaylistItem API の Generator
        #getPlaylistItemListAsyncGenerator(playlistId, part = Youtube.PlaylistItemApiData.partList) {
            const params = {
                auth: this.#apiKey,
                part: part,
                playlistId: playlistId,
                maxResults: 50,
            };
            return this.#getDataListAsyncGenerator(Youtube.PlaylistItemApiData.apiFunction, params);
        }
        // Playlist API の Generator
        #getPlaylistListAsyncGenerator(channelId, part = Youtube.PlaylistApiData.partList) {
            const params = {
                auth: this.#apiKey,
                part: part,
                channelId: channelId,
                maxResults: 50,
            };
            return this.#getDataListAsyncGenerator(Youtube.PlaylistApiData.apiFunction, params);
        }
        // ID List を 50個ずつに分割して，Generatorの配列を返す
        #getDataListAsyncGeneratorListFromIdList(idList, apiFunction, params) {
            return (0, _1.getChunkFromArray)(idList, 50).map((idList50) => {
                params.id = idList50;
                return this.#getDataListAsyncGenerator(apiFunction, params);
            });
        }
        // Video API の Generator
        #getVideoListAsyncGeneratorList(videoIdList, part = Youtube.VideoApiData.partList) {
            const params = {
                auth: this.#apiKey,
                part: part,
                maxResults: 50,
            };
            return this.#getDataListAsyncGeneratorListFromIdList(videoIdList, Youtube.VideoApiData.apiFunction, params);
        }
        // Channel API の Generator
        #getChannelListAsyncGeneratorList(channelIdList, part = Youtube.ChannelApiData.partList) {
            const params = {
                auth: this.#apiKey,
                part: part,
                maxResults: 50,
            };
            return this.#getDataListAsyncGeneratorListFromIdList(channelIdList, Youtube.ChannelApiData.apiFunction, params);
        }
        // Generator の for await 内で callback を実行する
        async #processFromAsyncGenerator(asyncGenerator, callback) {
            for await (const data of asyncGenerator) {
                callback(data);
            }
        }
        // PlaylistItem API Data に対して処理を行う
        async processPlaylistItemList(playlistId, callback, part = Youtube.PlaylistItemApiData.partList) {
            return this.#processFromAsyncGenerator(this.#getPlaylistItemListAsyncGenerator(playlistId, part), callback);
        }
        // Playlist API Data に対して処理を行う
        async processPlaylistList(channelId, callback, part = Youtube.PlaylistApiData.partList) {
            return this.#processFromAsyncGenerator(this.#getPlaylistListAsyncGenerator(channelId, part), callback);
        }
        // Generator の配列の各 for await 内で callback を実行する
        async #processFromAsyncGeneratorList(asyncGeneratorList, callback) {
            Promise.all(asyncGeneratorList.map((asyncGenerator) => {
                this.#processFromAsyncGenerator(asyncGenerator, callback);
            }));
        }
        // Video API Data に対して処理を行う
        async processVideoList(videoIdList, callback, part = Youtube.VideoApiData.partList) {
            return this.#processFromAsyncGeneratorList(this.#getVideoListAsyncGeneratorList(videoIdList, part), callback);
        }
        // Channel API Data に対して処理を行う
        async processChannelList(channelIdList, callback, part = Youtube.ChannelApiData.partList) {
            this.#processFromAsyncGeneratorList(this.#getChannelListAsyncGeneratorList(channelIdList, part), callback);
        }
    }
    Youtube.Api = Api;
})(Youtube = exports.Youtube || (exports.Youtube = {}));
