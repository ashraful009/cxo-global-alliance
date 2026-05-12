import { useEffect, useState, useCallback, useMemo } from 'react';
import { FiSearch, FiUsers } from 'react-icons/fi';
import { getAllUsers, updateUserRole, getUserCount } from '../../../services/userService';
import AdminTable from '../components/AdminTable';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../../../components/ui/ConfirmDialog/ConfirmDialog';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

const ROLE_TABS = ['All', 'Users', 'Members', 'Admins'];

const ROLE_BADGE = {
  admin:  'bg-purple-500/15 text-purple-400',
  member: 'bg-green-500/15 text-green-400',
  user:   'bg-gray-600/40 text-gray-300',
};

const ROLE_OPTIONS = ['user', 'member', 'admin'];

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-amber-600',
  'bg-pink-600', 'bg-teal-600', 'bg-red-600', 'bg-indigo-600',
];

const avatarColor = (name = '') => {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const [stats, setStats] = useState({ total: null, members: null, admins: null });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null); // { userId, userName, oldRole, newRole }
  const [roleLoading, setRoleLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to load users.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    document.title = 'Users — CXO Admin';
    fetchUsers();

    Promise.allSettled([
      getUserCount(),
      getUserCount('member'),
      getUserCount('admin'),
    ]).then(([total, members, admins]) => {
      setStats({
        total:   total.status   === 'fulfilled' ? total.value   : '—',
        members: members.status === 'fulfilled' ? members.value : '—',
        admins:  admins.status  === 'fulfilled' ? admins.value  : '—',
      });
    });
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    let list = users;
    if (activeTab === 'Users')   list = list.filter((u) => u.role === 'user');
    if (activeTab === 'Members') list = list.filter((u) => u.role === 'member');
    if (activeTab === 'Admins')  list = list.filter((u) => u.role === 'admin');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, activeTab, search]);

  const initiateRoleChange = (userId, userName, oldRole, newRole) => {
    if (newRole === oldRole) return;
    setPendingChange({ userId, userName, oldRole, newRole });
    setConfirmOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!pendingChange) return;
    setRoleLoading(true);
    try {
      const updated = await updateUserRole(pendingChange.userId, pendingChange.newRole);
      setUsers((prev) => prev.map((u) => u._id === updated._id ? { ...u, role: updated.role } : u));
      showToast(`${pendingChange.userName}'s role updated to ${pendingChange.newRole}.`, 'success');
      setConfirmOpen(false);
      setPendingChange(null);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to update role.', 'error');
    } finally {
      setRoleLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[160px]">
          {row.profileImage ? (
            <img src={row.profileImage} alt={row.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                             text-white text-xs font-bold flex-shrink-0 ${avatarColor(row.name)}`}>
              {initials(row.name)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-white truncate text-sm">{row.name}</p>
            <p className="text-gray-500 text-xs truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize
          ${ROLE_BADGE[row.role] || ROLE_BADGE.user}`}>
          {row.role}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        }),
    },
    {
      key: 'changeRole',
      label: 'Change Role',
      render: (row) => {
        const isSelf = row._id === currentUser?._id;
        return (
          <select
            value={row.role}
            disabled={isSelf}
            onChange={(e) => initiateRoleChange(row._id, row.name, row.role, e.target.value)}
            className={`bg-gray-800 border border-gray-700 text-sm rounded-lg px-3 py-1.5
                        text-white focus:outline-none focus:border-blue-500 transition
                        ${isSelf ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-gray-500'}`}
            title={isSelf ? 'You cannot change your own role' : undefined}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="User Manager" />

      {/* Stats Row */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total Users', value: stats.total, color: 'text-blue-400' },
          { label: 'Members',     value: stats.members, color: 'text-green-400' },
          { label: 'Admins',      value: stats.admins, color: 'text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700
                       rounded-xl text-sm">
            <FiUsers size={13} className={color} />
            <span className="text-gray-400">{label}:</span>
            <span className={`font-bold ${color}`}>
              {value === null ? (
                <span className="w-6 h-3 bg-gray-700 rounded animate-pulse inline-block" />
              ) : value}
            </span>
          </div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2
                       text-white text-sm placeholder-gray-500 focus:outline-none
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        <div className="flex gap-1 bg-gray-800 border border-gray-700 rounded-lg p-1">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage={
          search
            ? `No results found for "${search}".`
            : `No ${activeTab !== 'All' ? activeTab.toLowerCase() : 'users'} found.`
        }
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setPendingChange(null); }}
        onConfirm={confirmRoleChange}
        loading={roleLoading}
        title="Change User Role"
        message={
          pendingChange
            ? `Change ${pendingChange.userName}'s role from "${pendingChange.oldRole}" to "${pendingChange.newRole}"?`
            : ''
        }
        confirmLabel="Confirm Change"
      />
    </div>
  );
};

export default AdminUsers;
