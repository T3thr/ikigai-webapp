// app/page.tsx
"use client";

import { useState } from 'react';
import { Kanit } from 'next/font/google';
import type { NextPage } from 'next';
import IkigaiDiagram from '@/components/IkigaiDiagram';
import IkigaiForm, { IkigaiData } from '@/components/IkigaiForm';

// Font setup
const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '600', '700'],
});

// ข้อมูลเริ่มต้นสำหรับแผนภาพอิคิไก (ว่างเปล่าเพื่อให้ผู้ใช้กรอกเอง)
const initialIkigaiData: IkigaiData = {
    love: '',
    goodAt: '',
    paidFor: '',
    worldNeeds: '',
    passion: '',
    mission: '',
    profession: '',
    vocation: '',
};

const IkigaiPage: NextPage = () => {
    // State สำหรับ modal, loading, และ API response
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState('');
    const [apiError, setApiError] = useState('');
    const [ikigaiData, setIkigaiData] = useState(initialIkigaiData);

    // Handler สำหรับการเปลี่ยนแปลงข้อมูลฟอร์ม
    const handleDataChange = (newData: Partial<IkigaiData>) => {
        setIkigaiData(prev => ({ ...prev, ...newData }));
    };

    // ฟังก์ชันสำหรับรับคำแนะนำจาก AI coach
    const getAdvice = async () => {
        // ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบหรือไม่
        const hasEmptyFields = Object.values(ikigaiData).some(value => value.trim() === '');
        if (hasEmptyFields) {
            alert('กรุณากรอกข้อมูลให้ครบทุกช่องก่อนขอคำแนะนำ');
            return;
        }

        setIsModalOpen(true);
        setIsLoading(true);
        setApiResponse('');
        setApiError('');

        const prompt = `
            ในฐานะไลฟ์โค้ชผู้เชี่ยวชาญด้านอิคิไก โปรดให้คำแนะนำและขั้นตอนที่เป็นรูปธรรมเพื่อค้นหาและใช้ชีวิตตาม 'อิคิไก' โดยพิจารณาจากข้อมูลต่อไปนี้:
            - สิ่งที่รัก: ${ikigaiData.love}
            - สิ่งที่ถนัด: ${ikigaiData.goodAt}
            - สิ่งที่ทำแล้วมีรายได้: ${ikigaiData.paidFor}
            - สิ่งที่โลกต้องการ: ${ikigaiData.worldNeeds}
            - Passion (รัก+ถนัด): ${ikigaiData.passion}
            - Mission (รัก+โลกต้องการ): ${ikigaiData.mission}
            - Profession (ถนัด+มีรายได้): ${ikigaiData.profession}
            - Vocation (มีรายได้+โลกต้องการ): ${ikigaiData.vocation}

            โปรดให้คำแนะนำที่สร้างสรรค์และนำไปใช้ได้จริง โดยครอบคลุมถึง:
            1. **แนวทางอาชีพหรือโปรเจกต์:** ที่ผสมผสานองค์ประกอบเหล่านี้เข้าด้วยกันอย่างลงตัว
            2. **การพัฒนาทักษะ:** ทักษะใดที่ควรเรียนรู้เพิ่มเติมเพื่อเชื่อมโยงจุดแข็งกับสิ่งที่โลกต้องการ
            3. **ขั้นตอนเล็กๆ ที่เริ่มได้เลย:** สิ่งที่สามารถทำได้ในสัปดาห์นี้เพื่อเข้าใกล้อิคิไกมากขึ้น

            จัดรูปแบบคำตอบในรูปแบบ Markdown ที่อ่านง่าย มีหัวข้อชัดเจน.
        `;

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.error || `API error: ${response.status}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'ขออภัย ไม่สามารถรับคำแนะนำได้ในขณะนี้';
            setApiResponse(text);

        } catch (error: any) {
            console.error('Error calling local API:', error);
            setApiError(`เกิดข้อผิดพลาดในการเรียก AI Coach: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Simple markdown to HTML renderer
    const renderMarkdown = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/(\n|^)\* (.*?)(?=\n|$)/g, '<li>$2</li>')
            .replace(/(\n|^)(\d)\. (.*?)(?=\n|$)/g, '<li><strong>$2.</strong> $3</li>')
            .replace(/\n/g, '<br />')
            .replace(/<li>/g, '<li class="list-disc ml-5 mb-2">')
            .replace(/<br \s*\/?><li>/g, '<li>');
    };

    return (
        <main className={`${kanit.className} bg-background text-foreground min-h-screen`}>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-primary">
                        ปรัชญาชีวิตของญี่ปุ่น "IKIGAI"
                    </h1>
                    <h2 className="text-xl md:text-2xl text-foreground/70">
                        "เหตุผลของการมีชีวิตอยู่"
                    </h2>
                </header>

                <IkigaiDiagram data={ikigaiData} />
                
                <div className="text-center my-12">
                    <button 
                        onClick={getAdvice} 
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 text-lg flex items-center gap-2 mx-auto"
                    >
                        ✨ รับคำแนะนำเพื่อค้นหา Ikigai
                    </button>
                </div>
                
                <IkigaiForm data={ikigaiData} onDataChange={handleDataChange} />
            </div>

            {/* Result Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-foreground/20" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-foreground/20 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-foreground">คำแนะนำจาก AI Coach</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="text-foreground/60 hover:text-foreground text-3xl leading-none transition-colors"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {isLoading && (
                                <div className="flex justify-center items-center py-10">
                                    <div className="border-4 border-foreground/20 border-t-primary rounded-full w-12 h-12 animate-spin"></div>
                                </div>
                            )}
                            {apiError && (
                                <p className="text-red-500 dark:text-red-400">{apiError}</p>
                            )}
                            {apiResponse && (
                                <div 
                                    className="prose prose-lg max-w-none leading-relaxed text-foreground [&_strong]:text-primary [&_li]:text-foreground/90" 
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(apiResponse) }} 
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default IkigaiPage;