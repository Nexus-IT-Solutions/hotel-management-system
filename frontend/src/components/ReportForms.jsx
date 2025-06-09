import { useState } from "react";

export default function ReportForm (){
  const [form, setForm] = useState({
    reportType: "",
    description: "",
    date: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const reportTypes = [
    "Maintenance Issue",
    "Guest Complaint",
    "Lost & Found",
    "Incident",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.reportType) newErrors.reportType = "Report type is required.";
    if (!form.description || form.description.length < 10)
      newErrors.description = "Description must be at least 10 characters.";
    if (!form.date) newErrors.date = "Date is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
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
      description: "",
      date: "",
      file: null,
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit a Report</h2>
      {submitted && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Report submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
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
            rows={4}
            className={`w-full border rounded px-3 py-2 resize-none ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe the issue or report in detail..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block font-medium mb-1" htmlFor="date">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block font-medium mb-1" htmlFor="file">
            Attach File (optional)
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*,application/pdf"
            onChange={handleChange}
            className="w-full"
          />
          {form.file && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {form.file.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

