import { InputHTMLAttributes } from 'react';
import { Tooltip } from 'react-daisyui';
import { useFormContext, RegisterOptions } from 'react-hook-form';
import { InfoIcon } from '../icons';
import FieldWrapper from './FieldWrapper';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  field: string;
  label?: string;
  help?: string;
  registerOptions?: RegisterOptions;
  className?: string;
  children?: React.ReactNode | React.ReactNode[];
};

export default function CheckboxField(props: Props) {
  const {
    field,
    label,
    help,
    registerOptions = {},
    className,
    children
  } = props;
  const inputProps = Object.entries(props)
    .filter(
      ([key]) =>
        ![
          'field',
          'label',
          'help',
          'registerOptions',
          'className',
          'children'
        ].includes(key)
    )
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  const { register } = useFormContext();

  return (
    <FieldWrapper field={field} className={className}>
      {children}
      <div className={`form-control`}>
        <label htmlFor={field} className="label cursor-pointer justify-start">
          <input
            {...inputProps}
            id={field}
            {...register(field as any, registerOptions)}
            className="checkbox"
            type="checkbox"
          />
          {label && (
            <div className="label-text flex items-start align-middle">
              <span className="ml-2 mr-1">{label}</span>

              {help && (
                <Tooltip color="ghost" message={help}>
                  <InfoIcon className="-mt-2 h-3 w-3" />
                </Tooltip>
              )}
            </div>
          )}
        </label>
      </div>
    </FieldWrapper>
  );
}
