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

// Initial data for the Ikigai diagram, now including intersections
const initialIkigaiData: IkigaiData = {
    love: 'ครอบครัว, การเรียนรู้สิ่งใหม่',
    goodAt: 'สกิลด้าน IT, การแก้ปัญหา',
    paidFor: 'พัฒนาซอฟต์แวร์, สอนหนังสือ',
    worldNeeds: 'นวัตกรรม, ความยั่งยืน',
    passion: 'ใช้ทักษะ IT ดูแลครอบครัว',
    mission: 'สร้างนวัตกรรมเพื่อครอบครัวและสังคม',
    profession: 'อาชีพนักพัฒนาซอฟต์แวร์',
    vocation: 'พัฒนานวัตกรรมสร้างรายได้',
};

const IkigaiPage: NextPage = () => {
    // State for modal, loading, and API response
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState('');
    const [apiError, setApiError] = useState('');
    const [ikigaiData, setIkigaiData] = useState(initialIkigaiData);

    // Handler for form data changes
    const handleDataChange = (newData: Partial<IkigaiData>) => {
        setIkigaiData(prev => ({ ...prev, ...newData }));
    };

    // Function to get advice from the AI coach
    const getAdvice = async () => {
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
        <main className={`${kanit.className} bg-background text-foreground flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8`}>
            <div className="w-full max-w-5xl mx-auto">
                <header className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2">ปรัชญาชีวิตของญี่ปุ่น "IKIGAI"</h1>
                    <h2 className="text-xl md:text-2xl text-center text-gray-600 dark:text-gray-400">"เหตุผลของการมีชีวิตอยู่"</h2>
                </header>

                <IkigaiDiagram data={ikigaiData} />
                
                <div className="text-center my-8 md:my-12">
                    <button onClick={getAdvice} className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 text-lg">
                        ✨ รับคำแนะนำเพื่อค้นหา Ikigai
                    </button>
                </div>
                
                <IkigaiForm data={ikigaiData} onDataChange={handleDataChange} />
            </div>

            {/* Result Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-2xl font-bold">คำแนะนำจาก AI Coach</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-3xl leading-none">&times;</button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {isLoading && (
                                <div className="flex justify-center items-center py-10">
                                    <div className="loader border-4 border-solid border-gray-200 dark:border-gray-600 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                                </div>
                            )}
                            {apiError && <p className="text-red-500 dark:text-red-400">{apiError}</p>}
                            {apiResponse && <div className="prose dark:prose-invert max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(apiResponse) }} />}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default IkigaiPage;