import { useEffect, useState, useCallback, useRef } from 'react';
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown, FiBriefcase, FiUpload } from 'react-icons/fi';
import { getAllServices, createService, updateService, deleteService } from '../../../services/serviceService';
import PageHeader from '../components/PageHeader';
import AdminTable from '../components/AdminTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';

const EMPTY_FORM = { title: '', description: '', order: 0 };

const inputClass = `w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                    text-white text-sm placeholder-gray-500 focus:outline-none
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`;

const AdminServices = () => {
  const { showToast } = useToast();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllServices();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to load services.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    document.title = 'Services — CXO Admin';
    fetchServices();
  }, [fetchServices]);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditTarget(service);
    setForm({ title: service.title, description: service.description, order: service.order ?? 0 });
    setImageFile(null);
    setImagePreview(service.image || '');
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'order' ? Number(value) : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('order', form.order);
      if (imageFile) fd.append('image', imageFile);

      if (editTarget) {
        const updated = await updateService(editTarget._id, fd);
        setServices((prev) =>
          prev.map((s) => s._id === updated._id ? updated : s).sort((a, b) => a.order - b.order)
        );
        showToast('Service updated.', 'success');
      } else {
        const created = await createService(fd);
        setServices((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        showToast('Service created.', 'success');
      }
      setModalOpen(false);
    } catch {
      showToast('Failed to save service.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteService(deleteTarget._id);
      setServices((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      showToast('Service deleted.', 'success');
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete service.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReorder = async (idx, direction) => {
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= services.length) return;
    const a = services[idx];
    const b = services[swapIdx];

    setServices((prev) =>
      prev
        .map((s) => {
          if (s._id === a._id) return { ...s, order: b.order };
          if (s._id === b._id) return { ...s, order: a.order };
          return s;
        })
        .sort((x, y) => x.order - y.order)
    );

    try {
      const fd1 = new FormData(); fd1.append('order', b.order);
      const fd2 = new FormData(); fd2.append('order', a.order);
      await Promise.all([updateService(a._id, fd1), updateService(b._id, fd2)]);
    } catch {
      showToast('Reorder failed. Refreshing...', 'error');
      fetchServices();
    }
  };

  const tableData = services.map((s, i) => ({ ...s, _idx: i }));

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (row) =>
        row.image ? (
          <img src={row.image} alt={row.title} className="w-10 h-10 rounded-lg object-cover bg-gray-700" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-500">
            <FiBriefcase size={14} />
          </div>
        ),
    },
    {
      key: 'order',
      label: 'Order',
      render: (row) => <span className="text-gray-400 font-mono text-xs">{row.order}</span>,
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => <span className="font-medium text-white">{row.title}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <span className="text-gray-400 max-w-[220px] block truncate">
          {row.description.length > 60 ? `${row.description.slice(0, 60)}…` : row.description}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleReorder(row._idx, 'up')}
            disabled={row._idx === 0}
            className="p-1.5 rounded text-gray-500 hover:text-white hover:bg-gray-700 transition disabled:opacity-30"
            title="Move up"
          >
            <FiChevronUp size={14} />
          </button>
          <button
            onClick={() => handleReorder(row._idx, 'down')}
            disabled={row._idx === services.length - 1}
            className="p-1.5 rounded text-gray-500 hover:text-white hover:bg-gray-700 transition disabled:opacity-30"
            title="Move down"
          >
            <FiChevronDown size={14} />
          </button>
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 rounded text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition"
            title="Edit"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => { setDeleteTarget(row); setConfirmOpen(true); }}
            className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
            title="Delete"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Services Manager" buttonLabel="Add New Service" onButtonClick={openAdd} />

      <AdminTable
        columns={columns}
        data={tableData}
        loading={loading}
        emptyMessage="No services yet. Add your first service."
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Service' : 'Add New Service'}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel={editTarget ? 'Update Service' : 'Create Service'}
      >
        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Service Image
              {editTarget && <span className="ml-1.5 text-gray-500 font-normal text-xs">(leave empty to keep current)</span>}
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer group rounded-xl overflow-hidden border border-dashed
                         border-gray-600 hover:border-blue-500 transition bg-gray-800"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                                  transition flex items-center justify-center">
                    <span className="text-white text-xs font-medium flex items-center gap-1">
                      <FiUpload size={12} /> Change
                    </span>
                  </div>
                </>
              ) : (
                <div className="h-24 flex flex-col items-center justify-center gap-2 text-gray-500">
                  <FiUpload size={18} />
                  <span className="text-sm">Click to upload image</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Business Consulting"
              className={inputClass}
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe this service..."
              className={`${inputClass} resize-none`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Display Order
              <span className="ml-1.5 text-gray-500 font-normal text-xs">(lower = shown first)</span>
            </label>
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              min={0}
              className={inputClass}
            />
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteTarget(null); }}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Service"
      />
    </div>
  );
};

export default AdminServices;
