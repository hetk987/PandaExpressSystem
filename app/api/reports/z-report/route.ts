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

export async function POST(request: Request) {
    try {
        // Get current day in YYYY-MM-DD format (local timezone)
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDay = `${year}-${month}-${day}`;
        
        // Z-report reset functionality
        // In traditional POS systems, this marks the end of the business day
        // The "reset" is conceptual - it doesn't delete data, but marks the transition
        // between days. The next day's reports will naturally show new data due to date filtering.
        
        // NOTE: If audit tracking is needed, create a z_report_runs table with:
        // - id (primary key)
        // - report_date (date)
        // - run_timestamp (timestamp)
        // - run_by (employee_id)
        // Then insert a record here to track when Z-reports were executed.
        
        console.log(`Z-Report reset triggered for ${currentDay} at ${new Date().toISOString()}`);
        
        return NextResponse.json({ 
            success: true, 
            message: 'Z-Report reset completed',
            date: currentDay,
            timestamp: new Date().toISOString()
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            error: 'Failed to reset z-report: ' + error 
        }, { status: 500 });
    }
}

