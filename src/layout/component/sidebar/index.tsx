import { JSX, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip, Collapse } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  path?: string;
  name: string;
  icon: JSX.Element;
  submenu?: MenuItem[] | undefined;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Example menu structure - replace with your actual menu data from menuData
  const menuItems: MenuItem[] = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <DashboardIcon />,
    },
    {
      name: 'User Management',
      icon: <PeopleIcon />,
      submenu: [
        {
          path: '/users/list',
          name: 'User List',
          icon: <PersonIcon />,
        },
        {
          path: '/users/roles',
          name: 'Roles',
          icon: <AssignmentIcon />,
        },
      ],
    },
    {
      name: 'Reports',
      icon: <BarChartIcon />,
      submenu: [
        {
          path: '/reports/sales',
          name: 'Sales Report',
          icon: <BarChartIcon />,
        },
        {
          path: '/reports/analytics',
          name: 'Analytics',
          icon: <BarChartIcon />,
        },
      ],
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: <SettingsIcon />,
    },
  ];

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.name] || false;
    const paddingLeft = level * 1.5; // Increase padding for nested levels

    if (hasSubmenu) {
      return (
        <li key={item.name}>
          <Tooltip title={!isOpen ? item.name : ''} placement="right">
            <button
              onClick={() => toggleSubmenu(item.name)}
              className={`
                flex items-center justify-between w-full p-2 text-base text-gray-900 rounded-lg
                hover:bg-gray-100 group cursor-pointer
                ${isExpanded ? 'bg-gray-100' : ''}
              `}
              style={{ paddingLeft: `${paddingLeft + 0.5}rem` }}
            >
              <div className="flex items-center">
                <span className="text-gray-500">{item.icon}</span>
                <span className={`ml-3 ${!isOpen && 'hidden'}`}>{item.name}</span>
              </div>
              {isOpen && (
                <span className="transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : '' }}>
                  <ChevronRightIcon />
                </span>
              )}
            </button>
          </Tooltip>
          <Collapse in={isOpen && isExpanded}>
            <ul className="space-y-2 py-2">
              {item?.submenu?.map(subItem => renderMenuItem(subItem, level + 1))}
            </ul>
          </Collapse>
        </li>
      );
    }

    return (
      <li key={item.name}>
        <Tooltip title={!isOpen ? item.name : ''} placement="right">
          <NavLink
            to={item.path || '#'}
            className={({ isActive }) => `
              flex items-center p-2 text-base text-gray-900 rounded-lg
              hover:bg-gray-100 group
              ${isActive ? 'bg-gray-100' : ''}
            `}
            style={{ paddingLeft: `${paddingLeft + 0.5}rem` }}
          >
            <span className="text-gray-500">{item.icon}</span>
            <span className={`ml-3 ${!isOpen && 'hidden'}`}>{item.name}</span>
          </NavLink>
        </Tooltip>
      </li>
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen pt-20 transition-transform bg-white border-r border-gray-200 
        ${isOpen ? 'w-64' : 'w-16'} 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0
        dark:bg-gray-800 dark:border-gray-700`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {menuItems.map(item => renderMenuItem(item))}
        </ul>
      </div>
    </aside>
  );
}