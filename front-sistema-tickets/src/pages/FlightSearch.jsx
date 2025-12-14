import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import FlightSearchForm from '../components/flights/FlightSearchForm';
import FlightCard from '../components/flights/FlightCard';
import Spinner from '../components/common/Spinner';
import { NoResults } from '../components/common/EmptyState';
import Button from '../components/common/Button';
import useFlightStore from '../store/flightStore';
import searchApi from '../api/searchApi';

export default function FlightSearch() {
  const navigate = useNavigate();
  const { searchResults, setSearchResults, searchParams, sortByPrice } = useFlightStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'price-asc',
    maxPrice: null,
    timeRange: 'all'
  });

  const handleSearch = async (params) => {
    setIsLoading(true);
    try {
      const results = await searchApi.searchFlights(params);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast('No se encontraron vuelos para esta búsqueda', { icon: '✈️' });
      } else {
        toast.success(`Se encontraron ${results.length} vuelos`);
      }
    } catch (error) {
      toast.error('Error al buscar vuelos');
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlightSelect = (flight) => {
    navigate(`/flight/${flight.flightId}`);
  };

  const applySorting = (sortOption) => {
    switch (sortOption) {
      case 'price-asc':
        sortByPrice('asc');
        break;
      case 'price-desc':
        sortByPrice('desc');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    applySorting(filters.sortBy);
  }, [filters.sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Buscador Premium */}
        <div className="mb-8">
          <div className="gradient-primary rounded-2xl shadow-xl p-8 text-white mb-6">
            <h1 className="text-4xl font-bold mb-2">Encuentra tu vuelo perfecto</h1>
            <p className="text-white/80">Los mejores precios en vuelos nacionales e internacionales</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <FlightSearchForm onSearch={handleSearch} />
          </div>
        </div>
        
        

        {/* Resultados */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner variant="plane" size="xl" text="Buscando vuelos..." />
          </div>
        ) : searchResults.length > 0 ? (
          <>
            {/* Filtros y ordenamiento */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchResults.length} vuelos encontrados
              </h2>

              <div className="flex items-center gap-4">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="duration-asc">Duración: Más Corto</option>
                  <option value="departure-asc">Salida: Más Temprano</option>
                </select>

                <Button
                  variant="outline"
                  icon={<SlidersHorizontal className="w-5 h-5" />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filtros
                </Button>
              </div>
            </div>

            {/* Lista de vuelos */}
            <div className="space-y-4">
              {searchResults.map((flight) => (
                <FlightCard
                  key={flight.flightId}
                  flight={flight}
                  onSelect={() => handleFlightSelect(flight)}
                />
              ))}
            </div>
          </>
        ) : (
          <NoResults
            searchTerm={`${searchParams.origin} → ${searchParams.destination}`}
            onReset={() => {
              setSearchResults([]);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </div>
  );
}