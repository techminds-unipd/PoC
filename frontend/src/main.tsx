import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './components/Home'
import Workflow from './components/Workflow/Workflow'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
        <Routes>
            <Route index element={<Home/>} />
            <Route path="/workflow/:name/:id" element={<Workflow/>} />
        </Routes>
        </BrowserRouter>
    </StrictMode>,
)
