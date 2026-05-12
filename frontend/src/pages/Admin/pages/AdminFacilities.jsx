import { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { getAllFacilities, createFacility, updateFacility, deleteFacility } from '../../../services/facilityService';
import PageHeader from '../components/PageHeader';
import AdminTable from '../components/AdminTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';

const EMPTY_FORM = { title: '', description: '', order: 0 };

const inputClass = `w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5
                    text-white text-sm placeholder-gray-500 focus:outline-none
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`;

const AdminFacilities = () => {
  const { showToast } = useToast();

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllFacilities();
      setFacilities(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to load facilities.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    document.title = 'Facilities — CXO Admin';
    fetchFacilities();
  }, [fetchFacilities]);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (facility) => {
    setEditTarget(facility);
    setForm({ title: facility.title, description: facility.description, order: facility.order ?? 0 });
    setErrors({});
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'order' ? Number(value) : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
      if (editTarget) {
        const updated = await updateFacility(editTarget._id, form);
        setFacilities((prev) =>
          prev.map((f) => f._id === updated._id ? updated : f).sort((a, b) => a.order - b.order)
        );
        showToast('Facility updated.', 'success');
      } else {
        const created = await createFacility(form);
        setFacilities((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        showToast('Facility created.', 'success');
      }
      setModalOpen(false);
    } catch {
      showToast('Failed to save facility.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteFacility(deleteTarget._id);
      setFacilities((prev) => prev.filter((f) => f._id !== deleteTarget._id));
      showToast('Facility deleted.', 'success');
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete facility.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReorder = async (idx, direction) => {
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= facilities.length) return;

    const a = facilities[idx];
    const b = facilities[swapIdx];

    setFacilities((prev) =>
      prev
        .map((f) => {
          if (f._id === a._id) return { ...f, order: b.order };
          if (f._id === b._id) return { ...f, order: a.order };
          return f;
        })
        .sort((x, y) => x.order - y.order)
    );

    try {
      await Promise.all([
        updateFacility(a._id, { order: b.order }),
        updateFacility(b._id, { order: a.order }),
      ]);
    } catch {
      showToast('Reorder failed. Refreshing...', 'error');
      fetchFacilities();
    }
  };

  // Embed index so render functions can access it
  const tableData = facilities.map((f, i) => ({ ...f, _idx: i }));

  const columns = [
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
        <span className="text-gray-400 max-w-[260px] block truncate">
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
            disabled={row._idx === facilities.length - 1}
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
      <PageHeader title="Facilities Manager" buttonLabel="Add New Facility" onButtonClick={openAdd} />

      <AdminTable
        columns={columns}
        data={tableData}
        loading={loading}
        emptyMessage="No facilities yet. Add your first facility."
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Facility' : 'Add New Facility'}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel={editTarget ? 'Update Facility' : 'Create Facility'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Conference Room"
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
              placeholder="Describe this facility..."
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
        title="Delete Facility"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Facility"
      />
    </div>
  );
};

export default AdminFacilities;
