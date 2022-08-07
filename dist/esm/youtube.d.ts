import { youtube_v3 } from "@googleapis/youtube";
import { GaxiosPromise } from "gaxios";
import { Opaque } from "type-fest";
export declare namespace Youtube {
    export type VideoId = Opaque<string, "VideoId">;
    export const VideoId: {
        urlPrefix: string;
        shortUrlPrefix: string;
        validLength: number;
        new: (id: string) => VideoId;
        validate: (id: string) => id is VideoId;
        toUrl: (id: VideoId) => string;
        toShortUrl: (id: VideoId) => string;
        toThumbnail: (id: VideoId) => string;
    };
    export type ChannelId = Opaque<string, "ChannelId">;
    export const ChannelId: {
        urlPrefix: string;
        validLength: number;
        new: (id: string) => ChannelId;
        validate: (id: string) => id is ChannelId;
        toUrl: (id: ChannelId) => string;
        toPlaylistId: (id: ChannelId) => UploadPlaylistId;
        searchFromText(text: string): ChannelId[];
    };
    export type UploadPlaylistId = Opaque<string, "UploadPlaylistId">;
    export const UploadPlaylistId: {
        validLength: number;
        new: (id: string) => UploadPlaylistId;
        validate: (id: string) => id is UploadPlaylistId;
        toChannelId: (id: UploadPlaylistId) => ChannelId;
    };
    export type PlaylistItemId = Opaque<string, "PlaylistItemId">;
    export const PlaylistItemId: {
        validLength: number;
    };
    export type RegularPlaylistId = Opaque<string, "RegularPlaylistId">;
    export const RegularPlaylistId: {
        validLength: number;
        new: (id: string) => RegularPlaylistId;
        validate: (id: string) => id is RegularPlaylistId;
    };
    export type PlaylistId = UploadPlaylistId | RegularPlaylistId;
    export const PlaylistId: {
        urlPrefix: string;
        new: (id: string) => PlaylistId;
        toUrl: (id: PlaylistId) => string;
    };
    export type VideoApiData = youtube_v3.Schema$Video;
    export type ChannelApiData = youtube_v3.Schema$Channel;
    export type PlaylistApiData = youtube_v3.Schema$Playlist;
    export type PlaylistItemApiData = youtube_v3.Schema$PlaylistItem;
    export type ApiType = "Video" | "Channel" | "Playlist" | "PlaylistItem";
    type ApiData<T extends ApiType> = T extends "Video" ? VideoApiData : T extends "Channel" ? ChannelApiData : T extends "Playlist" ? PlaylistApiData : T extends "PlaylistItem" ? PlaylistItemApiData : unknown;
    type ApiDataExtractFunction<T extends ApiType, U = string> = (data: ApiData<T>) => U | null | undefined;
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
    };
    type VideoApiParameter = youtube_v3.Params$Resource$Videos$List;
    type ChannelApiParameter = youtube_v3.Params$Resource$Channels$List;
    type PlaylistApiParameter = youtube_v3.Params$Resource$Playlists$List;
    type PlaylistItemApiParameter = youtube_v3.Params$Resource$Playlistitems$List;
    type ApiParameter<T extends ApiType> = T extends "Video" ? VideoApiParameter : T extends "Channel" ? ChannelApiParameter : T extends "Playlist" ? PlaylistApiParameter : T extends "PlaylistItem" ? PlaylistItemApiParameter : unknown;
    type VideoApiResponse = youtube_v3.Schema$VideoListResponse;
    type ChannelApiResponse = youtube_v3.Schema$ChannelListResponse;
    type PlaylistApiResponse = youtube_v3.Schema$PlaylistListResponse;
    type PlaylistItemApiResponse = youtube_v3.Schema$PlaylistItemListResponse;
    type ApiResponse<T extends ApiType> = T extends "Video" ? VideoApiResponse : T extends "Channel" ? ChannelApiResponse : T extends "Playlist" ? PlaylistApiResponse : T extends "PlaylistItem" ? PlaylistItemApiResponse : unknown;
    const ApiResponse: {
        getDataList: <T extends ApiType>(response: ApiResponse<T>) => ApiData<T>[];
    };
    type ApiFunction<T extends ApiType> = (params: ApiParameter<T>) => GaxiosPromise<ApiResponse<T>>;
    export class Api {
        #private;
        constructor(apiKey: string);
        getPlaylistItemResponseAsyncGenerator(playlistId: PlaylistId): AsyncGenerator<youtube_v3.Schema$PlaylistItemListResponse, void, unknown>;
        getPlaylistResponseAsyncGenerator(channelId: ChannelId): AsyncGenerator<youtube_v3.Schema$PlaylistListResponse, void, unknown>;
        getPlaylistItemListAsyncGenerator(playlistId: PlaylistId, part?: (keyof PlaylistItemApiData)[]): AsyncGenerator<youtube_v3.Schema$PlaylistItem[], void, unknown>;
        getPlaylistListAsyncGenerator(channelId: ChannelId, part?: (keyof PlaylistApiData)[]): AsyncGenerator<youtube_v3.Schema$Playlist[], void, unknown>;
        getVideoListAsyncGeneratorList(videoIdList: VideoId[], part?: (keyof VideoApiData)[]): AsyncGenerator<youtube_v3.Schema$Video[], void, unknown>[];
        getChannelListAsyncGeneratorList(channelIdList: ChannelId[], part?: (keyof ChannelApiData)[]): AsyncGenerator<youtube_v3.Schema$Channel[], void, unknown>[];
        processPlaylistItemList(playlistId: PlaylistId, callback: (dataList: PlaylistItemApiData[]) => void, part?: (keyof PlaylistItemApiData)[]): Promise<void>;
        processPlaylistList(channelId: ChannelId, callback: (dataList: PlaylistApiData[]) => void, part?: (keyof PlaylistApiData)[]): Promise<void>;
        processVideoList(videoIdList: VideoId[], callback: (dataList: VideoApiData[]) => void, part?: (keyof VideoApiData)[]): Promise<void[]>;
        processChannelList(channelIdList: ChannelId[], callback: (dataList: ChannelApiData[]) => void, part?: (keyof ChannelApiData)[]): Promise<void[]>;
    }
    export {};
}
//# sourceMappingURL=youtube.d.ts.map