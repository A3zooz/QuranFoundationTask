import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Landing = () => {
    const navigate = useNavigate();
    const { isLoading, isAuthenticated } = useAuth();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate("/home");
        }
    }, [isLoading, isAuthenticated, navigate]);

    useEffect(() => {
        document.documentElement.lang = i18n.language;
        document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
        document.body.style.fontFamily =
            i18n.language === "ar"
                ? "'Cairo', 'Noto Kufi Arabic', sans-serif"
                : "'Inter', system-ui, sans-serif";
    }, [i18n.language]);

    return (
        <div
            className={`min-h-screen bg-linear-to-br from-emerald-100 via-white to-blue-100 ${
                i18n.language === "ar" ? "text-right" : "text-left"
            }`}
        >
            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-16 pb-8">
                <BookOpen className="mx-auto mb-4 text-emerald-500" size={48} />
                <h1 className="text-4xl font-bold text-center text-emerald-800 mb-4">
                    {t("landing.title")}
                </h1>
                <h2 className="text-xl font-sans text-center text-emerald-600 mt-5 mb-4">
                    {t("landing.subtitle")}
                </h2>
            </div>

            {/* Buttons */}
            <div className="text-center flex flex-col items-center">
                <Button
                    variant="outline"
                    className="bg-emerald-500 w-xl h-16 mt-10 hover:bg-emerald-600"
                    onClick={() => navigate("/signup")}
                >
                    <div className="text-white">{t("landing.signup")}</div>
                </Button>
                <Button
                    variant="outline"
                    className="mt-6 bg-white border-2 border-emerald-500 w-100 h-16 hover:bg-emerald-100"
                    onClick={() => navigate("/login")}
                >
                    <div className="text-emerald-500">{t("landing.login")}</div>
                </Button>

                <Button
                    variant="ghost"
                    className="mt-8 text-emerald-700 hover:text-emerald-900"
                    onClick={() =>
                        i18n.changeLanguage(
                            i18n.language === "ar" ? "en" : "ar"
                        )
                    }
                >
                    {i18n.language === "ar" ? "English" : "العربية"}
                </Button>
            </div>
        </div>
    );
};
