import { useEffect, useState, useRef } from 'react';
import {
  FiFacebook, FiLinkedin, FiInstagram, FiUpload, FiSave,
} from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';
import { getSettings, updateSettings } from '../../../services/settingsService';
import PageHeader from '../components/PageHeader';
import { useToast } from '../../../context/ToastContext';

const TABS = ['General Info', 'About & President', 'Social Links'];

const inputClass = `w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                    text-white text-sm placeholder-gray-500 focus:outline-none
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`;

const SaveButton = ({ loading, label = 'Save Changes', onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700
               disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold
               rounded-lg text-sm transition-colors"
  >
    {loading ? (
      <>
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Saving...
      </>
    ) : (
      <>
        <FiSave size={14} />
        {label}
      </>
    )}
  </button>
);

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 border-t border-gray-700" />
    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
    <div className="flex-1 border-t border-gray-700" />
  </div>
);

const AdminSettings = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [fetching, setFetching] = useState(true);

  // Tab 1 — General Info
  const [general, setGeneral] = useState({
    officeAddress: '', phone1: '', phone2: '', email: '',
  });
  const [generalSaving, setGeneralSaving] = useState(false);

  // Tab 2 — About & President
  const [about, setAbout] = useState({
    missionText: '', visionText: '',
    presidentName: '', presidentDesignation: '', presidentMessage: '',
  });
  const [presidentImageFile, setPresidentImageFile] = useState(null);
  const [presidentImagePreview, setPresidentImagePreview] = useState('');
  const [aboutSaving, setAboutSaving] = useState(false);
  const presidentFileRef = useRef(null);

  // Tab 3 — Social Links
  const [social, setSocial] = useState({
    facebook: '', linkedin: '', instagram: '', tiktok: '',
  });
  const [socialSaving, setSocialSaving] = useState(false);

  useEffect(() => {
    document.title = 'Settings — CXO Admin';
    getSettings()
      .then((data) => {
        if (!data) return;
        setGeneral({
          officeAddress: data.officeAddress || '',
          phone1: data.phone1 || '',
          phone2: data.phone2 || '',
          email: data.email || '',
        });
        setAbout({
          missionText: data.missionText || '',
          visionText: data.visionText || '',
          presidentName: data.presidentName || '',
          presidentDesignation: data.presidentDesignation || '',
          presidentMessage: data.presidentMessage || '',
        });
        setPresidentImagePreview(data.presidentImage || '');
        setSocial({
          facebook:  data.socialLinks?.facebook  || '',
          linkedin:  data.socialLinks?.linkedin  || '',
          instagram: data.socialLinks?.instagram || '',
          tiktok:    data.socialLinks?.tiktok    || '',
        });
      })
      .catch(() => showToast('Failed to load settings.', 'error'))
      .finally(() => setFetching(false));
  }, [showToast]);

  // ── Tab 1 Save ──
  const saveGeneral = async () => {
    setGeneralSaving(true);
    try {
      await updateSettings(general);
      showToast('General info saved.', 'success');
    } catch {
      showToast('Failed to save general info.', 'error');
    } finally {
      setGeneralSaving(false);
    }
  };

  // ── Tab 2 Save ──
  const saveAbout = async () => {
    setAboutSaving(true);
    try {
      const fd = new FormData();
      Object.entries(about).forEach(([k, v]) => fd.append(k, v));
      if (presidentImageFile) fd.append('presidentImage', presidentImageFile);
      const updated = await updateSettings(fd);
      if (updated.presidentImage) setPresidentImagePreview(updated.presidentImage);
      setPresidentImageFile(null);
      if (presidentFileRef.current) presidentFileRef.current.value = '';
      showToast('About & President info saved.', 'success');
    } catch {
      showToast('Failed to save about info.', 'error');
    } finally {
      setAboutSaving(false);
    }
  };

  // ── Tab 3 Save ──
  const saveSocial = async () => {
    setSocialSaving(true);
    try {
      await updateSettings({ socialLinks: social });
      showToast('Social links saved.', 'success');
    } catch {
      showToast('Failed to save social links.', 'error');
    } finally {
      setSocialSaving(false);
    }
  };

  const SkeletonField = () => (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div className="h-3 w-24 bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-10 bg-gray-800 rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Site Settings" />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800 border border-gray-700 rounded-lg p-1 w-fit">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
              ${activeTab === i ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        {fetching ? (
          <SkeletonField />
        ) : (
          <>
            {/* ── Tab 0: General Info ── */}
            {activeTab === 0 && (
              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Office Address</label>
                  <textarea
                    value={general.officeAddress}
                    onChange={(e) => setGeneral((p) => ({ ...p, officeAddress: e.target.value }))}
                    rows={3}
                    placeholder="Full office address..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone 1</label>
                    <input
                      type="text"
                      value={general.phone1}
                      onChange={(e) => setGeneral((p) => ({ ...p, phone1: e.target.value }))}
                      placeholder="+880 1XX XXX XXXX"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone 2</label>
                    <input
                      type="text"
                      value={general.phone2}
                      onChange={(e) => setGeneral((p) => ({ ...p, phone2: e.target.value }))}
                      placeholder="+880 1XX XXX XXXX"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={general.email}
                    onChange={(e) => setGeneral((p) => ({ ...p, email: e.target.value }))}
                    placeholder="info@cxoglobalalliance.com"
                    className={inputClass}
                  />
                </div>
                <div className="pt-2">
                  <SaveButton onClick={saveGeneral} loading={generalSaving} label="Save General Info" />
                </div>
              </div>
            )}

            {/* ── Tab 1: About & President ── */}
            {activeTab === 1 && (
              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Mission</label>
                  <textarea
                    value={about.missionText}
                    onChange={(e) => setAbout((p) => ({ ...p, missionText: e.target.value }))}
                    rows={4}
                    placeholder="Our mission is..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Vision</label>
                  <textarea
                    value={about.visionText}
                    onChange={(e) => setAbout((p) => ({ ...p, visionText: e.target.value }))}
                    rows={4}
                    placeholder="Our vision is..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <SectionDivider label="President's Section" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">President Name</label>
                    <input
                      type="text"
                      value={about.presidentName}
                      onChange={(e) => setAbout((p) => ({ ...p, presidentName: e.target.value }))}
                      placeholder="Full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Designation</label>
                    <input
                      type="text"
                      value={about.presidentDesignation}
                      onChange={(e) => setAbout((p) => ({ ...p, presidentDesignation: e.target.value }))}
                      placeholder="e.g. Founder & President"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* President Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    President Photo
                    <span className="ml-1.5 text-gray-500 font-normal text-xs">(leave empty to keep current)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    {presidentImagePreview && (
                      <img
                        src={presidentImagePreview}
                        alt="President"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-600 flex-shrink-0"
                      />
                    )}
                    <div
                      onClick={() => presidentFileRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-dashed
                                 border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition text-sm"
                    >
                      <FiUpload size={14} className="text-gray-400" />
                      <span className="text-gray-400">
                        {presidentImageFile ? presidentImageFile.name : 'Choose photo...'}
                      </span>
                    </div>
                    <input
                      ref={presidentFileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files[0];
                        if (!f) return;
                        setPresidentImageFile(f);
                        setPresidentImagePreview(URL.createObjectURL(f));
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">President's Message</label>
                  <textarea
                    value={about.presidentMessage}
                    onChange={(e) => setAbout((p) => ({ ...p, presidentMessage: e.target.value }))}
                    rows={6}
                    placeholder="Message from the president..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="pt-2">
                  <SaveButton onClick={saveAbout} loading={aboutSaving} label="Save About & President" />
                </div>
              </div>
            )}

            {/* ── Tab 2: Social Links ── */}
            {activeTab === 2 && (
              <div className="space-y-5 max-w-lg">
                {[
                  { key: 'facebook',  label: 'Facebook',  icon: <FiFacebook size={16} className="text-blue-400" />,  placeholder: 'https://facebook.com/...' },
                  { key: 'linkedin',  label: 'LinkedIn',  icon: <FiLinkedin size={16} className="text-sky-400" />,   placeholder: 'https://linkedin.com/company/...' },
                  { key: 'instagram', label: 'Instagram', icon: <FiInstagram size={16} className="text-pink-400" />, placeholder: 'https://instagram.com/...' },
                  { key: 'tiktok',    label: 'TikTok',    icon: <SiTiktok size={14} className="text-gray-300" />,    placeholder: 'https://tiktok.com/@...' },
                ].map(({ key, label, icon, placeholder }) => (
                  <div key={key}>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                      {icon} {label}
                    </label>
                    <input
                      type="url"
                      value={social[key]}
                      onChange={(e) => setSocial((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}

                <div className="pt-2">
                  <SaveButton onClick={saveSocial} loading={socialSaving} label="Save Social Links" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
