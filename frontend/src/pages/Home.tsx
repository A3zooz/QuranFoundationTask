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
import { BookOpen, Heart, Info, LogOut, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AudioPlayer } from "@/components/AudioPlayer";

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
    const [listeningSurah, setListeningSurah] = useState<string | null>(null);
    const [surahAudioUrls, setSurahAudioUrls] = useState<Record<string,string[]>>({});
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
    useEffect(() => {
        getSurahs();
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
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {surahs.map((surah) => (
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
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="ml-auto transition-colors"
                                                >
                                                    <Heart size={30} />
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
                                            navigate(`/surah/${surah.id}`)
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
                                            // Handle audio playback
                                            console.log(
                                                "Play audio for surah",
                                                surah.id
                                            );
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
                                                `/surah/${surah.id}/tafsir`
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
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
