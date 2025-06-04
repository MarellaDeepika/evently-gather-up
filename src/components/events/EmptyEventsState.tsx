
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface EmptyEventsStateProps {
  onClearFilters: () => void;
}

const EmptyEventsState = ({ onClearFilters }: EmptyEventsStateProps) => {
  return (
    <div className="text-center py-16">
      <div className="text-gray-400 mb-4">
        <Search className="h-16 w-16 mx-auto" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
      <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all events</p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear All Filters
      </Button>
    </div>
  );
};

export default EmptyEventsState;
