import { google, youtube_v3 } from "googleapis";
const youtube = google.youtube("v3");
import { GaxiosPromise } from "googleapis/build/src/apis/abusiveexperiencereport";
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

  export const VideoApiData = {
    getId: (data: VideoApiData) => {
      return data.id;
    },
  };

  export const ChannelApiData = {
    getId: (data: ChannelApiData) => {
      return data.id;
    },
  };

  export const PlaylistApiData = {
    getId: (data: PlaylistApiData) => {
      return data.id;
    },
  };

  export const PlaylistItemApiData = {
    getId: (data: PlaylistItemApiData) => {
      return data.id;
    },
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

  type VideoApiFunction = (
    p: VideoApiParameter
  ) => GaxiosPromise<VideoApiResponse>;

  type ChannelApiFunction = (
    p: ChannelApiParameter
  ) => GaxiosPromise<ChannelApiResponse>;

  type PlaylistApiFunction = (
    p: PlaylistApiParameter
  ) => GaxiosPromise<PlaylistApiResponse>;

  type PlaylistItemApiFunction = (
    p: PlaylistItemApiParameter
  ) => GaxiosPromise<PlaylistItemApiResponse>;

  type ApiFunction<T extends ApiType> = T extends "Video"
    ? VideoApiFunction
    : T extends "Channel"
    ? ChannelApiFunction
    : T extends "Playlist"
    ? PlaylistApiFunction
    : T extends "PlaylistItem"
    ? PlaylistItemApiFunction
    : unknown;

  export class Api {
    private readonly apiKey: string;
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }

    private async getData<T extends ApiType>(
      params: ApiParameter<T>,
      apiFunction: ApiFunction<T>
    ): Promise<ApiData<T>[]> {
      const dataList: ApiData<T>[] = [];
      params.pageToken = undefined;
      do {
        const res = await apiFunction(params);
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

    private async getDataFromIdList<
      T extends Extract<ApiType, "Video" | "Channel">
    >(idList: Id<T>[], params: ApiParameter<T>, apiFunction: ApiFunction<T>) {
      const youtubeApiData = await Promise.all(
        getChunkFromArray(idList, 50).map((idList50) => {
          params.id = idList50;
          return this.getData<T>(params, apiFunction);
        })
      );
      return youtubeApiData.flat();
    }

    async getVideos(
      videoIdList: VideoId[],
      part: (keyof VideoApiData)[] = [
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
        auth: this.apiKey,
        part: part,
        maxResults: 50,
      };
      return this.getDataFromIdList<"Video">(
        videoIdList,
        params,
        (p: VideoApiParameter) => youtube.videos.list(p)
      );
    }

    async getChannels(
      channelIdList: ChannelId[],
      part: (keyof ChannelApiData)[] = [
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
      const params: ChannelApiParameter = {
        auth: this.apiKey,
        part: part,
        maxResults: 50,
      };
      return this.getDataFromIdList<"Channel">(
        channelIdList,
        params,
        (p: ChannelApiParameter) => youtube.channels.list(p)
      );
    }

    async getPlaylistItems(
      playlistId: PlaylistId,
      part: (keyof PlaylistItemApiData)[] = [
        "snippet",
        "contentDetails",
        "id",
        "status",
      ]
    ) {
      const params: PlaylistItemApiParameter = {
        auth: this.apiKey,
        part: part,
        playlistId: playlistId,
        maxResults: 50,
      };
      return this.getData<"PlaylistItem">(
        params,
        (p: PlaylistItemApiParameter) => youtube.playlistItems.list(p)
      );
    }

    async getPlaylists(
      channelId: ChannelId,
      part: (keyof PlaylistApiData)[] = [
        "snippet",
        "contentDetails",
        "id",
        "status",
        "player",
        "localizations",
      ]
    ) {
      const params: PlaylistApiParameter = {
        auth: this.apiKey,
        part: part,
        channelId: channelId,
        maxResults: 50,
      };
      return this.getData<"Playlist">(params, (params: PlaylistApiParameter) =>
        youtube.playlists.list(params)
      );
    }
  }
}
