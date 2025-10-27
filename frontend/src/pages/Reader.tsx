import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../lib/axios.ts";

const TOTAL_PAGES = 604;
export const Reader = () => {
    const { pageNumber } = useParams<{ pageNumber: string }>();
    const navigate = useNavigate();
    const [pageNum, setPageNum] = useState(parseInt(pageNumber || "1"));
    const [verses, setVerses] = useState<any[]>([]);
    const [surahName, setSurahName] = useState<string>("");
    if (isNaN(pageNum) || pageNum < 1 || pageNum > TOTAL_PAGES) {
        return <Navigate to="/reader/1" replace />;
    }
    const [loading, isLoading] = useState(true);
    useEffect(() => {
        setPageNum(parseInt(pageNumber || "1"));
    }, [pageNumber]);

    const handlePreviousPage = () => {
        if (pageNum > 1) {
            navigate(`/surah/${pageNum - 1}`);
        }
    };
    const handleNextPage = () => {
        if (pageNum < TOTAL_PAGES) {
            navigate(`/surah/${pageNum + 1}`);
        }
    };

    useEffect(() => {
        const fetchPageVerses = async () => {
            isLoading(true);
            try {
                const response = await axios.get(`surah/page/${pageNum}`);
                setVerses(response.data)
                console.log(response.data);
                if (response.data && response.data.length > 0) {
                    const surahNumber = response.data[0].verseKey.split(":")[0];
                    const surahResponse = await axios.get(`surah/${surahNumber}`);
                    setSurahName(surahResponse.data.nameArabic);
                };
            } catch (error) {
                console.error("Error fetching page verses:", error);
            } finally {
                isLoading(false);
            }
        };
        fetchPageVerses();
        console.log("Fetched verses for page", pageNum);
    }, [pageNum]);

    const toArabicNumerals = (num: number) => {
        const arabicNumerals = [
            "٠",
            "١",
            "٢",
            "٣",
            "٤",
            "٥",
            "٦",
            "٧",
            "٨",
            "٩",
        ];
        return num
            .toString()
            .split("")
            .map((digit) => arabicNumerals[parseInt(digit)])
            .join("");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-100 via-white to-blue-100">
            <div className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white py-6 px-4 shadow-lg">
                <div className="container  w-full flex mx-auto items-center justify-between">
                    <Button
                        variant="ghost"
                        className="text-emerald-900 bg-white hover:bg-emerald-50"
                        onClick={() => navigate("/home")}
                    >
                        <Home className="mr-2" size={20} />
                        Back to Home
                    </Button>
                    <div className="flex items-center ml-auto gap-4">
                        <BookOpen size={32} />
                        <div>
                            <h1 className="text-2xl font-bold">
                                القرآن الكريم
                            </h1>
                            <p className="text-emerald-100 text-sm">
                                Page {pageNum} of {TOTAL_PAGES}
                            </p>
                        </div>
                    </div>
                    <div className="w-32" /> {/* Spacer for centering */}
                </div>
                {/* Page View */}
            </div>
            <div className="container mx-auto max-w-5xl px-4 py-6">
                <Card className="shadow-2xl border-emerald-100 overflow-hidden">
                    <div className="relative bg-linear-to-br from-amber-50 to-yellow-50 min-h-[600px] p-8">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                                <div className="animate-pulse text-emerald-600 flex flex-col items-center">
                                    <BookOpen size={48} />
                                    <p className="mt-4 text-lg">
                                        Loading Page {pageNum}...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="quran-text-container leading-loose font-['Uthmanic','Traditional_Arabic',serif]" dir= "rtl">
                                {verses.map((verse: any, index: number) => (
                                    <span key={index} className="inline">
                                        {verse.verseNumber === 1 && (
                                            <div className="w-full text-center my-8">
                                                <div className="inline-block bg-linear-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-lg shadow-lg">
                                                    <h2 className="text-3xl font-bold mb-2">
                                                        سُورَةُ {surahName}
                                                    </h2>
                                                </div>
                                                {/* Bismillah - except for Surah At-Tawbah (9) */}
                                                {verse.verseKey.split(":")[0] !== '9' && (
                                                    <div className="text-4xl mt-6 mb-4 text-emerald-800">
                                                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <span className="text-3xl font-arabic leading-loose">
                                            {verse.textUthmani}
                                        </span>
                                        <span className="inline-flex items-center justify-center mx-2 text-emerald-600">
                                            <span className="relative inline-flex items-center justify-center w-8 h-8">
                                                
                                                <span className="text-4xl">
                                                {toArabicNumerals(verse.verseNumber)}
                                            </span>
                                            </span>
                                        </span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Navigation Buttons */}
                    <div className="bg-emerald-100 border-t border-emerald-200 p-4">
                        <div className="flex justify-between items-center gap-4">
                            {/* Next Button */}
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleNextPage}
                                disabled={pageNum === TOTAL_PAGES}
                                className="flex-1 border-emerald-300 hover:bg-emerald-100 disabled:opacity-50"
                            >
                                <ArrowLeft className="mr-2" size={20} />
                                Next Page
                            </Button>

                            {/* Page Input */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max={TOTAL_PAGES}
                                    value={pageNum}
                                    onChange={(e) => {
                                        const page = parseInt(e.target.value);
                                        if (page >= 1 && page <= TOTAL_PAGES) {
                                            navigate(`/surah/${page}`);
                                        }
                                    }}
                                    className="w-20 text-center border-2 border-emerald-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <span className="text-slate-600 text-sm">
                                    / {TOTAL_PAGES}
                                </span>
                            </div>

                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handlePreviousPage}
                                disabled={pageNum === 1}
                                className="flex-1 border-emerald-300 hover:bg-emerald-100 disabled:opacity-50"
                            >
                                <ArrowRight className="ml-2" size={20} />
                                Previous Page
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
