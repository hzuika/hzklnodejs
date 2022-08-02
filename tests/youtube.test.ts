import { Youtube } from "../src/youtube";
describe("Test Youtube", () => {
  it("Channel ID", () => {
    expect(Youtube.ChannelId.new("UCeQ9P1k0dIDIeB4Rs_gPdLQ")).toBe(
      "UCeQ9P1k0dIDIeB4Rs_gPdLQ"
    );

    expect(() => {
      Youtube.ChannelId.new("UCeQ9P1k0dIDIeB4Rs_gPdL");
    }).toThrow();
    expect(() => {
      Youtube.ChannelId.new("UAeQ9P1k0dIDIeB4Rs_gPdLQ");
    }).toThrow();

    expect(
      Youtube.ChannelId.toPlaylistId(
        Youtube.ChannelId.new("UCeQ9P1k0dIDIeB4Rs_gPdLQ")
      )
    ).toBe("UUeQ9P1k0dIDIeB4Rs_gPdLQ");
  });
  it("Video ID", () => {
    expect(Youtube.VideoId.new("cTHzajpJD0Y")).toBe("cTHzajpJD0Y");
    expect(() => {
      Youtube.VideoId.new("cTHzajpJD0");
    }).toThrow();
    expect(Youtube.VideoId.toUrl(Youtube.VideoId.new("cTHzajpJD0Y")));
  });
});
