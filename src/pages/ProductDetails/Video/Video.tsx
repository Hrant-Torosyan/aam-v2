import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import styles from "./Video.module.scss";
import { Project } from "src/types/types";
import play from "src/images/svg/play.svg";
import pause from "src/images/svg/pause.svg";

declare module "src/types/types" {
    interface Project {
        mediaVideo?: {
            url?: {
                url?: string;
            };
            name?: string;
        };
    }
}

interface VideoProps {
    mainData: Project;
}

const Video: React.FC<VideoProps> = ({ mainData }) => {
    const videoUrl = mainData?.mediaVideo?.url?.url;
    const videoName = mainData?.mediaVideo?.name;
    const playerRef = useRef<ReactPlayer>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isSeekingRef = useRef(false);
    const wasPlayingBeforeSeekRef = useRef(false);
    const videoWrapperRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [isPauseIcon, setIsPauseIcon] = useState(false);

    useEffect(() => {
        const preventScroll = (e: KeyboardEvent) => {
            if (e.key === " " && e.target === document.body) {
                e.preventDefault();
            }
        };

        window.addEventListener("keydown", preventScroll);
        return () => window.removeEventListener("keydown", preventScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                handlePlayPause();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isPlaying]);

    useEffect(() => {
        setShowButton(true);
        setIsPlaying(false);
        setIsPauseIcon(false);
    }, [videoUrl]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const wrapper = videoWrapperRef.current;
        if (!wrapper) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (isSeekingRef.current) return;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (isSeekingRef.current) return;
            e.preventDefault();
            handlePlayPause();
        };

        wrapper.addEventListener('touchstart', handleTouchStart);
        wrapper.addEventListener('touchend', handleTouchEnd);

        return () => {
            wrapper.removeEventListener('touchstart', handleTouchStart);
            wrapper.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isPlaying]);

    const showButtonTemporarily = () => {
        setShowButton(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setShowButton(false);
        }, 700);
    };

    const handlePlayPause = () => {
        const newPlayingState = !isPlaying;
        setIsPlaying(newPlayingState);
        setIsPauseIcon(!newPlayingState);
        showButtonTemporarily();
        isSeekingRef.current = false;
        wasPlayingBeforeSeekRef.current = false;
    };

    const handleVideoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isSeekingRef.current) {
            handlePlayPause();
        }
    };

    const handleSeekStart = () => {
        isSeekingRef.current = true;
        wasPlayingBeforeSeekRef.current = isPlaying;
        setIsPlaying(false);
        setIsPauseIcon(true);
    };

    const handleSeekEnd = () => {
        setTimeout(() => {
            isSeekingRef.current = false;
            setIsPlaying(wasPlayingBeforeSeekRef.current);
            setIsPauseIcon(!wasPlayingBeforeSeekRef.current);
            showButtonTemporarily();
        }, 50);
    };

    const handleProgress = () => {
        if (isSeekingRef.current) {
            setIsPauseIcon(true);
        }
    };

    if (!videoUrl) return null;

    return (
        <div className={styles.video}>
            <div
                ref={videoWrapperRef}
                className={styles.videoWrapper}
                onClick={handleVideoClick}
            >
                <ReactPlayer
                    ref={playerRef}
                    url={videoUrl}
                    playing={isPlaying}
                    controls={true}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    onSeekMouseDown={handleSeekStart}
                    onSeekMouseUp={handleSeekEnd}
                    onProgress={handleProgress}
                    className={styles.reactPlayer}
                    config={{
                        file: {
                            attributes: {
                                controlsList: 'nodownload',
                                disablePictureInPicture: true,
                                disableRemotePlayback: true
                            }
                        }
                    }}
                />

                {showButton && (
                    <button
                        className={styles.playButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause();
                        }}
                    >
                        <img
                            className={styles.playIcon}
                            src={isPauseIcon ? pause : play}
                            alt={isPauseIcon ? "pause" : "play"}
                        />
                    </button>
                )}

                <p className={styles.videoName}>{videoName}</p>
            </div>
        </div>
    );
};

export default Video;