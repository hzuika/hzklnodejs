import { youtube_v3 } from "googleapis";
import { Opaque } from "type-fest";
export declare namespace Youtube {
    export type VideoId = Opaque<string, "VideoId">;
    export const VideoId: {
        urlPrefix: string;
        shortUrlPrefix: string;
        new: (id: string) => VideoId;
        validate: (id: string) => id is VideoId;
        toUrl: (id: VideoId) => string;
        toShortUrl: (id: VideoId) => string;
        toThumbnail: (id: VideoId) => string;
    };
    export type ChannelId = Opaque<string, "ChannelId">;
    export const ChannelId: {
        urlPrefix: string;
        new: (id: string) => ChannelId;
        validate: (id: string) => id is ChannelId;
        toUrl: (id: ChannelId) => string;
        toPlaylistId: (id: ChannelId) => UploadPlaylistId;
    };
    export type UploadPlaylistId = Opaque<string, "UploadPlaylistId">;
    export const UploadPlaylistId: {
        new: (id: string) => UploadPlaylistId;
        validate: (id: string) => id is UploadPlaylistId;
        toChannelId: (id: UploadPlaylistId) => ChannelId;
    };
    export type RegularPlaylistId = Opaque<string, "RegularPlaylistId">;
    export const RegularPlaylistId: {
        urlPrefix: string;
        new: (id: string) => RegularPlaylistId;
        validate: (id: string) => id is RegularPlaylistId;
    };
    export type PlaylistId = UploadPlaylistId | RegularPlaylistId;
    export const PlaylistId: {
        urlPrefix: string;
        toUrl: (id: PlaylistId) => string;
    };
    type VideoApiData = youtube_v3.Schema$Video;
    type ChannelApiData = youtube_v3.Schema$Channel;
    type PlaylistApiData = youtube_v3.Schema$Playlist;
    type PlaylistItemApiData = youtube_v3.Schema$PlaylistItem;
    type ApiData = VideoApiData | ChannelApiData | PlaylistApiData | PlaylistItemApiData;
    export class Api {
        private readonly apiKey;
        constructor(apiKey: string);
        private getData;
        private getDataFromIdList;
        getVideos(videoIdList: VideoId[], part?: (keyof VideoApiData)[]): Promise<ApiData[]>;
        getChannels(channelIdList: ChannelId[], part?: (keyof ChannelApiData)[]): Promise<ApiData[]>;
        getPlaylistItems(playlistId: PlaylistId, part?: (keyof PlaylistItemApiData)[]): Promise<ApiData[]>;
        getPlaylists(channelId: ChannelId, part?: (keyof PlaylistApiData)[]): Promise<ApiData[]>;
        getCommentThreads(videoId: VideoId, part?: string[]): Promise<ApiData[]>;
    }
    export {};
}
//# sourceMappingURL=youtube.d.ts.map