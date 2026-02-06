import TestCard from "../components/TestCard";

export default function TestsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Tests</h1>

      <div className="grid gap-4">
        <TestCard
          title="TCS Aptitude Test"
          company="TCS"
          deadline="20 Feb 2026"
        />
      </div>
    </div>
  );
}
