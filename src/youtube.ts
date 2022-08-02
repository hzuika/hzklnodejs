import { Opaque } from "type-fest";
import { replaceString } from ".";
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

  export class Api {
    private readonly apiKey: string;
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  }
}
