'use client';

import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2 } from 'lucide-react';
import type { IkigaiData } from './IkigaiForm';

// กำหนด Type สำหรับ Props
interface IkigaiDiagramProps {
  data: IkigaiData;
  colors?: { love: string; goodAt: string; paidFor: string; worldNeeds: string; };
}

const IkigaiDiagram: React.FC<IkigaiDiagramProps> = ({ data, colors }) => {
  const diagramRef = useRef<HTMLDivElement>(null);

  // ฟังก์ชันสำหรับบันทึกแผนภาพเป็นรูปภาพ
  const handleSaveImage = async () => {
    if (!diagramRef.current) return;
    try {
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

  // ฟังก์ชันสำหรับแชร์แผนภาพ
  const handleShare = async () => {
    if (!diagramRef.current) return;
    try {
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

  return (
    <section className="w-full flex flex-col items-center">
      {/* ส่วนของแผนภาพ */}
      <div className="flex justify-center items-center w-full mb-8">
        <div 
          ref={diagramRef} 
          className="relative bg-background p-4 sm:p-8 rounded-2xl shadow-lg border border-foreground/10 flex items-center justify-center"
          style={{ 
            width: 'min(900px, 95vw)', 
            height: 'min(900px, 95vw)',
            maxWidth: '900px',
            maxHeight: '900px'
          }}
        >
          {/* SVG Container สำหรับแผนภาพ Ikigai */}
          <svg 
            viewBox="0 0 900 900" 
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <rect width="900" height="900" fill="var(--background)" />
            
            {/* วงกลมที่ 1: สิ่งที่รัก (บน) */}
            <circle 
              cx="450" 
              cy="300" 
              r="190" 
              fill={colors?.love || 'var(--primary)'}
              fillOpacity="0.2"
              stroke={colors?.love || 'var(--primary)'}
              strokeWidth="2"
            />
            
            {/* วงกลมที่ 2: สิ่งที่ถนัด (ซ้าย) */}
            <circle 
              cx="300" 
              cy="450" 
              r="190" 
              fill={colors?.goodAt || 'var(--secondary)'}
              fillOpacity="0.2"
              stroke={colors?.goodAt || 'var(--secondary)'}
              strokeWidth="2"
            />
            
            {/* วงกลมที่ 3: สิ่งที่ทำแล้วมีรายได้ (ล่าง) */}
            <circle 
              cx="450" 
              cy="600" 
              r="190" 
              fill={colors?.paidFor || 'var(--primary)'}
              fillOpacity="0.15"
              stroke={colors?.paidFor || 'var(--primary)'}
              strokeWidth="2"
            />
            
            {/* วงกลมที่ 4: สิ่งที่โลกต้องการ (ขวา) */}
            <circle 
              cx="600" 
              cy="450" 
              r="190" 
              fill={colors?.worldNeeds || 'var(--secondary)'}
              fillOpacity="0.15"
              stroke={colors?.worldNeeds || 'var(--secondary)'}
              strokeWidth="2"
            />

            {/* ข้อความในวงกลมหลัก */}
            {/* สิ่งที่รัก (บน) */}
            <text x="450" y="210" textAnchor="middle" className="fill-current text-foreground font-bold text-lg">
              สิ่งที่รัก
            </text>
            <foreignObject x="370" y="220" width="160" height="80">
              <div className="text-center text-sm text-foreground/80 leading-tight p-2">
                {data.love || 'กรุณากรอกข้อมูล'}
              </div>
            </foreignObject>

            {/* สิ่งที่ถนัด (ซ้าย) */}
            <text x="210" y="400" textAnchor="middle" className="fill-current text-foreground font-bold text-lg">
              สิ่งที่ถนัด
            </text>
            <foreignObject x="130" y="410" width="160" height="80">
              <div className="text-center text-sm text-foreground/80 leading-tight p-2">
                {data.goodAt || 'กรุณากรอกข้อมูล'}
              </div>
            </foreignObject>

            {/* สิ่งที่ทำแล้วมีรายได้ (ล่าง) */}
            <text x="450" y="670" textAnchor="middle" className="fill-current text-foreground font-bold text-lg">
              สิ่งที่ทำแล้วมีรายได้
            </text>
            <foreignObject x="370" y="680" width="160" height="80">
              <div className="text-center text-sm text-foreground/80 leading-tight p-2">
                {data.paidFor || 'กรุณากรอกข้อมูล'}
              </div>
            </foreignObject>

            {/* สิ่งที่โลกต้องการ (ขวา) */}
            <text x="690" y="400" textAnchor="middle" className="fill-current text-foreground font-bold text-lg">
              สิ่งที่โลกต้องการ
            </text>
            <foreignObject x="610" y="410" width="160" height="80">
              <div className="text-center text-sm text-foreground/80 leading-tight p-2">
                {data.worldNeeds || 'กรุณากรอกข้อมูล'}
              </div>
            </foreignObject>

            {/* ข้อความในส่วนที่ทับซ้อน (Secondary Intersections) */}
            {/* Passion (รัก + ถนัด) - บนซ้าย */}
            <text x="365" y="350" textAnchor="middle" className="fill-current text-primary font-bold text-base">
              Passion
            </text>
            <foreignObject x="300" y="355" width="130" height="60">
              <div className="text-center text-xs text-foreground/70 leading-tight">
                {data.passion || 'รัก + ถนัด'}
              </div>
            </foreignObject>

            {/* Mission (รัก + โลกต้องการ) - บนขวา */}
            <text x="535" y="350" textAnchor="middle" className="fill-current text-primary font-bold text-base">
              Mission
            </text>
            <foreignObject x="470" y="355" width="130" height="60">
              <div className="text-center text-xs text-foreground/70 leading-tight">
                {data.mission || 'รัก + โลกต้องการ'}
              </div>
            </foreignObject>

            {/* Profession (ถนัด + รายได้) - ล่างซ้าย */}
            <text x="365" y="540" textAnchor="middle" className="fill-current text-primary font-bold text-base">
              Profession
            </text>
            <foreignObject x="300" y="545" width="130" height="60">
              <div className="text-center text-xs text-foreground/70 leading-tight">
                {data.profession || 'ถนัด + รายได้'}
              </div>
            </foreignObject>

            {/* Vocation (รายได้ + โลกต้องการ) - ล่างขวา */}
            <text x="535" y="540" textAnchor="middle" className="fill-current text-primary font-bold text-base">
              Vocation
            </text>
            <foreignObject x="470" y="545" width="130" height="60">
              <div className="text-center text-xs text-foreground/70 leading-tight">
                {data.vocation || 'รายได้ + โลกต้องการ'}
              </div>
            </foreignObject>

            {/* Tertiary Intersections - เส้นและป้ายชื่อภายนอก */}
            
            {/* 1. รัก + ถนัด + รายได้ (บนซ้าย) */}
            <path 
              d="M 520 500 Q 440 490 380 300" 
              stroke="var(--foreground)" 
              strokeWidth="1" 
              fill="none" 
              strokeDasharray="2,2"
              transform="translate(-160, -50)"
            />
            <foreignObject x="120" y="220" width="160" height="40">
              <div className="text-xs text-foreground/80 leading-tight">
                พอใจในชีวิต แต่รู้สึกว่าชีวิตไร้ความหมาย
              </div>
            </foreignObject>

            {/* 2. รัก + ถนัด + โลกต้องการ (บนขวา) */}
            <path 
              d="M 450 420 Q 490 320 650 300" 
              stroke="var(--foreground)" 
              strokeWidth="1" 
              fill="none" 
              strokeDasharray="2,2"
              transform="translate(0, -60)"
            />
            <foreignObject x="660" y="220" width="160" height="40">
              <div className="text-xs text-foreground/80 leading-tight">
                เต็มไปด้วยความสุข หากแต่ไม่มีความมั่นคง
              </div>
            </foreignObject>

            {/* 3. รัก + รายได้ + โลกต้องการ (ล่างขวา) */}
            <path 
              d="M 480 450 Q 550 440 620 640" 
              stroke="var(--foreground)" 
              strokeWidth="1" 
              fill="none" 
              strokeDasharray="2,2"
              transform="translate(60, 0)"
            />
            <foreignObject x="660" y="660" width="160" height="40">
              <div className="text-xs text-foreground/80 leading-tight">
                มีความอิ่มเอม ตื่นเต้น หากแต่รู้สึกไม่แน่นอน
              </div>
            </foreignObject>

            {/* 4. ถนัด + รายได้ + โลกต้องการ (ล่างซ้าย) */}
            <path 
              d="M 450 480 Q 440 600 250 600" 
              stroke="var(--foreground)" 
              strokeWidth="1" 
              fill="none" 
              strokeDasharray="2,2"
              transform="translate(0, 50)"
            />
            <foreignObject x="110" y="660" width="160" height="40">
              <div className="text-xs text-foreground/80 leading-tight">
                มีชีวิตที่สะดวกสบาย หากแต่รู้สึกว่างเปล่า
              </div>
            </foreignObject>

            {/* จุดศูนย์กลาง - Ikigai */}
            <circle cx="450" cy="450" r="45" fill="var(--primary)" opacity="0.5" />
            <text x="450" y="444" textAnchor="middle" className="fill-current text-primary-foreground font-bold text-2xl">
              IKIGAI
            </text>
            <text x="450" y="468" textAnchor="middle" className="fill-current text-primary-foreground text-sm">
              อิคิไก
            </text>
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