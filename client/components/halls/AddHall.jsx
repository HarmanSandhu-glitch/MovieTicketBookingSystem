import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createHall, resetHalls } from '../../feautres/halls/hallsSlice';
import { toast } from 'react-toastify';
import Input from '../general/Input';
import Button from '../general/Button';

const AddHall = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.halls);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    normalSittingCapacity: '',
    vipSittingCapacity: '',
    premiumSittingCapacity: '',
    normalSeatPrice: '',
    vipSeatPrice: '',
    premiumSeatPrice: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Hall name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.normalSittingCapacity || formData.normalSittingCapacity <= 0) 
      newErrors.normalSittingCapacity = 'Valid capacity required';
    if (!formData.vipSittingCapacity || formData.vipSittingCapacity < 0) 
      newErrors.vipSittingCapacity = 'Valid capacity required';
    if (!formData.premiumSittingCapacity || formData.premiumSittingCapacity < 0) 
      newErrors.premiumSittingCapacity = 'Valid capacity required';
    if (!formData.normalSeatPrice || formData.normalSeatPrice <= 0) 
      newErrors.normalSeatPrice = 'Valid price required';
    if (!formData.vipSeatPrice || formData.vipSeatPrice <= 0) 
      newErrors.vipSeatPrice = 'Valid price required';
    if (!formData.premiumSeatPrice || formData.premiumSeatPrice <= 0) 
      newErrors.premiumSeatPrice = 'Valid price required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all fields correctly');
      return;
    }

    const hallData = {
      ...formData,
      normalSittingCapacity: Number(formData.normalSittingCapacity),
      vipSittingCapacity: Number(formData.vipSittingCapacity),
      premiumSittingCapacity: Number(formData.premiumSittingCapacity),
      normalSeatPrice: Number(formData.normalSeatPrice),
      vipSeatPrice: Number(formData.vipSeatPrice),
      premiumSeatPrice: Number(formData.premiumSeatPrice),
    };

    try {
      await dispatch(createHall(hallData)).unwrap();
      toast.success('Hall created successfully!');
      dispatch(resetHalls());
      navigate('/halls');
    } catch (error) {
      toast.error(error || 'Failed to create hall');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Hall</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Hall Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter hall name"
              required
            />

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="Enter location"
              required
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Sitting Capacity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Normal Seats"
                name="normalSittingCapacity"
                type="number"
                value={formData.normalSittingCapacity}
                onChange={handleChange}
                error={errors.normalSittingCapacity}
                placeholder="0"
                required
              />

              <Input
                label="VIP Seats"
                name="vipSittingCapacity"
                type="number"
                value={formData.vipSittingCapacity}
                onChange={handleChange}
                error={errors.vipSittingCapacity}
                placeholder="0"
                required
              />

              <Input
                label="Premium Seats"
                name="premiumSittingCapacity"
                type="number"
                value={formData.premiumSittingCapacity}
                onChange={handleChange}
                error={errors.premiumSittingCapacity}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Seat Prices</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Normal Seat Price ($)"
                name="normalSeatPrice"
                type="number"
                step="0.01"
                value={formData.normalSeatPrice}
                onChange={handleChange}
                error={errors.normalSeatPrice}
                placeholder="0.00"
                required
              />

              <Input
                label="VIP Seat Price ($)"
                name="vipSeatPrice"
                type="number"
                step="0.01"
                value={formData.vipSeatPrice}
                onChange={handleChange}
                error={errors.vipSeatPrice}
                placeholder="0.00"
                required
              />

              <Input
                label="Premium Seat Price ($)"
                name="premiumSeatPrice"
                type="number"
                step="0.01"
                value={formData.premiumSeatPrice}
                onChange={handleChange}
                error={errors.premiumSeatPrice}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              label="Create Hall"
              variant="primary"
              loading={isLoading}
              className="flex-1"
            />
            <Button
              type="button"
              label="Cancel"
              variant="secondary"
              onClick={() => navigate('/halls')}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHall;