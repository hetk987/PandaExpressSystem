'use client';
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

export default function AdminTabsCard() {
    return (
        <div className="min-h-screen w-full bg-background flex items-start justify-center p-6 md:p-10">
            <Card className="w-full max-w-[1600px] rounded-2xl shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl">Dashboard</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                    <Tabs defaultValue="reports" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="reports">Reports</TabsTrigger>
                            <TabsTrigger value="employees">Manage Employees</TabsTrigger>
                            <TabsTrigger value="inventory">Buy Inventory</TabsTrigger>
                            <TabsTrigger value="recipes">Create Recipes</TabsTrigger>
                        </TabsList>

                        {/* REPORTS */}
                        <TabsContent value="reports" className="mt-6">
                            <Table aria-label="Reports table">
                                <TableCaption className="sr-only">Reports</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        {/* TODO: */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* TODO: */}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        {/* MANAGE EMPLOYEES */}
                        <TabsContent value="employees" className="mt-6">
                            <Table aria-label="Employees table">
                                <TableCaption className="sr-only">Manage Employees</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        {/* TODO: */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* TODO: */}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        {/* BUY INVENTORY */}
                        <TabsContent value="inventory" className="mt-6">
                            <Table aria-label="Inventory table">
                                <TableCaption className="sr-only">Buy Inventory</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        {/* TODO: */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* TODO: */}
                                </TableBody>
                            </Table>
                        </TabsContent>

                        {/* CREATE RECIPES */}
                        <TabsContent value="recipes" className="mt-6">
                            <Table aria-label="Recipes table">
                                <TableCaption className="sr-only">Create Recipes</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        {/* TODO: */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* TODO: */}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
