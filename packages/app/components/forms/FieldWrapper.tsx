import { ErrorMessage } from '@hookform/error-message';
import { Tooltip } from 'react-daisyui';
import { useFormContext } from 'react-hook-form';
import { InfoIcon } from '../icons';
import { ExclamationIcon } from '@heroicons/react/solid';
type Props = {
  field?: string;
  label?: string;
  help?: string;
  className?: string;
  children: React.ReactNode | React.ReactNode[];
};

export default function FieldWrapper(props: Props) {
  const { field, label, help, className, children } = props;
  const {
    formState: { errors },
    getFieldState
  } = useFormContext();
  const { error } = getFieldState(field);
  return (
    <div className={` ${className}`}>
      {label && (
        <div className="mb-1 flex items-start align-middle text-gray-300">
          <label htmlFor={field} className="mr-1 ">
            {label}
          </label>
          {help && (
            <Tooltip color="ghost" className="cursor-pointer" message={help}>
              <InfoIcon className="-mt-2 h-3 w-3" />
            </Tooltip>
          )}
        </div>
      )}
      {children}
      <ErrorMessage
        render={(m) => <p className="text-red-500">{m.message}</p>}
        errors={errors}
        message={error?.message}
        name={field}
      />
    </div>
  );
}
