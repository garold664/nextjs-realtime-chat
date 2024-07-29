import { UseFormRegisterReturn } from 'react-hook-form';

interface FormControlProps {
  label: string;
  id: string;
  placeholder: string;
  type: string;
  // name: string;
  Icon: React.ElementType;
  registerProps: UseFormRegisterReturn;
}
export default function FormControl({
  label,
  id,
  placeholder,
  type,
  // name,
  Icon,
  registerProps,
}: FormControlProps) {
  return (
    <div className="flex flex-col relative group">
      <label htmlFor="email" className="text-xs text-secondary-500 font-bold">
        {label}
      </label>
      <input
        type={type}
        // name={name}
        id={id}
        placeholder={placeholder}
        {...registerProps}
        className="rounded-md rounded-bl-none rounded-br-none text-sm pl-8 outline-none border-0 border-b-2 shadow-none border-secondary-300 focus-visible:border-blue-600  focus:ring-0 transition-colors duration-300 focus:bg-blue-50"
      />
      <Icon className="w-4 h-4 opacity-40 absolute bottom-3 left-2 group-focus-within:text-blue-600 group-focus-within:opacity-100" />
    </div>
  );
}
