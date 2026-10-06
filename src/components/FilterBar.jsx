import React from 'react';
import { Search, Grid2X2, Columns, List, SlidersHorizontal } from 'lucide-react';

export default function FilterBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  layoutMode,
  setLayoutMode,
  totalCount,
  accentColor
}) {
  const accent = accentColor || '#e63946';

  return (
    <div className="no-print py-6 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-all whitespace-nowrap rounded-xs border ${
              selectedCategory === 'ALL'
                ? 'bg-white text-black font-semibold border-white'
                : 'text-neutral-400 border-white/10 hover:text-white hover:border-white/20 bg-white/[0.02]'
            }`}
          >
            ALL [{totalCount}]
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-all whitespace-nowrap rounded-xs border ${
                selectedCategory === cat
                  ? 'text-white border-current font-semibold bg-white/10'
                  : 'text-neutral-400 border-white/10 hover:text-white hover:border-white/20 bg-white/[0.02]'
              }`}
              style={{
                borderColor: selectedCategory === cat ? accent : undefined,
                color: selectedCategory === cat ? '#ffffff' : undefined
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Right: Search & Layout Mode */}
        <div className="flex items-center gap-3 justify-between md:justify-end">
          
          {/* Search Box */}
          <div className="relative flex-1 md:w-56">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search works..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 font-mono rounded-xs focus:outline-none focus:border-white/30 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Layout Mode Switcher */}
          <div className="flex items-center bg-white/[0.03] border border-white/10 p-0.5 rounded-xs">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-xs transition-colors ${
                layoutMode === 'grid' ? 'bg-white/20 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Masonry Grid"
            >
              <Grid2X2 size={14} />
            </button>
            <button
              onClick={() => setLayoutMode('editorial')}
              className={`p-1.5 rounded-xs transition-colors ${
                layoutMode === 'editorial' ? 'bg-white/20 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Editorial 2-Column"
            >
              <Columns size={14} />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded-xs transition-colors ${
                layoutMode === 'list' ? 'bg-white/20 text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="List Index"
            >
              <List size={14} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
