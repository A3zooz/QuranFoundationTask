import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import  Home  from './pages/Home'
import { Landing } from './pages/Landing.tsx'
import { Login } from './pages/Login.tsx'
import { SignUp } from './pages/Signup.tsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
