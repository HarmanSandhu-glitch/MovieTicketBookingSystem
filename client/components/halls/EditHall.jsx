import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateHall, getHallById, resetHalls } from '../../feautres/halls/hallsSlice';
import { toast } from 'react-toastify';
import Input from '../general/Input';
import Button from '../general/Button';

const EditHall = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentHall, isLoading } = useSelector((state) => state.halls);
  
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

  useEffect(() => {
    if (id) {
      dispatch(getHallById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentHall) {
      setFormData({
        name: currentHall.name || '',
        location: currentHall.location || '',
        normalSittingCapacity: currentHall.normalSittingCapacity || '',
        vipSittingCapacity: currentHall.vipSittingCapacity || '',
        premiumSittingCapacity: currentHall.premiumSittingCapacity || '',
        normalSeatPrice: currentHall.normalSeatPrice || '',
        vipSeatPrice: currentHall.vipSeatPrice || '',
        premiumSeatPrice: currentHall.premiumSeatPrice || '',
      });
    }
  }, [currentHall]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      await dispatch(updateHall({ id, hallData })).unwrap();
      toast.success('Hall updated successfully!');
      dispatch(resetHalls());
      navigate(`/halls/${id}`);
    } catch (error) {
      toast.error(error || 'Failed to update hall');
    }
  };

  if (isLoading && !currentHall) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Hall</h2>
        
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
              label="Update Hall"
              variant="primary"
              loading={isLoading}
              className="flex-1"
            />
            <Button
              type="button"
              label="Cancel"
              variant="secondary"
              onClick={() => navigate(`/halls/${id}`)}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHall;