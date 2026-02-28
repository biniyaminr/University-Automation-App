import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Convert the File to a Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse the PDF buffer using pdf-parse v2 API
        const { PDFParse } = require('pdf-parse');
        const parser = new PDFParse({ data: buffer });

        const data = await parser.getText();
        await parser.destroy();

        // Return the extracted text
        return NextResponse.json({ text: data.text }, { status: 200 });

    } catch (error: any) {
        console.error("PDF Parsing Error:", error);
        return NextResponse.json({ error: "Failed to parse PDF", details: error.message || error.toString() }, { status: 500 });
    }
}
