import { useEffect, useState } from "react";
import TicketQR from "./TicketQR.jsx";
import RippleButton from "./RippleButton.jsx";

export default function DJBooking() {
  const [info, setInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    fetch("/api/registration/dj-info")
      .then((r) => r.json())
      .then(setInfo)
      .catch(() => setInfo(null));
  }, []);

  if (ticket) {
    return (
      <TicketQR
        title="DJ Night — General Admission"
        subtitle="Main Stage · 20 July, 8:00 PM onwards"
        lines={[
          ["Name", ticket.name],
          ["Quantity", ticket.quantity],
          ["Phone", ticket.phone],
        ]}
        total={ticket.total}
        ticketId={ticket.id}
        payload={JSON.stringify({ id: ticket.id, type: "dj", quantity: ticket.quantity, name: ticket.name })}
      />
    );
  }

  if (!info) return null;

  const total = quantity * info.price;

  const submit = async () => {
    setError("");
    if (!form.name || !form.phone) return setError("Name and phone are required.");
    setSubmitting(true);
    try {
      const res = await fetch("/api/registration/dj-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setTicket(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass mx-auto max-w-md rounded-2xl p-8 text-center">
      <h3 className="font-display text-2xl font-bold text-ivory">DJ Night</h3>
      <p className="mt-1 font-body text-sm text-ivory/60">
        {info.venue} · {new Date(info.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long" })}, {info.time}
      </p>
      <p className="mt-3 font-display text-3xl font-bold text-maroon">₹{info.price}</p>
      <p className="font-body text-xs text-ivory/40">per ticket · general admission, no seat allotted</p>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="h-9 w-9 rounded-full border border-kasavu/40 text-kasavu hover:bg-kasavu/10"
        >
          −
        </button>
        <span className="w-8 font-display text-xl font-bold text-ivory">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(10, q + 1))}
          className="h-9 w-9 rounded-full border border-kasavu/40 text-kasavu hover:bg-kasavu/10"
        >
          +
        </button>
      </div>

      <div className="mt-6 grid gap-3 text-left">
        <input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="rounded-lg border border-kasavu/30 bg-noir px-3 py-2 font-body text-sm text-ivory placeholder:text-ivory/30 focus:border-kasavu focus:outline-none"
        />
        <input
          placeholder="Email (for confirmation)"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="rounded-lg border border-kasavu/30 bg-noir px-3 py-2 font-body text-sm text-ivory placeholder:text-ivory/30 focus:border-kasavu focus:outline-none"
        />
        <input
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="rounded-lg border border-kasavu/30 bg-noir px-3 py-2 font-body text-sm text-ivory placeholder:text-ivory/30 focus:border-kasavu focus:outline-none"
        />
      </div>

      {error && <p className="mt-3 font-body text-sm text-maroon">{error}</p>}

      <RippleButton onClick={submit} className="mt-6 w-full" disabled={submitting}>
        {submitting ? "Processing payment…" : `Pay ₹${total} & Get Ticket`}
      </RippleButton>
    </div>
  );
}
