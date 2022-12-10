import { SelectHTMLAttributes } from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';
import { FormOptions } from 'models';
import FieldWrapper from './FieldWrapper';

type Props = SelectHTMLAttributes<HTMLInputElement> & {
  field: string;
  label?: string;
  help?: string;
  formOptions: FormOptions;
  registerOptions?: RegisterOptions;
  className?: string;
};

export default function SelectField(props: Props) {
  const {
    field,
    label,
    help,
    registerOptions = {},
    formOptions,
    className
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
  const { register, getFieldState, formState } = useFormContext();
  const { error } = getFieldState(field, formState);
  const classes = error ? 'select select-error' : 'select';
  return (
    <FieldWrapper field={field} label={label} help={help} className={className}>
      <select
        {...inputProps}
        id={field}
        {...register(field as any, registerOptions)}
        className={classes}
      >
        {formOptions?.map(({ text, value }, index) => (
          <option key={index.toString()} value={value}>
            {text}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
