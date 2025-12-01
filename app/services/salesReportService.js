import db from "@/drizzle/src/index";
import { orders } from "@/drizzle/src/db/schema";
import { sum, sql, and, gte, lte, eq } from "drizzle-orm";

export const getSalesReport = async (startDate, endDate) => {
    // Convert dates: start at beginning of start day, end at end of end day (inclusive)
    // Parse as UTC to match database timestamps
    const start = new Date(startDate + "T00:00:00.000Z");
    const end = new Date(endDate + "T23:59:59.999Z");

    const salesReport = await db
        .select({
            profit: sum(orders.totalCost),
            totalTax: sum(orders.tax),
            totalProfit: sql`SUM(${orders.totalCost}) + SUM(${orders.tax})`.as(
                "totalProfit"
            ),
        })
        .from(orders)
        .where(
            and(
                eq(orders.isCompleted, true),
                gte(orders.orderTime, start.toISOString()),
                lte(orders.orderTime, end.toISOString())
            )
        );
    return salesReport;
};

export const getHourlySalesReport = async (startDate, endDate) => {
    const hourlySalesReport = await db
        .select({
            hour: sql`EXTRACT(HOUR FROM (${orders.orderTime}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago'))`.as(
                "hour"
            ),
            netSales: sum(orders.totalCost),
        })
        .from(orders)
        .where(
            and(
                eq(orders.isCompleted, true),
                gte(orders.orderTime, startDate),
                lte(orders.orderTime, endDate)
            )
        )
        .groupBy(
            sql`EXTRACT(HOUR FROM (${orders.orderTime}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago'))`
        );
    return hourlySalesReport;
};

export const getHourlySales = async (day, startHour, endHour) => {
    // Build time window: [day@startHour, day@(endHour+1))  (end-exclusive)
    // Parse as UTC date by adding 'T00:00:00Z' suffix
    const startDate = new Date(day + "T00:00:00Z");
    // Use UTC methods to set the hour
    startDate.setUTCHours(startHour, 0, 0, 0);

    const endDate = new Date(day + "T00:00:00Z");
    if (endHour === 23) {
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        endDate.setUTCHours(0, 0, 0, 0);
    } else {
        endDate.setUTCHours(endHour + 1, 0, 0, 0);
    }

    const hourlySalesData = await db
        .select({
            hour: sql`EXTRACT(HOUR FROM (${orders.orderTime}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago'))`.as(
                "hour"
            ),
            netSales: sum(orders.totalCost),
        })
        .from(orders)
        .where(
            and(
                eq(orders.isCompleted, true),
                gte(orders.orderTime, startDate.toISOString()),
                lte(orders.orderTime, endDate.toISOString())
            )
        )
        .groupBy(
            sql`EXTRACT(HOUR FROM (${orders.orderTime}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago'))`
        );

    // Collect into a map so we can zero-fill missing hours
    const byHour = new Map();
    hourlySalesData.forEach((row) => {
        byHour.set(parseInt(row.hour), parseFloat(row.netSales) || 0);
    });

    // Zero-fill missing hours in the range
    const hourly = [];
    for (let h = startHour; h <= endHour; h++) {
        const sales = byHour.get(h) || 0.0;
        hourly.push({ hour: h, netSales: sales });
    }

    return hourly;
};
