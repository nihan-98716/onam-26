import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID, createHash } from "crypto";
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve uploaded poster images from frontend/public/uploads
const uploadsDir = path.join(__dirname, "..", "frontend", "public", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

const getDataDir = () => {
  const cwd = process.cwd();
  if (cwd.endsWith("backend")) {
    return path.join(cwd, "data");
  }
  return path.join(cwd, "backend", "data");
};

const dataFile = (name) =>
  JSON.parse(fs.readFileSync(path.join(getDataDir(), name), "utf-8"));

const saveFile = (name, data) => {
  fs.writeFileSync(path.join(getDataDir(), name), JSON.stringify(data, null, 2), "utf-8");
};

// ======================================================================
// Coordinator Authentication — only the salted SHA-256 hash is stored.
// To change the password, run:
//   node -e "const c=require('crypto');console.log(c.createHash('sha256').update('aarpo26-coord-salt'+process.argv[1]).digest('hex'))" YOUR_NEW_PASSWORD
// Then replace COORDINATOR_HASH below with the output.
// ======================================================================
const COORDINATOR_SALT = "aarpo26-coord-salt";
const COORDINATOR_HASH = "5d96d650758dcd37eefa584ed953a5a0885583b8da56efb209773abd06eaf0eb";

const MAX_COORDINATOR_SESSIONS = 2;
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes inactivity timeout

// Active session tokens: token -> { createdAt, lastActive }
const activeSessions = new Map();

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (now - session.lastActive > SESSION_TTL_MS) {
      activeSessions.delete(token);
    }
  }
}

function hashPassword(password) {
  return createHash("sha256").update(COORDINATOR_SALT + password).digest("hex");
}

function requireCoordAuth(req, res, next) {
  cleanupExpiredSessions();
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const token = auth.slice(7);
  const session = activeSessions.get(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
  session.lastActive = Date.now();
  next();
}

app.post("/api/auth/coordinator", (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (hashPassword(password) !== COORDINATOR_HASH) {
    return res.status(403).json({ error: "Incorrect password" });
  }

  cleanupExpiredSessions();
  if (activeSessions.size >= MAX_COORDINATOR_SESSIONS) {
    return res.status(429).json({
      error: `Maximum active session limit reached (${MAX_COORDINATOR_SESSIONS} active sessions allowed). Please logout from another session to log in.`,
    });
  }

  const token = randomUUID();
  activeSessions.set(token, { createdAt: Date.now(), lastActive: Date.now() });
  res.json({ token });
});

app.post("/api/auth/coordinator/verify", (req, res) => {
  cleanupExpiredSessions();
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.json({ valid: false });
  }
  const token = auth.slice(7);
  const session = activeSessions.get(token);
  if (session) {
    session.lastActive = Date.now();
    return res.json({ valid: true });
  }
  res.json({ valid: false });
});

app.post("/api/auth/coordinator/logout", (req, res) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    activeSessions.delete(auth.slice(7));
  }
  res.json({ success: true });
});

// ======================================================================
// File Upload — poster images
// ======================================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `poster-${Date.now()}-${randomUUID().slice(0, 6)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

