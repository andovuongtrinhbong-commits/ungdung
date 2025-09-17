import React, { useCallback, useRef, useEffect } from 'react';

interface EnhancedSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    disabled?: boolean;
    className?: string;
}

export const EnhancedSlider: React.FC<EnhancedSliderProps> = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unit = '',
    disabled = false,
    className,
}) => {
    const intervalRef = useRef<number | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const isFloat = !Number.isInteger(step) || !Number.isInteger(min) || !Number.isInteger(max);

    const handleValueChange = useCallback((newValue: number) => {
        const clampedValue = Math.max(min, Math.min(max, newValue));
        if (isFloat) {
            const precision = (String(step).split('.')[1] || '').length;
            onChange(parseFloat(clampedValue.toFixed(precision)));
        } else {
            onChange(Math.round(clampedValue));
        }
    }, [min, max, step, onChange, isFloat]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        if (rawValue === '' || rawValue === '-') {
            return;
        }
        let newValue = isFloat ? parseFloat(rawValue) : parseInt(rawValue, 10);
        if (!isNaN(newValue)) {
            handleValueChange(newValue);
        }
    };

    const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
         if (rawValue === '' || isNaN(parseFloat(rawValue))) {
            handleValueChange(min);
        }
    }
    
    const handleIncrement = () => {
        handleValueChange(value + step);
    };
    
    const handleDecrement = () => {
        handleValueChange(value - step);
    };

    const stopCounter = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startCounter = (handler: () => void) => {
        stopCounter();
        handler();
        timeoutRef.current = window.setTimeout(() => {
            intervalRef.current = window.setInterval(handler, 100);
        }, 400);
    };

    useEffect(() => {
        return stopCounter;
    }, [stopCounter]);

    return (
        <div className={`enhanced-slider ${className || ''}`}>
            <label>{label}</label>
            <div className="slider-input-group">
                 <div className="number-input-wrapper">
                    <input 
                        type="number" 
                        value={String(value)}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        min={min}
                        max={max}
                        step={step}
                        disabled={disabled}
                        aria-label={label}
                    />
                    <div className="spinner-controls">
                        <button 
                            onMouseDown={() => startCounter(handleIncrement)}
                            onMouseUp={stopCounter}
                            onMouseLeave={stopCounter}
                            disabled={disabled || value >= max} 
                            aria-label={`Increase ${label}`}
                        >▲</button>
                        <button 
                            onMouseDown={() => startCounter(handleDecrement)}
                            onMouseUp={stopCounter}
                            onMouseLeave={stopCounter}
                            disabled={disabled || value <= min} 
                            aria-label={`Decrease ${label}`}
                        >▼</button>
                    </div>
                </div>
                {unit && <span>{unit}</span>}
            </div>
            <input 
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => handleValueChange(isFloat ? parseFloat(e.target.value) : parseInt(e.target.value, 10))}
                disabled={disabled}
                aria-label={`${label} slider`}
            />
        </div>
    );
};