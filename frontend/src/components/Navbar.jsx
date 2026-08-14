import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { label: "HOME", to: "/" },
  { label: "ABOUT", to: "/about" },
  { label: "EVENTS", to: "/events" },
  { label: "GALLERY", to: "/gallery" },
  { label: "TEAM", to: "/updates#team" },
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Keep navbar visible at the very top of the page
      if (currentScrollY <= 15) {
        setVisible(true);
      } else {
        if (currentScrollY < lastScrollY) {
          // Scrolling UP -> make visible again
          setVisible(true);
        } else {
          // Scrolling DOWN -> glide up and hide
          setVisible(false);
        }
      }
      
      setLastScrollY(currentScrollY);
      setSolid(currentScrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-transform duration-300 ${
      visible ? "translate-y-0" : "-translate-y-full"
    } ${solid ? "bg-black/90 shadow-md backdrop-blur-sm" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 sm:py-2 sm:px-6 lg:px-8">
        {/* Left Side: Logo */}
        <NavLink to="/" className="flex items-center group">
          <img 
            src="/images/logomain.png" 
            alt="ONAM 2026 Logo" 
            className="h-14 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </NavLink>

        {/* Center: Links with Gold Diamond Spacers */}
        <div className="hidden items-center gap-4 lg:flex">
          {LINKS.map((link, idx) => (
            <div key={link.to} className="flex items-center gap-4">
              {idx > 0 && <span className="text-kasavu/60 text-[10px]">❖</span>}
              <NavLink
                data-cursor-lotus
                to={link.to}
                className={({ isActive }) =>
                  `font-display text-xs font-semibold uppercase tracking-widest transition-all duration-300 hover:text-kasavu ${
                    isActive ? "text-kasavu border-b border-kasavu pb-1" : "text-ivory/80"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </div>
          ))}
        </div>

        {/* Right Side: Social Media Icons */}
        <div className="hidden items-center gap-4 lg:flex" data-cursor-lotus>
          <a href="https://www.instagram.com/onam.avv/" target="_blank" rel="noreferrer" className="text-kasavu hover:text-maroon transition-colors p-1">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href="https://wa.me/917994083820" target="_blank" rel="noreferrer" className="text-kasavu hover:text-maroon transition-colors p-1">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-full border border-kasavu/40 p-2 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-kasavu" />
            <span className="block h-0.5 w-6 bg-kasavu" />
            <span className="block h-0.5 w-4 bg-kasavu" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black/90 px-4 pb-4 pt-2 lg:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2 font-display text-xs font-semibold tracking-wider uppercase ${
                  isActive ? "text-kasavu" : "text-ivory/80"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {/* Mobile Social Links */}
          <div className="mt-4 flex gap-4 border-t border-white/5 pt-3">
            <a href="https://www.instagram.com/onam.avv/" target="_blank" rel="noreferrer" className="text-kasavu hover:text-maroon transition-colors p-1">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://wa.me/917994083820" target="_blank" rel="noreferrer" className="text-kasavu hover:text-maroon transition-colors p-1">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
