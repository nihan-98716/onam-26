import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen.jsx";
import LotusCursor from "./components/LotusCursor.jsx";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import MovieEventPage from "./pages/MovieEventPage.jsx";
import DJEventPage from "./pages/DJEventPage.jsx";
import StorePage from "./pages/StorePage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import UpdatesPage from "./pages/UpdatesPage.jsx";
import CoordinatorPage from "./pages/CoordinatorPage.jsx";
import EventRegisterPage from "./pages/EventRegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };
    const handleDragStart = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <LotusCursor />
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/movie" element={<MovieEventPage />} />
          <Route path="/events/dj" element={<DJEventPage />} />
          <Route path="/events/:id/register" element={<EventRegisterPage />} />
          <Route path="/coordinator" element={<CoordinatorPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}
