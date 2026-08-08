import { useState } from 'react';
import { Link } from 'react-router-dom';
import MovieMegaMenu from './MovieMegaMenu';

interface NavItemProps {
  readonly title: string;
  readonly subMenu?: { label: string; path: string }[];
  readonly isMegaMenu?: boolean;
  path?: string;
}

export default function NavItem({ title, subMenu, isMegaMenu, path }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (path) {
    return (
      <li className="list-none w-full lg:w-auto">
        <Link
          to={path}
          className="block w-full py-3 lg:py-4 hover:text-[#f26b38] transition-colors text-[15px] font-medium"
        >
          {title}
        </Link>
      </li>
    );
  }

  const hasDropdown = subMenu || isMegaMenu;

  return (
    <li className="list-none w-full lg:w-auto relative group">

      <div
        className="flex items-center justify-between w-full py-3 lg:py-4 cursor-pointer text-[15px] font-medium hover:text-[#f26b38] transition-colors"
        onClick={() => setIsOpen(!isOpen)} // Bấm để đóng/mở trên Mobile
      >
        <span>{title}</span>

        {hasDropdown && (
          <svg
            // Xoay mũi tên khi click (Mobile) HOẶC khi hover (Desktop)
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 lg:group-hover:text-[#f26b38] lg:group-hover:rotate-180 ${isOpen ? 'rotate-180 text-[#f26b38]' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>

      {hasDropdown && (
        <div
          className={`
            transition-all duration-300 ease-in-out w-full z-50
            overflow-hidden 
            ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
            lg:absolute lg:top-full lg:left-0 lg:mt-0 lg:max-h-none lg:overflow-visible
            lg:bg-white lg:shadow-lg lg:rounded-md lg:border lg:border-gray-100 
            lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible
            ${isMegaMenu ? 'lg:w-max' : 'lg:w-56'}
          `}
        >
          {isMegaMenu && (
            <div className="hidden lg:block w-full cursor-default">
              <MovieMegaMenu />
            </div>
          )}

          {subMenu && (
            <ul className={`flex flex-col gap-1 py-1 lg:py-2 pl-4 lg:pl-0 border-l-[3px] border-[#f26b38] lg:border-none ml-2 lg:ml-0 ${isMegaMenu ? 'lg:hidden' : ''}`}>
              {subMenu.map((item, index) => (
                <li key={index}>
                  <Link to={item.path}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}