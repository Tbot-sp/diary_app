import { useMemo, useState } from "react";
import { 
  eachDayOfInterval, 
  format, 
  startOfWeek, 
  endOfWeek,
} from "date-fns";
import { zhTW } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import { themes } from "../lib/theme";

type DiaryHeatmapProps = {
  diaries: { _creationTime: number }[];
  themeMode?: string;
};

export default function DiaryHeatmap({ diaries, themeMode = 'default' }: DiaryHeatmapProps) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isYearOpen, setIsYearOpen] = useState(false);
  
  // Resolve theme (handle 'night' mapping for backward compatibility if needed, or just use direct lookup)
  // If themeMode is 'night', map to 'default'. If 'clouds', use 'clouds' (or 'default' if preferred).
  const modeKey = themeMode === 'night' ? 'default' : themeMode;
  const theme = themes[modeKey] || themes.default;

  // Process data to map date -> count
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    diaries.forEach((diary) => {
      const dateStr = format(new Date(diary._creationTime), "yyyy-MM-dd");
      map.set(dateStr, (map.get(dateStr) || 0) + 1);
    });
    return map;
  }, [diaries]);

  // Extract available years from diaries
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    const currentYear = new Date().getFullYear();
    years.add(currentYear);
    diaries.forEach(d => {
      years.add(new Date(d._creationTime).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [diaries]);

  // Generate calendar grid
  const { weeks, months } = useMemo(() => {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);

    // Align start to the beginning of the week (Sunday)
    const calendarStart = startOfWeek(startDate);
    // Align end to the end of the week (Saturday)
    const calendarEnd = endOfWeek(endDate);

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
    let lastMonthName = "";
    
    weeks.forEach((week, index) => {
      const firstDayOfWeek = week[0];
      const monthName = format(firstDayOfWeek, "MMM", { locale: zhTW });
      
      if (monthName !== lastMonthName) {
        // If the new label is too close to the previous one (less than 3 weeks / 42px)
        // This usually happens at the start of the graph with a partial month
        if (months.length > 0) {
          const lastAddedMonth = months[months.length - 1];
          if (index - lastAddedMonth.index < 3) {
             months.pop();
          }
        }
        
        months.push({ name: monthName, index });
        lastMonthName = monthName;
      }
    });

    return { weeks, months };
  }, [selectedYear]);

  const getColor = (count: number) => {
    if (count === 0) return theme.heatmapGrid0;
    if (count === 1) return theme.heatmapGrid1;
    if (count === 2) return theme.heatmapGrid2;
    if (count >= 3) return theme.heatmapGrid3;
    return theme.heatmapGrid0;
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 relative z-20">
        <div className="relative">
          <button
            onClick={() => setIsYearOpen(!isYearOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full transition-all ${theme.heatmapYearBtn}`}
          >
            {selectedYear}
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isYearOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isYearOpen && (
            <>
              <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsYearOpen(false)} 
              />
              <div className={`absolute right-0 top-full mt-2 py-1 min-w-[120px] backdrop-blur-xl rounded-xl shadow-xl z-20 overflow-hidden border ${theme.heatmapDropdown}`}>
                {availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setIsYearOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-xs text-left transition-colors flex items-center justify-between ${
                      selectedYear === year 
                        ? theme.heatmapDropdownItemActive
                        : theme.heatmapDropdownItem
                    }`}
                  >
                    {year}
                    {selectedYear === year && <div className={`w-1.5 h-1.5 rounded-full ${themeMode === 'day' ? 'bg-indigo-500' : 'bg-indigo-400'}`} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="min-w-max mx-auto w-fit">
        {/* Month Labels */}
        <div className={`flex mb-2 text-xs font-medium relative h-5 ${theme.heatmapText}`}>
            {months.map((month, i) => (
                <div 
                    key={`${month.name}-${i}`} 
                    className="absolute transform translate-x-1/2"
                    style={{ left: `${(month.index * 14) + 36}px` }} // 36px = w-8 (32px) + gap-1 (4px)
                >
                    {month.name}
                </div>
            ))}
        </div>

        <div className="flex gap-1">
          {/* Day Labels (Mon, Wed, Fri) */}
          <div className={`flex flex-col gap-1 pr-2 text-[10px] font-medium pt-[14px] w-8 text-right ${theme.heatmapText} opacity-80`}>
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
                {week.map((day) => {
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
        <div className={`mt-4 flex items-center justify-end gap-2 text-xs ${themeMode === 'day' ? 'text-zinc-500' : 'text-zinc-400'}`}>
          <span>少</span>
          <div className={`w-[10px] h-[10px] rounded-sm border transition-all ${getColor(0)}`} />
          <div className={`w-[10px] h-[10px] rounded-sm border transition-all ${getColor(1)}`} />
          <div className={`w-[10px] h-[10px] rounded-sm border transition-all ${getColor(2)}`} />
          <div className={`w-[10px] h-[10px] rounded-sm border transition-all ${getColor(3)}`} />
          <span>多</span>
        </div>
      </div>
    </div>
    </div>
  );
}
