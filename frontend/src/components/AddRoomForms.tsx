import { Bed, Check, X } from "lucide-react";

export default function AddRoomForms() {
  return (
    <div>
      <form action="">
        {/* section1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-8">
          <div className="space-y-8">
            {/* room number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number *
              </label>
              <input
                type="number"
                name="roomNumber"
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter room number"
                required
              />
            </div>

            {/* room type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number *
              </label>
              <select
                name=""
                id=""
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="room-type">Select Room Type</option>
                <option value="deluxe-room">Deluxe Room</option>
                <option value="executive-suite">Executive Suite</option>
                <option value="standard-room">Standard Room</option>
                <option value="family-suite">Family Suite</option>
              </select>
            </div>

            {/* floor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Floor *
              </label>
              <select
                name=""
                id=""
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="room-floor">Select Room Floor</option>
                <option value="ground-floor">Ground Floor</option>
                <option value="first-floor">Floor 1</option>
                <option value="second-floor">Floor 2</option>
                <option value="third-floor">Floor 3</option>
                <option value="last-floor">Last Floor</option>
              </select>
            </div>

            {/* room price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Price *
              </label>
              <input
                type="number"
                name="roomPrice"
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter room price"
                required
              />
            </div>
          </div>

          <div className="space-y-8">
            {/* room capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Capacity *
              </label>
              <input
                type="number"
                name="roomCapacity"
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter room capacity"
                required
              />
            </div>

            {/* room amenities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Bed className="w-5 h-5 mr-2 text-green-600" />
                Room Amenities
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="amenities"
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm">Air Condition</span>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="amenities"
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm">Television</span>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="amenities"
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm">Refrigerator</span>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="amenities"
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm">Jacuzzi</span>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="amenities"
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm">Fan</span>
                </label>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Bed className="w-5 h-5 mr-2 text-orange-600" />
                Add Room Summary
              </h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Number:</span>
                  <span className="font-medium">Not Selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type:</span>
                  <span className="font-medium">Not Selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Floor:</span>
                  <span className="font-medium"> Not Selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Price:</span>
                  <span className="font-medium"> Not Selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Capacity:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Amenities:</span>
                  <span className="font-medium">5</span>
                </div>
                

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">$234</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Create Booking
              </button>

              <button
                type="button"
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