app.post("/api/upload", requireCoordAuth, upload.single("poster"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

// ---- seed data ----
let timeline = dataFile("timeline.json");
let team = dataFile("team.json");
let gallery = dataFile("gallery.json");
let liveUpdates = dataFile("liveUpdates.json");
let storeProducts = dataFile("keralaStore.json");
let registrations = dataFile("registrations.json");

// ======================================================================
// Timeline / Event endpoints
// ======================================================================
app.get("/api/timeline", (req, res) => res.json(timeline));

// Get single event by ID
app.get("/api/timeline/:id", (req, res) => {
  const id = Number(req.params.id);
  const event = timeline.find((item) => Number(item.id) === id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

app.post("/api/timeline", requireCoordAuth, (req, res) => {
  const { title, time, description, icon, category, venue, poster, link, badge,
          registrationRequired, paymentRequired, price } = req.body;
  if (!title || !time) {
    return res.status(400).json({ error: "title and time are required" });
  }
  const newEvent = {
    id: Date.now(),
    title,
    time,
    description: description || "",
    icon: icon || "drum",
    category: category || "General",
    venue: venue || "Campus Venue",
    poster: poster || "",
    link: link || "",
    badge: badge || "",
    registrationRequired: Boolean(registrationRequired),
    paymentRequired: Boolean(paymentRequired),
    price: Number(price) || 0,
  };
  timeline.push(newEvent);
  saveFile("timeline.json", timeline);
  res.status(201).json(newEvent);
});

app.put("/api/timeline/:id", requireCoordAuth, (req, res) => {
  const id = Number(req.params.id);
  const index = timeline.findIndex((item) => Number(item.id) === id);
  if (index === -1) {
    return res.status(404).json({ error: "Event not found" });
  }
  const existing = timeline[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
  };
  // Ensure booleans
  if ("registrationRequired" in req.body) updated.registrationRequired = Boolean(req.body.registrationRequired);
  if ("paymentRequired" in req.body) updated.paymentRequired = Boolean(req.body.paymentRequired);
  if ("price" in req.body) updated.price = Number(req.body.price) || 0;
  timeline[index] = updated;
  saveFile("timeline.json", timeline);
  res.json(updated);
});

app.delete("/api/timeline/:id", requireCoordAuth, (req, res) => {
  const id = Number(req.params.id);
  const event = timeline.find((item) => Number(item.id) === id);
  if (event) {
    const titleLower = (event.title || "").toLowerCase();
    if (titleLower.includes("movie night") || titleLower.includes("dj night")) {
      return res.status(403).json({ error: "Movie Night and DJ Night are permanent events and cannot be deleted." });
    }
  }
  timeline = timeline.filter((item) => Number(item.id) !== id);
  saveFile("timeline.json", timeline);
  res.json({ success: true, id });
});

// ======================================================================
// Event Registration — generic form (name, email, phone, qty)
// ======================================================================
app.post("/api/events/:id/register", (req, res) => {
  const eventId = String(req.params.id);
  const event = timeline.find((item) => String(item.id) === eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });
  if (!event.registrationRequired) {
    return res.status(400).json({ error: "This event does not require registration" });
  }

  const { name, email, phone, quantity } = req.body;
  const qty = Number(quantity) || 1;
  if (!name || !phone) {
    return res.status(400).json({ error: "name and phone are required" });
  }
  if (qty < 1 || qty > 10) {
    return res.status(400).json({ error: "quantity must be between 1 and 10" });
  }

  const total = event.paymentRequired ? event.price * qty : 0;
  const registration = {
    id: randomUUID().slice(0, 8).toUpperCase(),
    eventId,
    eventTitle: event.title,
    name,
    email: email || "",
    phone,
    quantity: qty,
    total,
    createdAt: new Date().toISOString(),
  };

  if (!registrations[eventId]) registrations[eventId] = [];
  registrations[eventId].push(registration);
  saveFile("registrations.json", registrations);
  res.status(201).json(registration);
});

// Coordinator: view registrations for an event
app.get("/api/events/:id/registrations", requireCoordAuth, (req, res) => {
  const eventId = String(req.params.id);
  res.json(registrations[eventId] || []);
});

// ======================================================================
// Other existing endpoints
// ======================================================================
app.get("/api/team", (req, res) => res.json(team));
app.get("/api/gallery", (req, res) => res.json(gallery));

app.get("/api/live-updates", (req, res) => res.json(liveUpdates));
app.post("/api/live-updates", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "text is required" });
  }
  const entry = { id: Date.now(), text, time: new Date().toISOString() };
  liveUpdates = [entry, ...liveUpdates].slice(0, 30);
  res.status(201).json(entry);
});

