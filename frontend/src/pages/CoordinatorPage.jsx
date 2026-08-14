import { useState, useEffect, useCallback } from "react";
import PageFrame from "../components/PageFrame.jsx";

const PRESET_ICONS = [
  { id: "drum", label: "Drum / Chenda" },
  { id: "flower", label: "Flower / Pookalam" },
  { id: "crown", label: "Crown / Maveli" },
  { id: "dance", label: "Dance / Kathakali" },
  { id: "music", label: "Music / DJ" },
  { id: "movie", label: "Cinema / Movie" },
];

const DEMO_EVENTS = [
  { title: "Onam Teaser", time: "17 July, 3:30 PM", description: "A short performance preview to open the festival.", icon: "drum", category: "Opening", venue: "Main Quadrangle", poster: "", registrationRequired: false, paymentRequired: false, price: 0 },
  { title: "Eco Friendly Pookalam", time: "18 July, 9:00 AM", description: "Departments compete laying flower carpets using only biodegradable petals.", icon: "flower", category: "Competition", venue: "Central Atrium", poster: "", registrationRequired: true, paymentRequired: false, price: 0 },
  { title: "Chendamelam & Maveli Procession", time: "20 July, 9:00 AM", description: "King Mahabali's ceremonial procession through campus.", icon: "crown", category: "Procession", venue: "Campus Grounds", poster: "/images/theyyam.png", registrationRequired: false, paymentRequired: false, price: 0 },
  { title: "Cultural Performances & Sadya", time: "20 July, 11:00 AM onwards", description: "Classical and folk performances, traditional games, and a grand Sadya.", icon: "dance", category: "Culture", venue: "Main Auditorium & Lawns", poster: "/images/kathakali.png", registrationRequired: false, paymentRequired: false, price: 0 },
  { title: "DJ Night", time: "20 July, 8:00 PM onwards", description: "High-energy open-air set on the main stage.", icon: "music", category: "Booking Required", venue: "Main Stage", link: "/events/dj", badge: "Book Ticket", poster: "/images/dj_night_poster.png", registrationRequired: true, paymentRequired: true, price: 150 },
  { title: "Movie Night", time: "29 – 31 July", description: "Three nights of outdoor movie screenings.", icon: "movie", category: "Booking Required", venue: "Amritamayi Hall", link: "/events/movie", badge: "Select Seats", poster: "/images/movie_night_poster.png", registrationRequired: true, paymentRequired: true, price: 70 },
];

