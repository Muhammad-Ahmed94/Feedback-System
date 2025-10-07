import React from 'react'
import type { FormFieldProps } from '../props/props'

const FormField: React.FC<FormFieldProps> = ({title, type, placeholder, onChange, value, className}) => {
  return (
    <div className={`my-2 flex flex-col items-start `}>
        <label className='mb-1 text-sm font-medium'>{title}</label>
        <input 
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            className={className}
            required
        />
    </div>
  )
}

export default FormField