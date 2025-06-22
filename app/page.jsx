import { getFeaturedCars } from "@/action/home";
import CarCard from "@/components/car-card";
import HomeSearch from "@/components/home-search";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { bodyTypes, carMakes, faqItems } from "@/lib/data";
import { SignedOut } from "@clerk/nextjs";
import { Calendar, Car, ChevronRight, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default async function Home() {

  const featuredCars = await getFeaturedCars();
  return (
    <div className="pt-20 flex flex-col p-2">
      {/* Hero */}

      <section className="relative py-12 sm:py-16 md:py-28 dotted-background">
        <div className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 gradient-title leading-tight">
              Find your Dream Car with Vehicle AI
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-10 max-w-3xl mx-auto">
              Advanced AI car search and test drive from thousands of vehicles.
            </p>
          </div>
          {/* Search */}
          <HomeSearch />
        </div>
      </section>


      <section className="py-12">
        <div className="container mx-auto ">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Car</h2>
            <Link href='/cars'>
              <Button variant='ghost' className='flex items-center hover:bg-gray-300'>
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => {
              return <CarCard key={car.id} car={car} />
            })}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto ">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Browsed By Make</h2>
            <Button variant='ghost' className='flex items-center hover:bg-gray-300'>
              <Link href='/cars'></Link>
              View All <ChevronRight className="ml-1 h-4 w-4 " />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {carMakes.map((make) => {
              return (
                <Link
                  key={make.id}
                  href={`/cars?make=${make.name}`}
                  className="bg-white rounded-lg shadow p-4 text-center hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="h-16 w-auto mx-auto mb-2 relative">
                    <Image
                      src={make.image}
                      alt={make.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h3 className="font-medium">{make.name}</h3>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 ">
        <div className="container mx-auto p-4 hover:shadow-xl rounded-lg  transition-all duration-300">
          <h2 className="text-2xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Thousands of verified vehicles from trusted dealerships and private sellers.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Test Drive</h3>
              <p className="text-gray-600">Book a test drive online in minutes, with flexible scheduling options.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2" >Secure Process</h3>
              <p className="text-gray-600">Verified listings and secure booking process for peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto ">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Browsed By Body Type</h2>
            <Button variant='ghost' className='flex items-center hover:bg-gray-300'>
              <Link href='/cars'></Link>
              View All <ChevronRight className="ml-1 h-4 w-4 " />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bodyTypes.map((body) => {
              return (
                <Link
                  key={body.id}
                  href={`/cars?make=${body.name}`}
                  className="relative group cursor-pointer">
                  <div className="overflow-hidden rounded-lg flex justify-end h-28 mb-4 relative">
                    <Image
                      src={body.image}
                      alt={body.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
                  rounded-md flex items-end">
                    <h3 className="text-white text-xl font-bold pl-4 pb-1">{body.name}</h3>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>


      <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-gray-800">
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="w-full max-w-9xl mx-auto space-y-4">
            {faqItems.map((faq, index) => {
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg shadow-md bg-white transition-all duration-300 hover:shadow-md"
                >
                  <AccordionTrigger className="px-4 py-3 text-left font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-700 text-md leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </section>

      <section className="py-16 dotted-background text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to find Your Dream Car?
          </h2>
          <p>
            Join thousands of satisfied customers who found their perfect vehicle through our platform.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <Button size='lg' variant='secondary'>
            <Link href='/cars'>View All Cars</Link >
          </Button>
          <SignedOut>
            <Button size='lg' asChild>
              <Link href='/sign-up'>Sign Up Now</Link>
            </Button>
          </SignedOut>
        </div>
      </section>
    </div>
  );
}
