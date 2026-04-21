import ticketImg from '../../assets/ticket.png'; 

export default function TicketButton() {
  return (
    <button className="cursor-pointer hover:opacity-80 transition-opacity">
      <img src={ticketImg} alt="Mua Vé" className="h-10 w-auto object-contain" />
    </button>
  );
}