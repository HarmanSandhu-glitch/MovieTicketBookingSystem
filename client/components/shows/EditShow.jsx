import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateShow, getShowById, resetShows } from '../../feautres/shows/showsSlice';
import { getAllHalls } from '../../feautres/halls/hallsSlice';
import { toast } from 'react-toastify';
import Input from '../general/Input';
import Select from '../general/Select';
import Button from '../general/Button';

const EditShow = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentShow, isLoading } = useSelector((state) => state.shows);
  const { halls } = useSelector((state) => state.halls);
  
  const [formData, setFormData] = useState({
    showName: '',
    timing: '',
    length: '',
    description: '',
    hallId: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(getShowById(id));
    }
    dispatch(getAllHalls());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentShow) {
      // Convert timing to datetime-local format
      const formattedTiming = currentShow.timing 
        ? new Date(currentShow.timing).toISOString().slice(0, 16)
        : '';
      
      setFormData({
        showName: currentShow.showName || '',
        timing: formattedTiming,
        length: currentShow.length || '',
        description: currentShow.description || '',
        hallId: currentShow.hallId || '',
      });
    }
  }, [currentShow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.showName.trim()) newErrors.showName = 'Show name is required';
    if (!formData.timing) newErrors.timing = 'Show timing is required';
    if (!formData.length || formData.length <= 0) newErrors.length = 'Valid length required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.hallId) newErrors.hallId = 'Please select a hall';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all fields correctly');
      return;
    }

    const showData = {
      ...formData,
      length: Number(formData.length),
    };

    try {
      await dispatch(updateShow({ id, showData })).unwrap();
      toast.success('Show updated successfully!');
      dispatch(resetShows());
      navigate(`/shows/${id}`);
    } catch (error) {
      toast.error(error || 'Failed to update show');
    }
  };

  const hallOptions = halls.map((hall) => ({
    value: hall._id,
    label: `${hall.name} - ${hall.location}`,
  }));

  if (isLoading && !currentShow) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Show</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Show Name"
            name="showName"
            value={formData.showName}
            onChange={handleChange}
            error={errors.showName}
            placeholder="Enter show/movie name"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Show Timing"
              name="timing"
              type="datetime-local"
              value={formData.timing}
              onChange={handleChange}
              error={errors.timing}
              required
            />

            <Input
              label="Length (minutes)"
              name="length"
              type="number"
              value={formData.length}
              onChange={handleChange}
              error={errors.length}
              placeholder="120"
              required
            />
          </div>

          <Select
            label="Select Hall"
            name="hallId"
            value={formData.hallId}
            onChange={handleChange}
            options={hallOptions}
            error={errors.hallId}
            placeholder="Choose a hall"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter show description..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.description}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              label="Update Show"
              variant="primary"
              loading={isLoading}
              className="flex-1"
            />
            <Button
              type="button"
              label="Cancel"
              variant="secondary"
              onClick={() => navigate(`/shows/${id}`)}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShow;