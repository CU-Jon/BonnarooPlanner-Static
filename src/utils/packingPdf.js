// src/utils/packingPdf.js
import { jsPDF } from 'jspdf';

const PAGE_W = 215.9;
const PAGE_H = 279.4;
const MARGIN_X = 16.5;
const MARGIN_Y = 19;
const COL_GAP = 8;
const COL_W = (PAGE_W - MARGIN_X * 2 - COL_GAP) / 2;
const BOX_SIZE = 3.5;
const ITEM_H = 5.5;
const LINE_H = 3.5;
const TEXT_X_OFFSET = 1 + BOX_SIZE + 2;
const CAT_HEADER_H = 7;
const CAT_GAP = 4;

/**
 * Generates a 2-column PDF of the packing list and triggers a browser download.
 *
 * @param {Array} categories - Array of { name, items: [{ name }] } with selected items only.
 * @param {string} filename - Output filename for the PDF.
 */
export function generatePackingPdf(categories, filename) {
    const doc = new jsPDF({ unit: 'mm', format: 'letter' });

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('BONNAROO PACKING LIST', PAGE_W / 2, MARGIN_Y - 4, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
        `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        PAGE_W / 2,
        MARGIN_Y + 1,
        { align: 'center' }
    );

    // Ruled separator below title
    const titleBottom = MARGIN_Y + 4;
    doc.setLineWidth(0.4);
    doc.line(MARGIN_X, titleBottom, PAGE_W - MARGIN_X, titleBottom);

    let col = 0;
    let y = titleBottom + CAT_GAP;

    const colX = () => MARGIN_X + col * (COL_W + COL_GAP);

    const addPage = () => {
        doc.addPage();
        col = 0;
        y = MARGIN_Y;
    };

    const nextCol = () => {
        if (col === 0) {
            col = 1;
            y = titleBottom + CAT_GAP;
        } else {
            addPage();
        }
    };

    const pageBottom = PAGE_H - MARGIN_Y;

    const drawCatHeader = (label) => {
        const cx = colX();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        const headerLines = doc.splitTextToSize(label, COL_W - 4);
        const headerH = CAT_HEADER_H + Math.max(0, headerLines.length - 1) * LINE_H;
        doc.setFillColor(230, 230, 230);
        doc.rect(cx, y, COL_W, headerH, 'F');
        const baseline = y + CAT_HEADER_H - 2;
        headerLines.forEach((line, i) => {
            doc.text(line, cx + 2, baseline + i * LINE_H);
        });
        y += headerH;
    };

    for (const cat of categories) {
        if (!cat.items.length) continue;

        const blockH = CAT_HEADER_H + cat.items.length * ITEM_H + CAT_GAP;

        if (y + blockH > pageBottom) {
            nextCol();
        }

        const x = colX();

        // Category header
        drawCatHeader(cat.name.toUpperCase());

        // Items
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const textMaxW = COL_W - TEXT_X_OFFSET - 1;
        for (const item of cat.items) {
            const lines = doc.splitTextToSize(item.name, textMaxW);
            const rowH = ITEM_H + Math.max(0, lines.length - 1) * LINE_H;
            if (y + rowH > pageBottom) {
                nextCol();
                y = col === 0 ? MARGIN_Y : titleBottom + CAT_GAP;
                drawCatHeader(`${cat.name.toUpperCase()} (CONT'D)`);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
            }
            const ix = colX();
            doc.setLineWidth(0.3);
            doc.rect(ix + 1, y + 0.8, BOX_SIZE, BOX_SIZE);
            const firstBaseline = y + ITEM_H - 1.2;
            lines.forEach((line, i) => {
                doc.text(line, ix + TEXT_X_OFFSET, firstBaseline + i * LINE_H);
            });
            y += rowH;
        }

        y += CAT_GAP;
    }

    doc.save(filename);
}
