import { FunnelIcon } from "lucide-react";
import { Eye, Edit, Trash2 } from "lucide-react";

const IssuesTable = () => {
  const getStatusColor = (
    status: "pending" | "underreview" | "inProgress" | "Resolved" | "Rejected"
  ) => {
    const colors = {
      pending: "bg-red-100 border-red-300 text-red-800",
      underreview: "bg-yellow-100 border-yellow-300 text-yellow-800",
      inProgress: "bg-orange-100 border-orange-300 text-orange-600",
      Resolved: "bg-blue-100 border-blue-300 text-blue-800",
      Rejected: "bg-purple-100 border-purple-300 text-purple-800",
    };
    return colors[status] || colors.pending;
  };


  const getPriorityColor = (
    priority: "Low" | "Medium" | "High"
  ) => {
    const colors = {
      Low: "bg-green-100 border-green-300 text-green-800",
      Medium: "bg-yellow-100 border-yellow-300 text-yellow-800",
      High: "bg-red-100 border-red-300 text-red-800",
    };
    return colors[priority] || colors.Low;
  };

  return (
    <div>
      {/* filter section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-end lg:grid-cols-4 p-6 bg-white gap-5 shadow-md rounded-md">
        {/* search section */}
        <div>
          <label htmlFor="">Search</label>
          <input
            type="search"
            placeholder="Search..."
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label htmlFor="">Status</label>
          <select
            name=""
            id=""
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">All Statues</option>
            <option value="pending">Pending</option>
            <option value="under-review">Under Review</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label htmlFor="Priority">Priority</label>
          <select
            name=""
            id=""
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* apply filters */}
        <div>
          <button className="px-4 py-2 bg-blue-600 w-[100%] text-white rounded-sm flex items-center gap-2 justify-center">
            {" "}
            <FunnelIcon className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>

      <div className="mt-5 bg-white rounded-lg shadow hidden md:block">
        {/* issues table */}
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {issues.map((issue, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {issue.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {issue.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      issue.status as
                        | "pending"
                        | "underreview"
                        | "inProgress"
                        | "Resolved"
                        | "Rejected"
                    )}`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {issue.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                        issue.priority as "Low" | "Medium" | "High"
                      )}`}
                    >
                      {issue.priority}
                    </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center space-x-3">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssuesTable;

const issues = [
  {
    title: "Issue 1",
    location: "Location 1",
    status: "Rejected",
    priority: "Low",
    createdAt: "2023-01-01",
  },
  {
    title: "Issue 2",
    location: "Location 2",
    status: "InProgress",
    priority: "Medium",
    createdAt: "2023-01-02",
  },
  {
    title: "Issue 3",
    location: "Location 3",
    status: "Resolved",
    priority: "High",
    createdAt: "2023-01-03",
  },
  {
    title: "Issue 4",
    location: "Location 4",
    status: "underreview",
    priority: "Low",
    createdAt: "2023-01-04",
  },
  {
    title: "Issue 5",
    location: "Location 5",
    status: "Rejected",
    priority: "Medium",
    createdAt: "2023-01-05",
  },
];
