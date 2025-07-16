// src/app/api/gemini/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { GenerationConfig } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  const { prompt, isJsonMode } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const generationConfig: GenerationConfig = isJsonMode 
      ? { responseMimeType: "application/json" } // Adjust property names as per the actual type definition
      : {};

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash-latest',
      generationConfig,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: `Error calling Gemini API: ${error.message}` },
      { status: 500 }
    );
  }
} 