import { useEffect, useState, useCallback, useMemo } from 'react';
import { FiMail, FiInbox, FiTrash2, FiX, FiExternalLink } from 'react-icons/fi';
import { getAllMessages, toggleMessageRead, deleteMessage } from '../../../services/contactService';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../../../components/ui/ConfirmDialog/ConfirmDialog';
import { useToast } from '../../../context/ToastContext';

const FILTER_TABS = ['All', 'Unread', 'Read'];

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-amber-600',
  'bg-pink-600', 'bg-teal-600',
];

const avatarColor = (name = '') => {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const relativeDate = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const AdminMessages = () => {
  const { showToast } = useToast();

  const [messages, setMessages]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('All');
  const [selected, setSelected]       = useState(null);
  const [markLoading, setMarkLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to load messages.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    document.title = 'Messages — CXO Admin';
    fetchMessages();
  }, [fetchMessages]);

  const unreadCount = useMemo(() => messages.filter((m) => !m.isRead).length, [messages]);

  const filtered = useMemo(() => {
    if (activeTab === 'Unread') return messages.filter((m) => !m.isRead);
    if (activeTab === 'Read')   return messages.filter((m) => m.isRead);
    return messages;
  }, [messages, activeTab]);

  // Auto-mark as read when opening a message
  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        const updated = await toggleMessageRead(msg._id);
        setMessages((prev) => prev.map((m) => m._id === updated._id ? updated : m));
        if (selected?._id === msg._id) setSelected(updated);
      } catch { /* silent */ }
    }
  };

  const handleToggleRead = async (msg) => {
    if (markLoading) return;
    setMarkLoading(true);
    try {
      const updated = await toggleMessageRead(msg._id);
      setMessages((prev) => prev.map((m) => m._id === updated._id ? updated : m));
      if (selected?._id === updated._id) setSelected(updated);
    } catch {
      showToast('Failed to update message.', 'error');
    } finally {
      setMarkLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteMessage(deleteTarget._id);
      setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      if (selected?._id === deleteTarget._id) setSelected(null);
      showToast('Message deleted.', 'success');
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete message.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const MessageCard = ({ msg }) => {
    const isActive = selected?._id === msg._id;
    return (
      <button
        onClick={() => openMessage(msg)}
        className={`w-full text-left px-4 py-3.5 border-b border-gray-700/50 transition-colors
                    flex items-start gap-3 group
                    ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}
      >
        {/* Unread dot */}
        <div className="flex-shrink-0 mt-1 w-2">
          {!msg.isRead && <div className="w-2 h-2 rounded-full bg-blue-500" />}
        </div>

        {/* Avatar */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                         text-white text-sm font-bold ${avatarColor(msg.name)}`}>
          {msg.name[0]?.toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={`text-sm truncate ${!msg.isRead ? 'font-semibold text-white' : 'font-normal text-gray-300'}`}>
              {msg.name}
            </span>
            <span className="text-xs text-gray-500 flex-shrink-0">{relativeDate(msg.createdAt)}</span>
          </div>
          <p className={`text-xs truncate ${!msg.isRead ? 'text-gray-300' : 'text-gray-500'}`}>
            {msg.subject}
          </p>
        </div>
      </button>
    );
  };

  const DetailPanel = ({ msg }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                           text-white font-bold ${avatarColor(msg.name)}`}>
            {msg.name[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm">{msg.name}</p>
            <p className="text-gray-400 text-xs">{msg.email}</p>
          </div>
        </div>
        <button
          onClick={() => setSelected(null)}
          className="lg:hidden text-gray-400 hover:text-white p-1 flex-shrink-0"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Subject + date */}
      <div className="px-6 py-3 border-b border-gray-700/60 flex-shrink-0">
        <p className="text-white font-medium text-sm">{msg.subject}</p>
        <p className="text-gray-500 text-xs mt-0.5">
          {new Date(msg.createdAt).toLocaleString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
            year: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-700 flex flex-wrap gap-2 flex-shrink-0">
        <a
          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
                     text-white text-sm font-medium rounded-lg transition-colors"
        >
          <FiExternalLink size={13} />
          Reply via Email
        </a>
        <button
          onClick={() => handleToggleRead(msg)}
          disabled={markLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600
                     text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-colors
                     disabled:opacity-60"
        >
          {msg.isRead ? <FiMail size={13} /> : <FiInbox size={13} />}
          {msg.isRead ? 'Mark Unread' : 'Mark Read'}
        </button>
        <button
          onClick={() => { setDeleteTarget(msg); setConfirmOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20
                     text-red-400 hover:text-red-300 text-sm font-medium rounded-lg transition-colors"
        >
          <FiTrash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Contact Messages" />

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-gray-800 border border-gray-700 rounded-lg p-1 w-fit">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelected(null); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5
              ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {tab}
            {tab === 'Unread' && unreadCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold
                ${activeTab === 'Unread' ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-400'}`}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden
                      flex flex-col lg:flex-row min-h-[500px]">
        {/* Message List */}
        <div className={`flex-shrink-0 lg:w-[340px] border-r border-gray-700 overflow-y-auto
                         ${selected ? 'hidden lg:block' : 'block'}`}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-4 py-3.5 border-b border-gray-700/50 flex gap-3">
                <div className="w-2 flex-shrink-0 mt-2"><div className="w-2 h-2 rounded-full bg-gray-700 animate-pulse" /></div>
                <div className="w-9 h-9 rounded-full bg-gray-700 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
              No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} messages.
            </div>
          ) : (
            filtered.map((msg) => <MessageCard key={msg._id} msg={msg} />)
          )}
        </div>

        {/* Detail Panel */}
        <div className={`flex-1 ${selected ? 'block' : 'hidden lg:flex lg:items-center lg:justify-center'}`}>
          {selected ? (
            <DetailPanel msg={selected} />
          ) : (
            <div className="text-center text-gray-600">
              <FiMail size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteTarget(null); }}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Message"
        message={`Delete message from "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete Message"
      />
    </div>
  );
};

export default AdminMessages;