app.get("/api/event-info", (req, res) =>
  res.json({
    name: "AARPO'26",
    tagline: "Celebrating the Spirit of Onam",
    startDate: "2026-09-14T15:30:00+05:30",
    venue: "Amrita Vishwa Vidyapeetham, Chennai Campus",
  })
);

// ======================================================================
// Kerala Store — Jasmine Flower Roll (Mullappoo) & Mehendi Cones
// ======================================================================
let storeOrders = [];

app.get("/api/kerala-store", (req, res) => res.json(storeProducts));

app.post("/api/kerala-store/order", (req, res) => {
  const { items, name, phone } = req.body;
  if (!Array.isArray(items) || items.length === 0 || !name || !phone) {
    return res.status(400).json({ error: "items, name and phone are required" });
  }
  let total = 0;
  const lines = items.map(({ id, qty }) => {
    const product = storeProducts.find((p) => p.id === id);
    if (!product) throw new Error("invalid product");
    const lineTotal = product.price * qty;
    total += lineTotal;
    return { name: product.name, qty, price: product.price, lineTotal };
  });
  const order = {
    id: randomUUID().slice(0, 8).toUpperCase(),
    lines,
    total,
    name,
    phone,
    createdAt: new Date().toISOString(),
  };
  storeOrders.push(order);
  res.status(201).json(order);
});

// ======================================================================
// Movie Night registration — seat selection + 5-min temporary locking + booking
// ======================================================================
const ROW_LAYOUT = [
  { row: "A", left: 11, right: 11, tier: "near" },
  { row: "B", left: 12, right: 12, tier: "near" },
  { row: "C", left: 12, right: 12, tier: "near" },
  { row: "D", left: 13, right: 13, tier: "near" },
  { row: "E", left: 15, right: 15, tier: "near" },
  { row: "F", left: 16, right: 16, tier: "away" },
  { row: "G", left: 17, right: 17, tier: "away" },
  { row: "H", left: 17, right: 17, tier: "away" },
  { row: "I", left: 18, right: 18, tier: "away" },
  { row: "J", left: 19, right: 19, tier: "away" },
];
const PRICE = { near: 70, away: 100 };
const MOVIE_DATES = ["2026-07-29", "2026-07-30", "2026-07-31"];
const MOVIE_TITLE_BY_DATE = {
  "2026-07-29": "Movie Night — Night 1",
  "2026-07-30": "Movie Night — Night 2",
  "2026-07-31": "Movie Night — Night 3",
};

function isSeatLocked(seat) {
  if (!seat.lockedUntil || !seat.lockedBy) return false;
  if (Date.now() > seat.lockedUntil) {
    seat.lockedBy = null;
    seat.lockedUntil = null;
    return false;
  }
  return true;
}

function cleanupSeatLocks(seatMap) {
  const now = Date.now();
  for (const seat of seatMap) {
    if (seat.lockedUntil && now > seat.lockedUntil) {
      seat.lockedBy = null;
      seat.lockedUntil = null;
    }
  }
}

function buildSeatMap() {
  const seats = [];
  for (const { row, left, right, tier } of ROW_LAYOUT) {
    for (let n = 1; n <= left; n++) {
      seats.push({
        id: `${row}-L-${n}`,
        row,
        side: "left",
        number: n,
        tier,
        price: PRICE[tier],
        booked: false,
        lockedBy: null,
        lockedUntil: null,
      });
    }
    for (let n = 1; n <= right; n++) {
      seats.push({
        id: `${row}-R-${n}`,
        row,
        side: "right",
        number: n,
        tier,
        price: PRICE[tier],
        booked: false,
        lockedBy: null,
        lockedUntil: null,
      });
    }
  }
  return seats;
}

const movieSeatMaps = Object.fromEntries(MOVIE_DATES.map((d) => [d, buildSeatMap()]));
let movieBookings = [];

