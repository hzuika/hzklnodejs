import { youtube_v3, youtube } from "@googleapis/youtube";
const client = youtube("v3");
import { GaxiosPromise } from "gaxios";
import { GaxiosResponse } from "gaxios";
import { Opaque } from "type-fest";
import { getChunkFromArray, removeDuplicatesFromArray, replaceString } from ".";
export namespace Youtube {
  export type VideoId = Opaque<string, "VideoId">;
  export const VideoId = {
    urlPrefix: "https://www.youtube.com/watch?v=",
    shortUrlPrefix: "https://youtu.be/",
    validLength: 11,

    new: (id: string): VideoId => {
      if (!VideoId.validate(id)) {
        throw new Error(`${id} is not valid.`);
      }
      return id as VideoId;
    },

    validate: (id: string): id is VideoId => {
      return id.length === VideoId.validLength;
    },

    toUrl: (id: VideoId): string => {
      return `${VideoId.urlPrefix}${id}`;
    },

    toShortUrl: (id: VideoId): string => {
      return `${VideoId.shortUrlPrefix}${id}`;
    },

    toThumbnail: (id: VideoId): string => {
      return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    },
  };

  export type ChannelId = Opaque<string, "ChannelId">;
  export const ChannelId = {
    urlPrefix: "https://www.youtube.com/channel/",
    validLength: 24,

    new: (id: string): ChannelId => {
      if (!ChannelId.validate(id)) {
        throw new Error(`${id} is not valid.`);
      }
      return id as ChannelId;
    },

    validate: (id: string): id is ChannelId => {
      return id.substring(0, 2) === "UC" && id.length === ChannelId.validLength;
    },

    toUrl: (id: ChannelId): string => {
      return `${ChannelId.urlPrefix}${id}`;
    },

    toPlaylistId: (id: ChannelId): UploadPlaylistId => {
      return UploadPlaylistId.new(replaceString(id, 1, "U"));
    },

    searchFromText(text: string) {
      const searchString = /https:\/\/www.youtube.com\/channel\/(.{24})/g;
      return removeDuplicatesFromArray(
        [...text.matchAll(searchString)].map((elem) => ChannelId.new(elem[1]))
      );
    },
  };

  export type UploadPlaylistId = Opaque<string, "UploadPlaylistId">;
  export const UploadPlaylistId = {
    validLength: 24,

    new: (id: string): UploadPlaylistId => {
      if (!UploadPlaylistId.validate(id)) {
        throw new Error(`${id} is not valid.`);
      }
      return id as UploadPlaylistId;
    },

    validate: (id: string): id is UploadPlaylistId => {
      return (
        id.substring(0, 2) === "UU" &&
        id.length === UploadPlaylistId.validLength
      );
    },

    toChannelId: (id: UploadPlaylistId): ChannelId => {
      return ChannelId.new(replaceString(id, 1, "C"));
    },
  };

  export type PlaylistItemId = Opaque<string, "PlaylistItemId">;
  export const PlaylistItemId = {
    validLength: 48,
  };

  export type RegularPlaylistId = Opaque<string, "RegularPlaylistId">;
  export const RegularPlaylistId = {
    validLength: 34,

    new: (id: string): RegularPlaylistId => {
      if (!RegularPlaylistId.validate(id)) {
        throw new Error(`${id} is not valid.`);
      }
      return id as RegularPlaylistId;
    },

    validate: (id: string): id is RegularPlaylistId => {
      return (
        id.substring(0, 2) === "PL" &&
        id.length === RegularPlaylistId.validLength
      );
    },
  };

  export type PlaylistId = UploadPlaylistId | RegularPlaylistId;
  export const PlaylistId = {
    urlPrefix: "https://www.youtube.com/playlist?list=",
    toUrl: (id: PlaylistId): string => {
      return `${PlaylistId.urlPrefix}${id}`;
    },
  };

  type Id<T extends Extract<ApiType, "Video" | "Channel" | "Playlist">> =
    T extends "Video"
      ? VideoId
      : T extends "Channel"
      ? ChannelId
      : T extends "Playlist"
      ? PlaylistId
      : string;

  export type VideoApiData = youtube_v3.Schema$Video;

