import { NextResponse } from "next/server";
import Replicate from "replicate";

// Initialize the Replicate client with API token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  console.log("checking the REPLICATE_API_TOKEN:", process.env.REPLICATE_API_TOKEN);
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "REPLICATE_API_TOKEN is not configured"
      },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Using the latest SDXL model
    const output = await replicate.run(
      "stability-ai/stable-diffusion-3.5-large",
      {
        input: {
          aspect_ratio: "1:1",
          cfg: 3.5,
          output_format: "png",
          output_quality: 90,
          prompt,
          prompt_strength: 0.85,
          steps: 35,
        }
      }
    );

    // The output will be an array with the image URL
    if (!output || (Array.isArray(output) && output.length === 0)) {
      throw new Error("No output received from Replicate");
    }

    // If output is an array, take the first item, otherwise use the output as is
    const imageUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error from Replicate:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image" },
      { status: 500 }
    );
  }
}
