import { SlidersHorizontal } from 'lucide-react';

export default function JobListingHeader({ totalJobs = 0 }) {
  const filters = ['Cấp bậc', 'Loại hình', 'Mức lương', 'Lĩnh vực'];

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between py-6 gap-4 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-[#002d5c]">
        {totalJobs} Việc làm IT phù hợp
      </h2>
      
      <div className="flex items-center text-sm font-medium text-gray-500 italic">
        * Sắp xếp ưu tiên theo độ phù hợp AI (SBERT Match)
      </div>
    </div>
  );
}
