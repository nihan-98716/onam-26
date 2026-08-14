import { motion } from "framer-motion";

const BLOCKS = [
  {
    title: "What is Aarpo?",
    body: "Aarpo is Amrita Chennai's annual Onam celebration — days where the campus becomes a courtyard of kasavu and lamplight, food and music, brought together by every department on campus.",
    tone: "gold",
  },
  {
    title: "The Importance of Onam",
    body: "Onam marks the harvest and the Malayalam new year, a festival of gratitude that crosses caste and creed. It is Kerala's most unifying celebration, and Aarpo brings that same spirit to campus life.",
    tone: "maroon",
  },
  {
    title: "The Return of Mahabali",
    body: "Legend holds that King Mahabali returns each Onam to see his people thriving. Aarpo's procession honours that homecoming — a reminder that the festival is, at its heart, about welcome.",
    tone: "gold",
  },
  {
    title: "A Spirit of Unity",
    body: "Students, faculty and staff plan, cook, perform and compete together. Aarpo isn't staged for an audience — it's built by the same people who'll spend the next few days enjoying it.",
    tone: "maroon",
  },
];

const toneMap = {
  gold: "from-kasavu/20 to-kasavu/5 border border-kasavu/30",
  maroon: "from-maroon/25 to-maroon/5 border border-maroon/40",
};

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <p className="font-body text-xs uppercase tracking-[0.3em] text-kasavu/70">About</p>
        <h2 className="font-display text-4xl font-bold text-kasavu sm:text-5xl">
          A Festival Built by the Campus, for the Campus
        </h2>
      </motion.div>

      <div className="space-y-16">
        {BLOCKS.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className={`flex flex-col items-center gap-8 md:flex-row ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div
              className={`h-56 w-full flex-shrink-0 rounded-3xl bg-gradient-to-br ${toneMap[b.tone]} md:w-72 float-card`}
            />
            <div>
              <h3 className="font-display text-2xl font-bold text-ivory sm:text-3xl">
                {b.title}
              </h3>
              <p className="mt-3 font-body leading-relaxed text-ivory/65">
                {b.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
