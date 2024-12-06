import ProblemTable from "@/components/problem-table";
import Image from "next/image";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center mb-4 max-w-5xl">
        <h1 className="text-4xl font-bold mb-4">African Problems & Solutions</h1>
        <h2 className="text-md text-gray-600">
          A platform to document and track technological problems and solutions in Africa. Our goal is to bring together a community of tech enthusiasts, developers, and innovators to address the unique technological challenges faced by the continent. Join us in making a difference by contributing your insights and solutions.
        </h2>
      </div>
      <ProblemTable />
    </div>
  );
}