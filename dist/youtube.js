"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Youtube = void 0;
const _1 = require(".");
var Youtube;
(function (Youtube) {
    Youtube.VideoId = {
        urlPrefix: "https://www.youtube.com/watch?v=",
        shortUrlPrefix: "https://youtu.be/",
        new: (id) => {
            if (!Youtube.VideoId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.length === 11;
        },
        toUrl: (id) => {
            return `${Youtube.VideoId.urlPrefix}${id}`;
        },
        toShortUrl: (id) => {
            return `${Youtube.VideoId.shortUrlPrefix}${id}`;
        },
        toThumbnail: (id) => {
            return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        },
    };
    Youtube.ChannelId = {
        urlPrefix: "https://www.youtube.com/channel/",
        new: (id) => {
            if (!Youtube.ChannelId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.substring(0, 2) === "UC" && id.length === 24;
        },
        toUrl: (id) => {
            return `${Youtube.ChannelId.urlPrefix}${id}`;
        },
        toPlaylistId: (id) => {
            return Youtube.UploadPlaylistId.new((0, _1.replaceString)(id, 1, "U"));
        },
    };
    Youtube.UploadPlaylistId = {
        new: (id) => {
            if (!Youtube.UploadPlaylistId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.substring(0, 2) === "UU" && id.length === 24;
        },
        toChannelId: (id) => {
            return Youtube.ChannelId.new((0, _1.replaceString)(id, 1, "C"));
        },
    };
    Youtube.RegularPlaylistId = {
        urlPrefix: "https://www.youtube.com/playlist?list=",
        new: (id) => {
            if (!Youtube.RegularPlaylistId.validate(id)) {
                throw new Error(`${id} is not valid.`);
            }
            return id;
        },
        validate: (id) => {
            return id.substring(0, 2) === "PL" && id.length === 34;
        },
    };
    Youtube.PlaylistId = {
        urlPrefix: "https://www.youtube.com/playlist?list=",
        toUrl: (id) => {
            return `${Youtube.PlaylistId.urlPrefix}${id}`;
        },
    };
    class Api {
        apiKey;
        constructor(apiKey) {
            this.apiKey = apiKey;
        }
    }
    Youtube.Api = Api;
})(Youtube = exports.Youtube || (exports.Youtube = {}));
