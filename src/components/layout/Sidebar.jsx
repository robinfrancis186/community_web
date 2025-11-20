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
  Lightbulb,
  HelpCircle
} from 'lucide-react';
import clsx from 'clsx';
import logo from '../../assets/logo.png';

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
      { icon: HelpCircle, label: 'Help', path: '/member/help' },
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
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-50 transition-colors duration-300">
      <div className="p-6 flex items-center gap-3">
        <img src={logo} alt="STRIDE" className="h-8 w-auto" />
        <span className="text-xl font-bold text-slate-900 dark:text-white">STRIDE</span>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded ml-auto">{role}</span>
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
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary'
              )
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {role === 'member' && (
          <NavLink
            to="/member/profile"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary'
              )
            }
          >
            <Settings size={20} />
            <span className="font-medium">Profile</span>
          </NavLink>
        )}
        <NavLink to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full transition-all">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
