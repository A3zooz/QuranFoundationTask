import { Pause, Play, VolumeX, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState } from "react";

interface AudioPlayerProps {
    audioUrl: string;
    onEnded?: () => void;
    autoPlay?: boolean;
}

export const AudioPlayer = ({
    audioUrl,
    onEnded,
    autoPlay = false,
}: AudioPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleEnded = () => {
        setIsMuted(false);
        onEnded?.();
    };
    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
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
                onClick={togglePlay}
                className="hover:bg-blue-50"
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
                onClick={toggleMute}
                className="hover:bg-blue-50"
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
