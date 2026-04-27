import Link from "next/link";

interface ModuleCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

export function ModuleCard({ icon, title, description, href, badge }: ModuleCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
        {badge && (
          <span className="absolute top-4 right-4 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
            {badge}
          </span>
        )}
        <div className="text-3xl">{icon}</div>
        <div>
          <h2 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {title}
          </h2>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
        <div className="mt-auto pt-2 text-xs font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors">
          Open →
        </div>
      </div>
    </Link>
  );
}
