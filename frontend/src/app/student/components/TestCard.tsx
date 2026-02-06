import Link from "next/link";

export default function TestCard({
  title,
  company,
  deadline,
}: {
  title: string;
  company: string;
  deadline: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-600">Company: {company}</p>
      <p className="text-gray-500">Deadline: {deadline}</p>

      <Link
        href="/student/tests/1"
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Start Test
      </Link>
    </div>
  );
}
