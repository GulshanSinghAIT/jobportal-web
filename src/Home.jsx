import { useState, useEffect } from 'react';
import JobSearch from './components/JobSearch';
import JobList from './components/JobList';
import Pagination from './components/Pagination';
import JobFilters from './components/JobFilters';
import axios from 'axios';
import { Button } from './components/ui/button';
import Header from './components/Header';
import { Briefcase, BookmarkCheck, Send, Filter, X } from 'lucide-react';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("all"); // "all" or "saved" or "applied"
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchJobs = async (query, page = 1) => {
    setLoading(true);
    try {
      let endpoint = '/api/jobs';
      let params = { q: query, page, ...filters };

      if (viewMode === "saved") {
        endpoint = '/api/user/saved';
        params = {};
      } else if (viewMode === "applied") {
        endpoint = '/api/user/applied';
        params = {};
      }

      const res = await axios.get(endpoint, { params });
      setJobs(res.data.data || res.data);
      if (viewMode === "all") {
        setPagination(res.data.pagination);
      }
    } catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(search, 1);
  }, [search, filters, viewMode]);

  const handlePageChange = (newPage) => {
    fetchJobs(search, newPage);
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const ViewModeButton = ({ mode, current, icon, label }) => (
    <Button
      variant={current === mode ? "default" : "ghost"}
      onClick={() => setViewMode(mode)}
      className={`flex items-center gap-2 px-4 py-2 ${current === mode ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );

  // Job card skeleton for loading state
  const JobCardSkeleton = () => (
    <div className="w-full p-6 border rounded-lg bg-white shadow-sm animate-pulse">
      <div className="flex justify-between">
        <div className="h-6 bg-gray-200 rounded-full mb-4 w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded-full w-10"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded-full mb-2 w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded-full mb-4 w-1/4"></div>
      <div className="flex gap-2 mt-3">
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter size={20} />
              </Button>
              <div className="font-bold text-xl text-primary">JobFinder</div>
            </div>
            
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <JobSearch onSearch={setSearch} />
            </div>
            
            <Header />
          </div>
          
          {/* Mobile search */}
          <div className="md:hidden pb-4">
            <JobSearch onSearch={setSearch} />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Filters - Desktop */}
        <aside className={`hidden md:block bg-white border-r shadow-sm overflow-y-auto transition-all duration-300 h-[calc(100vh-4rem)] ${sidebarOpen ? 'w-80' : 'w-0'}`}>
          <div className="p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X size={18} />
              </Button>
            </div>
            <JobFilters filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        {/* Mobile filters modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}></div>
            <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl">
              <div className="p-6 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                    <X size={18} />
                  </Button>
                </div>
                <JobFilters filters={filters} setFilters={setFilters} />
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <section className="flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="max-w-[97em] mx-auto p-4 sm:p-6 lg:p-8">
            {/* Toggle button for desktop sidebar */}
            <div className="hidden md:flex mb-6">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={toggleSidebar}
              >
                <Filter size={16} />
                {sidebarOpen ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* View mode selector */}
            <div className="bg-white rounded-lg shadow-sm mb-6 p-1">
              <div className="flex overflow-x-auto">
                <ViewModeButton 
                  mode="all" 
                  current={viewMode} 
                  icon={<Briefcase size={18} />} 
                  label="All Jobs" 
                />
                <ViewModeButton 
                  mode="saved" 
                  current={viewMode} 
                  icon={<BookmarkCheck size={18} />} 
                  label="Saved Jobs" 
                />
                <ViewModeButton 
                  mode="applied" 
                  current={viewMode} 
                  icon={<Send size={18} />} 
                  label="Applied Jobs" 
                />
              </div>
            </div>

            {/* Results count and active filters summary */}
            <div className="flex flex-wrap items-center justify-between mb-4 text-sm text-gray-600">
              <div>
                {!loading && (
                  <p>{jobs.length} {viewMode === "all" ? "jobs being displayed" : 
                     viewMode === "saved" ? "saved jobs" : "applications"}
                  </p>
                )}
              </div>
              
              {Object.keys(filters).length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(filters).map(([key, value]) => (
                    <span key={key} className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {key}: {value}
                      <button 
                        onClick={() => setFilters(prev => {
                          const newFilters = {...prev};
                          delete newFilters[key];
                          return newFilters;
                        })}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={() => setFilters({})} 
                    className="text-xs text-primary hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Job listings or loading state */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(6)].map((_, index) => (
                  <JobCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <>
                {jobs.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="text-gray-400 mb-3">
                      <Briefcase size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800">No jobs found</h3>
                    <p className="text-gray-500 mt-2">
                      {viewMode === "all" 
                        ? "Try adjusting your search or filters" 
                        : viewMode === "saved" 
                          ? "You haven't saved any jobs yet" 
                          : "You haven't applied to any jobs yet"}
                    </p>
                  </div>
                ) : (
                  <JobList jobs={jobs} />
                )}
              </>
            )}

            {/* Pagination */}
            {!loading && viewMode === "all" && jobs.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;