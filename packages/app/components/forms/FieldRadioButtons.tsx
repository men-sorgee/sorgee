import { InputHTMLAttributes } from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';
import { FormOptions } from 'lib/types';
import FieldWrapper from './FieldWrapper';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  field: string;
  label?: string;
  help?: string;
  formOptions: FormOptions;
  registerOptions?: RegisterOptions;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
};

export default function RadioButtonsField(props: Props) {
  const {
    field,
    label,
    help,
    registerOptions = {},
    formOptions,
    className,
    color = 'primary'
  } = props;
  const inputProps = Object.entries(props)
    .filter(
      ([key]) =>
        ![
          'field',
          'label',
          'help',
          'registerOptions',
          'formOptions',
          'className'
        ].includes(key)
    )
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  const { register } = useFormContext();

  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {formOptions?.map(({ text, value }, index) => (
          <div key={index.toString()} className="form-control">
            <label
              htmlFor={value}
              className="label cursor-pointer justify-start"
            >
              <input
                type="radio"
                id={value}
                value={value}
                {...register(field, registerOptions)}
                {...inputProps}
                className={`radio checked:bg-${color}-500 `}
              />
              <span className="label-text ml-2">{text}</span>
            </label>
          </div>
        ))}
      </div>
    </FieldWrapper>
  );
}
