
import React from 'react';
import { Role } from '../types';
import { UserIcon, StoreIcon } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="flex p-1 bg-slate-200 dark:bg-slate-700/50 rounded-full">
      <button
        onClick={() => onRoleChange(Role.Buyer)}
        className={`flex items-center justify-center space-x-2 w-28 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${
          currentRole === Role.Buyer
            ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600/50'
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <span>Buyer</span>
      </button>
      <button
        onClick={() => onRoleChange(Role.Seller)}
        className={`flex items-center justify-center space-x-2 w-28 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${
          currentRole === Role.Seller
            ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600/50'
        }`}
      >
        <StoreIcon className="w-5 h-5" />
        <span>Seller</span>
      </button>
    </div>
  );
};

export default RoleSwitcher;
