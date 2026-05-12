import { useEffect, useState, useRef } from 'react';
import { FiUpload, FiImage, FiVideo, FiSave, FiEye } from 'react-icons/fi';
import api from '../../../services/api';
import PageHeader from '../components/PageHeader';
import { useToast } from '../../../context/ToastContext';

const AdminHero = () => {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    heroText: '',
    heroSubtext: '',
    heroMediaType: 'image',
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [existingMediaUrl, setExistingMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = 'Hero Section — CXO Admin';

    api.get('/settings/hero')
      .then(({ data }) => {
        if (data) {
          setForm({
            heroText: data.heroText || '',
            heroSubtext: data.heroSubtext || '',
            heroMediaType: data.heroMediaType || 'image',
          });
          setExistingMediaUrl(data.heroMediaUrl || '');
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMediaTypeChange = (type) => {
    setForm((prev) => ({ ...prev, heroMediaType: type }));
    setMediaFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.heroText.trim()) {
      showToast('Hero text is required.', 'error');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('heroText', form.heroText);
      formData.append('heroSubtext', form.heroSubtext);
      formData.append('heroMediaType', form.heroMediaType);
      if (mediaFile) formData.append('heroMedia', mediaFile);

      const { data } = await api.put('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setExistingMediaUrl(data.heroMediaUrl || existingMediaUrl);
      setMediaFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      showToast('Hero section updated!', 'success');
    } catch {
      showToast('Failed to save. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const activeMedia = previewUrl || existingMediaUrl;

  return (
    <div className="space-y-6">
      <PageHeader title="Hero Section" />

      {fetching ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
            {[120, 80, 60, 160].map((w, i) => (
              <div key={i} className={`h-10 bg-gray-800 rounded animate-pulse`} style={{ width: `${w}%`.replace('120%', '100%') }} />
            ))}
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-xl h-64 animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

          {/* Form Panel */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FiSave size={16} className="text-blue-400" />
              Edit Hero Content
            </h2>

            {/* Hero Text */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Hero Headline <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="heroText"
                value={form.heroText}
                onChange={handleChange}
                placeholder="e.g. Empowering Chief Experience Officers"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                           text-white text-sm placeholder-gray-500 focus:outline-none
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Hero Subtext */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Subheading
              </label>
              <textarea
                name="heroSubtext"
                value={form.heroSubtext}
                onChange={handleChange}
                rows={3}
                placeholder="A short description displayed below the headline..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                           text-white text-sm placeholder-gray-500 focus:outline-none
                           focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition
                           resize-none"
              />
            </div>

            {/* Media Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Background Media Type
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'image', label: 'Image', icon: <FiImage /> },
                  { value: 'video', label: 'Video', icon: <FiVideo /> },
                ].map(({ value, label, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleMediaTypeChange(value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium
                                transition-colors flex-1 justify-center
                                ${form.heroMediaType === value
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Upload {form.heroMediaType === 'image' ? 'Image' : 'Video'}
                <span className="text-gray-500 font-normal ml-1">(leave empty to keep current)</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 bg-gray-800 border border-dashed
                           border-gray-600 rounded-lg cursor-pointer hover:border-blue-500
                           hover:bg-gray-800/80 transition group"
              >
                <FiUpload size={18} className="text-gray-400 group-hover:text-blue-400 transition flex-shrink-0" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 truncate">
                  {mediaFile ? mediaFile.name : `Choose ${form.heroMediaType}...`}
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={form.heroMediaType === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60
                         disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm
                         transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={15} />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Preview Panel */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-700 flex items-center gap-2">
              <FiEye size={14} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Live Preview</span>
            </div>

            <div className="relative bg-gray-950 aspect-video overflow-hidden">
              {/* Background */}
              {activeMedia ? (
                form.heroMediaType === 'video' ? (
                  <video
                    key={activeMedia}
                    src={activeMedia}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay muted loop playsInline
                  />
                ) : (
                  <img
                    src={activeMedia}
                    alt="Hero preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">No media set</span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gray-950/60" />

              {/* Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-white font-bold text-xl md:text-2xl leading-snug drop-shadow">
                  {form.heroText || <span className="text-gray-500 italic">Hero headline...</span>}
                </h1>
                {form.heroSubtext && (
                  <p className="text-gray-300 text-sm mt-2 max-w-sm leading-relaxed drop-shadow">
                    {form.heroSubtext}
                  </p>
                )}
              </div>
            </div>

            {existingMediaUrl && !previewUrl && (
              <div className="px-5 py-3 border-t border-gray-700">
                <p className="text-xs text-gray-500 truncate">
                  Current: <span className="text-gray-400">{existingMediaUrl}</span>
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminHero;
