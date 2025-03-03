// components/ui/tabs.tsx
export function Tabs({ children }: { children: React.ReactNode }) {
    return <div className="w-full">{children}</div>;
  }
  
  export function TabsList({ children }: { children: React.ReactNode }) {
    return <div className="flex border-b border-gray-300 bg-gray-100 p-2">{children}</div>;
  }
  
  export function TabsTrigger({ children, isActive, onClick }: { children: React.ReactNode; isActive: boolean; onClick: () => void }) {
    return (
      <button
        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  
  export function TabsContent({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
    return isActive ? <div className="p-4 text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm">{children}</div> : null;
  }
  