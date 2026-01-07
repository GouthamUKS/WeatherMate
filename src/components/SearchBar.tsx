import { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { searchLocations, GeocodingResult } from '@/lib/weather';

interface SearchBarProps {
  onLocationSelect: (location: GeocodingResult) => void;
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // NEW: Track which item is highlighted (index)
  const [activeIndex, setActiveIndex] = useState(-1); 
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        const locations = await searchLocations(query);
        setResults(locations);
        setIsOpen(locations.length > 0);
        setActiveIndex(-1); // Reset highlight on new search
        setIsLoading(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // NEW: Handle Arrow Keys and Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // If something is highlighted, select it. Otherwise, select the first one.
      const selectedLocation = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (selectedLocation) {
        handleSelect(selectedLocation);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (location: GeocodingResult) => {
    onLocationSelect(location);
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto" onKeyDown={handleKeyDown}>
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 bg-slate-800/50">
        <div className="flex items-center px-4 py-3">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none text-base"
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl overflow-hidden z-[150] bg-slate-900 border border-white/10">
          {results.map((location, index) => (
            <button
              key={`${location.latitude}-${index}`}
              onClick={() => handleSelect(location)}
              onMouseEnter={() => setActiveIndex(index)} // Sync mouse hover with keyboard
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                index === activeIndex ? 'bg-white/15' : 'hover:bg-white/10'
              }`}
            >
              <MapPin className={`w-4 h-4 ${index === activeIndex ? 'text-blue-400' : 'text-slate-500'}`} />
              <div>
                <p className={`font-medium ${index === activeIndex ? 'text-white' : 'text-slate-200'}`}>
                  {location.name}
                </p>
                <p className="text-sm text-slate-400">
                  {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}