import React from 'react';

interface TextFieldProps {
    name: string;
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputText: React.FC<TextFieldProps> = ({ name, value, placeholder, onChange }) => (
    <div className="mb-4">
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-full bg-gray-200"
            placeholder={placeholder}
        />
    </div>
);

export default InputText;
