import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, BookOpen, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import "@/i18n";

export const SignUp = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setIsLoading] = useState(false);

    const passwordsMatch =
        formData.password &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("signup.passwords_not_match");
            return;
        }

        if (formData.password.length < 6) {
            setError("signup.password_too_short");
            return;
        }

        setIsLoading(true);
        try {
            await register(formData.email, formData.password);
            navigate("/login");
        } catch (error: any) {
            console.error("Signup failed", error);
            setError("signup.something_wrong");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.documentElement.lang = i18n.language;
        document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
        localStorage.setItem("lang", i18n.language);
    }, [i18n.language]);

    const toggleLang = () => {
        i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
    };

    return (
        <div
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
            className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-100 via-white to-blue-100 p-4"
        >
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30">
                        <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-slate-900">
                        {t("signup.header_title")}
                    </h1>
                    <p className="text-sm text-slate-600">
                        {t("signup.header_subtitle")}
                    </p>
                </div>

                {/* Signup Card */}
                <Card className="border-slate-200 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-slate-900">
                            {t("signup.card_title")}
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                            {t("signup.card_description")}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSignup} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {t(error)}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-slate-700"
                                >
                                    {t("signup.email_label")}
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={t("signup.email_placeholder")}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-slate-700"
                                >
                                    {t("signup.password_label")}
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={t(
                                        "signup.password_placeholder"
                                    )}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-slate-700"
                                >
                                    {t("signup.confirm_password_label")}
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder={t(
                                        "signup.confirm_password_placeholder"
                                    )}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                {passwordsMatch && (
                                    <CheckCircle2 className="absolute right-3 top-9 h-5 w-5 text-emerald-600" />
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-11 w-full bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md shadow-emerald-600/30 transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("signup.creating_account")}
                                    </>
                                ) : (
                                    t("signup.create_account_button")
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 border-t pt-6">
                        <div className="text-center text-sm text-slate-600">
                            {t("signup.already_have_account")}{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                {t("signup.login_link")}
                            </Link>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                            onClick={() => navigate("/")}
                        >
                            {t("signup.back_to_home")}
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-emerald-700 hover:text-emerald-900"
                            onClick={() =>
                                i18n.changeLanguage(
                                    i18n.language === "ar" ? "en" : "ar"
                                )
                            }
                        >
                            {i18n.language === "ar" ? "English" : "العربية"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
