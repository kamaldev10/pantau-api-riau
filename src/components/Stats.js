import { Flame, AlertTriangle, CheckCircle } from "lucide-react";

export default function Stats({ data }) {
  const total = data.length;
  const bahaya = data.filter((s) => s.status === "BAHAYA").length;
  const waspada = data.filter((s) => s.status === "WASPADA").length;

  const cards = [
    {
      label: "Total Titik Api",
      value: total,
      icon: <Flame size={20} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Status Bahaya",
      value: bahaya,
      icon: <AlertTriangle size={20} />,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Status Waspada",
      value: waspada,
      icon: <AlertTriangle size={20} />,
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`p-2 md:p-4 rounded-xl border flex items-center gap-4 ${card.color}`}
        >
          <div className="p-1 md:p-3 bg-white rounded-lg shadow-sm">
            {card.icon}
          </div>
          <div>
            <p className="text-[8px] md:text-base font-bold opacity-80 uppercase tracking-wider">
              {card.label}
            </p>
            <p className="text:base md:text-2xl font-bold">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
