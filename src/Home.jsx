import { useState, useEffect } from 'react';
import JobSearch from './components/JobSearch';
import JobList from './components/JobList';
import Pagination from './components/Pagination';
import JobFilters from './components/JobFilters';
import axios from 'axios';
import { Button } from './components/ui/button';
import Header from './components/Header';
import { Briefcase, BookmarkCheck, Send, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useAuth } from '@clerk/clerk-react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Home() {
  
const { getToken } = useAuth();
console.log("k",getToken())
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("all"); // "all" or "saved" or "applied"
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);


  const fetchJobs = async (query, page = 1) => {
    setLoading(true);
    try {
      // Start by setting default values for the API request
      let endpoint = '/api/jobs';
      let params = { q: query, page, ...filters };
  
      if (viewMode === "saved") {
        endpoint = '/api/user/saved';
        params = {}; // For saved jobs, you don't need query params
      } else if (viewMode === "applied") {
        endpoint = '/api/user/applied';
        params = {}; // For applied jobs, you don't need query params
      }
  
      // Get the Clerk authentication token (for the authenticated user)
      const token = await getToken();
  
      const res = await axios.get(`${BASE_URL}${endpoint}`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
  
      setJobs(res.data.data || res.data);
      if (viewMode === "all") {
        setPagination(res.data.pagination);
      }
    } catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      setLoading(false);
      setInitialLoad(false);
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
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={current === mode ? "default" : "ghost"}
        onClick={() => setViewMode(mode)}
        className={`flex items-center gap-2 px-4 py-2 ${current === mode ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </Button>
    </motion.div>
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

  // Animations configuration
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const sidebarVariants = {
    open: { width: '20rem', opacity: 1, transition: { duration: 0.3 } },
    closed: { width: 0, opacity: 0, transition: { duration: 0.3 } }
  };

  const mobileFiltersVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header with subtle entrance animation */}
      <motion.header 
        className="sticky top-0 z-20 bg-white border-b shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <Filter size={20} />
                </Button>
              </motion.div>

              <motion.div 
                className="font-bold text-xl text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                JobFinder
              </motion.div>
            </div>
            
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <JobSearch onSearch={setSearch} />
              </motion.div>
            </div>
            
            <Header />
          </div>
          
          {/* Mobile search */}
          <div className="md:hidden pb-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <JobSearch onSearch={setSearch} />
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Filters - Desktop with animation */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside 
              className="hidden md:block bg-white border-r shadow-sm overflow-y-auto h-[calc(100vh-4rem)]"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="p-6 h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                  <motion.div whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                      <X size={18} />
                    </Button>
                  </motion.div>
                </div>
                <JobFilters filters={filters} setFilters={setFilters} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile filters modal with slide-in animation */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div 
                className="fixed inset-0 z-30 bg-black/20 bg-opacity-50" 
                onClick={() => setShowMobileFilters(false)}
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              />
              <motion.div 
                className="fixed inset-y-0 left-0 z-40 w-full max-w-xs bg-white shadow-xl"
                variants={mobileFiltersVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="p-6 h-full overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                    <motion.div whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                        <X size={18} />
                      </Button>
                    </motion.div>
                  </div>
                  <JobFilters filters={filters} setFilters={setFilters} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content with staggered animations */}
        <motion.section 
          className="flex-1 overflow-y-auto h-[calc(100vh-4rem)]"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <div className="max-w-[97em] mx-auto p-4 sm:p-6 lg:p-8">
            {/* Toggle button for desktop sidebar */}
            <motion.div 
              className="hidden md:flex mb-6"
              variants={fadeInUpVariants}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={toggleSidebar}
                >
                  <Filter size={16} />
                  {sidebarOpen ? "Hide Filters" : "Show Filters"}
                </Button>
              </motion.div>
            </motion.div>

            {/* View mode selector with hover animations */}
            <motion.div 
              className="bg-white rounded-lg shadow-sm mb-6 p-1"
              variants={fadeInUpVariants}
            >
              <div className="flex gap-2">
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
            </motion.div>

            {/* Results count and active filters summary */}
            <motion.div 
              className="flex flex-wrap items-center justify-between mb-4 text-sm text-gray-600"
              variants={fadeInUpVariants}
            >
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
                    <motion.span 
                      key={key} 
                      className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                    >
                      {key}: {value}
                      <motion.button 
                        onClick={() => setFilters(prev => {
                          const newFilters = {...prev};
                          delete newFilters[key];
                          return newFilters;
                        })}
                        className="text-gray-500 hover:text-gray-700"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={12} />
                      </motion.button>
                    </motion.span>
                  ))}
                  <motion.button 
                    onClick={() => setFilters({})} 
                    className="text-xs text-primary hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear all
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Job listings or loading state with animations */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(6)].map((_, index) => (
                    <JobCardSkeleton key={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {jobs.length === 0 ? (
                    <motion.div 
                      className="text-center py-12 bg-white rounded-lg shadow-sm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      <motion.div 
                        className="text-gray-400 mb-3"
                        animate={{ 
                          y: [0, -10, 0],
                          scale: [1, 1.1, 1] 
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut" 
                        }}
                      >
                        <Briefcase size={48} className="mx-auto" />
                      </motion.div>
                      <h3 className="text-xl font-medium text-gray-800">No jobs found</h3>
                      <p className="text-gray-500 mt-2">
                        {viewMode === "all" 
                          ? "Try adjusting your search or filters" 
                          : viewMode === "saved" 
                            ? "You haven't saved any jobs yet" 
                            : "You haven't applied to any jobs yet"}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                    >
                      <JobList jobs={jobs} />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination with animation */}
            <AnimatePresence>
              {!loading && viewMode === "all" && jobs.length > 0 && (
                <motion.div 
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>
      
      {/* Welcome animation for first-time users */}
      <AnimatePresence>
        {initialLoad && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 1 }}
              >
                <Briefcase size={64} className="mx-auto text-primary mb-4" />
              </motion.div>
              <motion.h2 
                className="text-2xl font-bold mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome to JobFinder!
              </motion.h2>
              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Find your perfect job with our powerful search tools and filters.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button 
                  className="bg-primary text-white px-6 py-2 rounded-md"
                  onClick={() => setInitialLoad(false)}
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;