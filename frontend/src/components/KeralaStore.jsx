import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "../hooks/useApi.js";

export default function KeralaStore() {
  const { data: products } = useApi("/kerala-store", []);
  const [qty, setQty] = useState({});
  const [form, setForm] = useState({ name: "", phone: "" });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const setQuantity = (id, val) => setQty((q) => ({ ...q, [id]: Math.max(0, val) }));

  const cartItems = products
    .map((p) => ({ ...p, count: qty[p.id] || 0 }))
    .filter((p) => p.count > 0);
  const total = cartItems.reduce((sum, p) => sum + p.price * p.count, 0);

  const placeOrder = async () => {
    setError("");
    if (cartItems.length === 0) return setError("Add at least one item first.");
    if (!form.name || !form.phone) return setError("Name and phone are required.");
    setSubmitting(true);
    try {
      const res = await fetch("/api/kerala-store/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((p) => ({ id: p.id, qty: p.count })),
          name: form.name,
          phone: form.phone,
        }),
      });
      if (!res.ok) throw new Error("Order failed");
      const data = await res.json();
      setOrder(data);
      setQty({});
    } catch (e) {
      setError("Couldn't place the order — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="kerala-store" className="bg-charcoal/60 px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-kasavu/70">Onam Essentials</p>
          <h2 className="font-display text-4xl font-bold text-kasavu sm:text-5xl">Kerala Store</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {products.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="float-card rounded-2xl border border-kasavu/20 bg-noir p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-ivory">{p.name}</h3>
                  <p className="font-body text-xs italic text-kasavu/70">{p.malayalam}</p>
                </div>
                <span className="font-display text-xl font-bold text-maroon">₹{p.price}</span>
              </div>
              <p className="mt-2 font-body text-sm text-ivory/60">{p.note}</p>
              <p className="mt-1 font-body text-xs text-ivory/40">{p.unit}</p>

              <div className="mt-4 flex items-center gap-3">
                <button
                  data-cursor-lotus
                  onClick={() => setQuantity(p.id, (qty[p.id] || 0) - 1)}
                  className="h-8 w-8 rounded-full border border-kasavu/40 text-kasavu hover:bg-kasavu/10"
                >
                  −
                </button>
                <span className="w-6 text-center font-body text-ivory">{qty[p.id] || 0}</span>
                <button
                  data-cursor-lotus
                  onClick={() => setQuantity(p.id, (qty[p.id] || 0) + 1)}
                  className="h-8 w-8 rounded-full border border-kasavu/40 text-kasavu hover:bg-kasavu/10"
                >
                  +
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mt-10 rounded-2xl p-6"
          >
            <h4 className="mb-3 font-display text-lg font-bold text-kasavu">Your Order</h4>
            <ul className="mb-4 space-y-1 font-body text-sm text-ivory/75">
              {cartItems.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>{p.name} × {p.count}</span>
                  <span>₹{p.price * p.count}</span>
                </li>
              ))}
            </ul>
            <div className="mb-4 flex justify-between border-t border-kasavu/20 pt-3 font-display font-bold text-ivory">
              <span>Total</span>
              <span className="text-maroon">₹{total}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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

            <button
              data-cursor-lotus
              onClick={placeOrder}
              disabled={submitting}
              className="ripple-btn mt-4 w-full rounded-full bg-maroon py-3 font-body text-sm font-semibold text-ivory transition-colors hover:bg-[#8f0f17] disabled:opacity-50"
            >
              {submitting ? "Placing order…" : "Place Order"}
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 rounded-2xl border border-kasavu/40 bg-kasavu/10 p-6 text-center"
            >
              <p className="font-display text-lg font-bold text-kasavu">
                Order confirmed — #{order.id}
              </p>
              <p className="mt-1 font-body text-sm text-ivory/70">
                Show this order ID at the Kerala Store counter to collect and pay ₹{order.total} on pickup.
              </p>
              <button
                onClick={() => setOrder(null)}
                className="mt-3 font-body text-xs text-kasavu/70 underline"
              >
                Place another order
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
