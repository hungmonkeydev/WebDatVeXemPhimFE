export default function UserAction() {
  return (
    <div className="flex items-center gap-4">
      {/* Search Button */}
      <button aria-label="Search" className="p-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      
      {/* Login / Profile */}
      <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-500 transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <span>Đăng nhập</span>
      </button>
    </div>
  );
}
