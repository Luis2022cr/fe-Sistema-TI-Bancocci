import React from 'react';
import Select from 'react-select';

export interface SelectOption {
    value: number;
    label: string;
}

interface SelectFieldProps {
    value: SelectOption | null;
    options: SelectOption[];
    placeholder: string;
    onChange: (option: SelectOption | null) => void;
}

const SelectOptions: React.FC<SelectFieldProps> = ({ value, options, placeholder, onChange }) => (
    <div className="mb-4">
        <Select
            value={value}
            options={options}
            onChange={onChange}
            placeholder={placeholder}
            classNamePrefix="react-select"
        />
    </div>
);

export default SelectOptions;
