import React from 'react';

interface TextFieldProps {
    type: string;
    name: string;
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputText: React.FC<TextFieldProps> = ({type, name, value, placeholder, onChange }) => (
    <div className="mb-4">
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-full bg-gray-200"
            placeholder={placeholder}
        />
    </div>
);

export default InputText;
