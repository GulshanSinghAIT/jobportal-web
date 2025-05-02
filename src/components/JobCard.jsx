import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export default function JobCard({ job }) {
  return (
    <Card className="flex gap-4 items-start p-4">
      <img
        src={job.logo || '/placeholder.jpg'}
        alt={`${job.company} logo`}
        className="w-28 h-28 object-cover rounded"
      />
      <CardContent className="p-0">
        <h3 className="text-lg font-semibold">{job.job_title}</h3>
        <p className="text-sm text-muted-foreground">{job.company}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{job.job_type}</Badge>
          <Badge variant="secondary">{job.salary}</Badge>
          <Badge variant="secondary">{job.experience_level}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