  export type ChannelApiData = youtube_v3.Schema$Channel;

  export type PlaylistApiData = youtube_v3.Schema$Playlist;

  export type PlaylistItemApiData = youtube_v3.Schema$PlaylistItem;

  export type ApiType = "Video" | "Channel" | "Playlist" | "PlaylistItem";
  type ApiData<T extends ApiType> = T extends "Video"
    ? VideoApiData
    : T extends "Channel"
    ? ChannelApiData
    : T extends "Playlist"
    ? PlaylistApiData
    : T extends "PlaylistItem"
    ? PlaylistItemApiData
    : unknown;

  type ApiDataExtractFunction<T extends ApiType, U = string> = (
    data: ApiData<T>
  ) => U | null | undefined;

  export const VideoApiData: {
    partList: (keyof ApiData<"Video">)[];
    apiFunction: ApiFunction<"Video">;
    getId: ApiDataExtractFunction<"Video">;
    getPublishedAt: ApiDataExtractFunction<"Video">;
    getChannelId: ApiDataExtractFunction<"Video">;
    getTitle: ApiDataExtractFunction<"Video">;
    getDescription: ApiDataExtractFunction<"Video">;
    getThumbnail: ApiDataExtractFunction<"Video">;
    getChannelTitle: ApiDataExtractFunction<"Video">;
    getTagList: ApiDataExtractFunction<"Video", string[]>;
    getCategoryId: ApiDataExtractFunction<"Video">;
    getIsLive: ApiDataExtractFunction<"Video">;
    getDuration: ApiDataExtractFunction<"Video">;
    getHasCaption: ApiDataExtractFunction<"Video">;
    getViewCount: ApiDataExtractFunction<"Video">;
    getLikeCount: ApiDataExtractFunction<"Video">;
    getCommentCount: ApiDataExtractFunction<"Video">;
    getTopicIdList: ApiDataExtractFunction<"Video", string[]>;
    getTopicCategoryList: ApiDataExtractFunction<"Video", string[]>;
    getStartTime: ApiDataExtractFunction<"Video">;
    getEndTime: ApiDataExtractFunction<"Video">;
  } = {
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

  export const ChannelApiData: {
    partList: (keyof ChannelApiData)[];
    apiFunction: ApiFunction<"Channel">;
    getId: ApiDataExtractFunction<"Channel">;
    getTitle: ApiDataExtractFunction<"Channel">;
    getDescription: ApiDataExtractFunction<"Channel">;
    getCustomUrl: ApiDataExtractFunction<"Channel">;
    getPublishedAt: ApiDataExtractFunction<"Channel">;
    getThumbnail: ApiDataExtractFunction<"Channel">;
    getViewCount: ApiDataExtractFunction<"Channel">;
    getSubscriberCount: ApiDataExtractFunction<"Channel">;
    getVideoCount: ApiDataExtractFunction<"Channel">;
    getBanner: ApiDataExtractFunction<"Channel">;
  } = {
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

  export const PlaylistApiData: {
    partList: (keyof PlaylistApiData)[];
    apiFunction: ApiFunction<"Playlist">;
    getId: ApiDataExtractFunction<"Playlist">;
    getPublishedAt: ApiDataExtractFunction<"Playlist">;
    getChannelId: ApiDataExtractFunction<"Playlist">;
    getTitle: ApiDataExtractFunction<"Playlist">;
    getDescription: ApiDataExtractFunction<"Playlist">;
    getChannelTitle: ApiDataExtractFunction<"Playlist">;
    getVideoCount: ApiDataExtractFunction<"Playlist", number>;
  } = {
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

  export const PlaylistItemApiData: {
    partList: (keyof PlaylistItemApiData)[];
    apiFunction: ApiFunction<"PlaylistItem">;
    getId: ApiDataExtractFunction<"PlaylistItem">;
    getVideoId: ApiDataExtractFunction<"PlaylistItem">;
    getVideoChannelId: ApiDataExtractFunction<"PlaylistItem">;
    getVideoChannelTitle: ApiDataExtractFunction<"PlaylistItem">;
    getVideoPublishedAt: ApiDataExtractFunction<"PlaylistItem">;
    getTitle: ApiDataExtractFunction<"PlaylistItem">;
    getDescription: ApiDataExtractFunction<"PlaylistItem">;
    getThumbnail: ApiDataExtractFunction<"PlaylistItem">;
    getChannelId: ApiDataExtractFunction<"PlaylistItem">;
    getChannelTitle: ApiDataExtractFunction<"PlaylistItem">;
    getPublishedAt: ApiDataExtractFunction<"PlaylistItem">;
    getPlaylistId: ApiDataExtractFunction<"PlaylistItem">;
  } = {
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

  type VideoApiParameter = youtube_v3.Params$Resource$Videos$List;

  type ChannelApiParameter = youtube_v3.Params$Resource$Channels$List;

  type PlaylistApiParameter = youtube_v3.Params$Resource$Playlists$List;

  type PlaylistItemApiParameter = youtube_v3.Params$Resource$Playlistitems$List;

  type ApiParameter<T extends ApiType> = T extends "Video"
    ? VideoApiParameter
    : T extends "Channel"
    ? ChannelApiParameter
    : T extends "Playlist"
    ? PlaylistApiParameter
    : T extends "PlaylistItem"
    ? PlaylistItemApiParameter
    : unknown;

  type VideoApiResponse = youtube_v3.Schema$VideoListResponse;
  type ChannelApiResponse = youtube_v3.Schema$ChannelListResponse;
  type PlaylistApiResponse = youtube_v3.Schema$PlaylistListResponse;
  type PlaylistItemApiResponse = youtube_v3.Schema$PlaylistItemListResponse;

  type ApiResponse<T extends ApiType> = T extends "Video"
    ? VideoApiResponse
    : T extends "Channel"
    ? ChannelApiResponse
    : T extends "Playlist"
    ? PlaylistApiResponse
    : T extends "PlaylistItem"
    ? PlaylistItemApiResponse
    : unknown;

  const ApiResponse = {
    // ApiResponse<T>["items"]型がApiData<T>[]であることを認識させる．
    getDataList: <T extends ApiType>(
      response: ApiResponse<T>
    ): ApiData<T>[] => {
      return response.items ? (response.items as ApiData<T>[]) : [];
    },
  };

  type ApiFunction<T extends ApiType> = (
    params: ApiParameter<T>
  ) => GaxiosPromise<ApiResponse<T>>;

  export class Api {
    readonly #apiKey: string;
    constructor(apiKey: string) {
      this.#apiKey = apiKey;
    }

    // Gen([apiData, ... 50], [apiData, ... 50], ...)
    // apiのresponse data配列単位のGenerator
    async *#getDataListAsyncGenerator<T extends ApiType>(
      apiFunction: ApiFunction<T>,
      params: ApiParameter<T>
    ) {
      let nextPageToken: string | null | undefined = params.pageToken;
      do {
        const response: GaxiosResponse<ApiResponse<T>> = await apiFunction({
          ...params,
          pageToken: nextPageToken,
        });
        yield ApiResponse.getDataList(response.data);
        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);
    }

    // Gen(apiData, ...)
    // apiのreponse data単位のGenerator
    async *#getDataAsyncGenerator<T extends ApiType>(
      apiFunction: ApiFunction<T>,
      params: ApiParameter<T>
    ) {
      for await (const data of this.#getDataListAsyncGenerator(
        apiFunction,
        params
      )) {
        yield* data;
      }
    }

    // [Gen(apiData, ... 50), Gen(apiData, ... 50)]
    // apiのresponse data単位のGeneratorの配列
    // 使用先でmapを使う
    #getDataAsyncGeneratorListFromIdList<
      T extends Extract<ApiType, "Video" | "Channel">
    >(idList: Id<T>[], apiFunction: ApiFunction<T>, params: ApiParameter<T>) {
      return getChunkFromArray(idList, 50).map((idList50) => {
        params.id = idList50;
        return this.#getDataAsyncGenerator(apiFunction, params);
      });
    }

    // [Gen([apiData, ... 50]), Gen([apiData, ... 50])]
    // apiのresponse data配列単位のGeneratorの配列
    #getDataListAsyncGeneratorListFromIdList<
      T extends Extract<ApiType, "Video" | "Channel">
    >(idList: Id<T>[], apiFunction: ApiFunction<T>, params: ApiParameter<T>) {
      return getChunkFromArray(idList, 50).map((idList50) => {
        params.id = idList50;
        return this.#getDataListAsyncGenerator(apiFunction, params);
      });
    }

    async #processFromAsyncGenerator<T>(
      asyncGenerator: AsyncGenerator<T>,
      callback: (data: T) => void
    ) {
      for await (const data of asyncGenerator) {
        callback(data);
      }
    }

    async #processFromAsyncGeneratorList<T>(
      asyncGeneratorList: AsyncGenerator<T>[],
      callback: (data: T) => void
    ) {
      await Promise.all(
        asyncGeneratorList.map(async (asyncGenerator) => {
          await this.#processFromAsyncGenerator(asyncGenerator, callback);
        })
      );
    }

