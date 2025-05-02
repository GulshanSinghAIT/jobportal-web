import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { X, ChevronDown, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { Slider } from "./ui/slider";

export default function JobFilters({ filters, setFilters }) {
  // Default salary range values
  const MIN_SALARY = 10000;
  const MAX_SALARY = 200000;
  const STEP = 5000;
  
  // Local state for salary slider
  const [salaryRange, setSalaryRange] = useState([
    filters.salary_min || MIN_SALARY,
    filters.salary_max || MAX_SALARY
  ]);

  // Update local state when filters change externally
  useEffect(() => {
    setSalaryRange([
      filters.salary_min || MIN_SALARY,
      filters.salary_max || MAX_SALARY
    ]);
  }, [filters.salary_min, filters.salary_max]);

  const filterOptions = [
    {
      key: "job_location",
      label: "Location",
      placeholder: "All Locations",
      items: ["Irvine, CA", "Leonardo DRS", "San Mateo, CA", "Castro Valley, CA", "Atlanta, GA", "Seattle, WA"],
      icon: "🌎",
    },
    {
      key: "job_type",
      label: "Job Type",
      placeholder: "All Types",
      items: ["Full-Time", "Contract", "Part-Time", "Internship"],
      icon: "⏱️",
    },
    {
      key: "experience_level",
      label: "Experience",
      placeholder: "All Levels",
      items: ["Entry", "Mid", "Senior", "Mid senior", "Lead"],
      icon: "🎯",
    },
    {
      key: "work_setting",
      label: "Work Setting",
      placeholder: "All Settings",
      items: ["Remote", "Onsite", "Hybrid"],
      icon: "🏢",
    },
    {
      key: "h1Type",
      label: "Visa Sponsorship",
      placeholder: "H1B Type",
      items: ["H-1B", "Cap-Exempt", "OPT", "Green Card"],
      icon: "📄",
    },
    {
      key: "job_category",
      label: "Category",
      placeholder: "All Categories",
      items: ["Engineering (Software)", "Marketing", "Design", "Product", "Data Science", "Sales"],
      icon: "🔍",
    },
  ];

  const handleClearFilter = (key) => {
    setFilters((f) => {
      const newFilters = { ...f };
      delete newFilters[key];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setFilters({});
  };

  const handleSalaryChange = (newValues) => {
    setSalaryRange(newValues);
  };

  const handleSalaryApply = () => {
    if (salaryRange[0] === MIN_SALARY && salaryRange[1] === MAX_SALARY) {
      // If the full range is selected, remove the filters
      setFilters((f) => {
        const newFilters = { ...f };
        delete newFilters.salary_min;
        delete newFilters.salary_max;
        return newFilters;
      });
    } else {
      setFilters((f) => ({
        ...f,
        salary_min: salaryRange[0],
        salary_max: salaryRange[1]
      }));
    }
  };

  const handleResetSalary = () => {
    setSalaryRange([MIN_SALARY, MAX_SALARY]);
    setFilters((f) => {
      const newFilters = { ...f };
      delete newFilters.salary_min;
      delete newFilters.salary_max;
      return newFilters;
    });
  };

  const formatSalary = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const isSalaryFilterActive = filters.salary_min !== undefined || filters.salary_max !== undefined;

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="space-y-6">
      {/* Active filters summary */}
      {activeFilterCount > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
            <button
              onClick={handleClearAll}
              className="text-xs text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              // Skip displaying minSalary and maxSalary as separate badges
              if (key === 'minSalary' || key === 'maxSalary') return null;
              
              const option = filterOptions.find(opt => opt.key === key);
              return (
                <Badge 
                  key={key} 
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1 bg-primary/10 hover:bg-primary/15"
                >
                  <span className="text-xs">
                    {option?.label || key}: {value}
                  </span>
                  <button
                    onClick={() => handleClearFilter(key)}
                    className="ml-1 rounded-full hover:bg-gray-200 p-1"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              );
            })}
            
            {/* Special handling for salary range as a single badge */}
            {isSalaryFilterActive && (
  <Badge 
    variant="secondary"
    className="pl-2 pr-1 py-1 flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
  >
    <span className="text-xs">
      Salary: {formatSalary(filters.salary_min || MIN_SALARY)} - {formatSalary(filters.salary_max || MAX_SALARY)}
    </span>
    <button
      onClick={handleResetSalary}
      className="ml-1 rounded-full hover:bg-emerald-200 p-1"
    >
      <X size={12} />
    </button>
  </Badge>
)}

          </div>
        </div>
      )}

      {/* Filter categories */}
      <div className="space-y-5">
        {filterOptions.map(({ key, label, placeholder, items, icon }) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="w-5">{icon}</span>
              {label}
            </label>
            <Select
              value={filters[key] || ""}
              onValueChange={(val) =>
                setFilters((f) => ({ ...f, [key]: val === "all" ? "" : val }))
              }
            >
              <SelectTrigger 
                className={`w-full text-sm border border-gray-200 rounded-md px-4 py-2 shadow-sm transition duration-200 hover:border-gray-300 focus:ring-1 focus:ring-primary/30 ${
                  filters[key] ? "bg-primary/5 border-primary/30" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <SelectValue placeholder={placeholder} />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                <SelectItem value="all" className="text-sm py-2 px-2">
                  {placeholder}
                </SelectItem>
                {items.map((item) => (
                  <SelectItem key={item} value={item} className="text-sm py-2 px-2">
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* Salary range filter */}
      <div className="pt-4 border-t">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <span className="w-5">💰</span>
          Salary Range
        </h3>
        
        <div className="px-2 mb-6">
          <Slider
            value={salaryRange}
            min={MIN_SALARY}
            max={MAX_SALARY}
            step={STEP}
            onValueChange={handleSalaryChange}
            className="my-6"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mb-4">
            <span>{formatSalary(salaryRange[0])}</span>
            <span>{formatSalary(salaryRange[1])}</span>
          </div>
          
          <div className="flex justify-between gap-2">
            <button
              onClick={handleResetSalary}
              className="px-3 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50 transition"
            >
              Reset
            </button>
            <button
              onClick={handleSalaryApply}
              className={`px-3 py-1 text-xs rounded-md transition ${
                (salaryRange[0] !== (filters.minSalary || MIN_SALARY) || 
                 salaryRange[1] !== (filters.maxSalary || MAX_SALARY))
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              disabled={
                (salaryRange[0] === (filters.salary_min || MIN_SALARY) && 
                 salaryRange[1] === (filters.salary_max || MAX_SALARY))
              }
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}