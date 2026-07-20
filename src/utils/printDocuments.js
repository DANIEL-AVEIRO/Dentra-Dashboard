import { jsPDF } from "jspdf";
import { BRAND_PRIMARY } from "@/theme";

function hexToRgb(hex) {
  const h = String(hex || "#000000").replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16) || 0,
    g: parseInt(h.slice(2, 4), 16) || 0,
    b: parseInt(h.slice(4, 6), 16) || 0,
  };
}

function line(doc, label, value, y) {
  doc.setFont("helvetica", "bold");
  doc.text(`${label}:`, 40, y);
  doc.setFont("helvetica", "normal");
  doc.text(String(value ?? "—"), 140, y);
  return y + 18;
}

function header(doc, title) {
  const brand = hexToRgb(BRAND_PRIMARY);
  doc.setFontSize(16);
  doc.setTextColor(brand.r, brand.g, brand.b);
  doc.text(title, 40, 40);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  return 68;
}

export function printWorkTicket(caseRow) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = header(doc, "Work Ticket");
  y = line(doc, "Case", caseRow?.case_id, y);
  y = line(doc, "Patient", caseRow?.patient_name, y);
  y = line(doc, "Clinic", caseRow?.clinic_name, y);
  y = line(doc, "Assignee", caseRow?.assigned_to_name, y);
  y = line(doc, "Priority", caseRow?.priority, y);
  y = line(doc, "Status", caseRow?.status, y);
  y = line(doc, "Due", caseRow?.due_date || caseRow?.sla_due_at, y);
  y = line(doc, "Amount", caseRow?.amount, y);
  doc.save(`work-ticket-${caseRow?.case_id || "case"}.pdf`);
}

export function printDeliveryNote(deliveryOrCase) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = header(doc, "Delivery Note");
  y = line(
    doc,
    "Case",
    deliveryOrCase?.case_id_display || deliveryOrCase?.case_id,
    y,
  );
  y = line(doc, "Clinic", deliveryOrCase?.clinic_name, y);
  y = line(doc, "Patient", deliveryOrCase?.patient_name, y);
  y = line(doc, "Status", deliveryOrCase?.status, y);
  y = line(doc, "Scheduled", deliveryOrCase?.scheduled_date, y);
  y = line(doc, "Delivered", deliveryOrCase?.delivered_at, y);
  y = line(doc, "Notes", deliveryOrCase?.notes, y);
  doc.save(
    `delivery-note-${deliveryOrCase?.case_id_display || deliveryOrCase?.case_id || "delivery"}.pdf`,
  );
}

export function printInvoice(invoice) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = header(doc, "Invoice");
  y = line(doc, "Invoice #", invoice?.invoice_number, y);
  y = line(doc, "Clinic", invoice?.clinic_name, y);
  y = line(doc, "Date", invoice?.invoice_date, y);
  y = line(doc, "Due", invoice?.due_date, y);
  y = line(doc, "Status", invoice?.status, y);
  y = line(doc, "Subtotal", invoice?.subtotal ?? invoice?.amount, y);
  y = line(doc, "Discount", invoice?.discount, y);
  y = line(doc, "Tax", invoice?.tax, y);
  y = line(doc, "Grand total", invoice?.grand_total, y);
  y = line(doc, "Balance due", invoice?.balance_due, y);
  doc.save(`invoice-${invoice?.invoice_number || invoice?.id || "invoice"}.pdf`);
}
