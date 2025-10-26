import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../lib/axios.ts";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";

interface TafsirResource {
    id: number;
    name: string;
    author_name: string;
    language_name: string;
}

interface TafsirText {
    tafsir: {
        id: number;
        text: string;
        resource_name: string;
        language_name: string;
    };
    
}

const verseCount = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54,
    53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11,
    18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25,
    22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6
]

export const Tafsir = () => {
    const { surahNumber, verseNumber } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [tafsirData, setTafsirData] = useState<Record<number, TafsirText> | null>(null);
    const [availableTafsirs, setAvailableTafsirs] = useState<TafsirResource[]>([]);
    const [selectedTafsirId, setSelectedTafsirId] = useState<number | null>(null);
    const [verse, setVerse] = useState<any>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTafsir = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `/tafsir/tafsirs/${surahNumber}/${verseNumber}`
                );
                setTafsirData(response.data.tafsirs);
                setVerse(response.data.verse);
                
                // Set the first available tafsir as default
                const tafsirIds = Object.keys(response.data.tafsirs).map(Number);
                if (tafsirIds.length > 0) {
                    setSelectedTafsirId(tafsirIds[0]);
                }
            } catch (err) {
                setError("Failed to fetch tafsir data.");
            } finally {
                setLoading(false);
            }
        };
        const fetchTafsirs = async () => {
            try {
                const response = await axios.get(
                    `/tafsir/tafsirs`
                );
                setAvailableTafsirs(response.data);
            } catch (err) {
                setError("Failed to fetch available tafsirs.");
            }
        };
        if (surahNumber && verseNumber) {
            fetchTafsir();
            fetchTafsirs();
        }
    }, [surahNumber, verseNumber]);

    

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
            </div>
        );
    }

    const currentTafsir = selectedTafsirId && tafsirData && tafsirData[selectedTafsirId];

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white py-8 px-4 shadow-lg">
                <div className="container mx-auto max-w-6xl">
                    <Button
                        variant="ghost"
                        className="text-emerald-900 bg-white hover:bg-emerald-50 mb-6 transition-colors"
                        onClick={() => navigate("/home")}
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Back to Surahs
                    </Button>
                    
                    <div className="flex items-start gap-4">
                        <BookOpen size={48} className="shrink-0 mt-1" />
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-3">
                                Tafsir - Surah {surahNumber}, Verse {verseNumber}
                            </h1>
                            
                            
                            {/* Tafsir Selection Buttons */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {availableTafsirs.map((tafsir) => (
                                    <Button
                                        key={tafsir.id}
                                        onClick={() => setSelectedTafsirId(tafsir.id)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            selectedTafsirId === tafsir.id
                                                ? 'bg-white text-emerald-700 shadow-md hover:bg-emerald-50'
                                                : 'bg-emerald-500 text-white hover:bg-emerald-400'
                                        }`}
                                    >
                                        {tafsir.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Next Ayah and Previous Ayah */}
            <div className = "flex justify-between container mx-auto max-w-6xl px-4 pt-3">
                <Button
                    variant="outline"
                    className="text-emerald-600 border-emerald-600 hover:bg-emerald-600 hover:text-white"
                    onClick={() => navigate(`/tafsir/${surahNumber}/${parseInt(verseNumber?? '2') - 1}`)}
                    disabled={parseInt(verseNumber?? '1') === 1 ? true : false}
                >
                    Previous Ayah
                </Button>
                <Button
                    variant="outline"
                    className="text-emerald-600 border-emerald-600 hover:bg-emerald-600 hover:text-white"
                    onClick={() => navigate(`/tafsir/${surahNumber}/${parseInt(verseNumber?? '2') + 1}`)}
                    disabled={parseInt(verseNumber?? '1') === verseCount[parseInt(surahNumber?? '1') - 1] ? true : false}
                >
                    Next Ayah
                </Button>
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-6xl px-4 py-8">
                {error ? (
                    <Card className="border-red-200 bg-red-50 shadow-lg">
                        <CardContent className="pt-6">
                            <p className="text-red-600 text-center">{error}</p>
                        </CardContent>
                    </Card>
                ) : currentTafsir ? (
                    <Card className="shadow-xl border-emerald-100">
                        <CardHeader className="bg-linear-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                            <CardTitle className="text-2xl text-emerald-900">
                                {verse && (
                                <p className="text-2xl font-arabic text-emerald-700 mb-4 leading-loose text-right" dir="rtl">
                                    {verse.textUthmani}
                                </p>
                            )}  
                                <p dir="rtl">
                                {currentTafsir.tafsir.resource_name}
                                </p>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div 
                                className="prose prose-lg max-w-none text-slate-700 leading-relaxed" dir= "rtl"
                                dangerouslySetInnerHTML={{ __html: currentTafsir.tafsir.text || "" }}
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="shadow-lg">
                        <CardContent className="pt-6">
                            <p className="text-center text-gray-500">Select a tafsir to view</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
