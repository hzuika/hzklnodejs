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

    new: (id: string): VideoId => {
      if (!VideoId.validate(id)) {
        throw new Error(`${id} is not valid.`);
      }
      return id as VideoId;
    },

    validate: (id: string): id is VideoId => {
      return id.length === 11;
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

    new: (id: string): ChannelId => {
      if (!ChannelId.validate(id)) {
        throw new Error(`${id} is not valid.`);
      }
      return id as ChannelId;
    },

    validate: (id: string): id is ChannelId => {
      return id.substring(0, 2) === "UC" && id.length === 24;
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
    new: (id: string): UploadPlaylistId => {
      if (!UploadPlaylistId.validate(id)) {
        throw new Error(`${id} is not valid.`);
      }
      return id as UploadPlaylistId;
    },

    validate: (id: string): id is UploadPlaylistId => {
      return id.substring(0, 2) === "UU" && id.length === 24;
    },

    toChannelId: (id: UploadPlaylistId): ChannelId => {
      return ChannelId.new(replaceString(id, 1, "C"));
    },
  };

  export type RegularPlaylistId = Opaque<string, "RegularPlaylistId">;
  export const RegularPlaylistId = {
    urlPrefix: "https://www.youtube.com/playlist?list=",
    new: (id: string): RegularPlaylistId => {
      if (!RegularPlaylistId.validate(id)) {
        throw new Error(`${id} is not valid.`);
      }
      return id as RegularPlaylistId;
    },

    validate: (id: string): id is RegularPlaylistId => {
      return id.substring(0, 2) === "PL" && id.length === 34;
    },
  };

  export type PlaylistId = UploadPlaylistId | RegularPlaylistId;
  export const PlaylistId = {
    urlPrefix: "https://www.youtube.com/playlist?list=",
    toUrl: (id: PlaylistId): string => {
      return `${PlaylistId.urlPrefix}${id}`;
    },
  };

  type VideoApiData = youtube_v3.Schema$Video;

  type ChannelApiData = youtube_v3.Schema$Channel;

  type PlaylistApiData = youtube_v3.Schema$Playlist;

  type PlaylistItemApiData = youtube_v3.Schema$PlaylistItem;

  type ApiData =
    | VideoApiData
    | ChannelApiData
    | PlaylistApiData
    | PlaylistItemApiData;

  type VideoApiParameter = youtube_v3.Params$Resource$Videos$List;
  type ChannelApiParameter = youtube_v3.Params$Resource$Channels$List;
  type PlaylistApiParameter = youtube_v3.Params$Resource$Playlists$List;
  type PlaylistItemApiParameter = youtube_v3.Params$Resource$Playlistitems$List;
  type CommentThreadApiParameter =
    youtube_v3.Params$Resource$Commentthreads$List;

  type ApiParametar =
    | VideoApiParameter
    | ChannelApiParameter
    | PlaylistApiParameter
    | PlaylistItemApiParameter
    | CommentThreadApiParameter;

  type VideoApiResponse = youtube_v3.Schema$VideoListResponse;
  type ChannelApiResponse = youtube_v3.Schema$ChannelListResponse;
  type PlaylistApiResponse = youtube_v3.Schema$PlaylistListResponse;
  type PlaylistItemApiResponse = youtube_v3.Schema$PlaylistItemListResponse;
  type CommentThreadApiResponse = youtube_v3.Schema$CommentThreadListResponse;

  type ApiResponse =
    | VideoApiResponse
    | ChannelApiResponse
    | PlaylistApiResponse
    | PlaylistItemApiResponse
    | CommentThreadApiResponse;

  export class Api {
    private readonly apiKey: string;
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }

    private async getData(
      params: ApiParametar,
      apiFunction: (p: ApiParametar) => GaxiosPromise<ApiResponse>
    ) {
      const dataList: ApiData[] = [];
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

    private async getDataFromIdList(
      idList: (VideoId | ChannelId | PlaylistId)[],
      params: ApiParametar,
      apiFunction: (p: ApiParametar) => GaxiosPromise<ApiResponse>
    ) {
      const youtubeApiData = await Promise.all(
        getChunkFromArray(idList, 50).map((idList50) => {
          params.id = idList50;
          return this.getData(params, apiFunction);
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
      return this.getDataFromIdList(
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
      return this.getDataFromIdList(
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
      return this.getData(params, (p: PlaylistItemApiParameter) =>
        youtube.playlistItems.list(p)
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
      return this.getData(params, (params: PlaylistApiParameter) =>
        youtube.playlists.list(params)
      );
    }

    async getCommentThreads(
      videoId: VideoId,
      part = ["id", "snippet", "replies"]
    ) {
      const params: CommentThreadApiParameter = {
        auth: this.apiKey,
        part: part,
        videoId: videoId,
        maxResults: 100,
      };
      return this.getData(params, (p: CommentThreadApiParameter) =>
        youtube.commentThreads.list(p)
      );
    }
  }
}
