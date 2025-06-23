"use client";
import React from 'react';

interface SortDropdownProps {
    onSortChange?: (value: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange }) => {
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange && onSortChange(event.target.value);
    };

    return (
        <div className="mb-4">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                Sort By
            </label>
            <select
                id="sort"
                onChange={handleSortChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="dateCreated">Date Created</option>
                <option value="lastUpdated">Last Updated</option>
            </select>
        </div>
    );
};

export default SortDropdown;