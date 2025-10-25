import { Pause, Play, VolumeX, Volume2, SkipBack } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
    audioUrl: string;
    onEnded?: () => void;
    next?: () => void;
    previous?: () => void;
    autoPlay?: boolean;
    isMuted?: boolean;
    onMuteChange?: (muted: boolean) => void;
}

export const AudioPlayer = ({
    audioUrl,
    onEnded,
    next,
    previous,
    autoPlay = false,
    isMuted = false,
    onMuteChange,
}: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (autoPlay && audioRef.current) {
            audioRef.current
                .play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((error) => {
                    console.error("Auto-play failed:", error);
                    setIsPlaying(false);
                });
        }
    }, [audioUrl, autoPlay]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted, audioUrl]);

    const handleEnded = () => {
        setIsPlaying(false);
        onEnded?.();
    };

    const handleNext = () => {
        next?.();
    };
    const handlePrevious = () => {
        previous?.();
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((error) => {
                    console.error("Play failed:", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        onMuteChange?.(!isMuted);
    };
    return (
        <div className="flex items-center gap-2">
            <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleEnded}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={handlePrevious}
                className="hover:bg-blue-100"
            >
                <SkipBack className="text-blue-600 " size={18} />
            </Button>
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={togglePlay}
                className="hover:bg-blue-100"
            >
                {isPlaying ? (
                    <Pause className="text-blue-600" size={18} />
                ) : (
                    <Play className="text-blue-600" size={18} />
                )}
            </Button>
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleNext}
                className="hover:bg-blue-100"
            >
                <SkipBack className="rotate-180 text-blue-600" size={18} />
            </Button>
            <Button
                variant="ghost"
                size="icon-sm"
                onClick={toggleMute}
                className="hover:bg-blue-100"
            >
                {isMuted ? (
                    <VolumeX className="text-gray-500" size={18} />
                ) : (
                    <Volume2 className="text-blue-600" size={18} />
                )}
            </Button>
        </div>
    );
};
