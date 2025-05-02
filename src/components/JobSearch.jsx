// components/JobSearch.jsx
import { useState, useEffect } from 'react';
import { Input } from "../components/ui/input";

function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}

export default function JobSearch({ onSearch }) {
    const [query, setQuery] = useState('');
    const debounced = useDebounce(query);

    useEffect(() => {
        onSearch(debounced);
    }, [debounced, onSearch]);

    return (
        <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by job title or company..."
            className="w-full"
        />
    );
}
