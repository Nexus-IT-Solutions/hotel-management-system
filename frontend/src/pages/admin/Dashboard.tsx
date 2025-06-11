
import { useState, useEffect } from 'react';
import { CalendarDays, Bed, Plus, Trash2Icon, Wrench, DoorClosedLockedIcon  } from 'lucide-react';
import { RevenueChart } from '../../components/Revenue';
import Image1 from '../../assets/images/image1.jpg';
import Image2 from '../../assets/images/image2.jpg';
import Image3 from '../../assets/images/image3.jpg';
import Image4 from '../../assets/images/image4.jpg';
import DashboardStat from '../../components/admin-components/DashboardStat';

export default function Dashboard(){
  const [currentTime, setCurrentTime] = useState(new Date());
  //const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return(
    <section className='space-y-6'>
       {/* Header with Current Time */}
       <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-blue-100">Here's what's happening at your hotel today</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono">{currentTime.toLocaleTimeString()}</div>
            <div className="text-blue-100">{currentTime.toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      
      {/* overview stat */}
      <DashboardStat/>

      {/* today's check in and room status */}
      <div className='flex flex-col lg:flex-row items-center gap-5'>
        {/* Revenue Chart */}
      <div className='w-[100%] md:flex-2'>
        <RevenueChart/>
      </div>
      <div className='w-[100%] md:flex-[0.8] pb-10 bg-white shadow-md rounded-md'>
        <div className='border-b p-6'>
          <h1 className='text-slate-800 font-semibold text-lg'>Room Status</h1>
        </div>

        <div className='flex flex-col gap-1'>
          <div className='flex items-center justify-between px-6 pt-6'>
            <p className='text-slate-600 text-sm flex items-center gap-2'>
              <span className='bg-purple-500 w-10 h-10 rounded-sm flex items-center justify-center p-1'><CalendarDays className='w-7 h-7 text-white'/></span>
              Total Rooms
            </p>
            <p className='text-slate-800 font-semibold text-lg'>120</p>
          </div>
          <div className='flex items-center justify-between px-6 pt-6'>
            <p className='text-slate-600 text-sm flex items-center gap-2'>
              <span className='bg-[#22c55e] w-10 h-10 rounded-sm flex items-center justify-center p-1'><Bed className='w-7 h-7 text-white'/></span>
              Available Rooms
            </p>
            <p className='text-slate-800 font-semibold text-lg'>24</p>
          </div>
          <div className='flex items-center justify-between px-6 pt-6'>
            <p className='text-slate-600 text-sm flex items-center gap-2'>
              <span className='bg-[#1d4ed8] w-10 h-10 rounded-sm flex items-center justify-center p-1'><DoorClosedLockedIcon className='w-7 h-7 text-white'/></span>
              Occupied Rooms
            </p>
            <p className='text-slate-800 font-semibold text-lg'>24</p>
          </div>
          <div className='flex items-center justify-between px-6 pt-6'>
            <p className='text-slate-600 text-sm flex items-center gap-2'>
              <span className='bg-[#f97319] w-10 h-10 rounded-sm flex items-center justify-center p-1'><Wrench className='w-7 h-7 text-white'/></span>
              Maintenance
            </p>
            <p className='text-slate-800 font-semibold text-lg'>24</p>
          </div>
          <div className='flex items-center justify-between px-6 pt-6'>
            <p className='text-slate-600 text-sm flex items-center gap-2'>
              <span className='bg-[#eab308] w-10 h-10 rounded-sm flex items-center justify-center p-1'><Trash2Icon className='w-7 h-7 text-white'/></span>
              Dirty
            </p>
            <p className='text-slate-800 font-semibold text-lg'>24</p>
          </div>
        </div>
      </div>
      </div>

      {/* Available rooms */}
      <div className=' bg-white shadow-md rounded-md px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-slate-800 font-semibold text-lg'>Available Rooms</h1>
          <button  className='flex items-center gap-1 bg-blue-600 text-white p-2 rounded-sm'>
            <Plus/>
            Add Room Type
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 py-4'>
          <div className='bg-white shadow-md rounded-md w-full'>
            <img src={Image1} alt="" className='w-full h-40 object-cover rounded-t-md'/>
            <div className='p-4'>
              <p className='text-slate-800 font-semibold text-lg'>Deluxe Room</p>
              <p className='text-slate-600 text-sm '>2 beds, 1 bathroom</p>
              <p className='text-blue-600 font-semibold text-lg'>$200 per night</p>
            </div>
          </div>

          <div className='bg-white shadow-md rounded-md w-full'>
            <img src={Image4} alt="" className='w-full h-40 object-cover rounded-t-md'/>
            <div className='p-4'>
              <p className='text-slate-800 font-semibold text-lg'>Executive Suite</p>
              <p className='text-slate-600 text-sm '>2 beds, 1 bathroom</p>
              <p className='text-blue-600 font-semibold text-lg'>$300 per night</p>
            </div>
          </div>

          <div className='bg-white shadow-md rounded-md w-full'>
            <img src={Image2} alt="" className='w-full h-40 object-cover rounded-t-md'/>
            <div className='p-4'>
              <p className='text-slate-800 font-semibold text-lg'>Standard Room</p>
              <p className='text-slate-600 text-sm '>2 beds, 1 bathroom</p>
              <p className='text-blue-600 font-semibold text-lg'>$450 per night</p>
            </div>
          </div>

          <div className='bg-white shadow-md rounded-md w-full'>
            <img src={Image3} alt="" className='w-full h-40 object-cover rounded-t-md'/>
            <div className='p-4'>
              <p className='text-slate-800 font-semibold text-lg'>Family Suite</p>
              <p className='text-slate-600 text-sm '>2 beds, 1 bathroom</p>
              <p className='text-blue-600 font-semibold text-lg'>$700 per night</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}