import { youtube } from "@googleapis/youtube";
const client = youtube("v3");
import { getChunkFromArray, removeDuplicatesFromArray, replaceString } from ".";
export var Youtube;
(function (Youtube) {
    Youtube.VideoId = {
        urlPrefix: "https://www.youtube.com/watch?v=",
        shortUrlPrefix: "https://youtu.be/",
        validLength: 11,
        new: (id) => {
            if (!Youtube.VideoId.validate(id)) {
                throw new Error(`${id} is invalid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.length === Youtube.VideoId.validLength;
        },
        toUrl: (id) => {
            return `${Youtube.VideoId.urlPrefix}${Youtube.VideoId.new(id)}`;
        },
        toShortUrl: (id) => {
            return `${Youtube.VideoId.shortUrlPrefix}${Youtube.VideoId.new(id)}`;
        },
        toThumbnail: (id) => {
            return `https://i.ytimg.com/vi/${Youtube.VideoId.new(id)}/hqdefault.jpg`;
        },
    };
    Youtube.ChannelId = {
        urlPrefix: "https://www.youtube.com/channel/",
        validLength: 24,
        new: (id) => {
            if (!Youtube.ChannelId.validate(id)) {
                throw new Error(`${id} is invalid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.substring(0, 2) === "UC" && id.length === Youtube.ChannelId.validLength;
        },
        toUrl: (id) => {
            return `${Youtube.ChannelId.urlPrefix}${Youtube.ChannelId.new(id)}`;
        },
        toPlaylistId: (id) => {
            return Youtube.UploadPlaylistId.new(replaceString(Youtube.ChannelId.new(id), 1, "U"));
        },
        searchFromText(text) {
            const searchString = /https:\/\/www.youtube.com\/channel\/(.{24})/g;
            return removeDuplicatesFromArray([...text.matchAll(searchString)].map((elem) => Youtube.ChannelId.new(elem[1])));
        },
    };
    Youtube.UploadPlaylistId = {
        validLength: 24,
        new: (id) => {
            if (!Youtube.UploadPlaylistId.validate(id)) {
                throw new Error(`${id} is invalid.`);
            }
            return id;
        },
        validate: (id) => {
            return (id.substring(0, 2) === "UU" &&
                id.length === Youtube.UploadPlaylistId.validLength);
        },
        toChannelId: (id) => {
            return Youtube.ChannelId.new(replaceString(Youtube.UploadPlaylistId.new(id), 1, "C"));
        },
    };
    Youtube.PlaylistItemId = {
        validLength: 48,
    };
    Youtube.RegularPlaylistId = {
        validLength: 34,
        new: (id) => {
            if (!Youtube.RegularPlaylistId.validate(id)) {
                throw new Error(`${id} is invalid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.length === Youtube.RegularPlaylistId.validLength;
        },
    };
    Youtube.PlaylistId = {
        urlPrefix: "https://www.youtube.com/playlist?list=",
        new: (id) => {
            if (Youtube.UploadPlaylistId.validate(id)) {
                return Youtube.UploadPlaylistId.new(id);
            }
            if (Youtube.RegularPlaylistId.validate(id)) {
                return Youtube.RegularPlaylistId.new(id);
            }
            throw new Error(`${id} is invalid.`);
        },
        toUrl: (id) => {
            return `${Youtube.PlaylistId.urlPrefix}${Youtube.PlaylistId.new(id)}`;
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
        getIsLive: (data) => {
            if (data.snippet?.liveBroadcastContent == "live") {
                return true;
            }
            if (data.snippet?.liveBroadcastContent == "none") {
                return false;
            }
            return false;
        },
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
        getVideoPublishedAt: (data) => data.contentDetails?.videoPublishedAt,
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
        // pageInfo.totalResults の情報が欲しいのでApiResponse<T>を返す
        async *#getResponseAsyncGenerator(apiFunction, params) {
            let nextPageToken = params.pageToken;
            do {
                const response = await apiFunction({
                    ...params,
                    pageToken: nextPageToken,
                });
                yield response.data;
                nextPageToken = response.data.nextPageToken;
            } while (nextPageToken);
        }
        // 取得数が変動するため，break可能なfor awaitを外で使用できるようにする．
        getPlaylistItemResponseAsyncGenerator(playlistId) {
            const params = {
                playlistId: playlistId,
                auth: this.#apiKey,
                part: Youtube.PlaylistItemApiData.partList,
                maxResults: 50,
            };
            return this.#getResponseAsyncGenerator(Youtube.PlaylistItemApiData.apiFunction, params);
        }
        // 取得数が変動するため，break可能なfor awaitを外で使用できるようにする．
        getPlaylistResponseAsyncGenerator(channelId) {
            const params = {
                channelId: channelId,
                auth: this.#apiKey,
                part: Youtube.PlaylistItemApiData.partList,
                maxResults: 50,
            };
            return this.#getResponseAsyncGenerator(Youtube.PlaylistApiData.apiFunction, params);
        }
        // Gen([apiData, ... 50], [apiData, ... 50], ...)
        // apiのresponse data配列単位のGenerator
        async *#getDataListAsyncGenerator(apiFunction, params) {
            for await (const response of this.#getResponseAsyncGenerator(apiFunction, params)) {
                yield ApiResponse.getDataList(response);
            }
        }
        // PlaylistItem API の Generator
        getPlaylistItemListAsyncGenerator(playlistId, part = Youtube.PlaylistItemApiData.partList) {
            const params = {
                auth: this.#apiKey,
                part: part,
                playlistId: playlistId,
                maxResults: 50,
            };
            return this.#getDataListAsyncGenerator(Youtube.PlaylistItemApiData.apiFunction, params);
        }
        // Playlist API の Generator
        getPlaylistListAsyncGenerator(channelId, part = Youtube.PlaylistApiData.partList) {
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
            return getChunkFromArray(idList, 50).map((idList50) => {
                return this.#getDataListAsyncGenerator(apiFunction, {
                    id: idList50,
                    ...params,
                });
            });
        }
        // Video API の Generator
        getVideoListAsyncGeneratorList(videoIdList, part = Youtube.VideoApiData.partList) {
            const params = {
                auth: this.#apiKey,
                part: part,
                maxResults: 50,
            };
            return this.#getDataListAsyncGeneratorListFromIdList(videoIdList, Youtube.VideoApiData.apiFunction, params);
        }
        // Channel API の Generator
        getChannelListAsyncGeneratorList(channelIdList, part = Youtube.ChannelApiData.partList) {
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
                await callback(data);
            }
        }
        // PlaylistItem API Data に対して処理を行う
        processPlaylistItemList(playlistId, callback, part = Youtube.PlaylistItemApiData.partList) {
            return this.#processFromAsyncGenerator(this.getPlaylistItemListAsyncGenerator(playlistId, part), callback);
        }
        // Playlist API Data に対して処理を行う
        processPlaylistList(channelId, callback, part = Youtube.PlaylistApiData.partList) {
            return this.#processFromAsyncGenerator(this.getPlaylistListAsyncGenerator(channelId, part), callback);
        }
        // Generator の配列の各 for await 内で callback を実行する
        async #processFromAsyncGeneratorList(asyncGeneratorList, callback) {
            return Promise.all(asyncGeneratorList.map(async (asyncGenerator) => {
                await this.#processFromAsyncGenerator(asyncGenerator, callback);
            }));
        }
        // Video API Data に対して処理を行う
        processVideoList(videoIdList, callback, part = Youtube.VideoApiData.partList) {
            return this.#processFromAsyncGeneratorList(this.getVideoListAsyncGeneratorList(videoIdList, part), callback);
        }
        // Channel API Data に対して処理を行う
        processChannelList(channelIdList, callback, part = Youtube.ChannelApiData.partList) {
            return this.#processFromAsyncGeneratorList(this.getChannelListAsyncGeneratorList(channelIdList, part), callback);
        }
    }
    Youtube.Api = Api;
    Youtube.CustromUrl = {
        prefix: "https://www.youtube.com/c/",
        new: (text) => `${Youtube.CustromUrl.prefix}${text}`,
        searchFromText: (text) => {
            const customUrl = /https:\/\/www.youtube.com\/c\/[^\r\n \u3000]+/g;
            return text.match(customUrl) ?? [];
        },
    };
})(Youtube || (Youtube = {}));
