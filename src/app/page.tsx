// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Kanit } from 'next/font/google';
import type { NextPage } from 'next';
import IkigaiDiagram from '@/components/IkigaiDiagram';
import IkigaiForm, { IkigaiData } from '@/components/IkigaiForm';
import { Save, Copy, History, Trash2, X } from 'lucide-react';

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
    const [modalMode, setModalMode] = useState<'new' | 'history' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [apiResponse, setApiResponse] = useState('');
    const [apiError, setApiError] = useState('');
    const [ikigaiData, setIkigaiData] = useState(initialIkigaiData);
    const [savedAdvice, setSavedAdvice] = useState('');
    const [isAdviceSaved, setIsAdviceSaved] = useState(false);

    const [colors, setColors] = useState({
        love: '#3b82f6',
        goodAt: '#6b7280',
        paidFor: '#3b82f6',
        worldNeeds: '#6b7280'
    });

    useEffect(() => {
        const stored = localStorage.getItem('ikigaiColors');
        if (stored) {
            setColors(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        const storedAdvice = localStorage.getItem('ikigaiAdvice');
        if (storedAdvice) {
            setSavedAdvice(storedAdvice);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ikigaiColors', JSON.stringify(colors));
    }, [colors]);

    const handleColorChange = (key: string, value: string) => {
        setColors(prev => ({ ...prev, [key]: value }));
    };

    // Handler สำหรับการเปลี่ยนแปลงข้อมูลฟอร์ม
    const handleDataChange = (newData: Partial<IkigaiData>) => {
        setIkigaiData(prev => ({ ...prev, ...newData }));
    };
    
    // ฟังก์ชันสำหรับสร้าง Intersection จาก AI
    const generateIntersections = async () => {
      const { love, goodAt, paidFor, worldNeeds } = ikigaiData;
      if (!love || !goodAt || !paidFor || !worldNeeds) {
        alert('กรุณากรอกข้อมูลหลัก 4 อย่างให้ครบถ้วนก่อน');
        return;
      }

      setIsGenerating(true);
      setApiError('');

      const prompt = `
You are an Ikigai expert. Based on the user's inputs, generate concise, meaningful, and beautifully phrased suggestions for the four Ikigai intersections. Follow these principles strictly:

1. Passion: Combination of What you love + What you are good at. This is "the things that ignite your daily passion" – what drives you to wake up excited every day. It emerges from loving what you do and being skilled at it. Often, lack of passion comes from missing one of these.

2. Mission: Combination of What you love + What the world needs. This is your "mission" or purpose – why certain businesses or careers persist even if not highly profitable; it's what you love and what the world truly needs, creating value for others.

3. Profession: Combination of What you are good at + What you can be paid for. This is your "profession" – skills that generate income. Even if not your utmost passion, connecting all elements can turn loves into paid work.

4. Vocation: Combination of What the world needs + What you can be paid for. This is your "vocation" – market-demanded skills that provide income, encouraging skill development to meet world needs.

User inputs:
- What you love: ${love}
- What you are good at: ${goodAt}
- What you can be paid for: ${paidFor}
- What the world needs: ${worldNeeds}

Respond ONLY with a valid JSON object containing keys: passion, mission, profession, vocation. Each value should be a beautifully phrased, concise paragraph in Thai language, incorporating the principles above and user's inputs meaningfully.
      `;

      try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, isJsonMode: true }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.error || `API error: ${response.status}`);
        }
        
        const result = await response.json();
        let text = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        
        // Clean the response to ensure it's valid JSON
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const generatedData = JSON.parse(text);

        handleDataChange({
          passion: generatedData.passion || '',
          mission: generatedData.mission || '',
          profession: generatedData.profession || '',
          vocation: generatedData.vocation || '',
        });

      } catch (error: any) {
          console.error('Error generating intersections:', error);
          setApiError(`เกิดข้อผิดพลาดในการสร้างข้อมูล: ${error.message}`);
          alert(`เกิดข้อผิดพลาด: ${error.message}`);
      } finally {
        setIsGenerating(false);
      }
    };


    // ฟังก์ชันสำหรับรับคำแนะนำจาก AI coach
    const getAdvice = async () => {
        // ตรวจสอบว่าผู้ใช้กรอกข้อมูลครบหรือไม่
        const hasEmptyFields = Object.values(ikigaiData).some(value => value.trim() === '');
        if (hasEmptyFields) {
            alert('กรุณากรอกข้อมูลให้ครบทุกช่องก่อนขอคำแนะนำ');
            return;
        }

        setModalMode('new');
        setIsAdviceSaved(false);
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

    const handleSaveAdvice = () => {
        if (savedAdvice && !window.confirm('มีคำแนะนำที่บันทึกไว้อยู่แล้ว คุณต้องการบันทึกทับหรือไม่?')) {
            return;
        }
        localStorage.setItem('ikigaiAdvice', apiResponse);
        setSavedAdvice(apiResponse);
        setIsAdviceSaved(true);
        alert('บันทึกคำแนะนำเรียบร้อยแล้ว!');
    };

    const handleCopyAdvice = () => {
        navigator.clipboard.writeText(apiResponse);
        alert('คัดลอกคำแนะนำแล้ว!');
    };
    
    const handleDeleteAdvice = () => {
        if (window.confirm('คุณต้องการลบคำแนะนำที่บันทึกไว้ใช่หรือไม่?')) {
            localStorage.removeItem('ikigaiAdvice');
            setSavedAdvice('');
            setModalMode(null);
        }
    };

    const handleViewHistory = () => {
        if (savedAdvice) {
            setApiResponse(savedAdvice);
            setApiError('');
            setIsLoading(false);
            setModalMode('history');
        }
    };

    const handleCloseModal = () => {
        if (modalMode === 'new' && apiResponse && !isAdviceSaved) {
            if (!window.confirm('คุณยังไม่ได้บันทึกคำแนะนำ การเปลี่ยนแปลงจะสูญหาย ยืนยันที่จะปิดหรือไม่?')) {
                return;
            }
        }
        setModalMode(null);
        setApiResponse('');
        setApiError('');
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
            <div className="container mx-auto px-4 py-8 max-w-6xl pt-20">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-primary">
                        ปรัชญาชีวิตของญี่ปุ่น "IKIGAI"
                    </h1>
                    <h2 className="text-xl md:text-2xl text-foreground/70">
                        "เหตุผลของการมีชีวิตอยู่"
                    </h2>
                </header>

                <IkigaiForm 
                    data={ikigaiData} 
                    onDataChange={handleDataChange}
                    onGenerateIntersections={generateIntersections}
                    isGenerating={isGenerating}
                    getAdvice={getAdvice}
                    colors={colors}
                    onColorChange={handleColorChange}
                    savedAdvice={savedAdvice}
                    onViewHistory={handleViewHistory}
                >
                    <IkigaiDiagram data={ikigaiData} colors={colors} />
                </IkigaiForm>
            </div>

            {/* Result Modal */}
            {modalMode && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={handleCloseModal}>
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-foreground/20" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-foreground/20 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-foreground">
                                {modalMode === 'new' ? 'คำแนะนำจาก AI Coach' : 'ประวัติคำแนะนำ'}
                            </h3>
                            <button 
                                onClick={handleCloseModal} 
                                className="text-foreground/60 hover:text-foreground text-3xl leading-none transition-colors p-1 rounded-full hover:bg-black/10"
                                aria-label="Close Modal"
                            >
                                <X size={24} />
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
                            {apiResponse && !isLoading && (
                                <div 
                                    className="prose prose-lg max-w-none leading-relaxed text-foreground [&_strong]:text-primary [&_li]:text-foreground/90" 
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(apiResponse) }} 
                                />
                            )}
                        </div>
                        <div className="p-4 border-t border-foreground/20 flex justify-end items-center gap-3">
                            {modalMode === 'new' && apiResponse && !isLoading && (
                                <>
                                    <button onClick={handleCopyAdvice} className="bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all text-sm">
                                        <Copy size={16} /> คัดลอก
                                    </button>
                                    <button onClick={handleSaveAdvice} className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all text-sm">
                                        <Save size={16} /> บันทึก
                                    </button>
                                </>
                            )}
                            {modalMode === 'history' && (
                                <>
                                    <button onClick={handleCopyAdvice} className="bg-gray-200 dark:bg-background text-foreground hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all text-sm">
                                        <Copy size={16} /> คัดลอก
                                    </button>
                                    <button onClick={handleDeleteAdvice} className="bg-red-500 text-foreground hover:bg-red-600 flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all text-sm">
                                        <Trash2 size={16} /> ลบ
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default IkigaiPage;