import { useMemo } from "react";
import { 
  eachDayOfInterval, 
  subDays, 
  format, 
  isSameDay, 
  startOfWeek, 
  endOfWeek,
  parseISO,
  getDay
} from "date-fns";
import { zhTW } from "date-fns/locale";

type DiaryHeatmapProps = {
  diaries: { _creationTime: number }[];
};

export default function DiaryHeatmap({ diaries }: DiaryHeatmapProps) {
  // Process data to map date -> count
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    diaries.forEach((diary) => {
      const dateStr = format(new Date(diary._creationTime), "yyyy-MM-dd");
      map.set(dateStr, (map.get(dateStr) || 0) + 1);
    });
    return map;
  }, [diaries]);

  // Generate calendar grid
  const { weeks, months } = useMemo(() => {
    const today = new Date();
    // Show roughly last 1 year
    const startDate = subDays(today, 365);
    // Align start to the beginning of the week (Sunday)
    const calendarStart = startOfWeek(startDate);
    // Align end to the end of the week (Saturday)
    const calendarEnd = endOfWeek(today);

    const allDays = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    allDays.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Calculate month labels positions
    const months: { name: string; index: number }[] = [];
    let lastMonth = "";
    weeks.forEach((week, index) => {
      const firstDayOfWeek = week[0];
      const monthName = format(firstDayOfWeek, "MMM", { locale: zhTW });
      if (monthName !== lastMonth) {
        months.push({ name: monthName, index });
        lastMonth = monthName;
      }
    });

    return { weeks, months };
  }, []);

  const getColor = (count: number) => {
    if (count === 0) return "bg-white/5 border-transparent";
    if (count === 1) return "bg-indigo-900/60 border-indigo-800/50 shadow-[0_0_5px_rgba(79,70,229,0.2)]";
    if (count === 2) return "bg-indigo-700/80 border-indigo-600/50 shadow-[0_0_8px_rgba(79,70,229,0.4)]";
    if (count >= 3) return "bg-indigo-400 border-indigo-300/50 shadow-[0_0_12px_rgba(129,140,248,0.6)]";
    return "bg-white/5";
  };

  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="min-w-max">
        {/* Month Labels */}
        <div className="flex mb-2 text-xs text-zinc-500 font-medium pl-8 relative h-5">
            {months.map((month, i) => (
                <div 
                    key={`${month.name}-${i}`} 
                    className="absolute transform translate-x-1/2"
                    style={{ left: `${month.index * 14}px` }} // 14px = 10px width + 4px gap roughly
                >
                    {month.name}
                </div>
            ))}
        </div>

        <div className="flex gap-1">
          {/* Day Labels (Mon, Wed, Fri) */}
          <div className="flex flex-col gap-1 pr-2 text-[10px] text-zinc-600 font-medium pt-[14px]">
            <div className="h-[10px]" /> {/* Sun */}
            <div className="h-[10px] leading-[10px]">一</div>
            <div className="h-[10px]" /> {/* Tue */}
            <div className="h-[10px] leading-[10px]">三</div>
            <div className="h-[10px]" /> {/* Thu */}
            <div className="h-[10px] leading-[10px]">五</div>
            <div className="h-[10px]" /> {/* Sat */}
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const count = activityMap.get(dateStr) || 0;
                  return (
                    <div
                      key={dateStr}
                      className={`w-[10px] h-[10px] rounded-sm border transition-all duration-300 hover:scale-125 hover:z-10 ${getColor(count)}`}
                      title={`${format(day, "yyyy年M月d日")}: ${count} 篇日記`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-zinc-500">
          <span>少</span>
          <div className="w-[10px] h-[10px] rounded-sm bg-white/5 border border-transparent" />
          <div className="w-[10px] h-[10px] rounded-sm bg-indigo-900/60 border border-indigo-800/50" />
          <div className="w-[10px] h-[10px] rounded-sm bg-indigo-700/80 border border-indigo-600/50" />
          <div className="w-[10px] h-[10px] rounded-sm bg-indigo-400 border border-indigo-300/50" />
          <span>多</span>
        </div>
      </div>
    </div>
  );
}
