const experienceOptions = [
    { label: 'More than 0 year', value: '0' },
    { label: 'More than 1 year', value: '1' },
    { label: 'More than 2 years', value: '2' },
    { label: 'More than 3 years', value: '3' },
    { label: 'More than 4 years', value: '4' }
  ];
  
  const salaryOptions = [
    { label: 'Competitive', value: 'competitive' },
    { label: '2-4 LPA', value: '2-4' },
    { label: '4-6 LPA', value: '4-6' },
    { label: '6-10 LPA', value: '6-10' },
    { label: '10-20 LPA', value: '10-20' },
    { label: '20-30 LPA', value: '20-30' },
    { label: '30-40 LPA', value: '30-40' },
    { label: '40+ LPA', value: '40+' }
  ];
  
  const domains = ['Engineering', 'Marketing', 'Design', 'Product', 'HR'];
  
  export default function SidebarFilters({ filters, setFilters }) {
    const toggleCheckbox = (key, value) => {
      const current = filters[key] || [];
      if (current.includes(value)) {
        setFilters((f) => ({ ...f, [key]: current.filter((v) => v !== value) }));
      } else {
        setFilters((f) => ({ ...f, [key]: [...current, value] }));
      }
    };
  
    return (
      <div className="space-y-6 text-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button className="text-sm text-blue-600" onClick={() => setFilters({})}>
            Clear All
          </button>
        </div>
  
        {/* Job Type */}
        <div>
          <h3 className="font-medium mb-2">Job Type</h3>
          <div className="flex gap-2 flex-wrap">
            {['Full Time', 'Internship'].map((type) => (
              <button
                key={type}
                onClick={() => setFilters((f) => ({ ...f, job_type: type }))}
                className={`px-3 py-1 rounded-full text-sm border ${
                  filters.job_type === type ? 'bg-black text-white' : ''
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
  
        {/* Experience */}
        <div>
          <h3 className="font-medium mb-2">Experience</h3>
          <div className="space-y-2">
            {experienceOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.experience?.includes(opt.value) || false}
                  onChange={() => toggleCheckbox('experience', opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
  
        {/* Salary */}
        <div>
          <h3 className="font-medium mb-2">Salary</h3>
          <div className="space-y-2">
            {salaryOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.salary?.includes(opt.value) || false}
                  onChange={() => toggleCheckbox('salary', opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
  
        {/* Domain */}
        <div>
          <h3 className="font-medium mb-2">Domain</h3>
          <select
            className="w-full p-2 border rounded"
            value={filters.job_category || ''}
            onChange={(e) => setFilters((f) => ({ ...f, job_category: e.target.value || undefined }))}
          >
            <option value="">Select domain</option>
            {domains.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
  