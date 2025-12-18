'use client';

import React, { useEffect } from "react";

interface ModelProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModelProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) =>  {
    useEffect(() => {

        if (!isOpen) return
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeStyles = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
        <div 
            className="fixed inset-0 bg-gray-300 bg-opacity-60"
            onClick={onClose}
        />
        
       <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <div 
            className={`
                relative bg-white rounded-lg shadow-xl 
                w-full ${sizeStyles[size]}
            `}
            onClick={(e) => e.stopPropagation()}
            >
            {title && (
                <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                    {title}
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>
            )}
            
            <div className="p-6">
                {children}
            </div>
            </div>
        </div>
        </div>
  );
};