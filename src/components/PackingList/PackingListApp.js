// src/components/PackingList/PackingListApp.js
import React, { useState, useEffect, useRef } from 'react';
import Footer from '../Footer';
import CategoryCard from './CategoryCard';
import AddCategoryModal from './AddCategoryModal';
import PackingListView from './PackingListView';
import { exportToJson, readJsonFile, mergeImportedData } from '../../utils/packingExporter';
import { generatePackingPdf } from '../../utils/packingPdf';
import { PACKING_JSON_PATH, PACKING_PDF_FILENAME, PACKING_SAVE_FILENAME_TEMPLATE } from '../../config';

export default function PackingListApp() {
    const [categories, setCategories] = useState([]);
    const [view, setView] = useState('selection');
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch(PACKING_JSON_PATH)
            .then((r) => {
                if (!r.ok) throw new Error(`Failed to load packing list: ${r.status}`);
                return r.json();
            })
            .then((data) => {
                const loaded = Object.entries(data).map(([name, items]) => ({
                    name,
                    isCustomCategory: false,
                    items: items.map((itemName) => ({
                        name: itemName,
                        isCustomItem: false,
                        selected: false
                    }))
                }));
                setCategories(loaded);
            })
            .catch((err) => console.error(err));
    }, []);

    // ── Item selection ──────────────────────────────────────────────

    const toggleItem = (catName, itemName) => {
        setCategories((prev) =>
            prev.map((cat) => {
                if (cat.name !== catName) return cat;
                return {
                    ...cat,
                    items: cat.items.map((item) =>
                        item.name === itemName
                            ? { ...item, selected: !item.selected }
                            : item
                    )
                };
            })
        );
    };

    const selectAll = (catName) => {
        setCategories((prev) =>
            prev.map((cat) => {
                if (cat.name !== catName) return cat;
                return {
                    ...cat,
                    items: cat.items.map((item) => ({ ...item, selected: true }))
                };
            })
        );
    };

    const deselectAll = (catName) => {
        setCategories((prev) =>
            prev.map((cat) => {
                if (cat.name !== catName) return cat;
                return {
                    ...cat,
                    items: cat.items.map((item) => ({ ...item, selected: false }))
                };
            })
        );
    };

    // ── Custom categories ───────────────────────────────────────────

    const addCategory = (name) => {
        setCategories((prev) => [
            ...prev,
            { name, isCustomCategory: true, items: [] }
        ]);
        setShowAddCategoryModal(false);
    };

    const deleteCategory = (name) => {
        setCategories((prev) => prev.filter((cat) => cat.name !== name));
    };

    // ── Custom items ────────────────────────────────────────────────

    const addItem = (catName, itemName) => {
        setCategories((prev) =>
            prev.map((cat) => {
                if (cat.name !== catName) return cat;
                return {
                    ...cat,
                    items: [
                        ...cat.items,
                        { name: itemName, isCustomItem: true, selected: true }
                    ]
                };
            })
        );
    };

    const deleteItem = (catName, itemName) => {
        setCategories((prev) =>
            prev.map((cat) => {
                if (cat.name !== catName) return cat;
                return {
                    ...cat,
                    items: cat.items.filter((item) => item.name !== itemName)
                };
            })
        );
    };

    // ── Import / Export ─────────────────────────────────────────────

    const handleExport = () => {
        const date = new Date().toISOString().slice(0, 10);
        const filename = PACKING_SAVE_FILENAME_TEMPLATE.replace('{date}', date);
        exportToJson(categories, filename);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';
        try {
            const imported = await readJsonFile(file);
            setCategories((prev) => {
                try {
                    return mergeImportedData(prev, imported);
                } catch (error) {
                    console.error('Failed to merge imported packing data', error);
                    return prev;
                }
            });
        } catch {
            // Silent fail — invalid file
        }
    };

    // ── Generate list (navigate to list view) ───────────────────────

    const selectedCount = categories.reduce(
        (sum, cat) => sum + cat.items.filter((i) => i.selected).length,
        0
    );

    const getSelectedCategories = () =>
        categories
            .map((cat) => ({
                name: cat.name,
                items: cat.items.filter((i) => i.selected)
            }))
            .filter((cat) => cat.items.length > 0);

    const handleGenerate = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setView('list');
    };

    const handleBack = () => setView('selection');

    const handleStartOver = () => {
        setCategories((prev) =>
            prev
                .filter((cat) => !cat.isCustomCategory)
                .map((cat) => ({
                    ...cat,
                    items: cat.items
                        .filter((item) => !item.isCustomItem)
                        .map((item) => ({ ...item, selected: false }))
                }))
        );
        setView('selection');
    };

    const handlePrint = () => window.print();

    const handlePdf = () => {
        const date = new Date().toISOString().slice(0, 10);
        const filename = PACKING_PDF_FILENAME.replace('.pdf', `-${date}.pdf`);
        generatePackingPdf(getSelectedCategories(), filename);
    };

    // ── Render ──────────────────────────────────────────────────────

    return (
        <div className="page-wrap">
            <header className="site-header">
                <div className="no-print" style={{ marginBottom: '0.5rem' }}>
                    <a href="/" className="btn btn-home">
                        &larr; Home
                    </a>
                </div>
                <h1><span>Bonnaroo</span> Packing List</h1>
                <p>Check what you&apos;re bringing &mdash; generate your list</p>
            </header>

            {view === 'selection' && (
                <div className="toolbar">
                    <div className="toolbar-left">
                        <button
                            className="btn btn-add-category"
                            type="button"
                            onClick={() => setShowAddCategoryModal(true)}
                        >
                            + Add Category
                        </button>
                        <button
                            className="btn btn-import-json"
                            type="button"
                            onClick={handleImportClick}
                        >
                            Load Saved List
                        </button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        aria-label="Load a previously saved packing list file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            )}

            <main>
                {view === 'selection' && (
                    <section
                        className="packing-selection-view"
                        aria-label="Item selection"
                    >
                        <div className="view-header">
                            <h2>Select Your Items</h2>
                            <span className="selection-hint">
                                Check everything you plan to bring, then generate your list.
                            </span>
                        </div>

                        <div id="categoryGrid" role="list" aria-label="Packing categories">
                            {categories.map((cat, idx) => (
                                <CategoryCard
                                    key={cat.name}
                                    name={cat.name}
                                    items={cat.items}
                                    isCustomCategory={cat.isCustomCategory}
                                    cardIndex={idx}
                                    onToggleItem={toggleItem}
                                    onSelectAll={selectAll}
                                    onDeselectAll={deselectAll}
                                    onDeleteCategory={deleteCategory}
                                    onAddItem={addItem}
                                    onDeleteItem={deleteItem}
                                />
                            ))}
                        </div>

                        <div className="generate-bottom-padding" />
                    </section>
                )}

                {view === 'list' && (
                    <PackingListView
                        selectedCategories={getSelectedCategories()}
                        onBack={handleBack}
                        onStartOver={handleStartOver}
                        onPrint={handlePrint}
                        onPdf={handlePdf}
                        onExport={handleExport}
                    />
                )}
            </main>

            {view === 'selection' && (
                <div
                    className="generate-summary-bar"
                    role="region"
                    aria-label="Generate summary"
                >
                    <span className="summary-text">
                        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
                    </span>
                    <button
                        className="btn btn-generate"
                        type="button"
                        disabled={selectedCount === 0}
                        onClick={handleGenerate}
                    >
                        Generate My List →
                    </button>
                </div>
            )}

            <Footer />

            {showAddCategoryModal && (
                <AddCategoryModal
                    existingNames={categories.map((c) => c.name)}
                    onConfirm={addCategory}
                    onClose={() => setShowAddCategoryModal(false)}
                />
            )}
        </div>
    );
}
