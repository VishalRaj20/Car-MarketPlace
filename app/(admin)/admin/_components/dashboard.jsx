"use client";

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Car, CheckCircle, Clock, DollarSign, Info, TrendingUp, XCircle } from 'lucide-react';
import React, { useState } from 'react'

const DashBoard = ({ initialData }) => {

    const [activeTab, setActiveTab] = useState("overview");

    if (initialData?.data || initialData?.data?.success) {
        <Alert variant="destructive">
            <Info className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {initialData?.error || "Failed to loadd dashboard data"}
            </AlertDescription>
        </Alert>
    }
    
    const { cars, testDrives } = initialData.data;
    return (
        <div>
            <div>
                <Tabs defaultValue="overview"
                    value={activeTab}
                    onValueChange={setActiveTab}
                >
                    <TabsList>
                        <TabsTrigger value="overview" className="font-bold p-2">Overview</TabsTrigger>
                        <TabsTrigger value="test-drives" className="font-bold p-2">Test Drives</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-6 mt-4">
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                            <Card className="transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-md font-medium">Total cars</CardTitle>
                                    <Car className='h-5 w-5 text-muted-foreground' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>{cars.total}</div>
                                    <p className='text-sm text-muted-foreground'>{cars.available} available, {cars.sold} sold</p>
                                </CardContent>
                            </Card>
                            <Card className="transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-md font-medium">Test Drives</CardTitle>
                                    <Calendar className='h-5 w-5 text-muted-foreground' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>{testDrives.total}</div>
                                    <p className='text-sm text-muted-foreground'>{testDrives.pending} pending, {testDrives.confirmed} confirmed {testDrives.cancelled} cancelled</p>
                                </CardContent>
                            </Card>
                            <Card className="transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-md font-medium">Coversion Rate</CardTitle>
                                    <TrendingUp className='h-5 w-5 text-muted-foreground' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>{testDrives.conversionRate}%</div>
                                    <p className='text-sm text-muted-foreground'>From test drives to sales</p>
                                </CardContent>
                            </Card>
                            <Card className="transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-md font-medium">Cars Sold</CardTitle>
                                    <DollarSign className='h-5 w-5 text-muted-foreground' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>{cars.sold}</div>
                                    <p className='text-sm text-muted-foreground'>
                                        {((cars.sold / cars.total) * 100).toFixed(1)}% of inventory
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle>DealerShip Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='bg-gray-50 p-4 rounded-lg transition-shadow duration-300 hover:shadow-lg'>
                                            <h3 className='font-medium text-sm mb-2'>Car Inventory</h3>
                                            <div className='flex items-center'>
                                                <div className='w-full bg-gray-200 rounded-full h-2.5'>
                                                    <div
                                                        className='bg-green-600 h-2.5 rounded-full'
                                                        style={{ width: `${(cars.available / cars.total) * 100}%` }}
                                                    >
                                                    </div>
                                                </div>
                                                <span className='ml-2 text-sm'>
                                                    {((cars.available / cars.total) * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <p className='text-xs text-gray-500 mt-2'>
                                                Available inventory capacity
                                            </p>
                                        </div>
                                        <div className='bg-gray-50 p-4 rounded-lg transition-shadow duration-300 hover:shadow-lg'>
                                            <h3 className='font-medium text-sm mb-2'>Test Drive Success</h3>
                                            <div className='flex items-center'>
                                                <div className='w-full bg-gray-200 rounded-full h-2.5'>
                                                    <div
                                                        className='bg-green-600 h-2.5 rounded-full'
                                                        style={{ width: `${(testDrives.completed / testDrives.total || 1) * 100}%` }}
                                                    >
                                                    </div>
                                                </div>
                                                <span className='ml-2 text-sm'>
                                                    {((testDrives.completed / testDrives.total || 1) * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <p className='text-xs text-gray-500 mt-2'>
                                                Completed test drives
                                            </p>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-3 gap-4 mt-6 '>
                                        <div className='text-center'>
                                            <span className='text-3xl font-bold text-blue-600'>
                                                {cars.sold}
                                            </span>
                                            <p className='text-md text-gray-600 mt-1'>
                                                Cars Sold
                                            </p>
                                        </div>
                                        <div className='text-center'>
                                            <span className='text-3xl font-bold text-amber-600'>
                                                {testDrives.pending + testDrives.confirmed}
                                            </span>
                                            <p className='text-md text-gray-600 mt-1'>
                                                Upcoming Test Drives
                                            </p>
                                        </div>
                                        <div className='text-center'>
                                            <span className='text-3xl font-bold text-green-600'>
                                                {((cars.available / (cars.total || 1)) * 100).toFixed(0)}%
                                            </span>
                                            <p className='text-md text-gray-600 mt-1'
                                            >Inventory Utilization</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="test-drives" className="space-y-6">
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
                            <Card className="transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-md font-medium">Total Bookings</CardTitle>
                                    <Calendar className='h-5 w-5 text-muted-foreground' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-3xl font-bold'>{testDrives.total}</div>
                                </CardContent>
                            </Card>
                            <Card className="transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-md font-medium">Pending</CardTitle>
                                    <Clock className='h-5 w-5 text-orange-400' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-3xl font-bold'>{testDrives.pending}</div>
                                    <p className='text-sm text-muted-foreground'>{(testDrives.pending / (testDrives.total || 0) * 100).toFixed(1)}% of bookings</p>
                                </CardContent>
                            </Card>
                            <Card className="transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-md font-medium">Confirmed</CardTitle>
                                    <CheckCircle className='h-5 w-5 text-green-400' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-3xl font-bold'>{testDrives.confirmed}</div>
                                    <p className='text-sm text-muted-foreground'>{(testDrives.confirmed / (testDrives.total || 0) * 100).toFixed(1)}% of bookings</p>
                                </CardContent>
                            </Card>
                            <Card className="transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-md font-medium">Completed</CardTitle>
                                    <CheckCircle className='h-5 w-5 text-blue-400' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-3xl font-bold'>{testDrives.completed}</div>
                                    <p className='text-sm text-muted-foreground'>{(testDrives.completed / (testDrives.total || 0) * 100).toFixed(1)}% of bookings</p>
                                </CardContent>
                            </Card>
                            <Card className="transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-md font-medium">Cancelled</CardTitle>
                                    <XCircle className='h-5 w-5 text-red-400' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-3xl font-bold'>{testDrives.cancelled}</div>
                                    <p className='text-sm text-muted-foreground'>{(testDrives.cancelled / (testDrives.total || 0) * 100).toFixed(1)}% of bookings</p>
                                </CardContent>
                            </Card>
                        </div>
                        <Card className="transition-shadow duration-300 hover:shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">Test Drive Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='p-2 space-y-1 bg-gray-50 transition-shadow duration-300 hover:shadow-lg'>
                                            <p className='text-xl font-semibold'>Conversion Rate</p>
                                            <span className='text-3xl font-bold text-blue-600'>
                                                {testDrives.conversionRate}%
                                            </span>
                                            <p className='text-md text-gray-600 mt-1'>
                                                Test drives resulting in car purchases
                                            </p>
                                        </div>
                                        <div className='p-2 space-y-1 bg-gray-50 transition-shadow duration-300 hover:shadow-lg'>
                                            <p className='text-xl font-semibold'>Completion Rate</p>
                                            <span className='text-3xl font-bold text-green-600'>
                                                {(testDrives.completed / (testDrives.total || 0) * 100).toFixed(1)}%
                                            </span>
                                            <p className='text-md text-gray-600 mt-1'>
                                                Test drives successfully completed
                                            </p>
                                        </div>
                                    </div>
                                    <div className='gap-4 mt-8 p-2 space-y-4'>
                                        <h2 className='text-2xl font-semibold'>Booking Status Breakdown</h2>
                                        {/* Pending */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Pending</span>
                                                <span className="font-medium">
                                                    {testDrives.pending} (
                                                    {(
                                                        (testDrives.pending / testDrives.total) *
                                                        100
                                                    ).toFixed(1)}
                                                    %)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-amber-500 h-2.5 rounded-full"
                                                    style={{
                                                        width: `${(testDrives.pending / testDrives.total) * 100
                                                            }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        {/* Confirmed */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Confirmed</span>
                                                <span className="font-medium">
                                                    {testDrives.confirmed} (
                                                    {(
                                                        (testDrives.confirmed / testDrives.total) *
                                                        100
                                                    ).toFixed(1)}
                                                    %)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-green-500 h-2.5 rounded-full"
                                                    style={{
                                                        width: `${(testDrives.confirmed / testDrives.total) * 100
                                                            }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        {/* completed */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Completed</span>
                                                <span className="font-medium">
                                                    {testDrives.completed} (
                                                    {(
                                                        (testDrives.completed / testDrives.total) *
                                                        100
                                                    ).toFixed(1)}
                                                    %)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-500 h-2.5 rounded-full"
                                                    style={{
                                                        width: `${(testDrives.completed / testDrives.total) * 100
                                                            }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Cancelled</span>
                                                <span className="font-medium">
                                                    {testDrives.cancelled} (
                                                    {(
                                                        (testDrives.cancelled / testDrives.total) *
                                                        100
                                                    ).toFixed(1)}
                                                    %)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-gray-500 h-2.5 rounded-full"
                                                    style={{
                                                        width: `${(testDrives.cancelled / testDrives.total) * 100
                                                            }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>No Show</span>
                                                <span className="font-medium">
                                                    {testDrives.noShow} (
                                                    {(
                                                        (testDrives.noShow / testDrives.total) *
                                                        100
                                                    ).toFixed(1)}
                                                    %)
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-gray-200 h-2.5 rounded-full"
                                                    style={{
                                                        width: `${(testDrives.noShow / testDrives.total) * 100
                                                            }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default DashBoard;