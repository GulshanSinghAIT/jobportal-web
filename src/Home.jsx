import { useState, useEffect } from 'react';
import JobSearch from './components/JobSearch';
import JobList from './components/JobList';
import Pagination from './components/Pagination';
import JobFilters from './components/JobFilters';
import axios from 'axios';
import { Button } from './components/ui/button';
import Header from './components/Header';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("all"); // "all" or "saved"

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

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-gray-50">
      <header className="p-6 flex justify-between  items-center border-b bg-white shadow-md z-10">
        <div className='flex justify-between max-w-[87em] w-[100%] mx-auto items-center'>
          <div className="mt-4 max-w-lg w-full">
            <JobSearch onSearch={setSearch} />
          </div>
          <Header />
        </div>

      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar Filters */}
        <aside className="w-80 border-r bg-white p-4 overflow-y-auto sticky top-0 h-full shadow-inner">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filters</h2>
          <JobFilters filters={filters} setFilters={setFilters} />
        </aside>

        {/* Job List */}
        <section className="flex-1 overflow-y-auto p-6">
          {/* Display loader when jobs are being fetched */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Job Card Skeleton */}
              {[...Array(20)].map((_, index) => (
                <div key={index} className="w-full p-4 border rounded-lg bg-gray-100 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded-full mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-full mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* View toggle */}
              <div className="mb-4 flex gap-2">
                <Button
                  variant={viewMode === "all" ? "default" : "outline"}
                  onClick={() => setViewMode("all")}
                >
                  All Jobs
                </Button>
                <Button
                  variant={viewMode === "saved" ? "default" : "outline"}
                  onClick={() => setViewMode("saved")}
                >
                  Saved Jobs
                </Button>
                <Button
                  variant={viewMode === "applied" ? "default" : "outline"}
                  onClick={() => setViewMode("applied")}
                >
                  Applied Jobs
                </Button>
              </div>


              <JobList jobs={jobs} />
              <div className="mt-6">
                {viewMode === "all" && (
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </>

          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
