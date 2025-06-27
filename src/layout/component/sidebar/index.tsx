import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Tooltip, Collapse } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../../../auth/core/AuthContext';

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  menu_id?: number;
  menu_name: string;
  menu_icon?: string;
  menu_url?: string;
  menu_sequence?: number;
  menu_sub?: number;
  submenu: MenuItem[];
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { menuData } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };


  function buildMenuWithSubmenu(data: any[]): MenuItem[] {
    const map = new Map<number, MenuItem>();

    // สร้าง Map แรกเพื่อเก็บเมนูทั้งหมด
    data.forEach(item => {
      map.set(item.menu_id, {
        ...item,
        submenu: []
      });
    });

    const tree: MenuItem[] = [];

    data.forEach(item => {
      const current = map.get(item.menu_id)!;

      if (item.menu_sub && map.has(item.menu_sub)) {
        const parent = map.get(item.menu_sub)!;
        parent.submenu.push(current);
      } else {
        tree.push(current); // menu_sub === 0 or undefined → เมนูหลัก
      }
    });

    // เรียงลำดับ submenu ด้วย menu_sequence (optional)
    const sortSubmenu = (items: MenuItem[]) => {
      items.sort((a, b) => (b.menu_sequence ?? 0) - (a.menu_sequence ?? 0));
      items.forEach(i => sortSubmenu(i.submenu));
    };

    sortSubmenu(tree);
    return tree;
  }

  const menuResult: MenuItem[] = buildMenuWithSubmenu(menuData || []);

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus[item.menu_name] || false;
    const paddingLeft = level * 1.5 + 0.5;

    const isParentActive = item.submenu?.some(sub =>
      location.pathname.includes(`/${sub.menu_url}`)
    );

    const renderLabel = () => {
      if (level === 0) {
        // Top-level menu: collapsing label
        return (
          <span
            className="relative overflow-hidden"
            style={{
              width: isOpen ? 'auto' : '0px',
              transition: 'width 0.3s',
            }}
          >
            <label
              className={`absolute left-0 top-0 whitespace-pre transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'
                }`}
            >
              {item.menu_name}
            </label>
          </span>
        );
      } else {
        // Submenu: always visible
        return <span className="whitespace-pre">{item.menu_name}</span>;
      }
    };

    const iconAndLabel = (
      <div className="w-full">
        {item.menu_icon && (
          <span className="text-gray-500 mr-3 min-w-[20px] text-center">
            <i className={`${item.menu_icon} text-base`}></i>
          </span>
        )}
        {renderLabel()}
      </div>
    );


    if (hasSubmenu) {
      return (
        <li key={item.menu_name}>
          <Tooltip title={!isOpen && level === 0 ? item.menu_name : ''} placement="right">
            <div
              onClick={() => toggleSubmenu(item.menu_name)}
              className={`flex items-center p-2 text-sm rounded-lg transition-all 
              ${isExpanded || isParentActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-900 hover:bg-gray-100'}
            `}
              style={{ paddingLeft: `${paddingLeft}rem` }}
            >
              {iconAndLabel}
              {isOpen && (
                <ChevronRightIcon
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                />
              )}
            </div>
          </Tooltip>
          <Collapse in={isOpen && isExpanded}>
            <ul className="space-y-1 py-1">
              {item.submenu.map(subItem => renderMenuItem(subItem, level + 1))}
            </ul>
          </Collapse>
        </li>
      );
    }

    return (
      <li key={item.menu_name}>
        <Tooltip title={!isOpen && level === 0 ? item.menu_name : ''} placement="right">
          <NavLink
            to={`/${item.menu_url}`}
            className={({ isActive }) => `
            flex items-center w-full p-2 text-sm rounded-lg transition-all
            ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}
          `}
            style={{ paddingLeft: `${paddingLeft}rem` }}
          >
            {item.menu_icon && (
              <span className="text-gray-500 mr-3">
                <i className={`${item.menu_icon}`}></i>
              </span>
            )}
            {renderLabel()}
          </NavLink>
        </Tooltip>
      </li>
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen pt-20 transition-all bg-white border-r border-gray-200
    ${isOpen ? 'w-64' : 'w-16'}
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0
    dark:bg-gray-800 dark:border-gray-700
    overflow-x-hidden  // ✅ Add this
  `}
    >
      <div className="h-full px-3 pt-5 pb-4 overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {menuResult.map(item => renderMenuItem(item))}
        </ul>
      </div>
    </aside>

  );
}