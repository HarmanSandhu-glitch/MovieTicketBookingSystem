import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteHall } from '../../feautres/halls/hallsSlice';
import { toast } from 'react-toastify';
import Button from '../general/Button';

const HallCard = ({
  hallId,
  hallName,
  location,
  normalSittingCapacity,
  vipSittingCapacity,
  premiumSittingCapacity,
  vipSeatPrice,
  normalSeatPrice,
  premiumSeatPrice,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const totalCapacity = normalSittingCapacity + vipSittingCapacity + premiumSittingCapacity;

  const handleCardClick = () => {
    navigate(`/halls/${hallId}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/halls/${hallId}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete ${hallName}?`)) {
      try {
        await dispatch(deleteHall(hallId)).unwrap();
        toast.success('Hall deleted successfully!');
      } catch (error) {
        toast.error(error || 'Failed to delete hall');
      }
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{hallName}</h3>
        <div className="flex items-center gap-2 text-blue-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{location}</span>
        </div>
      </div>

      <div className="p-6">
        {/* Capacity Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">Seating Capacity</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-800">{normalSittingCapacity}</p>
              <p className="text-xs text-gray-600 mt-1">Normal</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{vipSittingCapacity}</p>
              <p className="text-xs text-gray-600 mt-1">VIP</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">{premiumSittingCapacity}</p>
              <p className="text-xs text-gray-600 mt-1">Premium</p>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">
              Total Capacity: <span className="font-bold text-gray-800">{totalCapacity}</span> seats
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">Seat Prices</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">${normalSeatPrice}</p>
              <p className="text-xs text-gray-600">Normal</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-purple-600">${vipSeatPrice}</p>
              <p className="text-xs text-gray-600">VIP</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-amber-600">${premiumSeatPrice}</p>
              <p className="text-xs text-gray-600">Premium</p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-3 pt-4 border-t">
            <Button
              label="Edit"
              variant="primary"
              onClick={handleEdit}
              className="flex-1 text-sm"
            />
            <Button
              label="Delete"
              variant="danger"
              onClick={handleDelete}
              className="flex-1 text-sm"
            />
          </div>
        )}

        {!isAdmin && (
          <div className="pt-4 border-t">
            <p className="text-center text-sm text-gray-500">
              Click to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HallCard;