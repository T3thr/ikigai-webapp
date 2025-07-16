'use client';

import React from 'react';
import { History } from 'lucide-react';

// กำหนด Type สำหรับข้อมูล Ikigai
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

// กำหนด Type สำหรับ Props
interface IkigaiFormProps {
  data: IkigaiData;
  onDataChange: (newData: Partial<IkigaiData>) => void;
  onGenerateIntersections: () => void;
  isGenerating: boolean;
  getAdvice: () => void;
  children: React.ReactNode;
  colors?: { love: string; goodAt: string; paidFor: string; worldNeeds: string; };
  onColorChange?: (key: string, value: string) => void;
  savedAdvice?: string;
  onViewHistory?: () => void;
}

const IkigaiForm: React.FC<IkigaiFormProps> = ({ 
  data, 
  onDataChange, 
  onGenerateIntersections,
  isGenerating,
  getAdvice,
  children,
  colors,
  onColorChange,
  savedAdvice,
  onViewHistory
}) => {
  
  // Handler สำหรับการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onDataChange({ [name]: value });
  };

  // ฟังก์ชันสำหรับสร้าง Textarea แต่ละช่อง
  const renderTextarea = (name: keyof IkigaiData, label: string, placeholder: string, colorClass: string) => (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center">
        <label htmlFor={name} className={`font-semibold text-sm ${colorClass}`}>
          {label}
        </label>
        {['love', 'goodAt', 'worldNeeds', 'paidFor'].includes(name) && colors && onColorChange && (
          <input
            type="color"
            value={colors[name as keyof typeof colors]}
            onChange={(e) => onColorChange(name, e.target.value)}
            className="ml-2 w-6 h-6 border-none cursor-pointer"
            aria-label={`เลือกสีสำหรับ ${label}`}
          />
        )}
      </div>
      <textarea
        id={name}
        name={name}
        value={data[name]}
        onChange={handleChange}
        rows={3}
        className="bg-container border border-neutral-300 dark:border-neutral-700 rounded-lg p-3 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none hover:border-primary/50"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <section className="w-full max-w-5xl mx-auto mt-12 bg-card p-6 md:p-8 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">สร้างแผนภาพอิคิไกของคุณ</h3>
        <p className="text-foreground/70 text-sm md:text-base">กรอกข้อมูลเพื่อค้นหาจุดประสงค์ของชีวิตที่แท้จริง</p>
      </div>

      {/* ส่วนข้อมูลหลัก 4 อย่าง */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {renderTextarea(
          'love', 
          '1. สิ่งที่คุณรัก (What You Love)', 
          'เช่น ครอบครัว, การเรียนรู้, การอ่านหนังสือ, การท่องเที่ยว...',
          'text-blue-700 dark:text-blue-300'
        )}
        {renderTextarea(
          'goodAt', 
          '2. สิ่งที่คุณเก่ง (What You Are Good At)', 
          'เช่น ทักษะด้าน IT, การสื่อสาร, การแก้ปัญหา, ความคิดสร้างสรรค์...',
          'text-green-700 dark:text-green-300'
        )}
        {renderTextarea(
          'worldNeeds', 
          '3. สิ่งที่โลกต้องการ (What The World Needs)', 
          'เช่น นวัตกรรม, ความยั่งยืน, การศึกษา, การดูแลสุขภาพ...',
          'text-yellow-700 dark:text-yellow-300'
        )}
        {renderTextarea(
          'paidFor', 
          '4. สิ่งที่สร้างรายได้ (What You Can Be Paid For)', 
          'เช่น พัฒนาซอฟต์แวร์, การสอน, การให้คำปรึกษา, การขายสินค้า...',
          'text-red-700 dark:text-red-300'
        )}
      </div>
      
      {children}

      <div className="text-center my-8 flex justify-center items-center gap-4">
        <button
          onClick={getAdvice}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 text-lg flex items-center gap-2"
        >
          ✨ รับคำแนะนำจากโค้ช AI สำหรับ Ikigai ของคุณ
        </button>
        {savedAdvice && onViewHistory && (
          <button
            onClick={onViewHistory}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 p-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
            aria-label="ดูประวัติคำแนะนำ"
          >
            <History size={24} />
          </button>
        )}
      </div>

      {/* เส้นแบ่ง */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 my-8"></div>
      
      {/* ส่วนหัวข้อสำหรับจุดเชื่อมต่อ */}
      <div className="text-center mb-6">
        <h4 className="text-xl md:text-2xl font-bold text-primary mb-2">จุดเชื่อมต่อ (Intersections)</h4>
        <p className="text-foreground/70 text-sm md:text-base">ส่วนที่เกิดจากการผสมผสานระหว่างองค์ประกอบต่างๆ</p>
      </div>

      <div className="text-center mb-8">
        <button
          onClick={onGenerateIntersections}
          disabled={isGenerating}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 text-base flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="border-2 border-white/20 border-t-white rounded-full w-5 h-5 animate-spin"></div>
              <span>กำลังประมวลผล...</span>
            </>
          ) : (
            'ให้ AI ช่วยหาตัวตนของคุณ'
          )}
        </button>
      </div>

      {/* ส่วนที่ทับซ้อนกัน */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTextarea(
          'passion', 
          'Passion (รัก + เก่ง)', 
          'เช่น ใช้ทักษะที่เก่งทำสิ่งที่รัก, งานอดิเรกที่มีความสามารถ...',
          'text-purple-700 dark:text-purple-300'
        )}
        {renderTextarea(
          'mission', 
          'Mission (รัก + โลกต้องการ)', 
          'เช่น การสนับสนุนสิ่งที่รักเพื่อตอบสนองความต้องการของโลก...',
          'text-indigo-700 dark:text-indigo-300'
        )}
        {renderTextarea(
          'profession', 
          'Profession (เก่ง + สร้างรายได้)', 
          'เช่น อาชีพที่ใช้ความสามารถเป็นหลัก, งานที่ถนัดและมีรายได้...',
          'text-teal-700 dark:text-teal-300'
        )}
        {renderTextarea(
          'vocation', 
          'Vocation (สร้างรายได้ + โลกต้องการ)', 
          'เช่น ธุรกิจที่สร้างรายได้และตอบสนองความต้องการของสังคม...',
          'text-orange-700 dark:text-orange-300'
        )}
      </div>

      {/* คำแนะนำ */}
      <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h5 className="font-semibold text-primary mb-2">💡 คำแนะนำ:</h5>
        <ul className="text-sm text-foreground/80 space-y-1">
          <li>• กรอกข้อมูลให้ละเอียดเพื่อให้ AI Coach สามารถให้คำแนะนำที่ดีขึ้น</li>
          <li>• ส่วน "จุดเชื่อมต่อ" จะอัปเดตแผนภาพให้เห็นการผสมผสานระหว่างองค์ประกอบต่างๆ</li>
          <li>• สามารถแก้ไขข้อมูลได้ตลอดเวลาและแผนภาพจะเปลี่ยนแปลงตาม</li>
        </ul>
      </div>
    </section>
  );
};

export default IkigaiForm;