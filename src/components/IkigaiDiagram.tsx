'use client';

import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2 } from 'lucide-react';
import type { IkigaiData } from './IkigaiForm';

// กำหนด Type สำหรับ Props
interface IkigaiDiagramProps {
  data: IkigaiData;
}

const IkigaiDiagram: React.FC<IkigaiDiagramProps> = ({ data }) => {
  const diagramRef = useRef<HTMLDivElement>(null);

  // ฟังก์ชันสำหรับบันทึกแผนภาพเป็นรูปภาพ
  const handleSaveImage = async () => {
    if (!diagramRef.current) return;
    try {
      // ใช้เฉพาะขนาดของ div ที่ล้อม SVG
      const width = diagramRef.current.offsetWidth;
      const height = diagramRef.current.offsetHeight;
      
      const dataUrl = await toPng(diagramRef.current, {
        cacheBust: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#ffffff',
        pixelRatio: 2,
        width,
        height,
        style: {
          transform: 'none',
          width: width + 'px',
          height: height + 'px',
        },
      });
      const link = document.createElement('a');
      link.download = 'ikigai-diagram.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('ไม่สามารถสร้างรูปภาพได้:', err);
    }
  };

  // ฟังก์ชันสำหรับแชร์แผนภาพ (ใช้ Web Share API)
  const handleShare = async () => {
    if (!diagramRef.current) return;
    try {
      // ใช้เฉพาะขนาดของ div ที่ล้อม SVG
      const width = diagramRef.current.offsetWidth;
      const height = diagramRef.current.offsetHeight;
      
      const dataUrl = await toPng(diagramRef.current, {
        cacheBust: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#ffffff',
        pixelRatio: 2,
        width,
        height,
        style: {
          transform: 'none',
          width: width + 'px',
          height: height + 'px',
        },
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'ikigai-diagram.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Ikigai Diagram',
          text: 'นี่คือแผนภาพอิคิไกของฉัน ลองสร้างของคุณเองได้เลย!',
          files: [file],
        });
      } else {
        // Fallback สำหรับเบราว์เซอร์ที่ไม่รองรับ Web Share API
        const link = document.createElement('a');
        link.download = 'ikigai-diagram.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการแชร์:', err);
      alert('ไม่สามารถแชร์รูปภาพได้ในขณะนี้');
    }
  };

  // ฟังก์ชันสำหรับตัดข้อความให้พอดีกับพื้นที่
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  return (
    <section className="w-full flex flex-col items-center">
      {/* ส่วนของแผนภาพ */}
      <div className="flex justify-center items-center w-full mb-8">
        <div 
          ref={diagramRef} 
          className="relative bg-background p-4 sm:p-8 rounded-2xl shadow-lg border border-foreground/10 flex items-center justify-center"
          style={{ 
            width: 'min(800px, 90vw)', 
            height: 'min(800px, 90vw)',
            maxWidth: '800px',
            maxHeight: '800px'
          }}
        >
          {/* SVG Container สำหรับแผนภาพ Ikigai */}
          <svg 
            viewBox="0 0 800 800" 
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <rect width="800" height="800" fill="var(--background)" />
            
            {/* วงกลมที่ 1: สิ่งที่รัก (บน) */}
            <circle 
              cx="400" 
              cy="250" 
              r="180" 
              fill="rgba(59, 130, 246, 0.3)" 
              stroke="rgba(59, 130, 246, 0.6)" 
              strokeWidth="2"
            />
            
            {/* วงกลมที่ 2: สิ่งที่ถนัด (ขวา) */}
            <circle 
              cx="550" 
              cy="400" 
              r="180" 
              fill="rgba(34, 197, 94, 0.3)" 
              stroke="rgba(34, 197, 94, 0.6)" 
              strokeWidth="2"
            />
            
            {/* วงกลมที่ 3: สิ่งที่ทำแล้วมีรายได้ (ล่าง) */}
            <circle 
              cx="400" 
              cy="550" 
              r="180" 
              fill="rgba(239, 68, 68, 0.3)" 
              stroke="rgba(239, 68, 68, 0.6)" 
              strokeWidth="2"
            />
            
            {/* วงกลมที่ 4: สิ่งที่โลกต้องการ (ซ้าย) */}
            <circle 
              cx="250" 
              cy="400" 
              r="180" 
              fill="rgba(245, 158, 11, 0.3)" 
              stroke="rgba(245, 158, 11, 0.6)" 
              strokeWidth="2"
            />

            {/* ข้อความในวงกลมหลัก */}
            {/* สิ่งที่รัก */}
            <text x="400" y="190" textAnchor="middle" className="fill-current text-foreground font-bold text-lg">
              สิ่งที่รัก
            </text>
            <foreignObject x="320" y="200" width="160" height="80">
              <div className="text-center text-sm text-foreground/80 leading-tight p-2">
                {data.love || 'กรุณากรอกข้อมูล'}
              </div>
            </foreignObject>

            {/* สิ่งที่ถนัด */}
            <text x="620" y="350" textAnchor="middle" className="fill-current text-foreground font-bold text-lg">
              สิ่งที่ถนัด
            </text>
            <foreignObject x="540" y="360" width="160" height="80">
              <div className="text-center text-sm text-foreground/80 leading-tight p-2">
                {data.goodAt || 'กรุณากรอกข้อมูล'}
              </div>
            </foreignObject>

            {/* สิ่งที่ทำแล้วมีรายได้ */}
            <text x="400" y="620" textAnchor="middle" className="fill-current text-foreground font-bold text-lg">
              สิ่งที่ทำแล้วมีรายได้
            </text>
            <foreignObject x="320" y="530" width="160" height="80">
              <div className="text-center text-sm text-foreground/80 leading-tight p-2">
                {data.paidFor || 'กรุณากรอกข้อมูล'}
              </div>
            </foreignObject>

            {/* สิ่งที่โลกต้องการ */}
            <text x="180" y="350" textAnchor="middle" className="fill-current text-foreground font-bold text-lg">
              สิ่งที่โลกต้องการ
            </text>
            <foreignObject x="100" y="360" width="160" height="80">
              <div className="text-center text-sm text-foreground/80 leading-tight p-2">
                {data.worldNeeds || 'กรุณากรอกข้อมูล'}
              </div>
            </foreignObject>

            {/* ข้อความในส่วนที่ทับซ้อน */}
            {/* Passion (รัก + ถนัด) */}
            <text x="475" y="310" textAnchor="middle" className="fill-current text-primary font-bold text-base">
              Passion
            </text>
            <foreignObject x="410" y="315" width="130" height="60">
              <div className="text-center text-xs text-foreground/70 leading-tight">
                {data.passion || 'รัก + ถนัด'}
              </div>
            </foreignObject>

            {/* Profession (ถนัด + รายได้) */}
            <text x="475" y="480" textAnchor="middle" className="fill-current text-primary font-bold text-base">
              Profession
            </text>
            <foreignObject x="410" y="485" width="130" height="60">
              <div className="text-center text-xs text-foreground/70 leading-tight">
                {data.profession || 'ถนัด + รายได้'}
              </div>
            </foreignObject>

            {/* Vocation (รายได้ + โลกต้องการ) */}
            <text x="325" y="480" textAnchor="middle" className="fill-current text-primary font-bold text-base">
              Vocation
            </text>
            <foreignObject x="260" y="485" width="130" height="60">
              <div className="text-center text-xs text-foreground/70 leading-tight">
                {data.vocation || 'รายได้ + โลกต้องการ'}
              </div>
            </foreignObject>

            {/* Mission (โลกต้องการ + รัก) */}
            <text x="325" y="310" textAnchor="middle" className="fill-current text-primary font-bold text-base">
              Mission
            </text>
            <foreignObject x="260" y="315" width="130" height="60">
              <div className="text-center text-xs text-foreground/70 leading-tight">
                {data.mission || 'โลกต้องการ + รัก'}
              </div>
            </foreignObject>

            {/* จุดศูนย์กลาง - Ikigai */}
            <circle cx="400" cy="400" r="80" fill="var(--primary)" opacity="0.9" />
            <text x="400" y="390" textAnchor="middle" className="fill-current text-primary-foreground font-bold text-2xl">
              IKIGAI
            </text>
            <text x="400" y="410" textAnchor="middle" className="fill-current text-primary-foreground text-sm">
              อิคิไก
            </text>

            {/* เส้นโค้งและลูกศร */}
            {/* ลูกศรจาก Passion */}
            <path d="M 475 280 Q 520 260 560 240" stroke="var(--primary)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            
            {/* ลูกศรจาก Profession */}
            <path d="M 520 480 Q 560 500 600 520" stroke="var(--primary)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            
            {/* ลูกศรจาก Vocation */}
            <path d="M 280 520 Q 240 540 200 560" stroke="var(--primary)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
            
            {/* ลูกศรจาก Mission */}
            <path d="M 280 280 Q 240 260 200 240" stroke="var(--primary)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />

            {/* Arrow marker definition */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--primary)" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* ปุ่มควบคุม */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={handleSaveImage}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          <Download size={18} />
          บันทึกเป็นรูปภาพ
        </button>
        <button
          onClick={handleShare}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          <Share2 size={18} />
          แชร์
        </button>
      </div>
    </section>
  );
};

export default IkigaiDiagram;