import { Link } from 'react-router-dom';
import MovieMegaMenu from './MovieMegaMenu';
interface NavItemProps {
  readonly title: string;
  readonly subMenu?: string[];
  readonly isMegaMenu?: boolean;
  path?: string;
}


export default function NavItem({ title, subMenu, isMegaMenu, path }: NavItemProps) {
  if (path) {
    return (
      <li className="list-none">
        <Link to={path} className="hover:text-blue-600 transition-colors">
          {title}
        </Link>
      </li>
    );
  }
  return (
    <li className="relative flex items-center gap-1 hover:text-orange-500 cursor-pointer group transition-colors text-[15px] py-4">
      {title}

      {(subMenu || isMegaMenu) && (
        <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
      {isMegaMenu && (
        <div className="hidden lg:block cursor-default">
          <MovieMegaMenu />
        </div>
      )}

      {subMenu && !isMegaMenu && (
        <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          <ul className="py-2">
            {subMenu.map((subItem) => (
              <li key={subItem}>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors">
                  {subItem}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}