
interface ResultsSummaryProps {
    loading: boolean;
    filteredCount: number;
    totalCount: number;
  }
  
  export function ResultsSummary({ loading, filteredCount, totalCount }: ResultsSummaryProps) {
    if (loading) {
      return (
        <div className="mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
      );
    }
  
    return (
      <div className="mb-6">
        <p className="text-gray-600">
          Showing <span className="font-bold">{filteredCount}</span> of {totalCount} Ceruela coffees
        </p>
      </div>
    );
  }