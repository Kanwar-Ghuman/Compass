"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORIES, LOCATIONS, ITEM_STATUSES } from "@/lib/constants";

interface ItemFiltersProps {
  showStatusFilter?: boolean;
}

export function ItemFilters({ showStatusFilter = false }: ItemFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  const currentSearch = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.set("page", "1");
      router.push(`/items?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/items");
  };

  const hasActiveFilters = currentCategory || currentLocation || currentStatus;

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <label htmlFor="search-input" className="sr-only">
            Search items
          </label>

          <input
            id="search-input"
            type="text"
            placeholder="Search by title or description..."
            value={searchValue}
            className={`w-full pr-4 py-3 glass-input ${
              searchValue ? "pl-4" : "pl-12"
            }`}
            onChange={(e) => {
              const value = e.target.value;
              setSearchValue(value);
              if (value.length === 0 || value.length >= 2) {
                updateFilters({ q: value });
              }
            }}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                updateFilters({ q: "" });
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#132A13]/10 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-[#132A13]/60" aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-2 px-4 py-3 glass-button-secondary sm:w-auto"
          aria-expanded={isExpanded}
          aria-controls="filter-panel"
        >
          <Filter className="w-5 h-5" aria-hidden="true" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span
              className="w-2 h-2 rounded-full bg-[#4F772D]"
              aria-label="Active filters"
            />
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div
          id="filter-panel"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#4F772D]/10"
        >
          <div>
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium text-[#132A13]/70 mb-2"
            >
              Category
            </label>
            <select
              id="category-filter"
              value={currentCategory}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="w-full px-4 py-3 glass-input"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="location-filter"
              className="block text-sm font-medium text-[#132A13]/70 mb-2"
            >
              Location
            </label>
            <select
              id="location-filter"
              value={currentLocation}
              onChange={(e) => updateFilters({ location: e.target.value })}
              className="w-full px-4 py-3 glass-input"
            >
              <option value="">All Locations</option>
              {LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {showStatusFilter && (
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-[#132A13]/70 mb-2"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={currentStatus}
                onChange={(e) => updateFilters({ status: e.target.value })}
                className="w-full px-4 py-3 glass-input"
              >
                <option value="">All Statuses</option>
                {ITEM_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="sort-filter"
              className="block text-sm font-medium text-[#132A13]/70 mb-2"
            >
              Sort By
            </label>
            <select
              id="sort-filter"
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="w-full px-4 py-3 glass-input"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>

          {hasActiveFilters && (
            <div className="sm:col-span-2 lg:col-span-4">
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-[#132A13]/60 hover:text-[#4F772D] transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
