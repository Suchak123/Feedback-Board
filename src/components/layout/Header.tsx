import React from "react";

export const Header: React.FC = () => {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <h1 className="text-2xl  text-gray-700 font-extrabold">Feedback Board
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Provide feeds here
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
};
