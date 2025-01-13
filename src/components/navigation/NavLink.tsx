import React from 'react';
import { LucideIcon } from 'lucide-react';
import { createLogger } from '../../utils/logger';

const logger = createLogger('NavLink');

interface NavLinkProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  count?: number;
  onClick: () => void;
}

export function NavLink({
  icon: Icon,
  label,
  isActive,
  count,
  onClick,
}: NavLinkProps) {
  const handleClick = () => {
    logger.debug('NavLink clicked', { label, isActive });
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md
        ${
          isActive
            ? 'text-gray-900 bg-violet-100'
            : 'text-gray-600 hover:text-gray-900 hover:bg-violet-50'
        }
      `}
    >
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3" />
        {label}
      </div>
      {count !== undefined && (
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
          {count}
        </span>
      )}
    </button>
  );
}
