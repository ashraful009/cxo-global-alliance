import { useState, useEffect, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import FormModal from '../../../pages/Admin/components/FormModal';

const EMPTY_FORM = {
  title: '',
  date: '',
  time: '',
  location: '',
  details: '',
  registrationLink: '',
};

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

const inputClass = `w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                    text-white text-sm placeholder-gray-500 focus:outline-none
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`;

const EventFormModal = ({ isOpen, onClose, onSaved, editEvent = null }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editEvent) {
      setForm({
        title: editEvent.title || '',
        date: editEvent.date ? editEvent.date.substring(0, 10) : '',
        time: editEvent.time || '',
        location: editEvent.location || '',
        details: editEvent.details || '',
        registrationLink: editEvent.registrationLink || '',
      });
      setImagePreview(editEvent.image || '');
    } else {
      setForm(EMPTY_FORM);
      setImagePreview('');
    }
    setImageFile(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [isOpen, editEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.date) errs.date = 'Date is required.';
    if (!form.time.trim()) errs.time = 'Time is required.';
    if (!form.location.trim()) errs.location = 'Location is required.';
    if (!form.details.trim()) errs.details = 'Details are required.';
    if (!form.registrationLink.trim()) errs.registrationLink = 'Registration link is required.';
    if (!editEvent && !imageFile) errs.image = 'Image is required for new events.';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);

      const token = localStorage.getItem('cxo_token');
      const url = editEvent
        ? `/api/events/${editEvent._id}`
        : '/api/events';
      const method = editEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Request failed');
      }

      const saved = await res.json();
      onSaved(saved, !!editEvent);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={editEvent ? 'Edit Event' : 'Add New Event'}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel={editEvent ? 'Update Event' : 'Create Event'}
    >
      <div className="space-y-4">
        {errors.form && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {errors.form}
          </div>
        )}

        {/* Image Upload */}
        <Field label="Event Image" required={!editEvent} error={errors.image}>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative cursor-pointer group rounded-xl overflow-hidden border border-dashed
                       border-gray-600 hover:border-blue-500 transition bg-gray-800"
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                                transition flex items-center justify-center">
                  <span className="text-white text-xs font-medium flex items-center gap-1">
                    <FiUpload size={14} /> Change Image
                  </span>
                </div>
              </>
            ) : (
              <div className="h-28 flex flex-col items-center justify-center gap-2 text-gray-500">
                <FiUpload size={20} />
                <span className="text-sm">Click to upload image</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {imageFile && (
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-xs text-gray-400 truncate flex-1">{imageFile.name}</span>
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(editEvent?.image || ''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="text-gray-500 hover:text-white transition flex-shrink-0"
              >
                <FiX size={14} />
              </button>
            </div>
          )}
        </Field>

        <Field label="Title" required error={errors.title}>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. CXO Annual Summit 2025"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" required error={errors.date}>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="Time" required error={errors.time}>
            <input
              type="text"
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="e.g. 10:00 AM"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Location" required error={errors.location}>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Dhaka, Bangladesh"
            className={inputClass}
          />
        </Field>

        <Field label="Registration Link" required error={errors.registrationLink}>
          <input
            type="url"
            name="registrationLink"
            value={form.registrationLink}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>

        <Field label="Details" required error={errors.details}>
          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the event..."
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>
    </FormModal>
  );
};

export default EventFormModal;
