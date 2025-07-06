'use client';

import React from 'react';

// The data structure now includes the four intersections
export interface IkigaiData {
    love: string;
    goodAt: string;
    paidFor: string;
    worldNeeds: string;
    passion: string;
    mission: string;
    profession: string;
    vocation: string;
}

interface Props {
    data: IkigaiData;
    onDataChange: (newData: Partial<IkigaiData>) => void;
}

const InputField = ({ label, name, value, onChange }: { label: string; name: keyof IkigaiData; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={2}
            className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-lg focus:outline-none focus:shadow-outline bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
    </div>
);

const IkigaiForm: React.FC<Props> = ({ data, onDataChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onDataChange({ [name]: value });
    };

    return (
        <div className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto mt-12 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-center mb-6">สร้าง Ikigai ของคุณ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {/* Main Circles */}
                <InputField label="1. สิ่งที่รัก" name="love" value={data.love} onChange={handleChange} />
                <InputField label="2. สิ่งที่ถนัด" name="goodAt" value={data.goodAt} onChange={handleChange} />
                <InputField label="3. สิ่งที่โลกต้องการ" name="worldNeeds" value={data.worldNeeds} onChange={handleChange} />
                <InputField label="4. สิ่งที่ทำแล้วมีรายได้" name="paidFor" value={data.paidFor} onChange={handleChange} />

                {/* Intersections */}
                <InputField label="Passion (รัก + ถนัด)" name="passion" value={data.passion} onChange={handleChange} />
                <InputField label="Mission (รัก + โลกต้องการ)" name="mission" value={data.mission} onChange={handleChange} />
                <InputField label="Profession (ถนัด + มีรายได้)" name="profession" value={data.profession} onChange={handleChange} />
                <InputField label="Vocation (มีรายได้ + โลกต้องการ)" name="vocation" value={data.vocation} onChange={handleChange} />
            </div>
        </div>
    );
};

export default IkigaiForm; 