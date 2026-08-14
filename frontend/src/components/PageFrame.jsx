export default function PageFrame({ children, className = "" }) {
  return (
    <main className="relative min-h-screen text-ivory">
      {/* Page Content */}
      <div className={`relative z-10 min-h-[calc(100vh-6rem)] pt-24 pb-12 ${className}`.trim()}>
        {children}
      </div>
    </main>
  );
}
