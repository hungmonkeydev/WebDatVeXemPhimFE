import { Link } from 'react-router-dom';
import logoImg from '../../../public/logo/logoViecinema.png';

export default function Logo() {
  return (
    <Link to="/" className="block cursor-pointer">
      <img 
        src={logoImg} 
        alt="Galaxy Cinema" 
        className="h-16 w-auto object-contain mr-10" 
      />
    </Link>
  );
}
