import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-gray-900">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-gray-500">
        The page you are looking for does not exist or was moved. Check the URL
        or head back to the dashboard.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">Back to Landing</Link>
        </Button>
      </div>
    </div>
  );
}
