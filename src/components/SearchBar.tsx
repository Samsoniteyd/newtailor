"use client";
import React from 'react';

interface SearchBarProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm = '', onSearchChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        className="border rounded p-2 w-full"
      />
    </div>
  );
};

export default SearchBar;