app.get("/api/registration/movie-shows", (req, res) => {
  res.json(
    MOVIE_DATES.map((date) => {
      cleanupSeatLocks(movieSeatMaps[date]);
      const available = movieSeatMaps[date].filter(
        (s) => !s.booked && !isSeatLocked(s)
      ).length;
      return {
        date,
        title: MOVIE_TITLE_BY_DATE[date],
        venue: "Amritamayi Hall",
        seatsAvailable: available,
        seatsTotal: movieSeatMaps[date].length,
      };
    })
  );
});

app.get("/api/registration/movie-seats", (req, res) => {
  const { date, sessionId } = req.query;
  if (!movieSeatMaps[date]) return res.status(400).json({ error: "invalid or missing date" });
  cleanupSeatLocks(movieSeatMaps[date]);

  const sanitizedSeats = movieSeatMaps[date].map((s) => {
    const locked = isSeatLocked(s);
    const isMyLock = locked && s.lockedBy === sessionId;
    // As requested: seats locked by other users are presented as booked (unavailable)
    const isUnavailable = s.booked || (locked && !isMyLock);
    return {
      id: s.id,
      row: s.row,
      side: s.side,
      number: s.number,
      tier: s.tier,
      price: s.price,
      booked: isUnavailable,
      isMyLock: isMyLock,
      lockedUntil: isMyLock ? s.lockedUntil : null,
    };
  });

  res.json({
    date,
    rows: ROW_LAYOUT.map(({ row, tier }) => ({ row, tier, price: PRICE[tier] })),
    seats: sanitizedSeats,
  });
});

app.post("/api/registration/movie-lock-seats", (req, res) => {
  const { date, seatIds, sessionId, gender } = req.body;
  if (!movieSeatMaps[date]) return res.status(400).json({ error: "invalid or missing date" });
  if (!Array.isArray(seatIds) || seatIds.length === 0 || !sessionId) {
    return res.status(400).json({ error: "seatIds array and sessionId are required" });
  }
  const seatMap = movieSeatMaps[date];
  cleanupSeatLocks(seatMap);

  const seats = seatIds.map((id) => seatMap.find((s) => s.id === id));
  if (seats.some((s) => !s)) {
    return res.status(400).json({ error: "one or more seats do not exist" });
  }

  if (gender === "male" && seats.some((s) => s.side !== "left")) {
    return res.status(400).json({ error: "Male attendees can only reserve seats in the Left Section." });
  }
  if (gender === "female" && seats.some((s) => s.side !== "right")) {
    return res.status(400).json({ error: "Female attendees can only reserve seats in the Right Section." });
  }

  const unavailable = seats.find(
    (s) => s.booked || (isSeatLocked(s) && s.lockedBy !== sessionId)
  );
  if (unavailable) {
    return res.status(409).json({ error: `Seat ${unavailable.id} is already booked or reserved.` });
  }

  // Lock for 5 minutes (300,000 ms)
  const lockedUntil = Date.now() + 5 * 60 * 1000;
  seats.forEach((s) => {
    s.lockedBy = sessionId;
    s.lockedUntil = lockedUntil;
  });

  res.json({ success: true, seatIds, lockedUntil });
});

app.post("/api/registration/movie-unlock-seats", (req, res) => {
  const { date, seatIds, sessionId } = req.body;
  if (!movieSeatMaps[date]) return res.status(400).json({ error: "invalid or missing date" });
  if (!Array.isArray(seatIds) || !sessionId) {
    return res.status(400).json({ error: "seatIds array and sessionId are required" });
  }
  const seatMap = movieSeatMaps[date];
  seatIds.forEach((id) => {
    const seat = seatMap.find((s) => s.id === id);
    if (seat && seat.lockedBy === sessionId) {
      seat.lockedBy = null;
      seat.lockedUntil = null;
    }
  });
  res.json({ success: true });
});

