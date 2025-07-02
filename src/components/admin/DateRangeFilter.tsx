import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangeFilterProps {
  onDateRangeChange: (dateRange: DateRange) => void;
  currentRange: DateRange;
}

const DateRangeFilter = ({ onDateRangeChange, currentRange }: DateRangeFilterProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(currentRange.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(currentRange.endDate);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
    
    setStartDate(start);
    setEndDate(end);
    onDateRangeChange({ startDate: start, endDate: end });
  };

  const handleApplyCustomRange = () => {
    if (startDate && endDate) {
      onDateRangeChange({ startDate, endDate });
    }
  };

  return (
    <Card className="p-4 mb-6 bg-gradient-to-br from-white/90 to-purple-50/30">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick(7)}
            className="text-xs"
          >
            Last 7 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick(30)}
            className="text-xs"
          >
            Last 30 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick(90)}
            className="text-xs"
          >
            Last 90 days
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <div className="flex gap-2 items-center">
            <Popover open={startOpen} onOpenChange={setStartOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal text-xs",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {startDate ? format(startDate, "MMM dd, yyyy") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setStartOpen(false);
                  }}
                  disabled={(date) =>
                    date > new Date() || (endDate && date > endDate)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-sm text-gray-500">to</span>

            <Popover open={endOpen} onOpenChange={setEndOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal text-xs",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {endDate ? format(endDate, "MMM dd, yyyy") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    setEndOpen(false);
                  }}
                  disabled={(date) =>
                    date > new Date() || (startDate && date < startDate)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            onClick={handleApplyCustomRange}
            disabled={!startDate || !endDate}
            size="sm"
            className="text-xs"
          >
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DateRangeFilter;
