export default function HPBar({ hp, checkedIn, total }) {
  const color = hp > 60 ? 'bg-green-500' : hp > 30 ? 'bg-amber-500' : 'bg-red-500'
  const label = hp > 60 ? 'text-green-400' : hp > 30 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm font-medium">Squad HP</span>
        <span className={`text-sm font-bold ${label}`}>{hp}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${hp}%` }}
        />
      </div>
      <p className="text-gray-500 text-xs mt-2">
        {checkedIn}/{total} members checked in today
      </p>
    </div>
  )
}
