import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Key } from 'react';

type ICustomDropdown = {
  options: Array<{ key: string; label: any }>;
  label: string;
  icon?: string;
  style?: string;
  value: string;
  onclick?: (key: Key) => void;
};

export const CustomDropdown: React.FC<ICustomDropdown> = ({
  options,
  label,
  onclick,
  icon = 'fluent:more-vertical-24-regular',
  style = '',
}) => {
  return (
    <Dropdown className="w-full h-full outline-none">
      <DropdownTrigger className="grid outline-none">
        {!label ? (
          <button className="outline-none">
            <Icon icon={icon} className="my-auto text-[19px]" />
          </button>
        ) : (
          <Button
            variant="bordered"
            radius="sm"
            className={`border-none outline-none ${style}`}>
            {label}
          </Button>
        )}
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        items={options}
        onAction={onclick}>
        {(item) => (
          <DropdownItem
            key={item.key}
            color={
              ['delete', 'reverse'].some((i) =>
                String(item.key).toLowerCase().includes(i)
              )
                ? 'danger'
                : 'default'
            }
            className={
              ['delete', 'reverse'].some((i) =>
                String(item.key).toLowerCase().includes(i)
              )
                ? 'text-red-500'
                : ''
            }>
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};
