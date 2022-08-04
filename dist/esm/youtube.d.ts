import { youtube_v3 } from "googleapis";
import { Opaque } from "type-fest";
export declare namespace Youtube {
    type VideoId = Opaque<string, "VideoId">;
    const VideoId: {
        urlPrefix: string;
        shortUrlPrefix: string;
        new: (id: string) => VideoId;
        validate: (id: string) => id is VideoId;
        toUrl: (id: VideoId) => string;
        toShortUrl: (id: VideoId) => string;
        toThumbnail: (id: VideoId) => string;
    };
    type ChannelId = Opaque<string, "ChannelId">;
    const ChannelId: {
        urlPrefix: string;
        new: (id: string) => ChannelId;
        validate: (id: string) => id is ChannelId;
        toUrl: (id: ChannelId) => string;
        toPlaylistId: (id: ChannelId) => UploadPlaylistId;
        searchFromText(text: string): ChannelId[];
    };
    type UploadPlaylistId = Opaque<string, "UploadPlaylistId">;
    const UploadPlaylistId: {
        new: (id: string) => UploadPlaylistId;
        validate: (id: string) => id is UploadPlaylistId;
        toChannelId: (id: UploadPlaylistId) => ChannelId;
    };
    type RegularPlaylistId = Opaque<string, "RegularPlaylistId">;
    const RegularPlaylistId: {
        urlPrefix: string;
        new: (id: string) => RegularPlaylistId;
        validate: (id: string) => id is RegularPlaylistId;
    };
    type PlaylistId = UploadPlaylistId | RegularPlaylistId;
    const PlaylistId: {
        urlPrefix: string;
        toUrl: (id: PlaylistId) => string;
    };
    type VideoApiData = youtube_v3.Schema$Video;
    type ChannelApiData = youtube_v3.Schema$Channel;
    type PlaylistApiData = youtube_v3.Schema$Playlist;
    type PlaylistItemApiData = youtube_v3.Schema$PlaylistItem;
    const VideoApiData: {
        getId: (data: VideoApiData) => string | null | undefined;
    };
    const ChannelApiData: {
        getId: (data: ChannelApiData) => string | null | undefined;
    };
    const PlaylistApiData: {
        getId: (data: PlaylistApiData) => string | null | undefined;
    };
    const PlaylistItemApiData: {
        getId: (data: PlaylistItemApiData) => string | null | undefined;
    };
    class Api {
        private readonly apiKey;
        constructor(apiKey: string);
        private getData;
        private getDataFromIdList;
        getVideos(videoIdList: VideoId[], part?: (keyof VideoApiData)[]): Promise<youtube_v3.Schema$Video[]>;
        getChannels(channelIdList: ChannelId[], part?: (keyof ChannelApiData)[]): Promise<youtube_v3.Schema$Channel[]>;
        getPlaylistItems(playlistId: PlaylistId, part?: (keyof PlaylistItemApiData)[]): Promise<youtube_v3.Schema$PlaylistItem[]>;
        getPlaylists(channelId: ChannelId, part?: (keyof PlaylistApiData)[]): Promise<youtube_v3.Schema$Playlist[]>;
        getCommentThreads(videoId: VideoId, part?: string[]): Promise<youtube_v3.Schema$Video[]>;
    }
}
//# sourceMappingURL=youtube.d.ts.map