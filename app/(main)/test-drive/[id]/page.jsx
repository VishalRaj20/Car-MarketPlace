import { getCarById } from "@/action/car-listing";
import { notFound } from "next/navigation";
import TestDriveForm from "./_components/test-drive-form";

export async function generateMetadata() {
  return {
    title: "Book Test Drive | Vehicle",
    description: "Schedule a test drive in few seconds",
  };
}

const TestDrivePage = async ({ params }) => {
  const id = (await params).id;
  const result = await getCarById(id);

  if (!result?.success) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-6xl mb-6 gradient-title">Book a Test Drive</h1>
      <TestDriveForm
        car={result.data}
        testDriveInfo={result.data.testDriveInfo}
      />
    </div>
  );
};

export default TestDrivePage;
