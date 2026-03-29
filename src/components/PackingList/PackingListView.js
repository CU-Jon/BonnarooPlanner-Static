// src/components/PackingList/PackingListView.js
import React from 'react';

export default function PackingListView({ selectedCategories, onBack, onStartOver, onPrint, onPdf, onExport }) {
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="packing-list-view">
            <div className="list-view-header no-print">
                <h2>Your Packing List</h2>
                <div className="list-view-actions">
                    <button className="btn btn-back" type="button" onClick={onBack}>
                        ← Back to Selection
                    </button>
                    <button className="btn btn-print" type="button" onClick={onPrint}>
                        Print
                    </button>
                    <button className="btn btn-pdf" type="button" onClick={onPdf}>
                        Save as PDF
                    </button>
                    <button className="btn btn-start-over" type="button" onClick={onStartOver}>
                        Start Over
                    </button>
                    <button
                        className="btn btn-export-json has-tooltip"
                        type="button"
                        onClick={onExport}
                        data-tooltip="Saves all your checked items to a file on your device. Next time you visit, hit “Load Saved List” to restore everything instantly — great for planning ahead or sharing your list with a friend!"
                    >
                        Save My List
                    </button>
                </div>
            </div>

            {/* Shown only during print */}
            <div className="print-title" aria-hidden="true">Bonnaroo Packing List</div>
            <div className="print-date" aria-hidden="true">Generated: {today}</div>

            <div className="list-output-grid">
                {selectedCategories.length === 0 ? (
                    <p className="empty-list-message">
                        No items selected. Go back and check what you&apos;re bringing.
                    </p>
                ) : (
                    selectedCategories.map((cat) => (
                        <div key={cat.name} className="list-category-card">
                            <table className="list-category-block">
                                <colgroup>
                                    <col className="print-box-col" />
                                    <col />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th colSpan="2">{cat.name}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cat.items.map((item) => (
                                        <tr key={item.name}>
                                            <td className="print-box-cell">
                                                <span className="print-box" aria-hidden="true" />
                                            </td>
                                            <td>{item.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
