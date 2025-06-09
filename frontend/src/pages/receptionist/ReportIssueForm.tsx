import { useState } from "react";

export default function ReportIssueForm() {
  const [form, setForm] = useState<{
    reportType: string;
    roomFloors: string;
    issuePriority: string;
    description: string;
    date: string;
    file: File | null;
  }>({
    reportType: "",
    roomFloors: "",
    issuePriority: "",
    description: "",
    date: "",
    file: null,
  });
  const [errors, setErrors] = useState<{
    reportType?: string;
    roomFloors?: string;
    issuePriority?: string;
    description?: string;
    date?: string;
  }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const reportTypes = [
    "Maintenance Issue",
    "Guest Complaint",
    "Lost & Found",
    "Incident",
    "Other",
  ];

  const roomFloors = [
    "Ground Floor",
    "First Floor",
    "Second Floor",
    "Third Floor",
    "Fourth Floor",
    "Fifth Floor",
  ];

  const issuePriority = ["High", "Medium", "Low"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors: {
      reportType?: string;
      description?: string;
      date?: string;
      roomFloors?: string;
      issuePriority?: string;
    } = {};
    if (!form.reportType) newErrors.reportType = "Report type is required.";
    if (!form.roomFloors) newErrors.roomFloors = "Room Floor is required.";
    if (!form.issuePriority)
      newErrors.issuePriority = "Issue Priority is required.";
    if (!form.description || form.description.length < 10)
      newErrors.description = "Description must be at least 10 characters.";
    if (!form.date) newErrors.date = "Date is required.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // TODO: Replace with actual API call
    setSubmitted(true);
    setForm({
      reportType: "",
      roomFloors: "",
      issuePriority: "",
      description: "",
      date: "",
      file: null,
    });
  };
  return (
    <div className="mx-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">Report an Issue</h1>
        <p className="text-blue-100">
          Please fill out the form below to submit a report.
        </p>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-8 mt-8">
        <h2 className="text-lg font-medium mb-6 ">Submit a Report</h2>
        {submitted && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Report submitted successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Report Type */}
          <div>
            <label className="block font-medium mb-1" htmlFor="reportType">
              Report Type <span className="text-red-500">*</span>
            </label>
            <select
              id="reportType"
              name="reportType"
              value={form.reportType}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${
                errors.reportType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select type</option>
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.reportType && (
              <p className="text-red-500 text-sm mt-1">{errors.reportType}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1" htmlFor="description">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              className={`w-full border rounded px-3 py-2 resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe the issue or report in detail..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Location */}
          <div className="mb-6 flex items-center gap-5">
            <div className="flex-1">
              <label className="block font-medium mb-1" htmlFor="location">
                Location of Issue <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="eg. Room 101"
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 transition duration-200 ease-in-out ${
                  errors.date ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block font-medium mb-1" htmlFor="floor">
                Floor of Issue <span className="text-red-500">*</span>
              </label>
              <select
                id="roomFloors"
                name="roomFloors"
                value={form.roomFloors}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.reportType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Floor</option>
                {roomFloors.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* issue priority */}
            <div>
              <label className="block font-medium mb-1" htmlFor="reportType">
                Report Type <span className="text-red-500">*</span>
              </label>
              <select
                id="issuePriority"
                name="issuePriority"
                value={form.issuePriority}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.reportType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Issue Priority</option>
                {issuePriority.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.reportType && (
                <p className="text-red-500 text-sm mt-1">{errors.reportType}</p>
              )}
            </div>
            {/* Date */}
            <div className="mb-6">
              <label className="block font-medium mb-1" htmlFor="date">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 transition duration-200 ease-in-out ${
                  errors.date ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block font-medium mb-1" htmlFor="file">
              Attach File (optional)
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*,application/pdf"
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 transition duration-200 ease-in-out border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.file && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {form.file.name}
              </p>
            )}
          </div>
         <div className="flex justify-end">
         <button
            type="submit"
            className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Submit Report
          </button>
          
         </div>
        </form>
      </div>
    </div>
  );
}
