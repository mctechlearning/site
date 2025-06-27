"use server";

import {
  generateLangflowJson,
} from "@/ai/flows/generate-langflow-json-from-chat";
import {
  refineLangflowFlowFromChat,
} from "@/ai/flows/refine-langflow-flow-from-chat";
import {
  suggestLangflowImprovements,
} from "@/ai/flows/suggest-langflow-improvements";

// Check if the Gemini API key is set in the environment variables
export async function isApiKeySet(): Promise<boolean> {
  return !!process.env.GOOGLE_API_KEY;
}

// Handle incoming chat messages
export async function handleChatMessage(
  chatHistory: string,
  currentJson: string
): Promise<{ json?: string; error?: string }> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set in the environment.");
    }

    let resultJson: string;

    if (!currentJson) {
      // If no JSON exists, generate a new one
      const result = await generateLangflowJson({ chatHistory });
      resultJson = result.langflowJson;
    } else {
      // If JSON exists, refine it based on the new chat message
      const result = await refineLangflowFlowFromChat({
        flowJson: currentJson,
        chatHistory,
      });
      resultJson = result.refinedFlowJson;
    }

    // Validate the generated JSON
    JSON.parse(resultJson);
    return { json: resultJson };
  } catch (error: any) {
    console.error("Error handling chat message:", error);
    if (error instanceof SyntaxError) {
      return { error: "The generated flow is not valid JSON. Please try again." };
    }
    return { error: error.message || "An unknown error occurred." };
  }
}

// Suggest improvements for the current flow
export async function handleSuggestImprovements(
  langflowJson: string,
  instructions: string
): Promise<{ improvedJson?: string; explanation?: string; error?: string }> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set in the environment.");
    }
    
    const result = await suggestLangflowImprovements({
      langflowJson,
      instructions,
    });
    
    // Validate the improved JSON
    JSON.parse(result.improvedLangflowJson);

    return {
      improvedJson: result.improvedLangflowJson,
      explanation: result.explanation,
    };
  } catch (error: any) {
    console.error("Error suggesting improvements:", error);
     if (error instanceof SyntaxError) {
      return { error: "The improved flow is not valid JSON. Please try again." };
    }
    return { error: error.message || "An unknown error occurred." };
  }
}

// Send the generated flow to the Langflow API
export async function sendToLangflow(
  flowJson: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const parsedFlow = JSON.parse(flowJson);
    const flowName = parsedFlow?.data?.name || `FlowCraft-${Date.now()}`;

    // Langflow's API to create/update a flow is via POST to /api/v1/flows/
    const response = await fetch("http://127.0.0.1:7860/api/v1/flows/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedFlow),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Langflow API Error (${response.status}): ${
          errorData.detail || "Unknown error"
        }`
      );
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error sending to Langflow:", error);
    if (error.message.includes('ECONNREFUSED')) {
        return { success: false, error: 'Connection refused. Is your local Langflow instance running at http://127.0.0.1:7860?' };
    }
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}
