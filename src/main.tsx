import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { GraphPage } from './pages/GraphPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/parasol">
      <Routes>
        <Route path="/" element={<GraphPage />} />
        <Route path="/node/:nodeId" element={<GraphPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
