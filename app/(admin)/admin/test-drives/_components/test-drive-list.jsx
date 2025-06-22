"use client";

import { getAdminTestDrives, updateTestDriveStatus } from '@/action/admin';
import { cancelTestDrive } from '@/action/test-drive';
import TestDriveCard from '@/components/test-drive-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { CalendarRange, Loader2, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const TestDriveList = () => {

    const [search, setSearch] = useState("");
    const [statusFilter, setSearchFilter] = useState("");

    const {
        loading: fechingTestDrives,
        fn: fetchTestDrives,
        data: testDrivesData,
        error: testDrivesError,
    } = useFetch(getAdminTestDrives);
    const {
        loading: updatesStatus,
        fn: updateStatusFn,
        data: updateResult,
        error: updateError,
    } = useFetch(updateTestDriveStatus);
    const {
        loading: cancelling,
        fn: cancelTestDrivesFn,
        data: cancelResult,
        error: cancelError,
    } = useFetch(cancelTestDrive);

    useEffect(() => {
        fetchTestDrives({ search, status: statusFilter });

    }, [search, statusFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // prevent auto refreshed on submit
        fetchTestDrives({ search, status: statusFilter });
    }

    const handleUpdateStatus = async (bookingId, newStatus) => {
        if (newStatus) {
            await updateStatusFn(bookingId, newStatus);
        }
    }

    useEffect(() => {
        if (updateResult?.success) {
            toast.success("Test drive status updated successfully");
            fetchTestDrives({ search, status: statusFilter });
        }
        if (cancelResult?.success) {
            toast.success("Test drive cancelled successfully");
            fetchTestDrives({ search, status: statusFilter });
        }
    }, [updateResult, cancelResult]);

    useEffect(() => {
        if (testDrivesError) {
            toast.error("Failed to load test drives");
        }
        if (updateError) {
            toast.error("Failed to update test drive status");
        }
        if (cancelError) {
            toast.error("Failed to cancel test drive");
        }
    }, [testDrivesError, updateError, cancelError]);

    return (
        <div className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center justify-between'>
                <Select
                    value={statusFilter}
                    onValueChange={setSearchFilter}
                    className="w-full sm:w-48"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">confirmed</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="NO_SHOW">No Show</SelectItem>
                    </SelectContent>
                </Select>

                <form onSubmit={handleSearchSubmit} className='flex w-full' >
                    <div className='relative flex-1'>
                        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
                        <Input
                            type="search"
                            placeholder="Search by car or customer..."
                            className="pl-9 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="ml-2">
                        Search
                    </Button>
                </form>
            </div>

            <Card >
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarRange className='h-5 w-5' /> Test Drive Bookings
                    </CardTitle>
                    <CardDescription>
                        Manage all test drive reservations and update their status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {fechingTestDrives && !testDrivesData ? (
                        <div className='flex justify-center items-center py-12'>
                            <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
                        </div>
                    ) : (<div className='space-y-6'>
                        {testDrivesData?.data?.map((booking) => (
                            <div key={booking.id} className='relative'>
                                <TestDriveCard
                                    booking={booking}
                                    onCancel={cancelTestDrivesFn}
                                    showActions={["PENDING", "CONFIRMED"].includes(booking.status)}
                                    isAdmin={true}
                                    isCancelling={cancelling}
                                    renderStatusSelector={() => (
                                        <Select
                                            value={booking.status}
                                            onValueChange={(value) => handleUpdateStatus(booking.id, value)}
                                            disabled={updatesStatus}
                                        >
                                            <SelectTrigger className="w-full h-8">
                                                <SelectValue placeholder="Update Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                <SelectItem value="NO_SHOW">No Show</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        )
                        )}
                    </div>)}
                </CardContent>
            </Card>
        </div>
    )
}

export default TestDriveList