// =========================================================================
// Login Screen
// =========================================================================
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/coordinator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem("coord_token", data.token);
        onLogin(data.token);
      } else {
        setError(data.error || "Incorrect password.");
      }
    } catch {
      setError("Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageFrame>
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-kasavu/30 bg-black/70 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-kasavu/40 bg-kasavu/10">
            <svg className="h-8 w-8 text-kasavu" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="mb-2 text-center font-display text-3xl font-bold text-kasavu">Coordinator Portal</h1>
          <p className="mb-8 text-center text-sm text-ivory/60">Enter the coordinator password to manage festival events.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ivory/70">Password</label>
              <input type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter coordinator password" className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3.5 text-sm text-ivory placeholder-ivory/30 focus:border-kasavu focus:outline-none focus:ring-1 focus:ring-kasavu/50 transition-all" />
            </div>
            {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-xs font-semibold text-red-400">{error}</div>}
            <button type="submit" disabled={loading || !password} className="w-full rounded-2xl border border-kasavu bg-kasavu py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-kasavu/80 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-kasavu/20">
              {loading ? "Verifying..." : "Unlock Portal"}
            </button>
          </form>
        </div>
      </div>
    </PageFrame>
  );
}

// =========================================================================
// Toggle Switch Component
// =========================================================================
function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={`h-6 w-11 rounded-full transition-colors duration-300 ${checked ? "bg-kasavu" : "bg-white/15"}`} />
        <div className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? "translate-x-5" : ""}`} />
      </div>
      <span className="text-xs font-semibold text-ivory/80">{label}</span>
    </label>
  );
}

// =========================================================================
// Registrations Modal
// =========================================================================
function RegistrationsModal({ event, authToken, onClose }) {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${event.id}/registrations`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((r) => r.json())
      .then((d) => setRegs(Array.isArray(d) ? d : []))
      .catch(() => setRegs([]))
      .finally(() => setLoading(false));
  }, [event.id, authToken]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border border-kasavu/40 bg-stone-950 p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-kasavu">Registrations</h2>
            <p className="text-sm text-ivory/60 mt-1">{event.title} — {regs.length} registrations</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full border border-white/20 text-ivory hover:border-kasavu hover:text-kasavu">✕</button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-ivory/50">Loading...</div>
        ) : regs.length === 0 ? (
          <div className="py-12 text-center text-ivory/50">No registrations yet for this event.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-kasavu/80">
                  <th className="py-3 pr-4">ID</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Phone</th>
                  <th className="py-3 pr-4">Qty</th>
                  {event.paymentRequired && <th className="py-3 pr-4">Amount</th>}
                  <th className="py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {regs.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 text-ivory/80 hover:bg-white/5">
                    <td className="py-2.5 pr-4 font-mono text-xs text-kasavu">{r.id}</td>
                    <td className="py-2.5 pr-4">{r.name}</td>
                    <td className="py-2.5 pr-4 text-ivory/60">{r.email || "—"}</td>
                    <td className="py-2.5 pr-4">{r.phone}</td>
                    <td className="py-2.5 pr-4">{r.quantity}</td>
                    {event.paymentRequired && <td className="py-2.5 pr-4 text-kasavu font-semibold">₹{r.total}</td>}
                    <td className="py-2.5 text-ivory/50 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// Main Coordinator Dashboard
// =========================================================================
export default function CoordinatorPage() {
  const [authToken, setAuthToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState("");
  const [viewRegsEvent, setViewRegsEvent] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "", time: "", description: "", category: "General", venue: "Campus Venue",
    icon: "drum", poster: "", link: "", badge: "",
    registrationRequired: false, paymentRequired: false, price: 0,
  });

  const authHeaders = useCallback(
    (extra = {}) => ({ "Content-Type": "application/json", Authorization: `Bearer ${authToken}`, ...extra }),
    [authToken]
  );

  useEffect(() => {
    const stored = sessionStorage.getItem("coord_token");
    if (!stored) { setAuthChecked(true); return; }
    fetch("/api/auth/coordinator/verify", { method: "POST", headers: { Authorization: `Bearer ${stored}` } })
      .then((r) => r.json())
      .then((d) => { if (d.valid) setAuthToken(stored); else sessionStorage.removeItem("coord_token"); })
      .catch(() => sessionStorage.removeItem("coord_token"))
      .finally(() => setAuthChecked(true));
  }, []);

  const fetchEvents = useCallback(async () => {
    try { setLoading(true); const res = await fetch("/api/timeline"); const data = await res.json(); setEvents(Array.isArray(data) ? data : []); }
    catch (err) { console.error("Failed to load events:", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (authToken) fetchEvents(); }, [authToken, fetchEvents]);

  const showNotification = (msg) => { setNotice(msg); setTimeout(() => setNotice(""), 3500); };

  const handleLogout = async () => {
    try { await fetch("/api/auth/coordinator/logout", { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }); } catch { /* */ }
    sessionStorage.removeItem("coord_token"); setAuthToken(null);
  };

  const handleOpenForm = (eventObj = null) => {
    if (eventObj) {
      setEditingEvent(eventObj);
      setFormData({
        title: eventObj.title || "", time: eventObj.time || "", description: eventObj.description || "",
        category: eventObj.category || "General", venue: eventObj.venue || "Campus Venue", icon: eventObj.icon || "drum",
        poster: eventObj.poster || "", link: eventObj.link || "", badge: eventObj.badge || "",
        registrationRequired: Boolean(eventObj.registrationRequired), paymentRequired: Boolean(eventObj.paymentRequired),
        price: eventObj.price || 0,
      });
    } else {
      setEditingEvent(null);
      setFormData({ title: "", time: "", description: "", category: "General", venue: "Campus Venue", icon: "drum", poster: "", link: "", badge: "", registrationRequired: false, paymentRequired: false, price: 0 });
    }
    setShowModal(true);
  };

  // -- Poster upload --
  const handlePosterUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("poster", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: fd,
      });
      if (res.status === 401) { alert("Session expired."); handleLogout(); return; }
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, poster: data.url }));
        showNotification("Poster uploaded successfully.");
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.time) { alert("Event Title and Date/Time are required."); return; }
    try {
      const payload = { ...formData };
      if (editingEvent) {
        const res = await fetch(`/api/timeline/${editingEvent.id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) });
        if (res.status === 401) { alert("Session expired."); handleLogout(); return; }
        if (res.ok) showNotification(`Updated "${formData.title}".`);
      } else {
        const res = await fetch("/api/timeline", { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
        if (res.status === 401) { alert("Session expired."); handleLogout(); return; }
        if (res.ok) showNotification(`Created "${formData.title}".`);
      }
      setShowModal(false); fetchEvents();
    } catch (err) { console.error("Save error:", err); alert("Error saving event."); }
  };

  const isPermanentEvent = (title) => {
    const t = (title || "").toLowerCase();
    return t.includes("movie night") || t.includes("dj night");
  };

  const handleDelete = async (id, title) => {
    if (isPermanentEvent(title)) {
      alert(`"${title}" is a permanent event and cannot be deleted.`);
      return;
    }
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/timeline/${id}`, { method: "DELETE", headers: authHeaders() });
      if (res.status === 401) { alert("Session expired."); handleLogout(); return; }
      if (res.ok) { showNotification(`Deleted "${title}".`); fetchEvents(); }
    } catch (err) { console.error("Delete error:", err); }
  };

  const handleLoadPresets = async () => {
    if (!window.confirm("Load preset festival events?")) return;
    try {
      for (const ev of DEMO_EVENTS) {
        const res = await fetch("/api/timeline", { method: "POST", headers: authHeaders(), body: JSON.stringify(ev) });
        if (res.status === 401) { alert("Session expired."); handleLogout(); return; }
      }
      showNotification("Loaded preset events."); fetchEvents();
    } catch (err) { console.error("Preset error:", err); }
  };

  // -- Auth gate --
  if (!authChecked) return <PageFrame><div className="flex min-h-[80vh] items-center justify-center"><div className="text-ivory/50">Checking session...</div></div></PageFrame>;
  if (!authToken) return <LoginScreen onLogin={(token) => setAuthToken(token)} />;

  return (
    <PageFrame>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-8">
          <div>
            <span className="inline-block rounded-full border border-kasavu/40 bg-kasavu/10 px-3 py-1 font-body text-xs font-bold uppercase tracking-[0.25em] text-kasavu">Admin & Coordinator Portal</span>
            <h1 className="mt-2 font-display text-4xl font-bold text-kasavu sm:text-5xl">Manage Festival Events</h1>
            <p className="mt-2 text-sm text-ivory/70 max-w-xl">Add events with poster uploads, registration forms, and payment toggles.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {events.length === 0 && (
              <button onClick={handleLoadPresets} className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-ivory hover:border-kasavu hover:text-kasavu transition-all">Load Sample Presets</button>
            )}
            <button onClick={() => handleOpenForm(null)} className="flex items-center gap-2 rounded-full border border-kasavu bg-kasavu/20 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-kasavu hover:bg-kasavu hover:text-black shadow-lg shadow-kasavu/20 transition-all">
              <span className="text-lg leading-none">+</span><span>Add New Event</span>
            </button>
            <button onClick={handleLogout} className="rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all">Logout</button>
          </div>
        </div>

        {notice && <div className="mb-8 rounded-2xl border border-kasavu/50 bg-kasavu/10 p-4 text-center font-body text-sm font-semibold text-kasavu">{notice}</div>}

        {/* Events Grid */}
        {loading ? (
          <div className="py-20 text-center text-ivory/50">Loading events data...</div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-black/40 p-12 text-center">
            <h3 className="font-display text-2xl font-bold text-ivory">No Events Configured</h3>
            <p className="mt-2 text-sm text-ivory/60">Click "+ Add New Event" to publish event tiles.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((item) => (
              <div key={item.id} className="relative flex flex-col justify-between rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-kasavu/40">
                <div>
                  <div className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50">
                    {item.poster ? (
                      <img src={item.poster} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-kasavu/5 text-xs font-semibold text-kasavu/60 uppercase">No Poster</div>
                    )}
                    <span className="absolute right-3 top-3 rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-semibold text-kasavu border border-kasavu/30">{item.time}</span>
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-widest text-maroon">{item.category || "General"}</span>
                  <h3 className="font-display text-xl font-bold text-ivory mb-2">{item.title}</h3>
                  <p className="text-xs text-ivory/70 leading-relaxed mb-3 line-clamp-2">{item.description || "No description."}</p>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.registrationRequired ? (
                      <span className="rounded-full border border-kasavu/40 bg-kasavu/10 px-2.5 py-0.5 text-[10px] font-bold text-kasavu">Registration On</span>
                    ) : (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-ivory/50">Open Entry</span>
                    )}
                    {item.paymentRequired && (
                      <span className="rounded-full border border-maroon/40 bg-maroon/10 px-2.5 py-0.5 text-[10px] font-bold text-maroon">₹{item.price}/person</span>
                    )}
                  </div>

                  <div className="text-xs text-ivory/50 mb-3">📍 {item.venue || "Campus Venue"}</div>
                  {item.link && <div className="mb-3 text-xs font-semibold text-kasavu">Custom Link: {item.link}</div>}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    {item.registrationRequired && (
                      <button onClick={() => setViewRegsEvent(item)} className="rounded-full border border-kasavu/30 px-3 py-1.5 text-[11px] font-semibold text-kasavu hover:bg-kasavu/20 transition-all">
                        Registrations
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenForm(item)} className="rounded-full border border-kasavu/40 px-4 py-1.5 text-xs font-semibold text-kasavu hover:bg-kasavu/20 transition-all">Edit</button>
                    {isPermanentEvent(item.title) ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-ivory/40 cursor-not-allowed">Permanent</span>
                    ) : (
                      <button onClick={() => handleDelete(item.id, item.title)} className="rounded-full border border-red-500/40 px-4 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all">Delete</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Registrations Modal */}
      {viewRegsEvent && <RegistrationsModal event={viewRegsEvent} authToken={authToken} onClose={() => setViewRegsEvent(null)} />}

      {/* Add / Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-kasavu/40 bg-stone-950 p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="font-display text-2xl font-bold text-kasavu">{editingEvent ? "Edit Event" : "Add New Event"}</h2>
              <button onClick={() => setShowModal(false)} className="h-8 w-8 rounded-full border border-white/20 text-ivory hover:border-kasavu hover:text-kasavu">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-left">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2">Event Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. DJ Night" className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-ivory focus:border-kasavu focus:outline-none" />
              </div>

              {/* Date & Category */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2">Date & Time *</label>
                  <input type="text" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="e.g. 20 July, 8:00 PM" className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-ivory focus:border-kasavu focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2">Category</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Competition" className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-ivory focus:border-kasavu focus:outline-none" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Event details..." className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-ivory focus:border-kasavu focus:outline-none" />
              </div>

              {/* Venue & Icon */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2">Venue</label>
                  <input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} placeholder="e.g. Main Stage" className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-ivory focus:border-kasavu focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2">Icon</label>
                  <select value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full rounded-2xl border border-white/15 bg-stone-900 px-4 py-3 text-sm text-ivory focus:border-kasavu focus:outline-none">
                    {PRESET_ICONS.map((ic) => <option key={ic.id} value={ic.id}>{ic.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Poster Upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2">Event Poster</label>
                <div className="flex flex-col gap-3">
                  {/* Upload zone */}
                  <label className={`relative flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-all ${uploading ? "border-kasavu/60 bg-kasavu/5" : "border-white/15 bg-black/40 hover:border-kasavu/40 hover:bg-kasavu/5"}`}>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handlePosterUpload(e.target.files[0])} disabled={uploading} />
                    {uploading ? (
                      <span className="text-sm text-kasavu font-semibold animate-pulse">Uploading...</span>
                    ) : (
                      <>
                        <svg className="h-8 w-8 text-kasavu/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-ivory/80">Click to upload poster image</p>
                          <p className="text-xs text-ivory/50">JPG, PNG, WebP up to 5MB</p>
                        </div>
                      </>
                    )}
                  </label>

                  {/* OR manual URL */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ivory/40">or paste URL:</span>
                    <input type="text" value={formData.poster} onChange={(e) => setFormData({ ...formData, poster: e.target.value })} placeholder="/uploads/poster.png" className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-ivory focus:border-kasavu focus:outline-none" />
                  </div>

                  {/* Preview */}
                  {formData.poster && (
                    <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-white/10">
                      <img src={formData.poster} alt="Preview" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      <button type="button" onClick={() => setFormData({ ...formData, poster: "" })} className="absolute right-2 top-2 rounded-full bg-black/80 border border-white/20 px-2 py-0.5 text-[10px] text-red-400 hover:bg-red-500/20">Remove</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration & Payment Toggles */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-ivory/60 mb-2">Registration & Payment Settings</p>

                <Toggle label="Registration Required" checked={formData.registrationRequired} onChange={(v) => setFormData({ ...formData, registrationRequired: v, paymentRequired: v ? formData.paymentRequired : false, price: v ? formData.price : 0 })} />

                {formData.registrationRequired && (
                  <>
                    <Toggle label="Payment Required" checked={formData.paymentRequired} onChange={(v) => setFormData({ ...formData, paymentRequired: v, price: v ? formData.price : 0 })} />

                    {formData.paymentRequired && (
                      <div className="ml-14">
                        <label className="block text-xs font-semibold text-ivory/70 mb-1">Price per person (₹)</label>
                        <input type="number" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-32 rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-sm text-ivory focus:border-kasavu focus:outline-none" />
                      </div>
                    )}

                    <p className="text-[11px] text-ivory/40 ml-14">
                      A registration form (Name, Email, Phone) will be auto-generated for this event at <span className="text-kasavu/70 font-mono">/events/{'<id>'}/register</span>
                    </p>
                  </>
                )}
              </div>

              {/* Custom Link (optional override) */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2">Custom Page Link (Optional)</label>
                  <input type="text" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} placeholder="e.g. /events/dj" className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-ivory focus:border-kasavu focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/80 mb-2">Button Badge Label</label>
                  <input type="text" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} placeholder="e.g. Book Ticket" className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-ivory focus:border-kasavu focus:outline-none" />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-full border border-white/20 px-6 py-2.5 text-xs font-semibold text-ivory/70 hover:bg-white/10">Cancel</button>
                <button type="submit" className="rounded-full border border-kasavu bg-kasavu px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-kasavu/80 shadow-md">{editingEvent ? "Save Changes" : "Create Event"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageFrame>
  );
}
