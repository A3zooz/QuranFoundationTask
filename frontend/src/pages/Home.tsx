import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import axios from "@/lib/axios";
import { BookOpen, Heart, Info, Loader2, LogOut, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AudioPlayer } from "@/components/AudioPlayer";
import PAGES_MAP from "@/shared/pages-map";

interface Surah {
    nameArabic: string;
    id: string;
    nameSimple: string;
    revelationPlace: string;
    versesCount: number;
}


const Home = () => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/surah`;
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [listeningSurah, setListeningSurah] = useState<string | null>(null);
    const [loadingSurah, setLoadingSurah] = useState<string | null>(null);
    const [verseIndex, setVerseIndex] = useState<number>(0);
    const [audioLoading, setAudioLoading] = useState(false);
    const [surahAudioUrls, setSurahAudioUrls] = useState<
        Record<string, string[]>
    >({});
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const getSurahs = async () => {
        try {
            const response = await axios.get(`${apiUrl}/surahs`);
            setSurahs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (surahNumber: string) => {
        if (favorites.has(surahNumber)) {
            try {
                await axios.delete(`${apiUrl}/favorite`, {
                    data: {
                        surahNumber: surahNumber,
                    },
                });
                await getFavorites();
            } catch (error) {
                console.error("Error removing favorite", error);
            }
        } else {
            try {
                await axios.post(`${apiUrl}/favorite`, {
                    surahNumber: surahNumber,
                });
                await getFavorites();
            } catch (error) {
                console.error("Error favoriting", error);
            }
        }
    };

    const getFavorites = async () => {
        try {
            const response = await axios.get(`${apiUrl}/favorites`);
            const favoriteSurahs = response.data.favorites.map(
                (fav: any) => fav.surah
            );
            setFavorites(new Set(favoriteSurahs));
            // console.log(favorites)
        } catch (error) {
            console.error("error fetching favorites", error);
        }
    };

    const loadSurahAudio = async (surahId: string) => {
        if (surahAudioUrls[surahId]) {
            setListeningSurah(surahId);
            setVerseIndex(0);
            return;
        }
        try {
            setAudioLoading(true);
            setLoadingSurah(surahId);
            console.log("Loading audio for surah:", surahId);
            const response = await axios.get(
                `${apiUrl}/surahs/${surahId}/audio`
            );
            console.log("Audio response:", response.data);

            const audioUrls = response.data.map((a: any) => a.audioUrl);
            console.log("Extracted audio URLs:", audioUrls);

            setSurahAudioUrls((prev) => ({
                ...prev,
                [surahId]: audioUrls,
            }));

            // Set listening surah after URLs are loaded
            setListeningSurah(surahId);
            setVerseIndex(0);
        } catch (error) {
            console.error("Loading Media Failed", error);
        } finally {
            setAudioLoading(false);
            setLoadingSurah(null);
        }
    };

    const handleNextVerse = () => {
        if (!listeningSurah) return;
        const urls = surahAudioUrls[listeningSurah];
        if (verseIndex < urls.length - 1) {
            setVerseIndex(verseIndex + 1);
        } else {
            setListeningSurah(null);
            setVerseIndex(0);
        }
    };

    const handlePreviousVerse = () => {
        if (!listeningSurah) return;
        if (verseIndex > 0) {
            setVerseIndex(verseIndex - 1);
        }
    };

    const handleVerseEnded = () => {
        handleNextVerse();
    };

    useEffect(() => {
        getSurahs();
        getFavorites();
        console.log(favorites);
    }, []);
    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-emerald-100 via-white to-blue-100 p-8">
                <div className="container mx-auto">
                    <div className="animate-pulse space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-32 bg-gray-200 rounded-xl"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-100 via-white to-blue-100">
            <div className="flex flex-row bg-linear-to-r from-emerald-600 to-emerald-700 text-white py-12 px-8 shadow-lg">
                <div className="container mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <BookOpen size={48} />
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                القرآن الكريم
                            </h1>
                            <p className="text-emerald-100 text-lg">
                                The Noble Quran
                            </p>
                        </div>
                    </div>
                    <p className="text-emerald-50 max-w-2xl">
                        Read, listen, and reflect upon the words of Allah. Click
                        on any Surah to begin your journey.
                    </p>
                </div>
                <div>
                    <Button
                        className="bg-white hover:bg-gray-300 text-black"
                        onClick={() => {
                            logout();
                        }}
                    >
                        <LogOut />
                        Logout
                    </Button>
                </div>
            </div>
            <div className="container mx-auto px-4 py-4">
                <div className="mb-4 flex justify-end">
                    <Button
                        variant={showFavoritesOnly ? "default" : "outline"}
                        className={
                            showFavoritesOnly
                                ? "bg-red-500 hover:bg-red-600 border-2"
                                : "transion-all duration-300 border-2 shadow-2xl border-red-400 hover:bg-red-50"
                        }
                        onClick={() => {
                            setShowFavoritesOnly(!showFavoritesOnly);
                        }}
                    >
                        {showFavoritesOnly ? "Show All" : "Show Favorites Only"}
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {surahs
                        .filter(
                            (surah) =>
                                !showFavoritesOnly || favorites.has(surah.id)
                        )
                        .map((surah) => (
                            <Card
                                key={surah.id}
                                className="group hover:shadow-xl transition-all duration-300 border-slate-300 border-2 hover:border-emerald-500 bg-white/70"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-end justify-between gap-4">
                                        <div className="flex items-start justify-between gap-4 w-full">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="shadow-lg rounded-full h-10 w-10 shrink-0 items-center justify-center text-center font-semibold flex bg-emerald-600 text-white">
                                                        {surah.id}
                                                    </div>
                                                    {/* Favorite Button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        className={`ml-auto transition-colors ${
                                                            favorites.has(
                                                                surah.id
                                                            )
                                                                ? "text-red-500 hover:text-red-600"
                                                                : "text-slate-400 hover:text-red-500"
                                                        }`}
                                                        onClick={() => {
                                                            toggleFavorite(
                                                                surah.id
                                                            );
                                                        }}
                                                    >
                                                        <Heart
                                                            size={30}
                                                            fill={
                                                                favorites.has(
                                                                    surah.id
                                                                )
                                                                    ? "currentColor"
                                                                    : "none"
                                                            }
                                                        />
                                                    </Button>
                                                </div>
                                                <CardTitle className="font-arabic text-2xl mb-1 text-slate-800">
                                                    {surah.nameArabic}
                                                </CardTitle>
                                                <CardDescription className="text-base font-medium text-slate-600 ">
                                                    {surah.nameSimple}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                    {surah.revelationPlace && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                {surah.revelationPlace}
                                            </span>
                                            {surah.versesCount && (
                                                <span className="text-xs text-slate-500">
                                                    {surah.versesCount} verses
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Read Button */}
                                        <Button
                                            variant="outline"
                                            className="w-full border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400 group/btn"
                                            onClick={() =>
                                                navigate(`/surah/${PAGES_MAP[surah.id as keyof typeof PAGES_MAP]}`)
                                            }
                                        >
                                            <BookOpen
                                                className="mr-2 group-hover/btn:text-emerald-600"
                                                size={16}
                                            />
                                            <span className="group-hover/btn:text-emerald-700">
                                                Read
                                            </span>
                                        </Button>

                                        {/* Listen Button */}

                                        <Button
                                            variant="outline"
                                            className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-400 group/btn"
                                            onClick={() => {
                                                loadSurahAudio(surah.id);
                                            }}
                                        >
                                            <Play
                                                className="mr-2 group-hover/btn:text-blue-600"
                                                size={16}
                                            />
                                            <span className="group-hover/btn:text-blue-700">
                                                Listen
                                            </span>
                                        </Button>

                                        {/* Tafsir Button */}
                                        <Button
                                            variant="outline"
                                            className="w-full col-span-2 border-purple-200 hover:bg-purple-50 hover:border-purple-400 group/btn"
                                            onClick={() =>
                                                navigate(
                                                    `/tafsir/${surah.id}/1`
                                                )
                                            }
                                        >
                                            <Info
                                                className="mr-2 group-hover/btn:text-purple-600"
                                                size={16}
                                            />
                                            <span className="group-hover/btn:text-purple-700">
                                                View Tafsir
                                            </span>
                                        </Button>
                                    </div>
                                    {audioLoading &&
                                    loadingSurah === surah.id ? (
                                        <>
                                            <Loader2
                                                className="mt-2 mr-2 animate-spin"
                                                size={16}
                                            />
                                            <span>Loading...</span>
                                        </>
                                    ) : listeningSurah === surah.id &&
                                      surahAudioUrls[surah.id] ? (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-900 mb-2">
                                                Now listening to verse{" "}
                                                {verseIndex + 1} of surah:{" "}
                                                {surah.nameSimple}
                                            </p>
                                            {surahAudioUrls[surah.id][0] ? (
                                                <AudioPlayer
                                                    key={verseIndex}
                                                    audioUrl={
                                                        surahAudioUrls[
                                                            surah.id
                                                        ][verseIndex]
                                                    }
                                                    autoPlay
                                                    onEnded={handleVerseEnded}
                                                    next={handleNextVerse}
                                                    previous={
                                                        handlePreviousVerse
                                                    }
                                                    isMuted={isMuted}
                                                    onMuteChange={setIsMuted}
                                                />
                                            ) : (
                                                <p className="text-sm text-red-600">
                                                    No audio available
                                                </p>
                                            )}
                                        </div>
                                    ) : null}
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
