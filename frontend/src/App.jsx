import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen.jsx";
import LotusCursor from "./components/LotusCursor.jsx";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import MovieEventPage from "./pages/MovieEventPage.jsx";
import DJEventPage from "./pages/DJEventPage.jsx";
import StorePage from "./pages/StorePage.jsx";
import UpdatesPage from "./pages/UpdatesPage.jsx";
import CoordinatorPage from "./pages/CoordinatorPage.jsx";
import EventRegisterPage from "./pages/EventRegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Smooth page fade & glide transitions
const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -8,
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.35,
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const sparksCanvasRef = useRef(null);

  useEffect(() => {
    if (location.pathname === "/") return;
    const canvas = sparksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -0.4 - Math.random() * 0.8;
        this.radius = 0.5 + Math.random() * 1.8;
        this.alpha = 0.1 + Math.random() * 0.55;
        this.fadeSpeed = 0.0015 + Math.random() * 0.004;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.fadeSpeed;
        if (this.alpha <= 0 || this.y < 0) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#D4AF37";
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = Array.from({ length: 25 }, () => new Particle());

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [location.pathname]);

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

        {/* Dimmed Static Background Image for Parallax Scroll (outside transition context) */}
        {location.pathname !== "/" && (
          <>
            <div 
              className="fixed inset-0 bg-[url('/images/remb_mob.webp')] md:bg-[url('/images/rembg.webp')] bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none z-0 opacity-[0.20]"
              style={{ filter: "brightness(0.6)" }}
            />
            {/* Golden Embers Canvas */}
            <canvas
              ref={sparksCanvasRef}
              className="fixed inset-0 pointer-events-none z-0"
            />
          </>
        )}
        
        {/* AnimatePresence coordinates entry and exit animations of child routes */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
            <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
            <Route path="/events" element={<AnimatedPage><EventsPage /></AnimatedPage>} />
            <Route path="/events/movie" element={<AnimatedPage><MovieEventPage /></AnimatedPage>} />
            <Route path="/events/dj" element={<AnimatedPage><DJEventPage /></AnimatedPage>} />
            <Route path="/events/:id/register" element={<AnimatedPage><EventRegisterPage /></AnimatedPage>} />
            <Route path="/coordinator" element={<AnimatedPage><CoordinatorPage /></AnimatedPage>} />
            <Route path="/store" element={<AnimatedPage><StorePage /></AnimatedPage>} />
            <Route path="/updates" element={<AnimatedPage><UpdatesPage /></AnimatedPage>} />
            <Route path="*" element={<AnimatedPage><NotFoundPage /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}
