// src/components/Header/TicketButton.tsx

import ticketImg from '../../assets/ticket.png'; 

export default function TicketButton() {
  return (
    // Thêm hiệu ứng hover mờ đi một chút để người ta biết đây là nút bấm được
    <button className="cursor-pointer hover:opacity-80 transition-opacity">
      <img src={ticketImg} alt="Mua Vé" className="h-10 w-auto object-contain" />
    </button>
  );
}