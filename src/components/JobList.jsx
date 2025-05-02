import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Loader2, Heart, MapPin, Building, Clock, Briefcase, Calendar, ExternalLink } from "lucide-react";
// Remove toast dependency - we'll use alert instead

// Helper functions for salary formatting
const formatSalary = (salary) => {
  // Convert to number if it's a string with digits only
  const num = parseFloat(salary.replace(/[^\d.]/g, ''));
  if (isNaN(num)) return salary;
  
  // Format with commas: 1,00,000
  return num.toLocaleString('en-IN');
};

const formatSalaryRange = (salaryRange) => {
  // Expected format: "50000-70000" or similar
  const parts = salaryRange.split('-');
  if (parts.length !== 2) return salaryRange;
  
  const min = formatSalary(parts[0].trim());
  const max = formatSalary(parts[1].trim());
  
  return `${min} - ${max}/month`;
};

export default function JobList({ jobs = [] }) {
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [savingJobs, setSavingJobs] = useState(new Set());
  const [applyingJobs, setApplyingJobs] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch saved job IDs
  useEffect(() => {
    async function loadSaved() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/user/saved");
        const data = await res.json();
        setSavedJobs(new Set(data.map((j) => j.jobId)));
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load saved jobs",
          variant: "destructive",
        });
        console.error("Failed to load saved jobs", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSaved();
  }, []);

  const handleSave = async (jobId) => {
    setSavingJobs((prev) => new Set(prev).add(jobId));
    try {
      await fetch(`/api/jobs/${jobId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      // Toggle saved state
      setSavedJobs((prev) => {
        const newSaved = new Set(prev);
        if (newSaved.has(jobId)) {
          newSaved.delete(jobId);
          alert("Job removed from saved list");
        } else {
          newSaved.add(jobId);
          alert("Job saved successfully!");
        }
        return newSaved;
      });
    } catch (err) {
      alert("Failed to save job");
      console.error("Save failed", err);
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
      await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      alert("Application submitted successfully!");
    } catch (err) {
      alert("Failed to submit application");
      console.error("Apply failed", err);
    } finally {
      setApplyingJobs((prev) => {
        const copy = new Set(prev);
        copy.delete(jobId);
        return copy;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading jobs...</span>
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center py-12">
        <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground">No jobs found matching your criteria.</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => {
        const isSaved = savedJobs.has(job.id);
        const isSaving = savingJobs.has(job.id);
        const isApplying = applyingJobs.has(job.id);
        
        return (
          <li key={job.id}>
            <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
              <div className="relative pt-12">
                {/* Company Logo */}
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

                {/* Save button */}
                <Button
                  variant={isSaved ? "secondary" : "ghost"}
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => handleSave(job.id)}
                  disabled={isSaving}
                  aria-label={isSaved ? "Remove from saved" : "Save job"}
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <Heart 
                      className={`h-5 w-5 ${isSaved ? "text-red-500 fill-red-500" : "text-gray-400"}`} 
                    />
                  )}
                </Button>
              </div>

              <CardContent className="flex-grow">
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold line-clamp-2">{job.job_title}</h2>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{job.company}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{job.job_location}</span>
                  </div>

                  {job.salary && (
                    <div className="flex items-center text-sm font-medium">
                      {job.salary.includes("-") ? (
                        // If salary contains a range (e.g., "50000-70000")
                        <div className="flex items-center">
                          <span className="text-emerald-500 font-semibold">₹</span>
                          <span className="truncate ml-1">{formatSalaryRange(job.salary)}</span>
                        </div>
                      ) : job.salary.toLowerCase().includes("month") || job.salary.toLowerCase().includes("year") ? (
                        // If salary already includes "per month/year" text
                        <div className="flex items-center">
                          <span className="text-emerald-500 font-semibold">₹</span>
                          <span className="truncate ml-1">{job.salary}</span>
                        </div>
                      ) : (
                        // Default: just show the salary
                        <div className="flex items-center">
                          <span className="text-emerald-500 font-semibold">₹</span>
                          <span className="truncate ml-1">{formatSalary(job.salary)}</span>
                          <span className="text-xs text-muted-foreground ml-1">/month</span>
                        </div>
                      )}
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
                      <Badge variant="secondary" className="flex items-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                        ₹ {formatSalaryRange(job.salary_range)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between gap-2 pt-2 pb-4">
                <Button
                  className="flex-1"
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
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-none"
                  onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}