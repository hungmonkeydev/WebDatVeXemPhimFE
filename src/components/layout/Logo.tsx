import logoImg from '../../../public/logo/logoViecinema.png';

export default function Logo() {
  return (
    <a href="/" className="block cursor-pointer">
      <img 
        src={logoImg} 
        alt="Galaxy Cinema" 
        className="h-16 w-auto object-contain mr-10" 
      />
    </a>
  );
}