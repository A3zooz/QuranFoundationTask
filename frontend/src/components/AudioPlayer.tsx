import { Pause, Play, VolumeX, Volume2, SkipBack } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
    audioUrl: string;
    onEnded?: () => void;
    next?: () => void;
    previous?: () => void;
    autoPlay?: boolean;
}

export const AudioPlayer = ({
    audioUrl,
    onEnded,
    next,
    previous,
    autoPlay = false,
}: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Handle autoPlay when component mounts or audioUrl changes
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
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
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
