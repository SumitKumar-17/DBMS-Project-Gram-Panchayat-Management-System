import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-center">
            Welcome to Panchayat Management System
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-center">
            A comprehensive platform for managing village administration and
            citizen services
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Login to Access Services
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">For Citizens</h3>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>• Access personal records</li>
              <li>• Apply for welfare schemes</li>
              <li>• View vaccination records</li>
              <li>• Check land records</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">
              For Panchayat Employees
            </h3>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>• Manage citizen records</li>
              <li>• Update census data</li>
              <li>• Handle welfare schemes</li>
              <li>• Manage village assets</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">
              For Government Monitors
            </h3>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>• View reports and analytics</li>
              <li>• Track scheme implementation</li>
              <li>• Monitor village assets</li>
              <li>• Access census statistics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
