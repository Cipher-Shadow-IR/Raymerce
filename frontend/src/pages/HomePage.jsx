import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import Message from '../components/Message';
import SearchBox from '../components/SearchBox';
import Paginate from '../components/Paginate';
import { FiFilter, FiX } from 'react-icons/fi';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '-createdAt';

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);
      params.append('pageNumber', page);

      const { data } = await API.get(`/products?${params}`);
      setProducts(data.products);
      setCategories(data.categories);
      setPage(data.page);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams, page]);

  const handleSearch = (q) => {
    const params = new URLSearchParams(searchParams);
    if (q) params.set('keyword', q);
    else params.delete('keyword');
    params.set('pageNumber', 1);
    setSearchParams(params);
  };

  const handleFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('pageNumber', 1);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = keyword || category || minPrice || maxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Our Products</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {total} product{total !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex gap-2 flex-1 max-w-md">
          <SearchBox onSearch={handleSearch} initial={keyword} />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border transition-colors ${
              hasFilters
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400'
            }`}
          >
            <FiFilter className="text-xl" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Filters</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                <FiX /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => handleFilter('category', e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min Price</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => handleFilter('minPrice', e.target.value)}
                placeholder="$0"
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max Price</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => handleFilter('maxPrice', e.target.value)}
                placeholder="$999"
                className="input-field"
                min="0"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs text-gray-500 mb-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => handleFilter('sort', e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
              <option value="-name">Name: Z-A</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 dark:text-gray-500 text-lg">No products found</p>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-primary mt-4">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Paginate page={page} pages={pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default HomePage;
