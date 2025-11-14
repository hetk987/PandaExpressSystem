import { NextResponse } from "next/server";
import { getHourlySales } from "@/app/services/salesReportService";

export async function GET(request: Request) {
    try {
        // Get current day in YYYY-MM-DD format (local timezone)
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDay = `${year}-${month}-${day}`;
        
        // Z-report is for the full day (0-23) at end of day
        const hourlySales = await getHourlySales(currentDay, 0, 23);
        return NextResponse.json(hourlySales, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch z-report: ' + error }, { status: 500 });
    }
}

