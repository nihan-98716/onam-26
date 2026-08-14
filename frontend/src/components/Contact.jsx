export default function Contact() {
  return (
    <footer id="contact" className="border-t border-kasavu/20 bg-black px-6 py-16 text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2">
        <div>
          <p className="font-display text-2xl font-bold">
            AARPO<span className="text-maroon">'26</span>
          </p>
          <p className="mt-3 max-w-xs font-body text-sm text-ivory/50">
            Amrita Vishwa Vidyapeetham, Chennai Campus
            <br />
            337/1A, Vengal Village, Thiruvallur Taluk &amp; District,
            Tamil Nadu 601103.
          </p>
        </div>

        <div>
          <p className="font-body text-xs uppercase tracking-widest text-kasavu">Reach Us</p>
          <a
            data-cursor-lotus
            href="https://www.instagram.com/onam.avv/"
            target="_blank"
            rel="noreferrer"
            className="mt-3 block w-fit font-body text-sm text-ivory/70 transition-colors hover:text-kasavu"
          >
            Instagram: @onam.avv
          </a>
        </div>
      </div>

      <div className="kasavu-border mx-auto mt-10 max-w-6xl border-t border-kasavu/10 pt-6 text-center">
        <p className="font-body text-xs text-ivory/30">
          © 2026 Amrita Vishwa Vidyapeetham, Chennai Campus. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
