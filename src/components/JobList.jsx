import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {useAuth} from "@clerk/clerk-react";
import { toast } from 'react-toastify'
import {
  Loader2,
  Heart,
  MapPin,
  Building,
  Clock,
  Briefcase,
  Calendar,
  ExternalLink,
} from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Salary formatting helpers
const formatSalary = (salary) => {
  const num = parseFloat(salary.replace(/[^\d.]/g, ""));
  if (isNaN(num)) return salary;
  return num.toLocaleString("en-IN");
};

const formatSalaryRange = (salaryRange) => {
  const parts = salaryRange.split("-");
  if (parts.length !== 2) return salaryRange;
  const min = formatSalary(parts[0].trim());
  const max = formatSalary(parts[1].trim());
  return `${min} - ${max}/month`;
};

export default function JobList({ jobs = [] }) {
  const{userId}= useAuth();
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [savingJobs, setSavingJobs] = useState(new Set());
  const [applyingJobs, setApplyingJobs] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/api/user/saved`);
        const data = await res.json();
        setSavedJobs(new Set(data.map((j) => j.jobId)));
      } catch (err) {
        console.error("Error loading saved jobs", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSaved();
  }, []);

  const handleSave = async (jobId) => {
    setSavingJobs((prev) => new Set(prev).add(jobId));
    try {
      await fetch(`${BASE_URL}/api/jobs/${jobId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setSavedJobs((prev) => {
        const updated = new Set(prev);
        if (updated.has(jobId)) {
          updated.delete(jobId);
          toast.success("Job removed from saved list");
        } else {
          updated.add(jobId);
          toast.success("Job saved successfully!");
        }
        return updated;
      });
    } catch (err) {
      toast.error("Failed to save job");
      console.error("Save error", err);
    } finally {
      setSavingJobs((prev) => {
        const copy = new Set(prev);
        copy.delete(jobId);
        return copy;
      });
    }
  };

  const handleApply = async (jobId) => {
    setApplyingJobs((prev) => new Set(prev).add(jobId));
    try {
      await fetch(`${BASE_URL}/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit application");
      console.error("Apply error", err);
    } finally {
      setApplyingJobs((prev) => {
        const copy = new Set(prev);
        copy.delete(jobId);
        return copy;
      });
    }
  };

  if (!jobs.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground">No jobs found.</p>
      </motion.div>
    );
  }

  return (
    <>
    {
      userId ? (
    
    <ul className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <AnimatePresence>
        {jobs.map((job, index) => {
          const isSaved = savedJobs.has(job.id);
          const isSaving = savingJobs.has(job.id);
          const isApplying = applyingJobs.has(job.id);

          return (
            <motion.li
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col">
                <div className="relative pt-12">
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    {job.logoUrl ? (
                      <img
                        src={job.logoUrl}
                        alt={`${job.company} logo`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building className="h-6 w-6 text-gray-400" />
                    )}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4"
                    disabled={isSaving}
                    onClick={() => handleSave(job.id)}
                    aria-label={isSaved ? "Unsave" : "Save"}
                  >
                    <Button
                      variant={isSaved ? "secondary" : "ghost"}
                      size="icon"
                    >
                      {isSaving ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <Heart
                          className={`h-5 w-5 ${
                            isSaved
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      )}
                    </Button>
                  </motion.button>
                </div>

                <CardContent className="flex-grow">
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold line-clamp-2">
                      {job.job_title}
                    </h2>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building className="h-4 w-4 mr-1" />
                      <span className="truncate">{job.company}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{job.job_location}</span>
                    </div>

                    {job.salary && (
                      <div className="flex items-center text-sm font-medium">
                        <span className="text-emerald-500 font-semibold">₹</span>
                        <span className="ml-1 truncate">
                          {job.salary.includes("-")
                            ? formatSalaryRange(job.salary)
                            : job.salary.toLowerCase().includes("month") ||
                              job.salary.toLowerCase().includes("year")
                            ? job.salary
                            : `${formatSalary(job.salary)}/month`}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      {job.experience_level && (
                        <Badge variant="secondary" className="flex items-center">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {job.experience_level}
                        </Badge>
                      )}
                      {job.job_type && (
                        <Badge variant="secondary" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {job.job_type}
                        </Badge>
                      )}
                      {job.work_setting && (
                        <Badge variant="secondary" className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {job.work_setting}
                        </Badge>
                      )}
                      {job.salary_range && !job.salary && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          ₹ {formatSalaryRange(job.salary_range)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between gap-2 pt-2 pb-4">
                  <a
                    href={job.job_link}
                    className="flex-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        className="w-full"
                        variant="default"
                        size="sm"
                        onClick={() => handleApply(job.id)}
                        disabled={isApplying}
                      >
                        {isApplying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          "Apply Now"
                        )}
                      </Button>
                    </motion.div>
                  </a>
                  <a
                    href={job.job_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </a>
                </CardFooter>
              </Card>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul> ) : (
      <div className="flex flex-col justify-center items-center py-12">
        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />

        <p className="text-lg text-muted-foreground">
          Please log in to view job listings.
        </p>
      </div>
    )
    }
    </>
  );
}
