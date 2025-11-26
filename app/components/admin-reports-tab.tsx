"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/app/components/ui/table";

type ReportType = "x" | "z" | null;

type HourlyRow = {
    hour: number;
    netSales: number;
};

export default function AdminReportsTab() {
    const [reportDialogOpen, setReportDialogOpen] = React.useState(false);
    const [activeReport, setActiveReport] = React.useState<ReportType>(null);
    const [reportData, setReportData] = React.useState<HourlyRow[] | null>(
        null
    );
    const [reportLoading, setReportLoading] = React.useState(false);
    const [reportError, setReportError] = React.useState<string | null>(null);

    async function fetchXReport() {
        try {
            setReportLoading(true);
            setReportError(null);
            setReportData(null);

            const res = await fetch(
                `/api/reports/x-report?startHour=0&endHour=23`
            );

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to fetch X-report");
            }

            const data = await res.json();

            const normalized: HourlyRow[] = (data ?? []).map(
                (row: { hour: number; netSales: number }) => ({
                    hour: Number(row.hour),
                    netSales: Number(row.netSales) || 0,
                })
            );

            setReportData(normalized);
        } catch (err: unknown) {
            setReportError(
                err instanceof Error ? err.message : "Unknown error"
            );
        } finally {
            setReportLoading(false);
        }
    }

    async function fetchZReport() {
        try {
            setReportLoading(true);
            setReportError(null);
            setReportData(null);

            const res = await fetch(`/api/reports/z-report`);

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to fetch Z-report");
            }

            const data = await res.json();
            const normalized: HourlyRow[] = (data ?? []).map(
                (row: { hour: number; netSales: number }) => ({
                    hour: Number(row.hour),
                    netSales: Number(row.netSales) || 0,
                })
            );
            setReportData(normalized);
        } catch (err: unknown) {
            setReportError(
                err instanceof Error ? err.message : "Unknown error"
            );
        } finally {
            setReportLoading(false);
        }
    }

    function handleOpenXReport() {
        setActiveReport("x");
        setReportDialogOpen(true);
        void fetchXReport();
    }

    function handleOpenZReport() {
        setActiveReport("z");
        setReportDialogOpen(true);
        void fetchZReport();
    }

    return (
        <div className="mt-6">
            <Table aria-label="Reports table">
                <TableCaption className="sr-only">Reports</TableCaption>
                <TableHeader>
                    <TableRow className="space-x-2">
                        <TableHead className="border-none">
                            <Button
                                onClick={handleOpenXReport}
                                className="bg-primary hover:bg-primary/90"
                            >
                                X-Report
                            </Button>
                        </TableHead>
                        <TableHead className="border-none">
                            <Button
                                onClick={handleOpenZReport}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Z-Report
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>{}</TableBody>
            </Table>

            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[70vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {activeReport === "x"
                                ? "X-Report (Hourly Sales)"
                                : activeReport === "z"
                                ? "Z-Report (End-of-Day Summary)"
                                : "Report"}
                        </DialogTitle>
                        <DialogDescription>
                            {activeReport === "x"
                                ? "Sales data for the current day by hour."
                                : activeReport === "z"
                                ? "End-of-day totals and summary."
                                : "Report details."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        {reportLoading && (
                            <p className="text-sm text-muted-foreground">
                                Loading report…
                            </p>
                        )}

                        {reportError && (
                            <p className="text-sm text-red-500">
                                {reportError}
                            </p>
                        )}

                        {!reportLoading &&
                            !reportError &&
                            reportData &&
                            reportData.length > 0 && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Hour</TableHead>
                                            <TableHead className="text-right">
                                                Net Sales ($)
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.map((row) => (
                                            <TableRow key={row.hour}>
                                                <TableCell>
                                                    {row.hour}:00
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {row.netSales.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}

                        {!reportLoading &&
                            !reportError &&
                            reportData &&
                            reportData.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No data for this report.
                                </p>
                            )}

                        {!reportLoading &&
                            !reportError &&
                            !reportData &&
                            activeReport && (
                                <p className="text-sm text-muted-foreground">
                                    No data returned for this report.
                                </p>
                            )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