app.post("/api/registration/movie-book", (req, res) => {
  const { date, seatIds, name, email, phone, gender, sessionId, paymentStatus } = req.body;
  if (!movieSeatMaps[date]) return res.status(400).json({ error: "invalid or missing date" });
  if (!Array.isArray(seatIds) || seatIds.length === 0 || !name || !phone) {
    return res.status(400).json({ error: "seatIds, name and phone are required" });
  }
  const seatMap = movieSeatMaps[date];
  cleanupSeatLocks(seatMap);

  const seats = seatIds.map((id) => seatMap.find((s) => s.id === id));
  if (seats.some((s) => !s)) return res.status(400).json({ error: "one or more seats do not exist" });

  if (gender === "male" && seats.some((s) => s.side !== "left")) {
    return res.status(400).json({ error: "Male attendees can only book seats in the Left Section." });
  }
  if (gender === "female" && seats.some((s) => s.side !== "right")) {
    return res.status(400).json({ error: "Female attendees can only book seats in the Right Section." });
  }

  if (paymentStatus === "failed") {
    // Payment failed: release locks
    seats.forEach((s) => {
      if (s.lockedBy === sessionId) {
        s.lockedBy = null;
        s.lockedUntil = null;
      }
    });
    return res.status(400).json({ error: "Payment failed. Your seat lock has been released." });
  }

  const invalidSeat = seats.find(
    (s) => s.booked || (isSeatLocked(s) && s.lockedBy !== sessionId)
  );
  if (invalidSeat) {
    return res.status(409).json({ error: "One or more seats are no longer locked for your session. Lock expired or booked." });
  }

  // Payment successful: permanently lock seats
  seats.forEach((s) => {
    s.booked = true;
    s.lockedBy = null;
    s.lockedUntil = null;
  });
  const total = seats.reduce((sum, s) => sum + s.price, 0);
  const booking = {
    id: randomUUID().slice(0, 8).toUpperCase(),
    type: "movie",
    date,
    title: MOVIE_TITLE_BY_DATE[date],
    seats: seats.map((s) => ({ id: s.id, row: s.row, side: s.side, number: s.number, price: s.price })),
    total,
    name,
    gender: gender || "male",
    email: email || "",
    phone,
    createdAt: new Date().toISOString(),
  };
  movieBookings.push(booking);
  res.status(201).json(booking);
});

// ======================================================================
// DJ Night registration — general admission, no seat selection
// ======================================================================
const DJ_INFO = {
  date: "2026-07-20",
  time: "8:00 PM onwards",
  venue: "Main Stage",
  price: 150,
};
let djBookings = [];

app.get("/api/registration/dj-info", (req, res) => res.json(DJ_INFO));

app.post("/api/registration/dj-book", (req, res) => {
  const { quantity, name, email, phone } = req.body;
  const qty = Number(quantity);
  if (!qty || qty < 1 || qty > 10 || !name || !phone) {
    return res.status(400).json({ error: "quantity (1-10), name and phone are required" });
  }
  const total = qty * DJ_INFO.price;
  const booking = {
    id: randomUUID().slice(0, 8).toUpperCase(),
    type: "dj",
    date: DJ_INFO.date,
    quantity: qty,
    total,
    name,
    email,
    phone,
    createdAt: new Date().toISOString(),
  };
  djBookings.push(booking);
  res.status(201).json(booking);
});

app.post("/api/admin/reset", (req, res) => {
  for (const date of MOVIE_DATES) {
    movieSeatMaps[date] = buildSeatMap();
  }
  movieBookings = [];
  djBookings = [];
  storeOrders = [];
  for (const key of Object.keys(registrations)) {
    registrations[key] = [];
  }
  saveFile("registrations.json", registrations);
  res.json({ success: true, message: "All bookings, orders, and seat locks have been reset." });
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Serve frontend static build files in production
const distPath = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(distPath));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`AARPO'26 API listening on http://localhost:${PORT}`);
});
