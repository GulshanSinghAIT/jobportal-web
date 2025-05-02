import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

export default function JobFilters({ filters, setFilters }) {
  const filterOptions = [
    {
      key: "job_location",
      placeholder: "All Locations",
      items: ["New York", "San Francisco"],
    },
    {
      key: "job_type",
      placeholder: "All Types",
      items: ["full-time", "contract"],
    },
    {
      key: "experience_level",
      placeholder: "All Levels",
      items: ["entry", "mid", "senior","Mid senior"],
    },
    {
      key: "work_setting",
      placeholder: "All Settings",
      items: ["remote", "onsite", "hybrid"],
    },
    {
      key: "h1Type",
      placeholder: "H1B Type",
      items: ["H-1B", "Cap-Exempt"],
    },
    {
      key: "job_category",
      placeholder: "All Categories",
      items: ["Engineering (Software)", "Marketing"],
    },
  ];

  return (
    <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
      {filterOptions.map(({ key, placeholder, items }) => (
        <Select
          key={key}
          onValueChange={(val) =>
            setFilters((f) => ({ ...f, [key]: val === "all" ? "" : val }))
          }
        >
          <SelectTrigger className="bg-gray-100 w-full hover:bg-gray-200 text-gray-800 rounded-md px-4 py-2 shadow-sm transition duration-200">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md">
            <SelectItem value="all">{placeholder}</SelectItem>
            {items.map((item) => (
              <SelectItem key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
