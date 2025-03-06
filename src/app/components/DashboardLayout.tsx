interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: string;
}

export default function DashboardLayout({
  children,
  userType,
}: DashboardLayoutProps) {
  const menuItems = {
    admin: [
      "Manage Users",
      "System Settings",
      "View Reports",
      "Manage Schemes",
    ],
    employee: [
      "Citizen Records",
      "Census Data",
      "Welfare Schemes",
      "Asset Management",
    ],
    citizen: [
      "Personal Information",
      "Scheme Enrollment",
      "Vaccination Records",
      "Land Records",
    ],
    monitor: [
      "View Reports",
      "Track Schemes",
      "Monitor Assets",
      "View Census Data",
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 bg-indigo-600 text-white">
          <h2 className="text-lg font-semibold">Panchayat System</h2>
          <p className="text-sm">
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard
          </p>
        </div>
        <nav className="mt-4">
          {menuItems[userType as keyof typeof menuItems].map((item, index) => (
            <a
              key={index}
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
