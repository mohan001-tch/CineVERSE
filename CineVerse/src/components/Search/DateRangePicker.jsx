/**
 * DateRangePicker.jsx — Dual date picker with quick filter buttons
 *
 * Features:
 *   - Single date or date range mode
 *   - Quick filters: This Week, This Month, This Year, Custom Range
 *   - Dark-themed date inputs
 *   - Dates displayed in DD/MM/YYYY, sent as YYYY-MM-DD
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { QUICK_FILTERS, formatDateDisplay } from '../../hooks/useDateSearch';

export default function DateRangePicker({ fromDate, toDate, onChange, onSearch }) {
  const [activeFilter, setActiveFilter] = useState(null);

  /** Apply a quick filter */
  const applyQuickFilter = (filter) => {
    setActiveFilter(filter.id);
    if (filter.getRange) {
      const range = filter.getRange();
      onChange(range.from, range.to);
      // Auto-search when quick filter is clicked
      onSearch(range.from, range.to);
    } else {
      // Custom range — just switch mode, user will pick dates
      onChange('', '');
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((filter) => (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => applyQuickFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeFilter === filter.id
                ? 'bg-cinema-accent text-white shadow-neon'
                : 'glass text-cinema-muted border border-white/5 hover:text-white hover:border-white/15'
            }`}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* Date Inputs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* From Date */}
        <div className="flex-1">
          <label className="text-cinema-muted text-[11px] mb-1 block font-medium">From Date</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cinema-muted pointer-events-none" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => { onChange(e.target.value, toDate); setActiveFilter('custom'); }}
              className="w-full bg-cinema-card border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cinema-accent/50 transition [color-scheme:dark]"
            />
          </div>
          {fromDate && (
            <p className="text-cinema-accent text-[10px] mt-1">{formatDateDisplay(fromDate)}</p>
          )}
        </div>

        <ArrowRight size={16} className="text-cinema-muted self-center hidden sm:block mt-4" />

        {/* To Date */}
        <div className="flex-1">
          <label className="text-cinema-muted text-[11px] mb-1 block font-medium">To Date</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cinema-muted pointer-events-none" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => { onChange(fromDate, e.target.value); setActiveFilter('custom'); }}
              className="w-full bg-cinema-card border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cinema-accent/50 transition [color-scheme:dark]"
            />
          </div>
          {toDate && (
            <p className="text-cinema-accent text-[10px] mt-1">{formatDateDisplay(toDate)}</p>
          )}
        </div>

        {/* Search Button (for custom range) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSearch(fromDate, toDate)}
          disabled={!fromDate || !toDate}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white text-sm font-bold shadow-neon self-end disabled:opacity-40 disabled:cursor-not-allowed mt-auto"
        >
          Search
        </motion.button>
      </div>

      {/* Date range validation error */}
      {fromDate && toDate && fromDate > toDate && (
        <p className="text-cinema-red text-xs">⚠ From date cannot be after To date</p>
      )}
    </div>
  );
}
