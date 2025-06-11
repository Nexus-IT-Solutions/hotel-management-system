import ReportForm from "../../components/ReportForm";

export default function ReportIssueForm() {
 
  return (
    <div className="mx-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">Report an Issue</h1>
        <p className="text-blue-100">
          Please fill out the form below to submit a report.
        </p>
      </div>
     <ReportForm/>
    </div>
  );
}
