"use client";

import { toggleSavedCar } from '@/action/car-listing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useFetch from '@/hooks/use-fetch';
import { formatCurrency } from '@/lib/helper';
import { useAuth } from '@clerk/nextjs';
import { Calendar, Car, Currency, Fuel, Gauge, Heart, LocateFixed, MessageSquare, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import EmiCalculator from './emi-calculator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

const CarDetails = ({ car, testDriveInfo }) => {
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(car.wishlisted);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const {
        loading: savingCar,
        fn: toggleSavedCarFn,
        data: toggleResult,
        error: toggleError,
    } = useFetch(toggleSavedCar);

    const handleSaveCar = async () => {

        if (!isSignedIn) {
            toast.error("Please sign in to save cars");
            router.push("/sign-in");
            return;
        }

        if (savingCar) return;

        await toggleSavedCarFn(car.id);
    };

    useEffect(() => {
        if (toggleError) {
            toast.error("Failed to update favourites");
        }
    }, [toggleError]);

    useEffect(() => {
        if (toggleResult?.success && toggleResult.saved !== isWishlisted) {
            setIsWishlisted(toggleResult.saved);
            toast.success(toggleResult.message);
        }
    }, [toggleResult, isWishlisted]);

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: `${car.year} ${car.make} ${car.model}`,
                    text: `check out this ${car.year} ${car.make} ${car.model} on vehicle`,
                    url: window.location.href,
                })
                .catch((error) => {
                    console.log("Error sharing", error);
                    copyToClipboard();
                })
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
    }

    const hanleBookTestDrive = () => {
        if (!isSignedIn) {
            toast.error("Please sign in to book a test drive");
            router.push("/sign-in");
            return;
        }

        if (testDriveInfo.userTestDrive) {
            toast.error("You have already booked a test drive for this car");
            return;
        }

        router.push(`/test-drive/${car.id}`);
    }
    return (
        <div>
            <div className='flex flex-col lg:flex-row gap-6'>
                <div className='w-full lg:w-7/12'>
                    <div className='aspect-video rounded-lg overflow-hidden relative mb-4'>
                        {car.images && car.images.length > 0 ? (
                            <Image
                                src={car.images[currentImageIndex]}
                                alt={`${car.year} ${car.make} ${car.mode}`}
                                fill
                                className='oject-cover'
                                priority
                            />
                        ) : (
                            <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                                <Car className='h-24 w-24 text-gray-400' />
                            </div>
                        )}</div>
                    {car.images && car.images.length > 0 &&
                        <div className='flex gap-2 overlow-x-auto pb-2'>
                            {car.images.map((image, index) => {
                                return (
                                    <div key={index}
                                        className={`relative cursor-pointer rounded-md h-20 w-24 flex-shrink-0 transition
                                ${index === currentImageIndex
                                                ? "border-2 border-gray-600" : "opacity-70 hover:opacity-100"
                                            }`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${car.year} ${car.make} ${car.model} - view ${index + 1}`}
                                            fill
                                            className='object-cover'
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    }
                    <div className='flex mt-4 gap-6'>
                        <Button
                            variant="outline"
                            className={`flex items-center gap-2 flex-1 ${isWishlisted ? "text-red-500" : ""
                                }`}
                            onClick={handleSaveCar}
                            disabled={savingCar}
                        >
                            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`} />
                            {isWishlisted ? "Saved" : "Save"}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 flex-1"
                            onClick={handleShare}
                        >
                            <Share2 className='w-5 h-5 ' /> Share
                        </Button>
                    </div>
                </div>

                <div>
                    <div className='flex items-center justify-between'>
                        <Badge className='mb-2'>{car.bodyType}</Badge>
                    </div>

                    <h1 className='text-4xl font-bold mb-1'>
                        {car.year} {car.make} {car.model}
                    </h1>

                    <div className='text-2xl font-bold text-blue-500 '>
                        {formatCurrency(car.price)}
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4 my-4'>
                        <div className='flex items-center gap-2'>
                            <Gauge className='text-gray-500 h-5 w-5' />
                            <span>{car.mileage.toLocaleString()} miles</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Fuel className='text-gray-500 h-5 w-5' />
                            <span>{car.fuelType}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Car className='text-gray-500 h-5 w-5' />
                            <span>{car.transmission}</span>
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger className='w-full text-start'>
                            <Card>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-lg font-medium mb-2">
                                        <Currency className="h-5 w-5 text-blue-600" />
                                        <h3>EMI CALCULATOR</h3>
                                    </div>
                                    <div className='text-sm text-gray-600'>
                                        Estimated Monthly Payment:{" "}
                                        <span className='font-bold text-gray-900'>
                                            {formatCurrency(car.price / 60)}
                                        </span>{" "}
                                        for 60 months
                                    </div>
                                    <div className='text-xs text-gray-500 mt-1'>
                                        *Based on $0 down payment and 4.5% interest rate
                                    </div>
                                </CardContent>
                            </Card>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-bold text-2xl">Car Loan EMI Calculator</DialogTitle>
                                <EmiCalculator price={car.price} />
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                    <Card className="my-5">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-lg font-medium">
                                <MessageSquare className='h-5 w-5 text-blue-600' />
                                <h3>Have Questions?</h3>
                            </div>
                            <p className='text-sm text-gray-600 mb-2'>Our representative are available to answer your queries about this vehicle.</p>
                            <a href="mailto:abc@gmail.com">
                                <Button variant="outline" className='w-full cursor-pointer'>
                                    Request Info
                                </Button>
                            </a>
                        </CardContent>
                    </Card>

                    {(car.status === "SOLD" || car.status === "UNAVAILABLE") && (
                        <Alert variant="destructive">
                            <AlertTitle className="capitalize">This car is {car.status.toLowerCase()}</AlertTitle>
                            <AlertDescription>Please check again later.</AlertDescription>
                        </Alert>
                    )}
                    {car.status !== "SOLD" && car.status !== "UNAVAILABLE" && (
                        <Button
                            className='w-full py6 text-lg'
                            disabled={testDriveInfo.userTestDrive}
                            onClick={hanleBookTestDrive}
                        >
                            <Calendar className='h-5 w-5 mr-2' />
                            {
                                testDriveInfo.userTestDrive ? `Booked on ${format(new Date(testDriveInfo.userTestDrive.bookingDate), "EEEE, MMMM d, yyyy")}` : "Book Test Drive"
                            }
                        </Button>
                    )}
                </div>
            </div>
            <div className='mt-8 p-6 bg-white rounded-lg shadow-md'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                        <h2 className='text-lg font-bold'>Description</h2>
                        <p className='text-gray-700 mt-4'>{car.description || "No description available."}</p>
                    </div>

                    <div className='ml-10'>
                        <h2 className='text-lg font-bold mb-2'>Features</h2>
                        <ul className='grid grid-cols-1 gap-2'>
                            <li className='flex items-center gap-2'>
                                <span className='h-2 w-2 bg-blue-600 rounded-full'></span>
                                {car.transmission} Transmission
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='h-2 w-2 bg-blue-600 rounded-full'></span>
                                {car.fuelType} Fuel Type
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='h-2 w-2 bg-blue-600 rounded-full'></span>
                                {car.bodyType} Body Type
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='h-2 w-2 bg-blue-600 rounded-full'></span>
                                {car.color} Color
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg hover:shadow-sm transition-shadow duration-300">
                <h2 className=' text-gray-900 font-bold text-lg flex items-center gap-2'>
                    <span className='text-2xl font-bold'>Specifications</span>
                </h2>
                <div className='grid grid-cols-1 lg:grid-cols-2 mt-4 p-6 rounded-lg shadow-md bg-gray-50'>
                    <div className=' gap-6 mt-4 mr-16'>
                        <div className='flex items-center justify-between gap-4 py-1 border-b'>
                            <span className='text-gray-700'>Make</span>
                            <span className='text-gray-900 font-semibold'>{car.make}</span>

                        </div>
                        <div className='flex items-center justify-between gap-4 mt-2 py-1 border-b'>
                            <span className='text-gray-700'>Year</span>
                            <span className='text-gray-900 font-semibold'>{car.year}</span>
                        </div>
                        <div className='flex items-center justify-between gap-4 mt-2 py-1 border-b'>
                            <span className='text-gray-700'>Fuel Type</span>
                            <span className='text-gray-900 font-semibold'>{car.fuelType}</span>
                        </div>
                        <div className='flex items-center justify-between gap-4 mt-2 py-1 border-b'>
                            <span className='text-gray-700'>Mileage</span>
                            <span className='text-gray-900 font-semibold'>{car.mileage.toLocaleString()} miles</span>
                        </div>
                        {car.seats && (
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Seats</span>
                                <span className="font-medium">{car.seats}</span>
                            </div>
                        )}
                    </div>
                    <div className=' gap-6 mt-4 ml-16'>
                        <div className='flex items-center justify-between gap-4 py-1 border-b'>
                            <span className='text-gray-700'>Model</span>
                            <span className='text-gray-900 font-semibold'>{car.model}</span>
                        </div>
                        <div className='flex items-center justify-between gap-4 mt-2 py-1 border-b'>
                            <span className='text-gray-700'>Body Type</span>
                            <span className='text-gray-900 font-semibold'>{car.bodyType}</span>
                        </div>
                        <div className='flex items-center justify-between gap-4 mt-2 py-1 border-b'>
                            <span className='text-gray-700'>Transmission</span>
                            <span className='text-gray-900 font-semibold'>{car.transmission}</span>
                        </div>
                        <div className='flex items-center justify-between gap-4 mt-2 py-1 border-b'>
                            <span className='text-gray-700'>Color</span>
                            <span className='text-gray-900 font-semibold'>{car.color}</span>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Dealership Location Section */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Dealership Location</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row gap-6 justify-between">
                        {/* Dealership Name and Address */}
                        <div className="flex items-start gap-3">
                            <LocateFixed className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium">Vehicle Motors</h4>
                                <p className="text-gray-600">
                                    {testDriveInfo.dealership?.address || "Not Available"}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Phone: {testDriveInfo.dealership?.phone || "Not Available"}
                                </p>
                                <p className="text-gray-600">
                                    Email: {testDriveInfo.dealership?.email || "Not Available"}
                                </p>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="md:w-1/2 lg:w-1/3">
                            <h4 className="font-medium mb-2">Working Hours</h4>
                            <div className="space-y-2">
                                {testDriveInfo.dealership?.workingHours
                                    ? testDriveInfo.dealership.workingHours
                                        .sort((a, b) => {
                                            const days = [
                                                "MONDAY",
                                                "TUESDAY",
                                                "WEDNESDAY",
                                                "THURSDAY",
                                                "FRIDAY",
                                                "SATURDAY",
                                                "SUNDAY",
                                            ];
                                            return (
                                                days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek)
                                            );
                                        })
                                        .map((day) => (
                                            <div
                                                key={day.dayOfWeek}
                                                className="flex justify-between text-sm"
                                            >
                                                <span className="text-gray-600">
                                                    {day.dayOfWeek.charAt(0) +
                                                        day.dayOfWeek.slice(1).toLowerCase()}
                                                </span>
                                                <span>
                                                    {day.isOpen
                                                        ? `${day.openTime} - ${day.closeTime}`
                                                        : "Closed"}
                                                </span>
                                            </div>
                                        ))
                                    : // Default hours if none provided
                                    [
                                        "Monday",
                                        "Tuesday",
                                        "Wednesday",
                                        "Thursday",
                                        "Friday",
                                        "Saturday",
                                        "Sunday",
                                    ].map((day, index) => (
                                        <div key={day} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{day}</span>
                                            <span>
                                                {index < 5
                                                    ? "9:00 - 18:00"
                                                    : index === 5
                                                        ? "10:00 - 16:00"
                                                        : "Closed"}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails