import logoImg from '../../assets/galaxy-logo-mobile.074abeac.png';

export default function Logo() {
  return (
    <a href="/" className="block cursor-pointer">
      <img 
        src={logoImg} 
        alt="Galaxy Cinema" 
        className="h-12 w-auto object-contain mr-10" 
      />
    </a>
  );
}