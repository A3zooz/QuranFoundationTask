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
import { BookOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const SignUp = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password strength
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/signup`, {
                email: formData.email,
                password: formData.password,
            });
            if (response.status === 201 || response.status === 200) {
                // Signup successful, redirect to login
                navigate("/login");
            }
        } catch (error: any) {
            console.error("Signup failed", error);
            setError(error.response?.data?.error || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-blue-50 p-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30">
                        <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-slate-900">
                        Join Us Today
                    </h1>
                    <p className="text-sm text-slate-600">
                        Create an account to start your Quranic journey
                    </p>
                </div>

                {/* Signup Card */}
                <Card className="border-slate-200 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-slate-900">
                            Sign Up
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                            Enter your details to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700">
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
                                <Label htmlFor="password" className="text-slate-700">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-slate-700">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
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
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-6">
                        <div className="text-center text-sm text-slate-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                Log in
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
