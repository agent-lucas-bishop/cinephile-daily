import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Header } from './components/Header';
import { FilmStrip } from './components/FilmStrip';
import { Home } from './pages/Home';
import { CreditsPage } from './pages/CreditsPage';
import { PosterPage } from './pages/PosterPage';
import { YearPage } from './pages/YearPage';
import { useIsMobile } from './hooks/useMediaQuery';

export default function App() {
  const isMobile = useIsMobile();

  return (
    <BrowserRouter>
      {!isMobile && <FilmStrip side="left" />}
      {!isMobile && <FilmStrip side="right" />}
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: isMobile ? '0 12px' : '0 32px',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/poster" element={<PosterPage />} />
            <Route path="/year" element={<YearPage />} />
          </Routes>
        </div>
      </div>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
}
