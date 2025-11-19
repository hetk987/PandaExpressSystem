import db from "@/drizzle/src/index";
import { orders } from "@/drizzle/src/db/schema";
import { sum, sql, and, gte, lt } from "drizzle-orm";

export const getSalesReport = async (startDate, endDate) => {
    // Convert dates to match Java behavior: start at start of day, end at start of next day
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);

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
                gte(orders.orderTime, start.toISOString()),
                lt(orders.orderTime, end.toISOString())
            )
        );
    return salesReport;
};

export const getHourlySalesReport = async (startDate, endDate) => {
    const hourlySalesReport = await db
        .select({
            hour: sql`EXTRACT(HOUR FROM ${orders.orderTime}::timestamp)`.as(
                "hour"
            ),
            netSales: sum(orders.totalCost),
        })
        .from(orders)
        .where(
            and(gte(orders.orderTime, startDate), lt(orders.orderTime, endDate))
        )
        .groupBy(sql`EXTRACT(HOUR FROM ${orders.orderTime}::timestamp)`);
    return hourlySalesReport;
};

export const getHourlySales = async (day, startHour, endHour) => {
    // Build time window: [day@startHour, day@(endHour+1))  (end-exclusive)
    const startDate = new Date(day);
    startDate.setHours(startHour, 0, 0, 0);

    const endDate = new Date(day);
    if (endHour === 23) {
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);
    } else {
        endDate.setHours(endHour + 1, 0, 0, 0);
    }

    const hourlySalesData = await db
        .select({
            hour: sql`EXTRACT(HOUR FROM ${orders.orderTime}::timestamp)`.as(
                "hour"
            ),
            netSales: sum(orders.totalCost),
        })
        .from(orders)
        .where(
            and(
                gte(orders.orderTime, startDate.toISOString()),
                lt(orders.orderTime, endDate.toISOString())
            )
        )
        .groupBy(sql`EXTRACT(HOUR FROM ${orders.orderTime}::timestamp)`);

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
