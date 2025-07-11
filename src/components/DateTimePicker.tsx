import * as React from "react";
import { format, parse, startOfDay, isToday as dateFnsIsToday, isPast as dateFnsIsPast } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
  date: Date | undefined; // This is the authoritative combined date/time from parent
  setDate: (date: Date | undefined) => void; // Callback to update parent
  className?: string;
}

export function DateTimePicker({
  date: parentDateTime, // Renaming for clarity within the component
  setDate: setParentDateTime,
  className,
}: DateTimePickerProps) {

  // Internal state for the DATE PART selected in the calendar
  const [selectedDatePart, setSelectedDatePart] = React.useState<Date | undefined>(
    parentDateTime ? startOfDay(parentDateTime) : undefined
  );

  // Internal state for the TIME STRING "HH:mm" selected in the dropdown
  const [selectedTimeString, setSelectedTimeString] = React.useState<string>(
    parentDateTime ? format(parentDateTime, "HH:mm") : "09:00" // Default time
  );

  // State to control the Popover for the calendar
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  
  // ===== Synchronization Effect: Parent -> Internal States =====
  // If parentDateTime changes externally, update internal states
  React.useEffect(() => {
    if (parentDateTime) {
      const newDatePart = startOfDay(parentDateTime);
      const newTimeString = format(parentDateTime, "HH:mm");
      // Only update if they are actually different to prevent loops/unnecessary re-renders
      if (selectedDatePart?.getTime() !== newDatePart.getTime()) {
        setSelectedDatePart(newDatePart);
      }
      if (selectedTimeString !== newTimeString) {
        setSelectedTimeString(newTimeString);
      }
    }
    // If parentDateTime becomes undefined (e.g., because no valid time could be found for selectedDatePart),
    // we should NOT automatically clear selectedDatePart here. The user's choice in the calendar
    // should persist visually. The fact that parentDateTime is undefined correctly signals that
    // there's no valid *combined* date/time. The other effect will handle trying to find a valid
    // time if selectedDatePart changes or if time becomes available.
  }, [parentDateTime]); // Dependencies are refined; only react to parentDateTime.


  // ===== Logic for Time Slots =====
  const timeSlots = React.useMemo(() => {
    const slots: Array<{ value: string; disabled: boolean }> = [];
    const now = new Date();

    // Determine if all times should be disabled (e.g., selectedDatePart is in the past)
    let disableAllTimes = false;
    if (selectedDatePart && dateFnsIsPast(selectedDatePart) && !dateFnsIsToday(selectedDatePart)) {
      disableAllTimes = true;
    }

    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeValue = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        let isDisabled = disableAllTimes;

        if (!isDisabled && selectedDatePart && dateFnsIsToday(selectedDatePart)) {
          // If selected date is today, disable past times
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          if (hour < currentHour || (hour === currentHour && minute < currentMinute)) {
            isDisabled = true;
          }
        }
        slots.push({ value: timeValue, disabled: isDisabled });
      }
    }
    return slots;
  }, [selectedDatePart]); // Depends only on the selected date part


  // ===== Synchronization Effect: Internal States -> Parent =====
  React.useEffect(() => {
    // If no date part is selected yet, the overall date/time is undefined.
    if (!selectedDatePart) {
      if (parentDateTime !== undefined) {
        setParentDateTime(undefined);
      }
      return;
    }

    // A date part is selected. Now, validate or correct the time string.
    const currentSlotInfo = timeSlots.find(slot => slot.value === selectedTimeString);

    if (currentSlotInfo && currentSlotInfo.disabled) {
      // The currently selected time is invalid for the selected date.
      // Attempt to find the first available time slot.
      const firstAvailableSlot = timeSlots.find(slot => !slot.disabled);
      if (firstAvailableSlot) {
        // A valid time slot is available. Update selectedTimeString and let the effect re-run.
        if (selectedTimeString !== firstAvailableSlot.value) {
          setSelectedTimeString(firstAvailableSlot.value);
        }
        return; // Exit and let the effect run again with the (potentially new) selectedTimeString.
      } else {
        // No available time slots for the selected date. The overall date/time is undefined.
        if (parentDateTime !== undefined) {
          setParentDateTime(undefined);
        }
        return;
      }
    }

    // At this point, selectedDatePart is valid, and selectedTimeString is valid for it (or was just corrected and effect will re-run).
    // Construct the new combined DateTime.
    const [hours, minutes] = selectedTimeString.split(':').map(Number);
    const newCombinedDateTime = new Date(selectedDatePart);
    newCombinedDateTime.setHours(hours, minutes, 0, 0);

    // Only update the parent if the new combined date/time is actually different.
    if (parentDateTime?.getTime() !== newCombinedDateTime.getTime()) {
      setParentDateTime(newCombinedDateTime);
    }
  }, [selectedDatePart, selectedTimeString, timeSlots, parentDateTime, setParentDateTime]);



  // Handler for Calendar date selection
  const handleDatePartSelect = (
    day: Date | undefined,
    selectedDay: Date, // Second arg from onSelect
    activeModifiers: any, // Third arg from onSelect (type from react-day-picker if needed, any for now)
    e: React.MouseEvent | React.KeyboardEvent // Fourth arg: the DOM event
  ) => {
    setSelectedDatePart(day ? startOfDay(day) : undefined);
    setIsCalendarOpen(false); // Close the popover when a date is selected

    // Prevent the event from causing further actions (e.g., form submission, bubbling)
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Handler for Time select change
  const handleTimeChange = (newTime: string) => { // Restored function signature
    setSelectedTimeString(newTime);
  };

  const calendarDisabledMatcher = (dayToEvaluate: Date) => {
    return dayToEvaluate < startOfDay(new Date());
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button" // Explicitly set type
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !parentDateTime && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {parentDateTime ? format(parentDateTime, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDatePart} 
            onSelect={handleDatePartSelect}
            initialFocus
            disabled={calendarDisabledMatcher}
          />
        </PopoverContent>
      </Popover>
      
      <div className="flex gap-2">
        <Select
          value={selectedTimeString} 
          onValueChange={handleTimeChange} 
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {timeSlots.map(slot => (
              <SelectItem key={slot.value} value={slot.value} disabled={slot.disabled}>
                {slot.value} 
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
