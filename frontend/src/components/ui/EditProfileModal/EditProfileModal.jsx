import { useState, useRef } from 'react';
import { FiX, FiCamera, FiUpload, FiSave, FiFacebook, FiLinkedin, FiInstagram, FiTwitter, FiGlobe } from 'react-icons/fi';
import { updateProfileApi } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const TABS = ['Personal', 'Organization', 'Social Links'];

const ORG_TYPES = [
  'Private Company', 'Public Company', 'Government',
  'NGO/Non-Profit', 'Startup', 'Multinational', 'Other',
];

const AVATAR_COLORS = ['bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-orange-600', 'bg-rose-600', 'bg-teal-600'];
const getAvatarColor = (name) => AVATAR_COLORS[(name || '').charCodeAt(0) % AVATAR_COLORS.length];

const inputClass = `w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white
                    placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition`;

const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-300 mb-1.5">{children}</label>
);

const EditProfileModal = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);

  // ── Tab 1 state ──
  const [personal, setPersonal] = useState({
    name:           user?.name           || '',
    dateOfBirth:    user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    nationality:    user?.nationality    || '',
    gender:         user?.gender         || '',
    phone:          user?.phone          || '',
    presentAddress: user?.presentAddress || '',
    bio:            user?.bio            || '',
  });
  const [profileFile, setProfileFile]   = useState(null);
  const [profilePreview, setProfilePreview] = useState(user?.profileImage || '');
  const [coverFile, setCoverFile]       = useState(null);
  const [coverPreview, setCoverPreview] = useState(user?.coverImage || '');
  const profileRef = useRef(null);
  const coverRef   = useRef(null);

  // ── Tab 2 state ──
  const [org, setOrg] = useState({
    organizationName:    user?.organizationName    || '',
    designation:         user?.designation         || '',
    organizationType:    user?.organizationType    || 'Other',
    companyLocation:     user?.companyLocation     || '',
    companyWebsite:      user?.companyWebsite      || '',
    companyDescription:  user?.companyDescription  || '',
  });

  // ── Tab 3 state ──
  const sl = user?.socialLinks || {};
  const [social, setSocial] = useState({
    linkedin:  sl.linkedin  || '',
    facebook:  sl.facebook  || '',
    instagram: sl.instagram || '',
    twitter:   sl.twitter   || '',
    website:   sl.website   || '',
  });

  const buildFormData = (fields, files = {}) => {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v);
    });
    Object.entries(files).forEach(([k, file]) => {
      if (file) fd.append(k, file);
    });
    return fd;
  };

  // ── Save handlers ──
  const savePersonal = async () => {
    if (!personal.name.trim()) { showToast('Name is required.', 'error'); return; }
    setSaving(true);
    try {
      const fd = buildFormData(personal, { profileImage: profileFile, coverImage: coverFile });
      const updated = await updateProfileApi(fd);
      updateUser(updated);
      showToast('Personal info saved!', 'success');
      setProfileFile(null); setCoverFile(null);
    } catch { showToast('Failed to save.', 'error'); }
    finally { setSaving(false); }
  };

  const saveOrg = async () => {
    setSaving(true);
    try {
      const fd = buildFormData(org);
      const updated = await updateProfileApi(fd);
      updateUser(updated);
      showToast('Organization info saved!', 'success');
    } catch { showToast('Failed to save.', 'error'); }
    finally { setSaving(false); }
  };

  const saveSocial = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('socialLinks', JSON.stringify(social));
      const updated = await updateProfileApi(fd);
      updateUser(updated);
      showToast('Social links saved!', 'success');
    } catch { showToast('Failed to save.', 'error'); }
    finally { setSaving(false); }
  };

  const SaveBtn = ({ onClick }) => (
    <button type="button" onClick={onClick} disabled={saving}
      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700
                 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold
                 rounded-lg text-sm transition-colors">
      {saving
        ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        : <FiSave size={14} />}
      {saving ? 'Saving...' : 'Save Changes'}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl
                      flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-lg font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-gray-800">
            <FiX size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 pb-0 flex-shrink-0">
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2
                ${activeTab === i
                  ? 'text-blue-400 border-blue-500 bg-blue-500/10'
                  : 'text-gray-400 border-transparent hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="border-b border-gray-800 mx-6" />

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* ── TAB 0: Personal ── */}
          {activeTab === 0 && (
            <>
              {/* Profile + Cover image side by side */}
              <div className="flex items-start gap-5">
                {/* Profile pic */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="relative group cursor-pointer" onClick={() => profileRef.current?.click()}>
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile"
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-600" />
                    ) : (
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white
                                       text-3xl font-bold ring-2 ring-gray-600 ${getAvatarColor(user?.name)}`}>
                        {(user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100
                                    transition flex items-center justify-center">
                      <FiCamera size={16} className="text-white" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Profile</span>
                  <input ref={profileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files[0]; if (!f) return; setProfileFile(f); setProfilePreview(URL.createObjectURL(f)); }} />
                </div>

                {/* Cover */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="relative group cursor-pointer rounded-lg overflow-hidden h-20
                                  bg-gradient-to-r from-blue-900/40 to-gray-800"
                    onClick={() => coverRef.current?.click()}>
                    {coverPreview && <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                                    transition flex items-center justify-center gap-1.5 text-white text-xs font-medium">
                      <FiUpload size={13} /> Change Cover
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Cover photo</span>
                  <input ref={coverRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files[0]; if (!f) return; setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); }} />
                </div>
              </div>

              <div>
                <Label>Full Name</Label>
                <input type="text" value={personal.name}
                  onChange={(e) => setPersonal((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date of Birth</Label>
                  <input type="date" value={personal.dateOfBirth}
                    onChange={(e) => setPersonal((p) => ({ ...p, dateOfBirth: e.target.value }))}
                    className={inputClass} />
                </div>
                <div>
                  <Label>Nationality</Label>
                  <input type="text" value={personal.nationality} placeholder="e.g. Bangladeshi"
                    onChange={(e) => setPersonal((p) => ({ ...p, nationality: e.target.value }))}
                    className={inputClass} />
                </div>
              </div>
              <div>
                <Label>Gender</Label>
                <div className="flex gap-4 mt-1">
                  {['Male', 'Female'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition
                                       ${personal.gender === g ? 'border-blue-500 bg-blue-500' : 'border-gray-600 hover:border-gray-500'}`}
                        onClick={() => setPersonal((p) => ({ ...p, gender: g }))}>
                        {personal.gender === g && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-gray-300 text-sm">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>Phone</Label>
                <input type="tel" value={personal.phone} placeholder="+880 1XXX XXXXXX"
                  onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <Label>Present Address</Label>
                <textarea rows={2} value={personal.presentAddress} placeholder="Full address"
                  onChange={(e) => setPersonal((p) => ({ ...p, presentAddress: e.target.value }))}
                  className={`${inputClass} resize-none`} />
              </div>
              <div>
                <Label>Bio</Label>
                <textarea rows={3} value={personal.bio} placeholder="Brief description about yourself..."
                  onChange={(e) => setPersonal((p) => ({ ...p, bio: e.target.value }))}
                  className={`${inputClass} resize-none`} />
              </div>
            </>
          )}

          {/* ── TAB 1: Organization ── */}
          {activeTab === 1 && (
            <>
              <div>
                <Label>Organization Name</Label>
                <input type="text" value={org.organizationName} placeholder="Company or organization"
                  onChange={(e) => setOrg((p) => ({ ...p, organizationName: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <Label>Designation</Label>
                <input type="text" value={org.designation} placeholder="CEO, Director..."
                  onChange={(e) => setOrg((p) => ({ ...p, designation: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <Label>Organization Type</Label>
                <select value={org.organizationType}
                  onChange={(e) => setOrg((p) => ({ ...p, organizationType: e.target.value }))}
                  className={`${inputClass} cursor-pointer`}>
                  {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <Label>Company Location</Label>
                <input type="text" value={org.companyLocation} placeholder="City, Country"
                  onChange={(e) => setOrg((p) => ({ ...p, companyLocation: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <Label>Company Website</Label>
                <input type="url" value={org.companyWebsite} placeholder="https://..."
                  onChange={(e) => setOrg((p) => ({ ...p, companyWebsite: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <Label>Company Description</Label>
                <textarea rows={4} value={org.companyDescription} placeholder="Brief description..."
                  onChange={(e) => setOrg((p) => ({ ...p, companyDescription: e.target.value }))}
                  className={`${inputClass} resize-none`} />
              </div>
            </>
          )}

          {/* ── TAB 2: Social Links ── */}
          {activeTab === 2 && (
            <>
              {[
                { key: 'linkedin',  icon: <FiLinkedin size={15} className="text-sky-400" />,    label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/...' },
                { key: 'facebook',  icon: <FiFacebook size={15} className="text-blue-400" />,   label: 'Facebook',  placeholder: 'https://facebook.com/...' },
                { key: 'instagram', icon: <FiInstagram size={15} className="text-pink-400" />,  label: 'Instagram', placeholder: 'https://instagram.com/...' },
                { key: 'twitter',   icon: <FiTwitter size={15} className="text-sky-300" />,     label: 'Twitter',   placeholder: 'https://twitter.com/...' },
                { key: 'website',   icon: <FiGlobe size={15} className="text-gray-400" />,      label: 'Website',   placeholder: 'https://yoursite.com' },
              ].map(({ key, icon, label, placeholder }) => (
                <div key={key}>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1.5">
                    {icon} {label}
                  </label>
                  <input type="url" value={social[key]} placeholder={placeholder}
                    onChange={(e) => setSocial((p) => ({ ...p, [key]: e.target.value }))}
                    className={inputClass} />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800 flex-shrink-0">
          <button type="button" onClick={onClose} disabled={saving}
            className="px-4 py-2 border border-gray-700 text-gray-300 hover:text-white
                       hover:border-gray-500 rounded-lg text-sm font-medium transition disabled:opacity-60">
            Cancel
          </button>
          <SaveBtn onClick={activeTab === 0 ? savePersonal : activeTab === 1 ? saveOrg : saveSocial} />
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
