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

            const prompt = `You are an ai chat bot, who helps people in giving code and solve their problems. your response will directly be shown in the text, so give the response like a chat and your request is this: ${message}`;

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
