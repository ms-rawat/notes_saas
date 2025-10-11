import { Input, DatePicker, Button } from "antd";
import { Search } from "lucide-react";
import FreeSoloDropdown from "../common/FreeSoloDropdown";

const { RangePicker } = DatePicker;

const NoteFilters = ({ filters, onFilterChange, categories }) => {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex gap-3 flex-wrap items-center">
        <Input
          prefix={<Search size={16} className="text-gray-400" />}
          placeholder="Search notes..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-56"
        />

        <FreeSoloDropdown
          options={categories}
          placeholder="Filter by category"
          value={filters.category}
          onChange={(val) => onFilterChange({ category: val?.name || "" })}
          className="w-48"
        />

        <RangePicker
          onChange={(dates) => onFilterChange({ dateRange: dates })}
          className="w-64"
        />
      </div>

      <Button
        type="primary"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => onFilterChange({ reset: true })}
      >
        Reset
      </Button>
    </div>
  );
};

export default NoteFilters;
