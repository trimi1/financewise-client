import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HeaderName from './headerName'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HeaderName />
    </StrictMode>,
)
  