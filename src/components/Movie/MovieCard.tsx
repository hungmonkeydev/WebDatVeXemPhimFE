import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button'; 

interface MovieCardProps {
  readonly id: number;
  readonly title: string;
  readonly imageUrl: string;
  readonly rating: string;
  readonly ageTag: string;
}

export default function MovieCard({id, title, imageUrl, rating, ageTag }: MovieCardProps) {
  const navigate = useNavigate();
  
  const handleGoToDetail = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    navigate(`/phim/${id}`); 
  };
  return (
    <div className="flex flex-col gap-3 cursor-pointer group">
      
      {/* KHUNG ẢNH POSTER CÓ CHỨA LỚP PHỦ */}
      <div className="relative rounded-lg overflow-hidden">
        
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105" 
        />

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 z-10">
          
          {/* Nút Mua vé */}
          <Button 
            onClick={handleGoToDetail}
            className="w-32" 
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Mua vé
          </Button>

          {/* Nút Trailer*/}
          <Button 
            variant="ghost"
            className="w-32"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Trailer
          </Button>
          
        </div>

        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-20">
          <div className="bg-black/70 text-white text-sm font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
            <span className="text-yellow-400 text-xs">★</span>
            {rating}
          </div>
          <div className="bg-[#f26b38] text-white text-sm font-bold px-2 py-0.5 rounded">
            {ageTag}
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-800 text-[17px] truncate group-hover:text-blue-600 transition-colors">
        {title}
      </h3>

    </div>
  );
}