import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App'
import Workflow from './components/Workflow'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
        <Routes>
            <Route index element={<App />} />
            <Route path="/workflow/:id" element={<Workflow/>} />
        </Routes>
        </BrowserRouter>
    </StrictMode>,
)
