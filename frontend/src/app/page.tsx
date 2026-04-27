import { ModuleCard } from "@/components/features/home/ModuleCard";

const modules = [
  {
    icon: "🔗",
    title: "QR Code Generator",
    description: "Create dynamic QR codes with trackable short links and analytics.",
    href: "/qr",
  },
];

export default function HomePage() {
  return (
    <main className="flex-1 px-4 py-16">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Mark&apos;s Toolkit
          </h1>
          <p className="mt-3 text-gray-500 text-base max-w-md mx-auto">
            A collection of productivity tools. Pick a module to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <ModuleCard key={mod.href} {...mod} />
          ))}
        </div>
      </div>
    </main>
  );
}
