import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteShow } from '../../feautres/shows/showsSlice';
import { toast } from 'react-toastify';
import Button from '../general/Button';

const ShowCard = ({
  showId,
  showName,
  timing,
  length,
  description,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const formatDate = (dateString) => {
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

  const handleCardClick = () => {
    navigate(`/shows/${showId}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/shows/${showId}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete ${showName}?`)) {
      try {
        await dispatch(deleteShow(showId)).unwrap();
        toast.success('Show deleted successfully!');
      } catch (error) {
        toast.error(error || 'Failed to delete show');
      }
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="bg-linear-to-r from-purple-500 to-pink-500 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">{showName}</h3>
        <div className="flex items-center gap-2 text-purple-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>{formatDate(timing)}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{length} minutes</span>
          </div>
          
          <p className="text-gray-700 text-sm line-clamp-3">
            {description}
          </p>
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
            <Button
              label="View Details"
              variant="primary"
              onClick={handleCardClick}
              className="w-full text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowCard;