import { Opaque } from "type-fest";
export namespace Youtube {
  type VideoId = Opaque<string, "VideoId">;
  const VideoId = {
    new: (id: string): VideoId => {
      return id as VideoId;
    },

    validate: (id: string): boolean => {
      return id.length === 11;
    },
  };
  type ChannelId = Opaque<string, "ChannelId">;
  type UploadPlaylistId = Opaque<string, "UploadPlaylistId">;
  type RegularPlaylistId = Opaque<string, "RegularPlaylistId">;
  export class Api {
    private readonly apiKey: string;
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  }
}
