// src/components/PackingList/CategoryCard.js
import React, { useState } from 'react';

export default function CategoryCard({
    name,
    items,
    isCustomCategory,
    cardIndex,
    onToggleItem,
    onSelectAll,
    onDeselectAll,
    onDeleteCategory,
    onAddItem,
    onDeleteItem
}) {
    const [addItemText, setAddItemText] = useState('');
    const [addItemError, setAddItemError] = useState('');

    const handleAddItemConfirm = () => {
        const trimmed = addItemText.trim();
        if (!trimmed) {
            setAddItemError('Item name cannot be empty.');
            return;
        }
        const duplicate = items.some(
            (i) => i.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (duplicate) {
            setAddItemError(`"${trimmed}" already exists in this category.`);
            return;
        }
        onAddItem(name, trimmed);
        setAddItemText('');
        setAddItemError('');
    };

    const handleAddItemKeyDown = (e) => {
        if (e.key === 'Enter') handleAddItemConfirm();
        if (e.key === 'Escape') {
            setAddItemText('');
            setAddItemError('');
        }
    };

    return (
        <div
            className="category-card"
            role="listitem"
            data-category={name}
            style={{ '--card-index': cardIndex }}
        >
            <div className="card-header">
                <h3>{name}</h3>
                {isCustomCategory && <span className="badge-custom">Custom</span>}
                {isCustomCategory && (
                    <button
                        className="btn-trash"
                        type="button"
                        aria-label={`Delete category ${name}`}
                        title={`Delete category "${name}"`}
                        onClick={() => onDeleteCategory(name)}
                    >
                        🗑
                    </button>
                )}
            </div>

            <div className="card-controls">
                <button
                    className="btn btn-select-all"
                    type="button"
                    onClick={() => onSelectAll(name)}
                >
                    Select All
                </button>
                <button
                    className="btn btn-deselect-all"
                    type="button"
                    onClick={() => onDeselectAll(name)}
                >
                    Deselect All
                </button>
            </div>

            <ul className="card-item-list" aria-label={`Items in ${name}`}>
                {items.map((item) => {
                    const id = `chk-${name}-${item.name}`.replace(/\s+/g, '-');
                    return (
                        <li key={item.name} className="card-item">
                            <input
                                type="checkbox"
                                id={id}
                                checked={item.selected}
                                onChange={() => onToggleItem(name, item.name)}
                                aria-label={item.name}
                            />
                            <label htmlFor={id}>{item.name}</label>
                            {item.isCustomItem && (
                                <button
                                    className="btn-trash"
                                    type="button"
                                    aria-label={`Delete item ${item.name}`}
                                    title={`Delete "${item.name}"`}
                                    onClick={() => onDeleteItem(name, item.name)}
                                >
                                    🗑
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>

            <div className="add-item-form" role="form" aria-label={`Add item to ${name}`}>
                    <input
                        className="add-item-input"
                        type="text"
                        placeholder="+ Add item…"
                        maxLength={120}
                        value={addItemText}
                        onChange={(e) => {
                            setAddItemText(e.target.value);
                            setAddItemError('');
                        }}
                        onKeyDown={handleAddItemKeyDown}
                    />
                    <button
                        className="btn btn-add-item-confirm"
                        type="button"
                        onClick={handleAddItemConfirm}
                    >
                        Add
                    </button>
                    {addItemError && (
                        <div className="add-item-error" role="alert">
                            {addItemError}
                        </div>
                    )}
                </div>
        </div>
    );
}
