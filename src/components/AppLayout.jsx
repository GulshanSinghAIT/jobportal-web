export default function AppLayout({ sidebar, children }) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <aside className="w-80 p-6 border-r bg-white">{sidebar}</aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    );
  }
  