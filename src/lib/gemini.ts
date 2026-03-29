import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const SYSTEM_PROMPT = `
You are a semantic file editor. You receive a file's content and a request.
Instead of rewriting the file, you must output a JSON array of "patches".
Format: 
[
  { "op": "replace", "find": "old text", "replace": "new text" },
  { "op": "insert", "after": "specific line text", "content": "new text" }
]
Only return the JSON. No conversational text.
`;

export async function getSemanticPatch(fileName: string, content: string, userPrompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `File: ${fileName}\nContent: ${content}\n\nTask: ${userPrompt}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            op: { type: Type.STRING, enum: ["replace", "insert"] },
            find: { type: Type.STRING },
            replace: { type: Type.STRING },
            after: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["op"]
        }
      }
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export function applyPatch(originalContent: string, patches: any[]) {
  let updatedContent = originalContent;
  patches.forEach(patch => {
    if (patch.op === 'replace') {
      // Simple string replacement (can be improved with regex or diff-match-patch)
      updatedContent = updatedContent.split(patch.find).join(patch.replace);
    } else if (patch.op === 'insert') {
      const index = updatedContent.indexOf(patch.after);
      if (index !== -1) {
        const insertPos = index + patch.after.length;
        updatedContent = updatedContent.slice(0, insertPos) + "\n" + patch.content + updatedContent.slice(insertPos);
      }
    }
  });
  return updatedContent;
}
