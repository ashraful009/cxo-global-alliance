import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar, FiTrendingUp, FiUsers, FiBriefcase,
  FiMail, FiUserCheck, FiArrowRight
} from 'react-icons/fi';
import api from '../../../services/api';
import StatCard from '../components/StatCard';
import AdminTable from '../components/AdminTable';
import PageHeader from '../components/PageHeader';

const QUICK_ACTIONS = [
  { label: 'Manage Events',    to: '/admin/events',    color: 'bg-blue-600 hover:bg-blue-700' },
  { label: 'Manage Services',  to: '/admin/services',  color: 'bg-emerald-600 hover:bg-emerald-700' },
  { label: 'View Messages',    to: '/admin/messages',  color: 'bg-purple-600 hover:bg-purple-700' },
  { label: 'Manage Users',     to: '/admin/users',     color: 'bg-amber-600 hover:bg-amber-700' },
];

const EVENT_COLUMNS = [
  { key: 'title',    label: 'Title',    render: (row) => <span className="font-medium text-white">{row.title}</span> },
  { key: 'date',     label: 'Date',     render: (row) => new Date(row.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
  { key: 'location', label: 'Location', render: (row) => row.location || '—' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => {
      const upcoming = new Date(row.date) >= new Date();
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
          ${upcoming ? 'bg-green-500/15 text-green-400' : 'bg-gray-600/40 text-gray-400'}`}>
          {upcoming ? 'Upcoming' : 'Closed'}
        </span>
      );
    },
  },
];

const MESSAGE_COLUMNS = [
  { key: 'name',    label: 'Sender',  render: (row) => <span className="font-medium text-white">{row.name}</span> },
  { key: 'subject', label: 'Subject', render: (row) => <span className="line-clamp-1">{row.subject}</span> },
  { key: 'email',   label: 'Email' },
  {
    key: 'isRead',
    label: 'Status',
    render: (row) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
        ${row.isRead ? 'bg-gray-600/40 text-gray-400' : 'bg-blue-500/15 text-blue-400'}`}>
        {row.isRead ? 'Read' : 'Unread'}
      </span>
    ),
  },
];

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalEvents: null, upcomingEvents: null,
    totalMembers: null, totalUsers: null,
    totalServices: null, unreadMessages: null,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard — CXO Admin';

    const fetchStats = async () => {
      const [
        totalEventsRes, upcomingEventsRes,
        totalUsersRes, totalMembersRes,
        totalServicesRes, unreadMessagesRes,
      ] = await Promise.allSettled([
        api.get('/events/count'),
        api.get('/events/count?status=upcoming'),
        api.get('/users/count'),
        api.get('/users/count?role=member'),
        api.get('/services/count'),
        api.get('/contact/count?unread=true'),
      ]);

      setStats({
        totalEvents:    totalEventsRes.status    === 'fulfilled' ? totalEventsRes.value.data.count    : '—',
        upcomingEvents: upcomingEventsRes.status === 'fulfilled' ? upcomingEventsRes.value.data.count : '—',
        totalUsers:     totalUsersRes.status     === 'fulfilled' ? totalUsersRes.value.data.count     : '—',
        totalMembers:   totalMembersRes.status   === 'fulfilled' ? totalMembersRes.value.data.count   : '—',
        totalServices:  totalServicesRes.status  === 'fulfilled' ? totalServicesRes.value.data.count  : '—',
        unreadMessages: unreadMessagesRes.status === 'fulfilled' ? unreadMessagesRes.value.data.count : '—',
      });
    };

    const fetchRecentEvents = async () => {
      try {
        const { data } = await api.get('/events?limit=5');
        setRecentEvents(Array.isArray(data) ? data : data.events ?? []);
      } catch {
        setRecentEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    const fetchRecentMessages = async () => {
      try {
        const { data } = await api.get('/contact?limit=5');
        setRecentMessages(Array.isArray(data) ? data : data.messages ?? []);
      } catch {
        setRecentMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchStats();
    fetchRecentEvents();
    fetchRecentMessages();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard icon={<FiCalendar />}    label="Total Events"      count={stats.totalEvents}    color="border-blue-500" />
        <StatCard icon={<FiTrendingUp />}  label="Upcoming Events"   count={stats.upcomingEvents} color="border-green-500" />
        <StatCard icon={<FiUsers />}       label="Total Users"       count={stats.totalUsers}     color="border-purple-500" />
        <StatCard icon={<FiUserCheck />}   label="Members"           count={stats.totalMembers}   color="border-amber-500" />
        <StatCard icon={<FiBriefcase />}   label="Services"          count={stats.totalServices}  color="border-pink-500" />
        <StatCard icon={<FiMail />}        label="Unread Messages"   count={stats.unreadMessages} color="border-red-500" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {QUICK_ACTIONS.map(({ label, to, color }) => (
            <Link
              key={to}
              to={to}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm
                          font-semibold transition-colors ${color}`}
            >
              {label}
              <FiArrowRight size={14} />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Events</h2>
          <Link to="/admin/events" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View all →
          </Link>
        </div>
        <AdminTable
          columns={EVENT_COLUMNS}
          data={recentEvents}
          loading={eventsLoading}
          emptyMessage="No events found."
        />
      </div>

      {/* Recent Messages */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Messages</h2>
          <Link to="/admin/messages" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View all →
          </Link>
        </div>
        <AdminTable
          columns={MESSAGE_COLUMNS}
          data={recentMessages}
          loading={messagesLoading}
          emptyMessage="No messages found."
        />
      </div>
    </div>
  );
};

export default AdminOverview;
