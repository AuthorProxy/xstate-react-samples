import {
  VideoState,
  simpleVideoPlayerMachine,
} from "@/machines/simpleVideoPlayerMachine";
import styles from "@/styles/Home.module.css";
import { useMachine } from "@xstate/react";
import { FC, useCallback, useEffect, useRef } from "react";

export const SimpleVideoPlayer: FC<{ title: string }> = ({ title }) => {
  const [state, send] = useMachine(simpleVideoPlayerMachine);

  const videoRef = useRef<HTMLVideoElement>(null);

  const escKeyHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        send("key.escape");
      }
    },
    [send]
  );

  useEffect(() => {
    window.addEventListener("keydown", escKeyHandler);
    return () => {
      window.removeEventListener("keydown", escKeyHandler);
    };
  }, [escKeyHandler]);

  useEffect(() => {
    if (state.context.videoState === VideoState.VideoPlaying) {
      videoRef.current?.play();
    } else if (state.context.videoState === VideoState.VideoOnPause) {
      videoRef.current?.pause();
    } else if (state.context.videoState === VideoState.VideoStopped) {
      videoRef.current?.load();
    }
  }, [state.context.videoState]);

  return (
    <div className={styles.card}>
      <h5 className={styles.h5}>{title}</h5>
      <br />
      <pre className={styles.dumpJs}>{JSON.stringify(state.value)}</pre>
      <pre className={styles.dumpJs}>{JSON.stringify(state.context)}</pre>
      <div
        className={
          state.context.videoState === VideoState.VideoStopped
            ? styles.miniPlayer
            : styles.fullPlayer
        }
      >
        <video
          ref={videoRef}
          onClick={() => {
            if (state.context.videoState === VideoState.VideoStopped) {
              send("toggle");
            } else {
              state.context.videoState === VideoState.VideoPlaying
                ? send("pause")
                : send("play");
            }
          }}
          onEnded={() => {
            send("video.ended");
          }}
        >
          <source
            type="video/mp4"
            src="https://www.w3schools.com/html/mov_bbb.mp4"
          />
        </video>

        {state.context.videoState === VideoState.VideoStopped && (
          <button
            onClick={() => {
              send("toggle");
            }}
          >
            Start Playing
          </button>
        )}

        {state.context.videoState === VideoState.VideoOnPause && (
          <button
            onClick={() => {
              send("play");
            }}
          >
            Continue
          </button>
        )}

        {state.context.videoState === VideoState.VideoPlaying && (
          <button
            onClick={() => {
              send("pause");
            }}
          >
            Pause
          </button>
        )}

        {(state.context.videoState === VideoState.VideoOnPause ||
          state.context.videoState === VideoState.VideoPlaying) && (
          <button
            onClick={() => {
              send("toggle");
            }}
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};
