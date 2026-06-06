import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

function SearchBox({ onSearch, initial = '' }) {
  const [query, setQuery] = useState(initial);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="input-field pl-[68px]"
        />
      </div>
      <button type="submit" className="btn-primary">
        Search
      </button>
    </form>
  );
}

export default SearchBox;
