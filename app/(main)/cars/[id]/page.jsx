import { getCarById } from "@/action/car-listing";
import NotFound from "@/app/not-found";
import CarDetails from "./_components/car-details";

export async function generateMetadata({params}){
  const {id} = await params;
  const result = await getCarById(id);

  if(!result. success){
    return {
      title: "Car Not Found | Vehicle",
      description: "The requsted car should not be found",
    };
  }
  const car = result.data;

  return{
    title: `${car.year} ${car.make} ${car.model} | vehicle`,
    description: car.description.substring(0, 160),
    openGraph: {
      images: car.images?.[0] ? [car.images[0]] : [],
    },
  }
}

const CarPage = async({params}) => {
    const {id} = await params;
    const result = await getCarById(id);

    if(!result.success){
      NotFound();
    }

  return (
    <div className="container mx-auto px-4 py-12">
      <CarDetails car={result.data} testDriveInfo={result.data.testDriveInfo} />
    </div>
  )
}

export default CarPage;