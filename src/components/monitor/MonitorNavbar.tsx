interface MonitorNavbarProps {
  userEmail: string;
  onGenerateReport: () => void;
  onLogout: () => void;
}

export default function MonitorNavbar({
  userEmail,
  onGenerateReport,
  onLogout,
}: MonitorNavbarProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl  text-black font-bold">Monitor Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {userEmail}</span>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
