import AddRoomForms from "../../components/AddRoomForms";


export default function AddRoom(){
  return(
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Add New Room</h2>
        <p className="text-gray-600 mt-1">
          Fill in the details to add a new room
        </p>
      </div>

      {/* forms */}
      <div className="p-6">
        <AddRoomForms/>
      </div>
    </div>
  )
}