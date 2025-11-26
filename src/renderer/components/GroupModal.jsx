import { useState, useEffect } from 'preact/hooks';

const PRESET_COLORS = [
    '#282268', '#3a2f8f', '#6366f1', '#8b5cf6', '#a855f7',
    '#ec4899', '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
    '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'
];

export function GroupModal({ isOpen, group, onClose, onSave }) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#282268');
    const [colorInput, setColorInput] = useState('#282268');
    const [colorError, setColorError] = useState('');

    useEffect(() => {
        if (group) {
            setName(group.name);
            setColor(group.color);
            setColorInput(group.color);
        } else {
            setName('');
            setColor('#282268');
            setColorInput('#282268');
        }
        setColorError('');
    }, [group, isOpen]);

    const isValidHexColor = (hex) => {
        return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
    };

    const handleColorInputChange = (e) => {
        const value = e.target.value;
        setColorInput(value);

        if (isValidHexColor(value)) {
            setColor(value);
            setColorError('');
        } else if (value.length > 0) {
            setColorError('Invalid hex color (e.g., #282268)');
        } else {
            setColorError('');
        }
    };

    const handleColorPickerChange = (e) => {
        const value = e.target.value;
        setColor(value);
        setColorInput(value);
        setColorError('');
    };

    const handlePresetClick = (presetColor) => {
        setColor(presetColor);
        setColorInput(presetColor);
        setColorError('');
    };

    const handleSave = async () => {
        if (!name.trim()) return;
        if (!isValidHexColor(color)) {
            setColorError('Please select a valid color');
            return;
        }

        if (group) {
            await onSave(group.id, { name: name.trim(), color });
        } else {
            await onSave(name.trim(), color);
        }

        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-bg-secondary border border-border rounded-2xl w-[90%] max-w-[520px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <h3 className="text-lg font-semibold text-text-primary">
                        {group ? 'Edit Group' : 'Create Group'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 rounded-md bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary hover:rotate-90 flex items-center justify-center transition-all duration-200"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Group Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onInput={(e) => setName(e.target.value)}
                            placeholder="e.g., Frontend, Backend, Services"
                            className="w-full px-3 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary focus:bg-bg-dark focus:ring-2 focus:ring-primary/20 transition-all"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Color
                        </label>

                        {/* Color Picker and Input */}
                        <div className="flex items-start gap-3 mb-3">
                            <input
                                type="color"
                                value={color}
                                onInput={handleColorPickerChange}
                                className="w-14 h-14 border border-border rounded-lg cursor-pointer hover:border-primary transition-all"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={colorInput}
                                    onInput={handleColorInputChange}
                                    placeholder="#282268"
                                    className={`w-full px-4 py-3 bg-bg-tertiary border rounded-lg text-sm font-mono transition-all ${colorError
                                        ? 'border-error text-error focus:border-error focus:ring-2 focus:ring-error/20'
                                        : 'border-border text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
                                        } focus:outline-none focus:bg-bg-dark`}
                                />
                                {colorError && (
                                    <p className="text-xs text-error mt-1.5 flex items-center gap-1">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        {colorError}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Preset Colors */}
                        <div>
                            <p className="text-xs text-text-tertiary mb-2">Preset Colors</p>
                            <div className="grid grid-cols-10 gap-2">
                                {PRESET_COLORS.map((presetColor) => (
                                    <button
                                        key={presetColor}
                                        onClick={() => handlePresetClick(presetColor)}
                                        className={`w-8 h-8 rounded-md cursor-pointer transition-all hover:scale-110 ${color === presetColor ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-secondary scale-110' : ''
                                            }`}
                                        style={{
                                            backgroundColor: presetColor,
                                        }}
                                        title={presetColor}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-5 border-t border-border justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-bg-tertiary text-text-primary rounded-lg text-sm font-medium hover:bg-bg-dark transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name.trim() || !!colorError}
                        className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
