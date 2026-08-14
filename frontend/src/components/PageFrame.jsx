export default function PageFrame({ children, className = "" }) {
  return (
    <main className="relative min-h-screen bg-noir text-ivory">
      {/* Dimmed Static Background Image for Parallax Scroll */}
      <div 
        className="fixed inset-0 bg-[url('/images/remb_mob.webp')] bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none z-0 opacity-[0.20]"
        style={{ filter: "brightness(0.6)" }}
      />
      
      {/* Page Content */}
      <div className={`relative z-10 min-h-[calc(100vh-6rem)] pt-24 pb-12 ${className}`.trim()}>
        {children}
      </div>
    </main>
  );
}
