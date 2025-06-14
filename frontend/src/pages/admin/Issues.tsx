import IssuesTable from "../../components/IssuesTable";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Issues = () => {
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Issue Management</h1>
          <p className="text-blue-100">Manage and track issues</p>
        </div>

        <div>
          <Link to='make-reports-admin' className="flex items-center gap-2 mt-4 bg-white text-blue-600 py-2 px-4 rounded-lg font-medium">
            <Plus className="w-6 h-6" />
            Report New Issue
          </Link>
        </div>
      </div>

      <div className="py-6">
        <IssuesTable />
      </div>
    </div>
  );
};

export default Issues;
