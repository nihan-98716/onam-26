import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

export default function TicketQR({ title, subtitle, lines, total, ticketId, payload }) {
  const exportPDF = () => {
    const svgEl = document.querySelector("#qr-svg-container svg");
    if (!svgEl) return;

    const svgString = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const blobURL = URL.createObjectURL(svgBlob);
    const image = new Image();
    
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 280; 
      canvas.height = 280;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, 280, 280);
      const pngDataUrl = canvas.toDataURL("image/png");
      URL.revokeObjectURL(blobURL);

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a6",
      });

      // Dark theme background
      doc.setFillColor(10, 9, 8); 
      doc.rect(0, 0, 105, 148, "F");

      // Gold border frame
      doc.setStrokeColor(212, 175, 55); 
      doc.setLineWidth(0.5);
      doc.rect(4, 4, 97, 140);
      
      // Header
      doc.setTextColor(212, 175, 55);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.text("AARPO'26 E-TICKET", 52.5, 14, { align: "center" });

      doc.setTextColor(245, 237, 225); 
      doc.setFontSize(13);
      const titleLines = doc.splitTextToSize(title, 85);
      doc.text(titleLines, 52.5, 22, { align: "center" });

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(170, 170, 170);
      doc.text(subtitle, 52.5, 30, { align: "center" });

      // Separator
      doc.setStrokeColor(212, 175, 55);
      doc.setLineDashPattern([2, 1.5], 0);
      doc.line(10, 36, 95, 36);
      doc.setLineDashPattern([], 0);

      // Info Rows
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      let y = 44;
      lines.forEach(([label, value]) => {
        doc.setTextColor(150, 150, 150);
        doc.text(label, 12, y);
        doc.setTextColor(245, 237, 225);
        doc.setFont("Helvetica", "bold");
        doc.text(value, 93, y, { align: "right" });
        doc.setFont("Helvetica", "normal");
        y += 6.5;
      });

      // Total Paid
      doc.setStrokeColor(212, 175, 55);
      doc.line(12, y, 93, y);
      y += 6.5;
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(245, 237, 225);
      doc.text("Total Paid", 12, y);
      doc.setTextColor(179, 18, 28); 
      doc.text(`Rs. ${total}`, 93, y, { align: "right" });

      // Separator
      y += 6.5;
      doc.setStrokeColor(212, 175, 55);
      doc.setLineDashPattern([2, 1.5], 0);
      doc.line(10, y, 95, y);
      doc.setLineDashPattern([], 0);

      // Draw QR Code image
      doc.addImage(pngDataUrl, "PNG", 35, y + 6, 35, 35);

      // Ticket ID
      doc.setTextColor(212, 175, 55);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.text(`TICKET ID: ${ticketId}`, 52.5, y + 46, { align: "center" });

      doc.setTextColor(120, 120, 120);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(6.5);
      doc.text("Present this ticket at the venue entrance.", 52.5, y + 51, { align: "center" });

      doc.save(`aarpo26-ticket-${ticketId.toLowerCase()}.pdf`);
    };

    image.src = blobURL;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="mx-auto mt-8 max-w-md overflow-hidden rounded-3xl border border-kasavu/40 bg-gradient-to-b from-charcoal to-noir shadow-[0_0_50px_-15px_rgba(212,175,55,0.4)]"
    >
      <div className="border-b border-dashed border-kasavu/30 p-6 text-center">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-kasavu/70">AARPO'26 · E-Ticket</p>
        <h3 className="mt-1 font-display text-2xl font-bold text-ivory">{title}</h3>
        {subtitle && <p className="mt-1 font-body text-sm text-ivory/60">{subtitle}</p>}
      </div>

      <div className="space-y-1 px-6 py-4 font-body text-sm text-ivory/75">
        {lines.map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <span className="text-ivory/50">{label}</span>
            <span className="font-semibold text-ivory">{value}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-kasavu/20 pt-2 font-display font-bold">
          <span className="text-ivory">Total Paid</span>
          <span className="text-maroon">₹{total}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 border-t border-dashed border-kasavu/30 bg-noir p-6">
        <div className="rounded-xl bg-ivory p-3" id="qr-svg-container">
          <QRCodeSVG value={payload} size={140} fgColor="#0A0908" bgColor="#F5EDE1" />
        </div>
        <p className="font-body text-xs tracking-widest text-kasavu/70">TICKET ID · {ticketId}</p>
        <p className="text-center font-body text-[11px] text-ivory/40">
          Present this QR code at entry. Download the PDF ticket below.
        </p>

        <button
          type="button"
          onClick={exportPDF}
          className="mt-3 w-full rounded-xl border border-kasavu bg-kasavu/20 py-2.5 text-xs font-bold uppercase tracking-wider text-kasavu hover:bg-kasavu hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download PDF Ticket</span>
        </button>
      </div>
    </motion.div>
  );
}
