import { CalendarIcon } from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { INSERT_DATETIME_COMMAND } from "@/components/editor-x/date-time-extension";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function DateTimePickerPlugin(dictionary: Dictionary) {
  return new ComponentPickerOption(dictionary.editor.dateTime.date, {
    icon: <CalendarIcon className="size-4" />,
    keywords: ["date", "calendar", "time", "today"],
    onSelect: (_, editor) => {
      const dateTime = new Date();
      dateTime.setHours(0, 0, 0, 0); // Set time to midnight
      editor.dispatchCommand(INSERT_DATETIME_COMMAND, { dateTime });
    },
  });
}