    #getPlaylistItemAsyncGenerator(
      playlistId: PlaylistId,
      part: (keyof PlaylistItemApiData)[] = PlaylistItemApiData.partList
    ) {
      const params = {
        auth: this.#apiKey,
        part: part,
        playlistId: playlistId,
        maxResults: 50,
      };
      return this.#getDataAsyncGenerator(
        PlaylistItemApiData.apiFunction,
        params
      );
    }

    #getPlaylistItemListAsyncGenerator(
      playlistId: PlaylistId,
      part: (keyof PlaylistItemApiData)[] = PlaylistItemApiData.partList
    ) {
      const params = {
        auth: this.#apiKey,
        part: part,
        playlistId: playlistId,
        maxResults: 50,
      };
      return this.#getDataListAsyncGenerator(
        PlaylistItemApiData.apiFunction,
        params
      );
    }

    async processPlaylistItem(
      playlistId: PlaylistId,
      callback: (data: PlaylistItemApiData) => void,
      part: (keyof PlaylistItemApiData)[] = PlaylistItemApiData.partList
    ) {
      return this.#processFromAsyncGenerator(
        this.#getPlaylistItemAsyncGenerator(playlistId, part),
        callback
      );
    }

    async processPlaylistItemList(
      playlistId: PlaylistId,
      callback: (data: PlaylistItemApiData[]) => void,
      part: (keyof PlaylistItemApiData)[] = PlaylistItemApiData.partList
    ) {
      return this.#processFromAsyncGenerator(
        this.#getPlaylistItemListAsyncGenerator(playlistId, part),
        callback
      );
    }

    async getPlaylistItemList(
      playlistId: PlaylistId,
      part: (keyof PlaylistItemApiData)[] = PlaylistItemApiData.partList
    ) {
      const dataList: PlaylistItemApiData[] = [];
      await this.processPlaylistItem(
        playlistId,
        (data) => dataList.push(data),
        part
      );
      return dataList;
    }

    #getPlaylistAsyncGenerator(
      channelId: ChannelId,
      part: (keyof PlaylistApiData)[] = PlaylistApiData.partList
    ) {
      const params = {
        auth: this.#apiKey,
        part: part,
        channelId: channelId,
        maxResults: 50,
      };
      return this.#getDataAsyncGenerator(PlaylistApiData.apiFunction, params);
    }

    #getPlaylistListAsyncGenerator(
      channelId: ChannelId,
      part: (keyof PlaylistApiData)[] = PlaylistApiData.partList
    ) {
      const params = {
        auth: this.#apiKey,
        part: part,
        channelId: channelId,
        maxResults: 50,
      };
      return this.#getDataListAsyncGenerator(
        PlaylistApiData.apiFunction,
        params
      );
    }

    async processPlaylist(
      channelId: ChannelId,
      callback: (data: PlaylistApiData) => void,
      part: (keyof PlaylistApiData)[] = PlaylistApiData.partList
    ) {
      return this.#processFromAsyncGenerator(
        this.#getPlaylistAsyncGenerator(channelId, part),
        callback
      );
    }

    async processPlaylistList(
      channelId: ChannelId,
      callback: (data: PlaylistApiData[]) => void,
      part: (keyof PlaylistApiData)[] = PlaylistApiData.partList
    ) {
      return this.#processFromAsyncGenerator(
        this.#getPlaylistListAsyncGenerator(channelId, part),
        callback
      );
    }

    async getPlaylistList(
      channelId: ChannelId,
      part: (keyof PlaylistApiData)[] = PlaylistApiData.partList
    ) {
      const dataList: PlaylistApiData[] = [];
      await this.processPlaylist(
        channelId,
        (data) => dataList.push(data),
        part
      );
      return dataList;
    }

    async processVideo(
      videoIdList: VideoId[],
      callback: (data: VideoApiData) => void,
      part: (keyof VideoApiData)[] = VideoApiData.partList
    ) {
      return this.#processFromAsyncGeneratorList(
        this.#getVideoAsyncGeneratorList(videoIdList, part),
        callback
      );
    }

    async processVideoList(
      videoIdList: VideoId[],
      callback: (data: VideoApiData[]) => void,
      part: (keyof VideoApiData)[] = VideoApiData.partList
    ) {
      return this.#processFromAsyncGeneratorList(
        this.#getVideoListAsyncGeneratorList(videoIdList, part),
        callback
      );
    }

    #getVideoAsyncGeneratorList(
      videoIdList: VideoId[],
      part: (keyof VideoApiData)[] = VideoApiData.partList
    ) {
      const params: VideoApiParameter = {
        auth: this.#apiKey,
        part: part,
        maxResults: 50,
      };
      return this.#getDataAsyncGeneratorListFromIdList(
        videoIdList,
        VideoApiData.apiFunction,
        params
      );
    }

    #getVideoListAsyncGeneratorList(
      videoIdList: VideoId[],
      part: (keyof VideoApiData)[] = VideoApiData.partList
    ) {
      const params: VideoApiParameter = {
        auth: this.#apiKey,
        part: part,
        maxResults: 50,
      };
      return this.#getDataListAsyncGeneratorListFromIdList(
        videoIdList,
        VideoApiData.apiFunction,
        params
      );
    }

    async getVideoList(
      videoIdList: VideoId[],
      part: (keyof VideoApiData)[] = VideoApiData.partList
    ) {
      const dataList: VideoApiData[] = [];
      await this.processVideo(videoIdList, (data) => dataList.push(data), part);
      return dataList;
    }

    async processChannel(
      channelIdList: ChannelId[],
      callback: (data: ChannelApiData) => void,
      part: (keyof ChannelApiData)[] = ChannelApiData.partList
    ) {
      this.#processFromAsyncGeneratorList(
        this.#getChannelAsyncGeneratorList(channelIdList, part),
        callback
      );
    }

    async processChannelList(
      channelIdList: ChannelId[],
      callback: (data: ChannelApiData[]) => void,
      part: (keyof ChannelApiData)[] = ChannelApiData.partList
    ) {
      this.#processFromAsyncGeneratorList(
        this.#getChannelListAsyncGeneratorList(channelIdList, part),
        callback
      );
    }

    #getChannelAsyncGeneratorList(
      channelIdList: ChannelId[],
      part: (keyof ChannelApiData)[] = ChannelApiData.partList
    ) {
      const params = {
        auth: this.#apiKey,
        part: part,
        maxResults: 50,
      };
      return this.#getDataAsyncGeneratorListFromIdList(
        channelIdList,
        ChannelApiData.apiFunction,
        params
      );
    }

    #getChannelListAsyncGeneratorList(
      channelIdList: ChannelId[],
      part: (keyof ChannelApiData)[] = ChannelApiData.partList
    ) {
      const params = {
        auth: this.#apiKey,
        part: part,
        maxResults: 50,
      };
      return this.#getDataListAsyncGeneratorListFromIdList(
        channelIdList,
        ChannelApiData.apiFunction,
        params
      );
    }

    async getChannelList(
      channelIdList: ChannelId[],
      part: (keyof ChannelApiData)[] = ChannelApiData.partList
    ) {
      const dataList: ChannelApiData[] = [];
      await this.processChannel(
        channelIdList,
        (data) => dataList.push(data),
        part
      );
      return dataList;
    }
  }
}
