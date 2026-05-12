import { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../../services/api';
import PageHeader from '../components/PageHeader';
import AdminTable from '../components/AdminTable';
import EventFormModal from '../../../components/ui/AdminModals/EventFormModal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';

const AdminEvents = () => {
  const { showToast } = useToast();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events');
      setEvents(Array.isArray(data) ? data : data.events ?? []);
    } catch {
      showToast('Failed to load events.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    document.title = 'Events — CXO Admin';
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenAdd = () => {
    setEditEvent(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditEvent(event);
    setModalOpen(true);
  };

  const handleOpenDelete = (event) => {
    setDeleteTarget(event);
    setConfirmOpen(true);
  };

  const handleSaved = (saved, isEdit) => {
    if (isEdit) {
      setEvents((prev) => prev.map((e) => (e._id === saved._id ? saved : e)));
      showToast('Event updated successfully.', 'success');
    } else {
      setEvents((prev) => [saved, ...prev]);
      showToast('Event created successfully.', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/events/${deleteTarget._id}`);
      setEvents((prev) => prev.filter((e) => e._id !== deleteTarget._id));
      showToast('Event deleted.', 'success');
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete event.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (row) => (
        <img
          src={row.image}
          alt={row.title}
          className="w-12 h-10 object-cover rounded-lg bg-gray-700 flex-shrink-0"
        />
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <div className="max-w-[200px]">
          <p className="font-medium text-white truncate">{row.title}</p>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) =>
        new Date(row.date).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric',
        }),
    },
    { key: 'time', label: 'Time' },
    {
      key: 'location',
      label: 'Location',
      render: (row) => (
        <span className="max-w-[140px] truncate block">{row.location}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const upcoming = new Date(row.date) >= new Date();
        return (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap
              ${upcoming
                ? 'bg-green-500/15 text-green-400'
                : 'bg-gray-600/40 text-gray-400'}`}
          >
            {upcoming ? 'Upcoming' : 'Closed'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition"
            title="Edit"
          >
            <FiEdit2 size={15} />
          </button>
          <button
            onClick={() => handleOpenDelete(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
            title="Delete"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        buttonLabel="Add Event"
        onButtonClick={handleOpenAdd}
      />

      <AdminTable
        columns={columns}
        data={events}
        loading={loading}
        emptyMessage="No events found. Click 'Add Event' to get started."
      />

      <EventFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        editEvent={editEvent}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteTarget(null); }}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Event"
      />
    </div>
  );
};

export default AdminEvents;
