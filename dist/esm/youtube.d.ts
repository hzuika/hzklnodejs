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
    class Api {
        private readonly apiKey;
        constructor(apiKey: string);
    }
}
//# sourceMappingURL=youtube.d.ts.map