import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const POST =async (request : Request)=>{
        try {
            const url = new URL(request.url);
            const message = url.searchParams.get("message");
            if (!message) {
                return NextResponse.json({ error: "Message is required" }, { status: 400 });
            }

            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

            const prompt = `You are an expert AI coding assistant who helps developers solve programming problems, debug code, and learn best practices. You communicate in a friendly, conversational tone like a helpful colleague.
                    When analyzing code, you:
                    1. Quickly assess what the code does
                    2. Identify issues, bugs, or improvements needed
                    3. Explain solutions clearly with working examples
                    4. Suggest best practices and optimizations
                    5. Encourage learning and understanding

                    Your responses should be:
                    - Conversational and friendly
                    - Clear and actionable
                    - Include code examples when helpful
                    - Focus on both fixing issues and teaching concepts
                    - short and concise 
                    - don't use any markdown notations except for when you write code.
                
                    context: User's question: ${message}

                    Respond as if you're having a friendly chat with a fellow developer who needs your help.`;

            const response = await ai.models.generateContent({
              model: "gemini-1.5-flash",
              contents: prompt,
            });

            console.log(response.text);
            const aiResponse = response.text;

            return NextResponse.json({ aiResponse }, { status: 200 });
            
        } catch (error) {
            console.error("Gemini API Error:", error);
            return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
        }
}
