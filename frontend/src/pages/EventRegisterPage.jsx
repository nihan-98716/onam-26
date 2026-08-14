import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageFrame from "../components/PageFrame.jsx";

export default function EventRegisterPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [booking, setBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: 1,
  });

  useEffect(() => {
    fetch(`/api/timeline/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Event not found");
        return r.json();
      })
      .then((data) => {
        if (!data.registrationRequired) {
          setError("This event does not require registration.");
        }
        setEvent(data);
      })
      .catch(() => setError("Event not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const total = event?.paymentRequired ? event.price * form.quantity : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert("Name and Phone are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setBooking(data);
        setSubmitted(true);
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch {
      alert("Could not reach server.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <PageFrame>
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="text-ivory/50 text-sm">Loading event...</div>
        </div>
      </PageFrame>
    );
  }

  // Error / not found
  if (error || !event) {
    return (
      <PageFrame>
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-kasavu mb-4">Event Not Found</h1>
            <p className="text-sm text-ivory/60 mb-6">{error || "This event doesn't exist."}</p>
            <Link to="/events" className="rounded-full border border-kasavu bg-kasavu/20 px-6 py-2.5 text-xs font-bold text-kasavu hover:bg-kasavu hover:text-black transition-all">
              Back to Events
            </Link>
          </div>
        </div>
      </PageFrame>
    );
  }

  // Confirmation
  if (submitted && booking) {
    return (
      <PageFrame>
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg rounded-3xl border border-kasavu/40 bg-black/70 p-10 text-center backdrop-blur-xl shadow-2xl"
          >
            {/* Checkmark */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-kasavu bg-kasavu/10">
              <svg className="h-10 w-10 text-kasavu" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-display text-3xl font-bold text-kasavu mb-2">Registration Confirmed!</h1>
            <p className="text-sm text-ivory/60 mb-6">You're registered for <span className="text-ivory font-semibold">{event.title}</span></p>

            {/* Booking Details Card */}
            <div className="rounded-2xl border border-white/10 bg-black/50 p-6 text-left space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-ivory/60">Booking ID</span>
                <span className="font-mono font-bold text-kasavu">{booking.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ivory/60">Name</span>
                <span className="text-ivory">{booking.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ivory/60">Phone</span>
                <span className="text-ivory">{booking.phone}</span>
              </div>
              {booking.email && (
                <div className="flex justify-between text-sm">
                  <span className="text-ivory/60">Email</span>
                  <span className="text-ivory">{booking.email}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-ivory/60">Quantity</span>
                <span className="text-ivory">{booking.quantity} {booking.quantity > 1 ? "persons" : "person"}</span>
              </div>
              {event.paymentRequired && (
                <>
                  <div className="border-t border-white/10 my-2" />
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-ivory/80">Total Amount</span>
                    <span className="text-kasavu text-lg">₹{booking.total}</span>
                  </div>
                  <p className="text-[11px] text-ivory/40">Payment to be made at the venue.</p>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/events" className="rounded-full border border-kasavu bg-kasavu px-6 py-2.5 text-xs font-bold uppercase text-black hover:bg-kasavu/80 transition-all">
                Back to Events
              </Link>
            </div>
          </motion.div>
        </div>
      </PageFrame>
    );
  }

  // Registration Form
  return (
    <PageFrame>
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/events"
          className="group inline-flex items-center gap-2.5 rounded-full border border-kasavu/40 bg-kasavu/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-kasavu transition-all duration-300 hover:border-kasavu hover:bg-kasavu hover:text-black hover:shadow-lg hover:shadow-kasavu/25 active:scale-95 backdrop-blur-md mb-8"
        >
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Back to Events</span>
        </Link>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Event Info Panel */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-24 rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl"
            >
              {/* Poster */}
              {event.poster && (
                <div className="mb-5 overflow-hidden rounded-2xl border border-white/10">
                  <img src={event.poster} alt={event.title} className="w-full object-cover" />
                </div>
              )}

              <span className="text-[10px] uppercase font-bold tracking-widest text-maroon">{event.category || "Event"}</span>
              <h2 className="mt-1 font-display text-2xl font-bold text-kasavu">{event.title}</h2>

              <div className="mt-4 space-y-2 text-sm text-ivory/70">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-kasavu/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-kasavu/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  <span>{event.venue}</span>
                </div>
                {event.paymentRequired && (
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-kasavu/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
                    <span className="text-kasavu font-semibold">₹{event.price} per person</span>
                  </div>
                )}
              </div>

              {event.description && (
                <p className="mt-4 text-xs text-ivory/50 leading-relaxed">{event.description}</p>
              )}
            </motion.div>
          </div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="rounded-3xl border border-kasavu/30 bg-black/60 p-8 backdrop-blur-xl shadow-2xl">
              <h2 className="font-display text-2xl font-bold text-kasavu mb-1">Register for this Event</h2>
              <p className="text-sm text-ivory/60 mb-8">Fill in your details below to secure your spot.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ivory/70">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3.5 text-sm text-ivory placeholder-ivory/30 focus:border-kasavu focus:outline-none focus:ring-1 focus:ring-kasavu/50 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ivory/70">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3.5 text-sm text-ivory placeholder-ivory/30 focus:border-kasavu focus:outline-none focus:ring-1 focus:ring-kasavu/50 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ivory/70">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3.5 text-sm text-ivory placeholder-ivory/30 focus:border-kasavu focus:outline-none focus:ring-1 focus:ring-kasavu/50 transition-all"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ivory/70">Number of Attendees</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/60 text-ivory hover:border-kasavu hover:text-kasavu transition-all"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-lg font-bold text-ivory">{form.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, quantity: Math.min(10, form.quantity + 1) })}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/60 text-ivory hover:border-kasavu hover:text-kasavu transition-all"
                    >
                      +
                    </button>
                    <span className="text-xs text-ivory/40 ml-2">Max 10</span>
                  </div>
                </div>

                {/* Payment Summary */}
                {event.paymentRequired && (
                  <div className="rounded-2xl border border-kasavu/30 bg-kasavu/5 p-5 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-kasavu/80">Payment Summary</p>
                    <div className="flex justify-between text-sm text-ivory/70">
                      <span>₹{event.price} × {form.quantity} {form.quantity > 1 ? "persons" : "person"}</span>
                      <span className="text-kasavu font-semibold">₹{total}</span>
                    </div>
                    <p className="text-[11px] text-ivory/40 pt-1 border-t border-white/10">Payment to be made at the venue counter.</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl border border-kasavu bg-kasavu py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-kasavu/80 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-kasavu/20 mt-4"
                >
                  {submitting ? "Registering..." : event.paymentRequired ? `Register — ₹${total}` : "Register Now"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </PageFrame>
  );
}
