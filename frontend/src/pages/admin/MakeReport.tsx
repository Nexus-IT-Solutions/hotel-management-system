import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import ReportForm from "../../components/ReportForm";

const MakeReport = () => {
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Report an Issue</h1>
          <p className="text-blue-100">
            Please fill out the form below to submit a report.
          </p>
        </div>

        <div>
          <Link
            to="issues"
            className="flex items-center gap-2 mt-4 bg-white text-blue-600 py-2 px-4 rounded-lg font-medium"
          >
            <Plus className="w-6 h-6" />
            View Issues
          </Link>
        </div>
      </div>

      <ReportForm/>
    </div>
  );
};

export default MakeReport;
