import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Landing } from "./pages/Landing.tsx";
import { Login } from "./pages/Login.tsx";
import { SignUp } from "./pages/Signup.tsx";
import { ProtectedRoute } from "./components/routes/ProtectedRoute.tsx";
import { AuthProvider } from "./components/context/AuthContext.tsx";
import { Tafsir } from "./pages/Tafsir.tsx";
import { Reader } from "./pages/Reader.tsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route path = "/tafsir/:surahNumber/:verseNumber" element={
                        <ProtectedRoute>
                            <Tafsir />
                        </ProtectedRoute>
                    } />
                    <Route path="/surah/:pageNumber" element={
                        <ProtectedRoute>
                            <Reader />
                        </ProtectedRoute>
                    } />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
