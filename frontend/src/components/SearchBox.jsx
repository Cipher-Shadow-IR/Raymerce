import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import InputField from './InputField';

function SearchBox({ onSearch, initial = '' }) {
  const [query, setQuery] = useState(initial);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <InputField
        icon={FiSearch}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="flex-1"
      />
      <button type="submit" className="btn-primary flex-shrink-0">
        Search
      </button>
    </form>
  );
}

export default SearchBox;
