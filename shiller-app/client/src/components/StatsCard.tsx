interface StatsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}

const StatsCard = ({ title, value, icon, color = 'green' }: StatsCardProps) => {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const bgColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.green;

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center">
      {icon && (
        <div className={`${bgColor} p-3 rounded-full mr-4 text-white`}>
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-gray-400 text-sm uppercase">{title}</h3>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
