import Link from "next/link";

export default function TestCard({
  title,
  deadline,
  onStart,
}: {
  title: string;
  deadline: string;
  onStart: () => void;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-500">Created: {deadline}</p>

      <button
        onClick={onStart}
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Start Test
      </button>
    </div>
  );
}
