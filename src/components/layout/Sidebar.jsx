import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  BookOpen,
  Award,
  Users,
  Settings,
  LogOut,
  Activity,
  Globe,
  Shield,
  MessageSquare,
  FileText,
  Lightbulb
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine role based on path (simple mock logic)
  const role = currentPath.includes('/admin') ? 'admin' : currentPath.includes('/campus') ? 'campus' : 'member';

  const navItems = {
    member: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/member/dashboard' },
      { icon: Trophy, label: 'Leaderboard', path: '/member/leaderboard' },
      { icon: Calendar, label: 'Events', path: '/member/events' },
      { icon: BookOpen, label: 'Courses', path: '/member/courses' },
      { icon: Award, label: 'Certificates', path: '/member/certificates' },
      { icon: Lightbulb, label: 'Innovations', path: '/member/innovations' },
      { icon: MessageSquare, label: 'Community', path: '/member/community' },
    ],
    campus: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/campus/dashboard' },
      { icon: Users, label: 'Members', path: '/campus/members' },
      { icon: Calendar, label: 'Events', path: '/campus/events' },
      { icon: Activity, label: 'Analytics', path: '/campus/analytics' },
    ],
    admin: [
      { icon: Globe, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: Users, label: 'Users', path: '/admin/users' },
      { icon: FileText, label: 'Content', path: '/admin/content' },
      { icon: Activity, label: 'Impact', path: '/admin/impact' },
    ]
  };

  const currentNavItems = navItems[role] || navItems.member;

  return (
    <aside className="w-64 bg-surface border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">S</div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">STRIDE</span>
        <span className="text-xs font-mono text-gray-500 uppercase border border-white/10 px-1.5 py-0.5 rounded ml-auto">{role}</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {currentNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white w-full transition-all">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <NavLink to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-all">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
