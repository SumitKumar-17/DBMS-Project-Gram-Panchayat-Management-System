// components/ui/card.tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-4">
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4 text-white">{children}</div>;
}
