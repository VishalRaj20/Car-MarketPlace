"use client";

import { bookTestDrive } from '@/action/test-drive';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Car, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const testDriveSchema = z.object({
    date: z.date({
        required_error: "Please select a date for the test drive",
    }),
    timeSlot: z.string({
        required_error: "Please select a time slot for the test drive",
    }),
    notes: z.string().optional(),
});

const TestDriveForm = ({ car, testDriveInfo }) => {

    const router = useRouter();
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    const { control, handleSubmit, watch, setValue, reset, formState: { errors, invalid } } = useForm({
        resolver: zodResolver(testDriveSchema),
        defaultValues: {
            date: undefined,
            timeSlot: undefined,
            notes: '',
        },
    })

    const {
        loading: bookingInProgress,
        fn: bookTestDriveFn,
        data: bookingResult,
        error: bookingError,
    } = useFetch(bookTestDrive);

    const dealership = testDriveInfo?.dealership;
    const existingBookings = testDriveInfo?.existingBookings || [];

    const selectedDate = watch("date");

    const onSubmit = async (data) => {
        const selectedSlot = availableTimeSlots.find((slot) => slot.id === data.timeSlot);

        if (!selectedSlot) {
            toast.error("Selected time slot is not available. Please choose another slot.");
            return;
        }

        await bookTestDriveFn({
            carId: car.id,
            bookingDate: format(data.date, 'yyyy-MM-dd'),
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            notes: data.notes,
        });
    }

    useEffect(() => {
        const data = bookingResult?.data;
        if (data?.bookingDate && data?.startTime && data?.endTime) {
            try {
                const dateFormatted = format(data.bookingDate, "EEEE, MMMM dd, yyyy");
                const start = parseISO(`2022-01-01T${data.startTime}`);
                const end = parseISO(`2022-01-01T${data.endTime}`);

                setBookingDetails({
                    date: dateFormatted,
                    timeSlot: `${format(start, 'hh:mm a')} - ${format(end, 'hh:mm a')}`,
                    notes: data.notes || "No additional notes provided",
                });
                setShowConfirmation(true);
                reset();
            } catch (e) {
                console.error("Error formatting booking times:", e);
                toast.error("Invalid time slot format received.");
            }
        }
    }, [bookingResult]);


    useEffect(() => {
        if (bookingError) {
            toast.error("Failed to book test drive. Please try again.");
        }
    }, [bookingError]);

    const isDayDisabled = (day) => {
        if (day < new Date()) {
            return true; // Disable past dates
        }

        const dayOfWeek = format(day, 'EEEE').toUpperCase();

        const daySchedule = dealership?.workingHours?.find((schedule) =>
            schedule.dayOfWeek === dayOfWeek
        )
        return !daySchedule || !daySchedule.isOpen;
    }

    useEffect(() => {
        if (!selectedDate || !dealership?.workingHours) return;

        const selectedDayOfWeek = format(selectedDate, 'EEEE').toUpperCase();

        const daySchedule = dealership.workingHours.find(schedule =>
            schedule.dayOfWeek === selectedDayOfWeek

        );

        if (!daySchedule || !daySchedule.isOpen) {
            setAvailableTimeSlots([]);
            return;
        }

        const openHour = parseInt(daySchedule.openTime.split(':')[0]);
        const closeHour = parseInt(daySchedule.closeTime.split(':')[0]);

        const timeSlots = [];
        for (let hour = openHour; hour < closeHour; hour++) {
            const startTime = `${hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

            const isBooked = existingBookings.some(booking => {
                const bookingDate = booking.date;

                return (
                    bookingDate == format(selectedDate, 'yyyy-MM-dd') &&
                    (booking.startTime === startTime || booking.endTime === endTime)
                )
            });

            if (!isBooked) {
                timeSlots.push({
                    id: `${startTime}-${endTime}`,
                    label: `${startTime} - ${endTime}`,
                    startTime,
                    endTime,
                });
            }
            setAvailableTimeSlots(timeSlots);
            // Reset time slot if the date changes
            setValue("timeSlot", "");
        }
    }, [selectedDate]);

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
        router.push(`/cars/${car.id}`);
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='md:col-span-1'>
                <Card>
                    <CardContent className='p-6'>
                        <h2 className="text-2xl font-bold mb-4">Car Details</h2>
                        <div className='aspect-video rounded-lg overflow-hidden relative mb-4'>
                            {car.images && car.images.length > 0 ? (
                                <img
                                    src={car.images[0]}
                                    alt={`${car.year} ${car.make} ${car.mode}`}
                                    className='object-cover w-full h-full'
                                />
                            ) : (
                                <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                                    <Car className='h-24 w-24 text-gray-400' />
                                </div>
                            )}
                        </div>

                        <h3 className='text-lg font-bold'>{car.year} {car.make} {car.model}</h3>
                        <div className='mt-4 text-sm text-gray-600'>
                            <div className='flex justify-between py-1 border-b'>
                                <span>Mileage</span>
                                <span className='font-bold'>{car.mileage.toLocaleString()} miles</span>
                            </div>
                            <div className='flex justify-between py-1 border-b'>
                                <span>Fuel Type</span>
                                <span className='font-bold'>{car.fuelType}</span>
                            </div>
                            <div className='flex justify-between py-1 border-b'>
                                <span>Body Type</span>
                                <span className='font-bold'>{car.bodyType}</span>
                            </div>
                            <div className='flex justify-between py-1 border-b'>
                                <span>Transmission</span>
                                <span className='font-bold'>{car.transmission}</span>
                            </div>
                            <div className='flex justify-between py-1 border-b'>
                                <span>Color</span>
                                <span className='font-bold'>{car.color}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='mt-6'>
                    <CardContent className='p-6'>
                        <h2 className='text-xl font-bold mb-4'>DealerShip Info</h2>
                        <div className="text-slate-700">
                            <p className='font-medium'>{dealership?.name || "Vehicle Motors"}</p>
                        </div>
                        <div className="text-slate-700 mt-1">
                            <p className='font-medium'>{dealership?.address || "Not Available"}</p>
                        </div>
                        <div className="text-slate-700 mt-3">
                            <p className='font-medium'>{dealership?.phone || "Not Available"}</p>
                        </div>
                        <div className="text-slate-700">
                            <p className='font-medium'>{dealership?.email || "Not Available"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className='md:col-span-2'>
                <Card>
                    <CardContent>
                        <h2 className='text-xl font-bold mb- 10'>Schedule Your Test Drive</h2>
                        <form onSubmit={handleSubmit(onSubmit)}
                            className='space-y-6' >
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium mt-6'>
                                    Select a Date
                                </label>
                                <Controller name="date" control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal"
                                                            , !field.value && "text-muted-foreground"
                                                        )}
                                                    >

                                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                                        {field.value ? format(field.value, "PPP") : "Select a date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        className="rounded-lg border"
                                                        initialFocus
                                                        disabled={isDayDisabled}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {errors.date && (
                                                <p className='text-red-500 text-sm mt-1'>
                                                    {errors.date.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium mb-2'>
                                    Select a Time Slot
                                </label>
                                <Controller name="timeSlot" control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={!selectedDate || availableTimeSlots.length === 0}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={!selectedDate ? "Please select a date first" : availableTimeSlots.length === 0 ? "No time slots available" : "Select a time slot"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableTimeSlots.map((slot) => (
                                                    <SelectItem key={slot.id} value={slot.id}>
                                                        {slot.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.timeSlot && (
                                    <p className='text-red-500 text-sm mt-1'>
                                        {errors.timeSlot.message}
                                    </p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium mb-2'>
                                    Additional Notes (optional)
                                </label>
                            </div>
                            <Controller name="notes" control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        className='min-h-25'
                                        placeholder='Any specific requests or questions?'
                                    />
                                )}
                            />
                            <Button
                                type="submit"
                                className='w-full cursor-pointer'
                                disabled={bookingInProgress}
                            >
                                <Car className='mr-1 h-8 w-8' />
                                {bookingInProgress ?
                                    <Loader2 className='animate-spin h-4 w-4 mr-2' /> :
                                    "Booking your Test Drive..."
                                }
                            </Button>
                        </form>

                        <div className='mt-8 bg-gray-50 p-4 rounded-lg'>
                            <h3 className='font-medium mb-2'>What to expect</h3>
                            <ul className='space-y-2 text-sm text-gray-600'>
                                <li className='flex items-center mb-2'>
                                    <CheckCircle2 className='text-green-500 h-4 w-4 mt-0.5 mr-2' />
                                    Bring your driver's license for verification
                                </li>
                                <li className='flex items-center mb-2'>
                                    <CheckCircle2 className='text-green-500 h-4 w-4 mt-0.5 mr-2' />
                                    Test drives typically last 30-60 minutes
                                </li>
                                <li className='flex items-center mb-2'>
                                    <CheckCircle2 className='text-green-500 h-4 w-4 mt-0.5 mr-2' />
                                    A dealership representative will accompany you during the test drive
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                            <CheckCircle2 className='h-6 w-6 text-green-500 mr-2 inline-block' />
                            Test Drive Booked Successfully
                        </DialogTitle>
                        <DialogDescription>
                            Your test drive has been successfully booked! Here are the details:
                        </DialogDescription>
                    </DialogHeader>
                    {bookingDetails && (
                        <div className='py-4'>
                            <div className='space-y-3'>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>Car:</span>
                                    <span>
                                        {car.year} {car.make} {car.model}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>Date:</span>
                                    <span>{bookingDetails.date}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>Time Slot:</span>
                                    <span>{bookingDetails.timeSlot}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-medium'>Dealership:</span>
                                    <span>{dealership?.name || "Vehicle Motors"}</span>
                                </div>
                            </div>
                            <div className='mt-4 bg-blue-50 p-3 rounded text-sm text-blue-700'>
                                Please arrive 10 minutes early with your driver's license. If you have any questions or need to reschedule, please contact the dealership directly.
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button 
                        onClick={handleCloseConfirmation}
                        className="cursor-pointer"
                        >
                            Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default TestDriveForm;