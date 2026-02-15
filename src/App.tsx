import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { FilmStrip } from './components/FilmStrip';
import { Home } from './pages/Home';
import { CreditsPage } from './pages/CreditsPage';
import { PosterPage } from './pages/PosterPage';
import { YearPage } from './pages/YearPage';

export default function App() {
  return (
    <BrowserRouter>
      <FilmStrip side="left" />
      <FilmStrip side="right" />
      <div style={{ 
        maxWidth: 600, 
        margin: '0 auto', 
        padding: '0 32px',
        minHeight: '100vh',
      }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/poster" element={<PosterPage />} />
          <Route path="/year" element={<YearPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
