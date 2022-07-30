import { Youtube } from "../src";

describe("Test Youtube", () => {
    it("Channel ID to Playlist ID", () => {
        expect(Youtube.getUploadPlaylistIdFromChannelId("UCeQ9P1k0dIDIeB4Rs_gPdLQ")).toBe("UUeQ9P1k0dIDIeB4Rs_gPdLQ");
    })
});