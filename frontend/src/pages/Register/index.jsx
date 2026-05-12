import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiCheck, FiUpload } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ORG_TYPES = [
  'Private Company', 'Public Company', 'Government',
  'NGO/Non-Profit', 'Startup', 'Multinational', 'Other',
];

const STEP_TITLES = [
  'Personal Information',
  'Organization Information',
  'Account & Membership',
  'Social Links & Declaration',
];

const INITIAL_FORM = {
  // Step 1
  name: '', dateOfBirth: '', nationality: '', gender: '', phone: '', presentAddress: '',
  // Step 2
  organizationName: '', designation: '', organizationType: 'Private Company',
  companyLocation: '', companyWebsite: '', companyDescription: '',
  // Step 3
  email: '', password: '', confirmPassword: '',
  membershipType: 'General Member', reference: '', bio: '',
  // Step 4
  linkedin: '', facebook: '', instagram: '', twitter: '', website: '',
  declarationAccepted: false,
};

const inputClass = (err) =>
  `w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500
   text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
   ${err ? 'border-red-500' : 'border-gray-700'}`;

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-300 mb-1.5">
    {children}{required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const FieldError = ({ msg }) =>
  msg ? <p className="mt-1 text-xs text-red-400">{msg}</p> : null;

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => { document.title = 'Register | CXO Global Alliance'; }, []);

  const set = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
    setApiError('');
  };

  const handleChange = (e) => set(e.target.name, e.target.value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  // ── Per-step validation ──
  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.name.trim())           e.name = 'Full name is required';
      if (!form.dateOfBirth)           e.dateOfBirth = 'Date of birth is required';
      if (!form.nationality.trim())    e.nationality = 'Nationality is required';
      if (!form.gender)                e.gender = 'Please select a gender';
      if (!form.phone.trim())          e.phone = 'Phone number is required';
      if (!form.presentAddress.trim()) e.presentAddress = 'Present address is required';
    }
    if (s === 2) {
      if (!form.organizationName.trim()) e.organizationName = 'Organization name is required';
      if (!form.designation.trim())      e.designation = 'Designation is required';
      if (!form.organizationType)        e.organizationType = 'Please select an organization type';
    }
    if (s === 3) {
      if (!form.email.trim()) {
        e.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        e.email = 'Enter a valid email address';
      }
      if (!form.password) {
        e.password = 'Password is required';
      } else if (form.password.length < 6) {
        e.password = 'Password must be at least 6 characters';
      }
      if (!form.confirmPassword) {
        e.confirmPassword = 'Please confirm your password';
      } else if (form.password !== form.confirmPassword) {
        e.confirmPassword = 'Passwords do not match';
      }
      if (!form.membershipType) e.membershipType = 'Please select a membership type';
    }
    if (s === 4) {
      if (!form.declarationAccepted) e.declarationAccepted = 'You must accept the declaration to proceed';
    }
    return e;
  };

  const handleNext = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep((p) => p + 1);
  };

  const handleBack = () => { setErrors({}); setStep((p) => p - 1); };

  const handleSubmit = async () => {
    const e = validateStep(4);
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    setApiError('');
    try {
      const fd = new FormData();
      // Step 1
      fd.append('name', form.name.trim());
      fd.append('dateOfBirth', form.dateOfBirth);
      fd.append('nationality', form.nationality);
      fd.append('gender', form.gender);
      fd.append('phone', form.phone.trim());
      fd.append('presentAddress', form.presentAddress.trim());
      // Step 2
      fd.append('organizationName', form.organizationName.trim());
      fd.append('designation', form.designation.trim());
      fd.append('organizationType', form.organizationType);
      fd.append('companyLocation', form.companyLocation);
      fd.append('companyWebsite', form.companyWebsite);
      fd.append('companyDescription', form.companyDescription);
      // Step 3
      fd.append('email', form.email.trim().toLowerCase());
      fd.append('password', form.password);
      fd.append('membershipType', form.membershipType);
      fd.append('reference', form.reference);
      fd.append('bio', form.bio);
      // Step 4
      fd.append('socialLinks', JSON.stringify({
        linkedin: form.linkedin, facebook: form.facebook,
        instagram: form.instagram, twitter: form.twitter, website: form.website,
      }));
      fd.append('declarationAccepted', 'true');

      if (profileFile) fd.append('profileImage', profileFile);

      await register(fd);
      showToast('Account created successfully!', 'success');
      navigate('/profile');
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step Indicator ──
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                           border-2 transition-all
                           ${step > s
                             ? 'bg-blue-600 border-blue-600 text-white'
                             : step === s
                               ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                               : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
            {step > s ? <FiCheck size={13} /> : s}
          </div>
          {i < 3 && (
            <div className={`w-10 sm:w-16 h-0.5 mx-1 transition-colors
                             ${step > s + 1 ? 'bg-blue-600' : step > s ? 'bg-blue-600/50' : 'bg-gray-700'}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mb-3">
            <span className="text-white font-bold text-sm">CXO</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Join CXO Global Alliance</h1>
          <p className="text-gray-400 text-sm mt-1">Step {step} of 4 — {STEP_TITLES[step - 1]}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <StepIndicator />

          {apiError && (
            <div className="mb-5 px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg text-red-400 text-sm">
              {apiError}
            </div>
          )}

          {/* ── STEP 1: Personal Info ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label required>Full Name</Label>
                <input name="name" type="text" value={form.name} onChange={handleChange}
                  placeholder="John Doe" className={inputClass(errors.name)} />
                <FieldError msg={errors.name} />
              </div>
              <div>
                <Label required>Date of Birth</Label>
                <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange}
                  className={inputClass(errors.dateOfBirth)} />
                <FieldError msg={errors.dateOfBirth} />
              </div>
              <div>
                <Label required>Nationality</Label>
                <input name="nationality" type="text" value={form.nationality} onChange={handleChange}
                  placeholder="e.g. Bangladeshi" className={inputClass(errors.nationality)} />
                <FieldError msg={errors.nationality} />
              </div>
              <div>
                <Label required>Gender</Label>
                <div className="flex gap-4 mt-1">
                  {['Male', 'Female'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition
                                       ${form.gender === g ? 'border-blue-500 bg-blue-500' : 'border-gray-600 group-hover:border-gray-500'}`}
                        onClick={() => set('gender', g)}>
                        {form.gender === g && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-gray-300 text-sm">{g}</span>
                    </label>
                  ))}
                </div>
                <FieldError msg={errors.gender} />
              </div>
              <div>
                <Label required>Phone Number (WhatsApp)</Label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                  placeholder="+880 1XXX XXXXXX" className={inputClass(errors.phone)} />
                <FieldError msg={errors.phone} />
              </div>
              <div>
                <Label required>Present Address</Label>
                <textarea name="presentAddress" rows={2} value={form.presentAddress} onChange={handleChange}
                  placeholder="Full address..." className={`${inputClass(errors.presentAddress)} resize-none`} />
                <FieldError msg={errors.presentAddress} />
              </div>
            </div>
          )}

          {/* ── STEP 2: Organization Info ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label required>Organization Name</Label>
                <input name="organizationName" type="text" value={form.organizationName} onChange={handleChange}
                  placeholder="Your company or organization" className={inputClass(errors.organizationName)} />
                <FieldError msg={errors.organizationName} />
              </div>
              <div>
                <Label required>Designation</Label>
                <input name="designation" type="text" value={form.designation} onChange={handleChange}
                  placeholder="CEO, Director, Manager..." className={inputClass(errors.designation)} />
                <FieldError msg={errors.designation} />
              </div>
              <div>
                <Label required>Organization Type</Label>
                <select name="organizationType" value={form.organizationType} onChange={handleChange}
                  className={`${inputClass(errors.organizationType)} cursor-pointer`}>
                  {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <FieldError msg={errors.organizationType} />
              </div>
              <div>
                <Label>Company Location</Label>
                <input name="companyLocation" type="text" value={form.companyLocation} onChange={handleChange}
                  placeholder="City, Country" className={inputClass()} />
              </div>
              <div>
                <Label>Company Website</Label>
                <input name="companyWebsite" type="url" value={form.companyWebsite} onChange={handleChange}
                  placeholder="https://yourcompany.com" className={inputClass()} />
              </div>
              <div>
                <Label>Company Description</Label>
                <textarea name="companyDescription" rows={3} value={form.companyDescription} onChange={handleChange}
                  placeholder="Brief description of your organization..."
                  className={`${inputClass()} resize-none`} />
              </div>
            </div>
          )}

          {/* ── STEP 3: Account & Membership ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label required>Email Address</Label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className={inputClass(errors.email)} />
                <FieldError msg={errors.email} />
              </div>
              <div>
                <Label required>Password</Label>
                <div className="relative">
                  <input name="password" type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={handleChange} placeholder="Min. 6 characters"
                    className={`${inputClass(errors.password)} pr-11`} />
                  <button type="button" onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" tabIndex={-1}>
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                <FieldError msg={errors.password} />
              </div>
              <div>
                <Label required>Confirm Password</Label>
                <div className="relative">
                  <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                    onChange={handleChange} placeholder="Re-enter password"
                    className={`${inputClass(errors.confirmPassword)} pr-11`} />
                  <button type="button" onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" tabIndex={-1}>
                    {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                <FieldError msg={errors.confirmPassword} />
              </div>
              <div>
                <Label required>Membership Type</Label>
                <div className="flex gap-4 mt-1">
                  {['General Member', 'Life Member'].map((m) => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition
                                       ${form.membershipType === m ? 'border-blue-500 bg-blue-500' : 'border-gray-600 group-hover:border-gray-500'}`}
                        onClick={() => set('membershipType', m)}>
                        {form.membershipType === m && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-gray-300 text-sm">{m}</span>
                    </label>
                  ))}
                </div>
                <FieldError msg={errors.membershipType} />
              </div>
              <div>
                <Label>Reference</Label>
                <input name="reference" type="text" value={form.reference} onChange={handleChange}
                  placeholder="Referred by (optional)" className={inputClass()} />
              </div>
              {/* Profile Photo */}
              <div>
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  {profilePreview ? (
                    <img src={profilePreview} alt="Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-600 flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 flex-shrink-0">
                      <FiUpload size={18} />
                    </div>
                  )}
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 hover:border-blue-500 text-gray-300
                               hover:text-white rounded-lg text-sm transition-colors flex items-center gap-2">
                    <FiUpload size={13} />
                    {profileFile ? profileFile.name.slice(0, 20) + '…' : 'Choose photo (optional)'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
              </div>
              <div>
                <Label>Bio / About</Label>
                <textarea name="bio" rows={3} value={form.bio} onChange={handleChange}
                  placeholder="Brief description about yourself..."
                  className={`${inputClass()} resize-none`} />
              </div>
            </div>
          )}

          {/* ── STEP 4: Social Links & Declaration ── */}
          {step === 4 && (
            <div className="space-y-4">
              {[
                { name: 'linkedin',  label: 'LinkedIn URL',      placeholder: 'https://linkedin.com/in/...' },
                { name: 'facebook',  label: 'Facebook URL',      placeholder: 'https://facebook.com/...' },
                { name: 'instagram', label: 'Instagram URL',     placeholder: 'https://instagram.com/...' },
                { name: 'twitter',   label: 'Twitter / X URL',   placeholder: 'https://twitter.com/...' },
                { name: 'website',   label: 'Personal Website',  placeholder: 'https://yoursite.com' },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <Label>{label}</Label>
                  <input name={name} type="url" value={form[name]} onChange={handleChange}
                    placeholder={placeholder} className={inputClass()} />
                </div>
              ))}

              {/* Declaration */}
              <div className={`mt-2 p-4 rounded-xl border ${errors.declarationAccepted ? 'border-red-500 bg-red-900/10' : 'border-gray-700 bg-gray-800/50'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => set('declarationAccepted', !form.declarationAccepted)}
                    className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition
                                 ${form.declarationAccepted
                                   ? 'bg-blue-600 border-blue-600'
                                   : 'border-gray-600 hover:border-gray-500'}`}
                  >
                    {form.declarationAccepted && <FiCheck size={12} className="text-white" />}
                  </div>
                  <span className="text-gray-300 text-sm leading-relaxed">
                    I hereby declare that all information provided is true and correct. I agree to abide by
                    the rules and regulations of{' '}
                    <span className="text-blue-400 font-medium">CXO Global Alliance</span>.
                    <span className="text-red-400 ml-1">*</span>
                  </span>
                </label>
                <FieldError msg={errors.declarationAccepted} />
              </div>
            </div>
          )}

          {/* ── Navigation Buttons ── */}
          <div className={`flex gap-3 mt-6 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
            {step > 1 && (
              <button type="button" onClick={handleBack} disabled={submitting}
                className="px-5 py-2.5 border border-gray-700 text-gray-300 hover:text-white
                           hover:border-gray-500 rounded-lg text-sm font-medium transition disabled:opacity-60">
                ← Back
              </button>
            )}

            {step < 4 ? (
              <button type="button" onClick={handleNext}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                           rounded-lg text-sm transition-colors">
                Next →
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={submitting}
                className="flex-1 sm:flex-none px-8 py-2.5 bg-blue-600 hover:bg-blue-700
                           disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold
                           rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : 'Create Account'}
              </button>
            )}
          </div>
        </div>

        {/* Login link */}
        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
