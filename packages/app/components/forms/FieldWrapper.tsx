import { ErrorMessage } from '@hookform/error-message'
import { useFormContext } from 'react-hook-form'
import { InfoIcon } from '../icons'

type Props = {
  field?: string
  label?: string
  help?: string
  className?: string
  children: React.ReactNode | React.ReactNode[]
}

const FieldWrapper = (props: Props) => {
  const { field, label, help, className, children } = props
  const {
    formState: { errors },
    getFieldState,
  } = useFormContext()
  const { error } = getFieldState(field)
  return (
    <div className={` ${className}`}>
      {label && (
        <div className="mb-1 flex items-start align-middle text-gray-300">
          <label htmlFor={field} className="mr-1 ">
            {label}
          </label>
          {help && (
            <div className="tooltip-ghost tooltip" data-tip={help}>
              <InfoIcon className="-mt-2 h-3 w-3" />
            </div>
          )}
        </div>
      )}
      {children}
      <ErrorMessage
        as="p"
        className="!py-0 text-red-500"
        render={({ message }) => message}
        errors={errors}
        message={error?.message}
        name={field}
      />
    </div>
  )
}

export default FieldWrapper
