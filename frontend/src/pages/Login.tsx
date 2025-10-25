import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { AlertCircle, BookOpen, Loader2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Login = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate("/home");
        } catch (error: any) {
            console.error("Login failed", error);
            setError(error.response?.data?.error || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-200 via-white to-blue-200 p-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30">
                        <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-slate-900">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-slate-600">
                        Sign in to continue your Quranic journey
                    </p>
                </div>

                {/* Login Card */}
                <Card className="border-slate-200 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-slate-900">
                            Log In
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-slate-700"
                                >
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-slate-700"
                                >
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-11 w-full bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md shadow-emerald-600/30 transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-6">
                        <div className="text-center text-sm text-slate-600">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                Sign up
                            </Link>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            onClick={() => navigate("/")}
                        >
                            Back to Home
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
