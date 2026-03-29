// src/components/PackingList/AddCategoryModal.js
import React, { useState, useEffect, useRef } from 'react';

export default function AddCategoryModal({ existingNames, onConfirm, onClose }) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') onClose();
    };

    const handleConfirm = () => {
        const trimmed = value.trim();
        if (!trimmed) {
            setError('Category name cannot be empty.');
            return;
        }
        const duplicate = existingNames.some(
            (n) => n.toLowerCase() === trimmed.toLowerCase()
        );
        if (duplicate) {
            setError(`"${trimmed}" already exists.`);
            return;
        }
        onConfirm(trimmed);
    };

    return (
        <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-cat-modal-title"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal">
                <h2 id="add-cat-modal-title">Add Category</h2>
                <p className="modal-hint">Give your custom category a name.</p>
                <input
                    ref={inputRef}
                    className="modal-input"
                    type="text"
                    placeholder="Category name…"
                    value={value}
                    onChange={(e) => { setValue(e.target.value); setError(''); }}
                    onKeyDown={handleKeyDown}
                    aria-label="Category name"
                />
                {error && (
                    <div className="modal-error" role="alert">{error}</div>
                )}
                <div className="modal-actions">
                    <button
                        className="btn btn-add-category"
                        type="button"
                        onClick={handleConfirm}
                    >
                        Add Category
                    </button>
                    <button
                        className="btn btn-back"
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
