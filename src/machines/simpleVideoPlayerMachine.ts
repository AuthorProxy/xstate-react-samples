import { assign, createMachine } from "xstate";

export const VideoState = {
  VideoStopped: "Stopped",
  VideoOnPause: "Paused",
  VideoPlaying: "Playing",
};

export const simpleVideoPlayerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgFsBLAOyIGIAXAeyilTAG0AGAXURWtiMqOpI4gAHogC0ATgAseAKySATAEYA7AGZl45vIBsiydoA0ITIgAcivPPHXxp3fMnNVUgL4ujaLLjwAzAK6oqFS09ExsgshcPHwCSMKIijKmeLYymtrM4jrK+pJGJgjmlja29o7Oqm4eGNj4-oHkANZgmHhwAMboyGHscZHcvPyCIgh6eAqqkpLKmapps8r5CTLyslba2qaq8vLKuzLaVSCetb4BQQBuRBBg1G0kNxAsvZwDMcOIzEsIzEcn3vVUHgTqQoORkOg-LAehEooNYqARrtpKZTJpTDJFIpxGpxN9JGk8IlVMwkmj5MwFOI-jUAedgZDoRBwTVnrC3kM4iNREVJps1ApMg5vittHhmMptJJbKpTMxmOZKkcSNQbvA+rScOzopzEWIVMo8HzTAKKVk8sYxCbxeJ1NL1HYlNp5DSvPhiGRtfCPggFN8igt7cpHYopa7ToCve8ufqrEb9CbJmbhZaEPIZIaHFtlIotjIMxnlOG6YFgTVQVHdfEELK8NoZKpFDoM5pJd9nMwjXMTRTMloG0X3MdNWdSxCoZBKwjq7X643mxoJYZUysUesdlkSc7Dm4XEA */
    id: "player",
    initial: "mini",

    context: {
      videoState: VideoState.VideoStopped,
    },

    states: {
      mini: {
        meta: "The video is just a small image; not playing",

        on: {
          toggle: "full",
        },
      },

      full: {
        meta: "The full-screen video",
        exit: "stopVideo",

        on: {
          toggle: "mini",
          "key.escape": "mini",
          "video.ended": "mini",
        },

        states: {
          playing: {
            on: {
              pause: "paused",
            },

            entry: "playVideo",
          },
          paused: {
            on: {
              play: "playing",
            },

            entry: "pauseVideo",
          },
        },

        initial: "playing",
      },
    },

    tsTypes: {} as import("./simpleVideoPlayerMachine.typegen").Typegen0,
    schema: {
      context: {} as { videoState: string },
      actions: {} as
        | { type: "toggle" }
        | { type: "key.escape" }
        | { type: "video.ended" }
        | { type: "pause" }
        | { type: "play" },
    },
  },
  {
    actions: {
      playVideo: assign(() => {
        return {
          videoState: VideoState.VideoPlaying,
        };
      }),
      pauseVideo: assign(() => {
        return {
          videoState: VideoState.VideoOnPause,
        };
      }),
      stopVideo: assign(() => {
        return {
          videoState: VideoState.VideoStopped,
        };
      }),
    },
  }
);
