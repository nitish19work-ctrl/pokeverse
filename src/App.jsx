import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import { ThemeProvider } from './context/ThemeContext';

const Home = lazy(() => import('./pages/Home'));
const Pokedex = lazy(() => import('./pages/Pokedex'));
const PokemonDetails = lazy(() => import('./pages/PokemonDetails'));
const Regions = lazy(() => import('./pages/Regions'));
const Types = lazy(() => import('./pages/Types'));
const Legendary = lazy(() => import('./pages/Legendary'));
const Favorites = lazy(() => import('./pages/Favorites'));
const TeamBuilder = lazy(() => import('./pages/TeamBuilder'));
const Compare = lazy(() => import('./pages/Compare'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <img src="/pokeball.svg" alt="Loading" className="w-16 h-16 mx-auto animate-spin mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="pokedex" element={<Pokedex />} />
                <Route path="pokemon/:id" element={<PokemonDetails />} />
                <Route path="regions" element={<Regions />} />
                <Route path="types" element={<Types />} />
                <Route path="legendary" element={<Legendary />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="team-builder" element={<TeamBuilder />} />
                <Route path="compare" element={<Compare />} />
                <Route path="about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
