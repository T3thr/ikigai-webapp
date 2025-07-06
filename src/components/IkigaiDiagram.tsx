'use client';

import React, { useRef } from 'react';
import type { IkigaiData } from './IkigaiForm';
import html2canvas from 'html2canvas';
import { Download, Share2 } from 'lucide-react';

interface Props {
  data: IkigaiData;
}

// A reusable component for the main circles
const Circle = ({ title, content, position, color }: { title: string, content: string, position: string, color: string }) => (
    <div className={`absolute ${position} w-[56%] h-[56%] rounded-full ${color} flex items-center justify-center text-center text-white mix-blend-multiply dark:mix-blend-lighten filter brightness-110 dark:brightness-100 opacity-80 dark:opacity-70`}>
        <div className="p-4">
            <h3 className="font-bold text-sm sm:text-base md:text-lg">{title}</h3>
            <p className="text-xs sm:text-sm md:text-base leading-tight break-words">{content}</p>
        </div>
    </div>
);

// A reusable component for the intersection labels
const Intersection = ({ title, content, position, color }: { title: string, content: string, position: string, color: string }) => (
    <div className={`absolute ${position} text-center`}>
        <h4 className={`font-bold text-xs sm:text-sm md:text-base ${color}`}>{title}</h4>
        <p className="text-2xs sm:text-xs md:text-sm leading-tight max-w-[10ch] sm:max-w-[15ch] break-words">{content}</p>
    </div>
);

// A reusable component for the outer 'imbalance' labels
const ImbalanceLabel = ({ content, position }: { content: string, position: string }) => (
    <div className={`absolute ${position} text-center text-gray-500 dark:text-gray-400 text-2xs sm:text-xs md:text-sm leading-tight max-w-[15ch] sm:max-w-[20ch]`}>
        {content}
    </div>
);


const IkigaiDiagram: React.FC<Props> = ({ data }) => {
    const diagramRef = useRef<HTMLDivElement>(null);

    const handleExport = async (action: 'save' | 'share') => {
        if (!diagramRef.current) return;
    
        const elementToCapture = diagramRef.current;
        const originalBg = elementToCapture.style.backgroundColor;
        
        // Temporarily set a solid background for capture
        const isDarkMode = document.documentElement.classList.contains('dark');
        elementToCapture.style.backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';

        try {
            const canvas = await html2canvas(elementToCapture, {
                scale: 2.5,
                useCORS: true,
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                onclone: (document) => {
                    // This ensures mix-blend-mode works correctly on the cloned element for capture
                    const clonedElement = document.querySelector('.diagram-capture-area');
                    if(clonedElement) {
                        (clonedElement as HTMLElement).style.backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
                    }
                }
            });
    
            elementToCapture.style.backgroundColor = originalBg;
    
            if (action === 'save') {
                const link = document.createElement('a');
                link.download = 'ikigai-diagram.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            } else if (action === 'share' && navigator.share) {
                canvas.toBlob(async (blob) => {
                    if (!blob) return;
                    try {
                        await navigator.share({
                            title: 'My Ikigai',
                            text: 'Here is my Ikigai diagram, created with the Ikigai AI Coach.',
                            files: [new File([blob], 'ikigai-diagram.png', { type: 'image/png' })],
                        });
                    } catch (error) {
                        console.error('Sharing failed', error);
                        alert('Could not share the image.');
                    }
                }, 'image/png');
            } else if (action === 'share') {
                alert("Sharing is not supported on this browser. Please save the image and share it manually.");
            }
        } catch (error) {
            console.error('Failed to capture diagram:', error);
            elementToCapture.style.backgroundColor = originalBg;
        }
    };

    return (
        <div className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto flex flex-col items-center">
             <div ref={diagramRef} className="diagram-capture-area w-full p-4 sm:p-6 md:p-8 bg-background transition-colors duration-300">
                <div className="relative aspect-square">
                    {/* Imbalance Labels */}
                    <ImbalanceLabel content="พอใจในชีวิต แต่รู้สึกว่าชีวิตไร้ความหมาย" position="top-[2%] left-[-10%] sm:left-[-5%] -translate-x-1/2" />
                    <ImbalanceLabel content="เต็มไปด้วยความสุข แต่ไม่มีความมั่นคงทางการเงิน" position="top-[2%] right-[-10%] sm:right-[-5%] translate-x-1/2" />
                    <ImbalanceLabel content="มีชีวิตที่สะดวกสบาย แต่รู้สึกว่างเปล่า" position="bottom-[2%] left-[-10%] sm:left-[-5%] -translate-x-1/2" />
                    <ImbalanceLabel content="มีความตื่นเต้นในการใช้ชีวิต แต่รู้สึกถึงความไม่แน่นอน" position="bottom-[2%] right-[-10%] sm:right-[-5%] translate-x-1/2" />

                    {/* Main Circles */}
                    <Circle title="สิ่งที่รัก" content={data.love} position="top-0 left-1/2 -translate-x-1/2" color="bg-cyan-500" />
                    <Circle title="สิ่งที่โลกต้องการ" content={data.worldNeeds} position="top-1/2 right-0 -translate-y-1/2" color="bg-blue-500" />
                    <Circle title="สิ่งที่ทำแล้วมีรายได้" content={data.paidFor} position="bottom-0 left-1/2 -translate-x-1/2" color="bg-indigo-500" />
                    <Circle title="สิ่งที่ถนัด" content={data.goodAt} position="top-1/2 left-0 -translate-y-1/2" color="bg-sky-500" />

                    {/* Intersections */}
                    <Intersection title="Mission" content={data.mission} position="top-[25%] right-[25%] translate-x-1/2 -translate-y-1/2" color="text-blue-800 dark:text-blue-300" />
                    <Intersection title="Passion" content={data.passion} position="top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2" color="text-sky-800 dark:text-sky-300" />
                    <Intersection title="Profession" content={data.profession} position="bottom-[25%] left-[25%] -translate-x-1/2 translate-y-1/2" color="text-indigo-800 dark:text-indigo-300" />
                    <Intersection title="Vocation" content={data.vocation} position="bottom-[25%] right-[25%] translate-x-1/2 translate-y-1/2" color="text-purple-800 dark:text-purple-300" />
                    
                    {/* Center Ikigai */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                        <div className="text-center">
                            <h3 className="text-lg sm:text-2xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                                Ikigai
                            </h3>
                            <p className="text-2xs sm:text-xs md:text-sm text-gray-600 dark:text-gray-300">คุณค่าในการมีชีวิต</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
                 <button onClick={() => handleExport('save')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <Download size={20} />
                    <span>Save as PNG</span>
                </button>
                <button onClick={() => handleExport('share')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <Share2 size={20} />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
};

export default IkigaiDiagram;