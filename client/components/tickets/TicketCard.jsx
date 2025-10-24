import React from 'react';

const TicketCard = ({
  ticketId,
  showName,
  showTiming,
  seats = [],
  status,
  price,
  onClick,
}) => {
  const statusColors = {
    booked: 'bg-green-100 text-green-800 border-green-300',
    confirmed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const statusColor = statusColors[status?.toLowerCase()] || statusColors.pending;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative">
      {/* Ticket shape with notches */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-shadow duration-300">
        {/* Top section */}
        <div className="bg-linear-to-r from-blue-500 to-purple-600 p-6 text-white relative">
          {/* Corner decorations */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-10 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-tr-full"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">{showName}</h3>
            <div className="flex items-center gap-2 text-blue-100">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{formatDate(showTiming)}</span>
            </div>
          </div>
        </div>

        {/* Perforation line */}
        <div className="relative h-6 bg-gray-50">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full -ml-3 border-2 border-gray-200"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full -mr-3 border-2 border-gray-200"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-t-2 border-dashed border-gray-300 w-full"></div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-6 bg-white">
          <div className="space-y-4">
            {/* Seats */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Seats</p>
              <div className="flex flex-wrap gap-2">
                {seats.length > 0 ? (
                  seats.map((seat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium border border-gray-300"
                    >
                      {seat}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No seats assigned</span>
                )}
              </div>
            </div>

            {/* Status and Price */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColor}`}>
                  {status?.toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Price</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${price ? Number(price).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>

            {/* Ticket ID */}
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Ticket ID: <span className="font-mono">{ticketId}</span>
              </p>
            </div>

            {/* Action Button */}
            {onClick && (
              <button
                onClick={onClick}
                className="w-full mt-4 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                View Details
              </button>
            )}
          </div>
        </div>

        {/* Barcode decoration */}
        <div className="bg-gray-50 p-3 border-t">
          <div className="flex justify-center gap-0.5">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gray-800"
                style={{ height: `${Math.random() * 20 + 10}px` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard; 