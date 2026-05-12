import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiEdit2, FiMail, FiPhone, FiMapPin, FiGlobe, FiBriefcase,
  FiCalendar, FiUser, FiCamera, FiPlus, FiEdit3, FiTrash2, FiX, FiCheck,
  FiLinkedin, FiFacebook, FiInstagram, FiTwitter, FiExternalLink,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Layout from '../../components/common/Layout/Layout';
import EditProfileModal from '../../components/ui/EditProfileModal/EditProfileModal';
import { getUserProfile, updateProfileApi } from '../../services/authService';
import { getUserServices, createUserService, updateUserService, deleteUserService } from '../../services/userServiceService';
import ConfirmDialog from '../../components/ui/ConfirmDialog/ConfirmDialog';

// ── Helpers ──────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-orange-600', 'bg-rose-600', 'bg-teal-600'];
const avatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const initials = (name = '') => name.charAt(0).toUpperCase();

const MEMBERSHIP_BADGE = {
  'Life Member':    'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'General Member': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
};
const ROLE_BADGE = {
  admin:  'bg-purple-500/15 text-purple-400 border-purple-500/30',
  member: 'bg-green-500/15 text-green-400 border-green-500/30',
  user:   'bg-gray-600/30 text-gray-400 border-gray-600/30',
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
const fmtJoined = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null;

const SocialIcon = ({ url, icon, label }) => {
  if (!url) return null;
  const href = url.startsWith('http') ? url : `https://${url}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-gray-400 hover:text-white transition-colors" title={label}>
      {icon}
    </a>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-xl p-5 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{children}</h3>
);

const InfoRow = ({ icon, label, value, href, className = '' }) => {
  if (!value) return null;
  const content = (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <span className="text-gray-500 mt-0.5 flex-shrink-0 text-sm">{icon}</span>
      <div className="min-w-0">
        {label && <p className="text-xs text-gray-500 mb-0.5">{label}</p>}
        <p className="text-gray-300 text-sm break-words">{value}</p>
      </div>
    </div>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 block">{content}</a>;
  return content;
};

// ── Service Form ──────────────────────────────────────────────────────────
const ServiceForm = ({ initial, onSave, onCancel, saving }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [errors, setErrors] = useState({});

  const inputClass = `w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                      text-white text-sm placeholder-gray-500 focus:outline-none
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`;

  const handle = () => {
    const e = {};
    if (!title.trim()) e.title = 'Title required';
    if (!description.trim()) e.description = 'Description required';
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ title: title.trim(), description: description.trim() });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
      <div>
        <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: '' })); }}
          placeholder="Service title *" className={inputClass} />
        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
      </div>
      <div>
        <textarea value={description} onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: '' })); }}
          placeholder="Describe this service *" rows={3}
          className={`${inputClass} resize-none`} />
        {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
      </div>
      <div className="flex gap-2">
        <button onClick={handle} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60
                     text-white text-sm font-medium rounded-lg transition">
          {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCheck size={13} />}
          Save
        </button>
        <button onClick={onCancel} className="px-4 py-1.5 border border-gray-700 text-gray-400 hover:text-white
                                              text-sm rounded-lg transition">
          <FiX size={13} />
        </button>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────
const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isOwn = !userId;
  const [profileUser, setProfileUser] = useState(isOwn ? currentUser : null);
  const [profileLoading, setProfileLoading] = useState(!isOwn);
  const [profileError, setProfileError] = useState('');

  const [editOpen, setEditOpen] = useState(false);

  // Services state
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [serviceSaving, setServiceSaving] = useState(false);
  const [deleteServiceTarget, setDeleteServiceTarget] = useState(null);
  const [deleteServiceLoading, setDeleteServiceLoading] = useState(false);

  // Image upload refs
  const coverRef = useRef(null);
  const avatarRef = useRef(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Access control for other profiles
  useEffect(() => {
    if (userId && (!currentUser || currentUser.role === 'user')) {
      navigate('/login', { replace: true });
    }
  }, [userId, currentUser, navigate]);

  // Fetch other user's profile
  useEffect(() => {
    if (isOwn) {
      setProfileUser(currentUser);
      return;
    }
    setProfileLoading(true);
    getUserProfile(userId)
      .then((data) => {
        setServices(data.services || []);
        setProfileUser(data);
      })
      .catch(() => setProfileError('Failed to load profile.'))
      .finally(() => setProfileLoading(false));
  }, [userId, isOwn, currentUser]);

  // Fetch own services
  useEffect(() => {
    if (!isOwn || !currentUser) return;
    getUserServices(currentUser._id)
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setServicesLoading(false));
  }, [isOwn, currentUser]);

  const handleEditClose = useCallback(() => setEditOpen(false), []);

  // Quick cover/avatar image upload
  const uploadImage = async (file, field) => {
    const fd = new FormData();
    fd.append(field, file);
    try {
      const updated = await updateProfileApi(fd);
      updateUser(updated);
      setProfileUser((p) => ({ ...p, ...updated }));
      showToast('Image updated!', 'success');
    } catch {
      showToast('Image upload failed.', 'error');
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setCoverUploading(true);
    await uploadImage(file, 'coverImage');
    setCoverUploading(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setAvatarUploading(true);
    await uploadImage(file, 'profileImage');
    setAvatarUploading(false);
  };

  // Services CRUD
  const handleAddService = async (payload) => {
    setServiceSaving(true);
    try {
      const created = await createUserService(payload);
      setServices((p) => [...p, created]);
      setShowAddForm(false);
      showToast('Service added.', 'success');
    } catch { showToast('Failed to add service.', 'error'); }
    finally { setServiceSaving(false); }
  };

  const handleUpdateService = async (id, payload) => {
    setServiceSaving(true);
    try {
      const updated = await updateUserService(id, payload);
      setServices((p) => p.map((s) => s._id === id ? updated : s));
      setEditServiceId(null);
      showToast('Service updated.', 'success');
    } catch { showToast('Failed to update service.', 'error'); }
    finally { setServiceSaving(false); }
  };

  const handleDeleteService = async () => {
    if (!deleteServiceTarget) return;
    setDeleteServiceLoading(true);
    try {
      await deleteUserService(deleteServiceTarget._id);
      setServices((p) => p.filter((s) => s._id !== deleteServiceTarget._id));
      showToast('Service deleted.', 'success');
      setDeleteServiceTarget(null);
    } catch { showToast('Failed to delete service.', 'error'); }
    finally { setDeleteServiceLoading(false); }
  };

  useEffect(() => { document.title = `${profileUser?.name || 'Profile'} | CXO Global Alliance`; }, [profileUser]);

  if (profileLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-950 pt-[70px]">
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-4 animate-pulse">
            <div className="h-48 bg-gray-800 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="h-64 bg-gray-800 rounded-xl" />
              <div className="lg:col-span-2 h-64 bg-gray-800 rounded-xl" />
              <div className="h-64 bg-gray-800 rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (profileError) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-950 pt-[70px] flex items-center justify-center">
          <p className="text-red-400">{profileError}</p>
        </div>
      </Layout>
    );
  }

  if (!profileUser) return null;

  const p = profileUser;
  const sl = p.socialLinks || {};

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950 pt-[70px] pb-12">
        <div className="max-w-6xl mx-auto px-4">

          {/* ── Cover + Profile Pic ────────────────────── */}
          <div className="relative mb-16 md:mb-20">
            {/* Cover */}
            <div className="h-40 md:h-52 rounded-b-2xl overflow-hidden bg-gradient-to-r from-blue-900/50 via-indigo-900/40 to-gray-900 relative group">
              {p.coverImage && (
                <img src={p.coverImage} alt="Cover" className="w-full h-full object-cover" />
              )}
              {isOwn && (
                <>
                  <button
                    onClick={() => coverRef.current?.click()}
                    disabled={coverUploading}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition
                               flex items-center justify-center gap-2 text-white text-sm font-medium">
                    {coverUploading
                      ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><FiCamera size={16} /> Change Cover</>}
                  </button>
                  <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                </>
              )}
            </div>

            {/* Profile picture — overlaps cover bottom */}
            <div className="absolute bottom-0 left-4 md:left-8 translate-y-1/2">
              <div className="relative group">
                {p.profileImage ? (
                  <img src={p.profileImage} alt={p.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-gray-950" />
                ) : (
                  <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center
                                   text-white text-4xl font-bold ring-4 ring-gray-950 select-none
                                   ${avatarColor(p.name)}`}>
                    {initials(p.name)}
                  </div>
                )}
                {isOwn && (
                  <>
                    <button
                      onClick={() => avatarRef.current?.click()}
                      disabled={avatarUploading}
                      className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100
                                 transition flex items-center justify-center">
                      {avatarUploading
                        ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <FiCamera size={18} className="text-white" />}
                    </button>
                    <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </>
                )}
              </div>
            </div>

            {/* Edit Profile button — top right */}
            {isOwn && (
              <div className="absolute bottom-0 right-4 md:right-8 translate-y-14 md:translate-y-16">
                <button onClick={() => setEditOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-700 bg-gray-900
                             text-gray-300 hover:border-blue-500 hover:text-blue-400 rounded-lg
                             text-sm font-medium transition-colors shadow-lg">
                  <FiEdit2 size={14} /> Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* ── Name / Title Bar ──────────────────────── */}
          <div className="px-4 md:px-8 pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{p.name}</h1>
            {(p.designation || p.organizationName) && (
              <p className="text-blue-400 font-medium text-sm md:text-base">
                {[p.designation, p.organizationName].filter(Boolean).join(' · ')}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {p.membershipType && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border
                                  ${MEMBERSHIP_BADGE[p.membershipType] || MEMBERSHIP_BADGE['General Member']}`}>
                  {p.membershipType}
                </span>
              )}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize
                                ${ROLE_BADGE[p.role] || ROLE_BADGE.user}`}>
                {p.role}
              </span>
            </div>
          </div>

          {/* ── 3-column grid ─────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 px-4 md:px-8">

            {/* ═══ LEFT COLUMN ═══ */}
            <div className="lg:col-span-1 space-y-4">

              {/* Contact Info */}
              <Card>
                <SectionTitle>Contact</SectionTitle>
                <div className="space-y-3">
                  <InfoRow icon={<FiPhone size={14} />} value={p.phone}
                    href={p.phone ? `https://wa.me/${p.phone.replace(/\D/g, '')}` : undefined} />
                  <InfoRow icon={<FiMail size={14} />} value={p.email}
                    href={`mailto:${p.email}`} />
                  <InfoRow icon={<FiMapPin size={14} />} value={p.presentAddress} />
                  <InfoRow icon={<FiBriefcase size={14} />} value={p.companyLocation} />
                  {p.organizationType && (
                    <span className="inline-block px-2.5 py-0.5 bg-gray-800 border border-gray-700
                                     text-gray-400 text-xs rounded-full">
                      {p.organizationType}
                    </span>
                  )}
                </div>
              </Card>

              {/* Membership */}
              <Card>
                <SectionTitle>Membership</SectionTitle>
                <div className="space-y-2 text-sm">
                  {p.membershipType && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="text-gray-200 font-medium">{p.membershipType}</span>
                    </div>
                  )}
                  {p.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Since</span>
                      <span className="text-gray-300">{fmtJoined(p.createdAt)}</span>
                    </div>
                  )}
                  {p.reference && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reference</span>
                      <span className="text-gray-300 text-right">{p.reference}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Social Links */}
              {(sl.linkedin || sl.facebook || sl.instagram || sl.twitter || sl.website) && (
                <Card>
                  <SectionTitle>Social Links</SectionTitle>
                  <div className="flex flex-wrap gap-3">
                    <SocialIcon url={sl.linkedin}  icon={<FiLinkedin size={18} />}  label="LinkedIn" />
                    <SocialIcon url={sl.facebook}  icon={<FiFacebook size={18} />}  label="Facebook" />
                    <SocialIcon url={sl.instagram} icon={<FiInstagram size={18} />} label="Instagram" />
                    <SocialIcon url={sl.twitter}   icon={<FiTwitter size={18} />}   label="Twitter" />
                    <SocialIcon url={sl.website}   icon={<FiGlobe size={18} />}     label="Website" />
                  </div>
                </Card>
              )}
            </div>

            {/* ═══ MIDDLE COLUMN ═══ */}
            <div className="lg:col-span-2 space-y-4">

              {/* About */}
              <Card>
                <SectionTitle>About</SectionTitle>
                {p.bio ? (
                  <p className="text-gray-300 text-sm leading-relaxed">{p.bio}</p>
                ) : isOwn ? (
                  <button onClick={() => setEditOpen(true)}
                    className="text-gray-500 text-sm hover:text-blue-400 transition-colors italic">
                    Add a bio to tell people about yourself →
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm italic">No bio added.</p>
                )}
              </Card>

              {/* Personal Details */}
              <Card>
                <SectionTitle>Personal Details</SectionTitle>
                <div className="space-y-3">
                  <InfoRow icon={<FiCalendar size={14} />} label="Date of Birth" value={fmtDate(p.dateOfBirth)} />
                  <InfoRow icon={<FiGlobe size={14} />}    label="Nationality"   value={p.nationality} />
                  <InfoRow icon={<FiUser size={14} />}     label="Gender"        value={p.gender} />
                </div>
                {!p.dateOfBirth && !p.nationality && !p.gender && (
                  <p className="text-gray-600 text-sm italic">No personal details added.</p>
                )}
              </Card>

              {/* Company / Organization */}
              <Card>
                <SectionTitle>Organization</SectionTitle>
                {p.organizationName ? (
                  <div className="space-y-2">
                    <p className="text-white font-semibold text-base">{p.organizationName}</p>
                    {p.designation && <p className="text-blue-400 text-sm">{p.designation}</p>}
                    {p.organizationType && (
                      <span className="inline-block px-2.5 py-0.5 bg-gray-800 border border-gray-700
                                       text-gray-400 text-xs rounded-full">
                        {p.organizationType}
                      </span>
                    )}
                    <div className="pt-1 space-y-1.5">
                      <InfoRow icon={<FiMapPin size={13} />} value={p.companyLocation} />
                      {p.companyWebsite && (
                        <a href={p.companyWebsite.startsWith('http') ? p.companyWebsite : `https://${p.companyWebsite}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition">
                          <FiExternalLink size={13} /> {p.companyWebsite}
                        </a>
                      )}
                      {p.companyDescription && (
                        <p className="text-gray-400 text-sm mt-2 leading-relaxed">{p.companyDescription}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm italic">No organization info added.</p>
                )}
              </Card>
            </div>

            {/* ═══ RIGHT COLUMN ═══ */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <SectionTitle>Services</SectionTitle>
                  {isOwn && !showAddForm && (
                    <button onClick={() => setShowAddForm(true)}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                      <FiPlus size={13} /> Add
                    </button>
                  )}
                </div>

                {isOwn && showAddForm && (
                  <div className="mb-3">
                    <ServiceForm
                      onSave={handleAddService}
                      onCancel={() => setShowAddForm(false)}
                      saving={serviceSaving}
                    />
                  </div>
                )}

                {servicesLoading && isOwn ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : services.length === 0 ? (
                  <p className="text-gray-600 text-sm italic">
                    {isOwn ? 'Add your first service.' : 'No services listed.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {services.map((svc) =>
                      editServiceId === svc._id ? (
                        <ServiceForm
                          key={svc._id}
                          initial={svc}
                          onSave={(payload) => handleUpdateService(svc._id, payload)}
                          onCancel={() => setEditServiceId(null)}
                          saving={serviceSaving}
                        />
                      ) : (
                        <div key={svc._id}
                          className="bg-gray-800 rounded-xl p-3.5 border border-gray-700/60 group">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-white font-medium text-sm leading-tight">{svc.title}</p>
                            {isOwn && (
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                                <button onClick={() => setEditServiceId(svc._id)}
                                  className="p-1 text-gray-500 hover:text-blue-400 transition">
                                  <FiEdit3 size={12} />
                                </button>
                                <button onClick={() => setDeleteServiceTarget(svc)}
                                  className="p-1 text-gray-500 hover:text-red-400 transition">
                                  <FiTrash2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs mt-1 leading-relaxed">{svc.description}</p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </Card>
            </div>

          </div>
        </div>
      </div>

      {editOpen && <EditProfileModal onClose={handleEditClose} />}

      <ConfirmDialog
        isOpen={!!deleteServiceTarget}
        onClose={() => setDeleteServiceTarget(null)}
        onConfirm={handleDeleteService}
        loading={deleteServiceLoading}
        title="Delete Service"
        message={`Delete "${deleteServiceTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </Layout>
  );
};

export default Profile;
