import type { ComponentProps } from "react";

import { DateInput } from "@heroui/date-input";
import { parseDate } from "@internationalized/date";

type DateInputValue = ComponentProps<typeof DateInput>["value"];

type Props = Omit<ComponentProps<typeof DateInput>, "value"> & {
  value?: Date | string | null; // formato "aaaa-mm-dd"
};

const classNames = {
  inputWrapper: ["border", "dark:hover:border-green-800", "dark:group-data-[focus=true]:border-green-800"],
};

export const DateInputCustom = ({ value, ...props }: Props) => {
  const parsedValue = isValidISODate(value) ? parseDate(value) : undefined;

  return (
    <DateInput
      {...props}
      classNames={classNames}
      labelPlacement="outside"
      radius="sm"
      value={parsedValue as DateInputValue}
      variant="faded"
    />
  );
};

function isValidISODate(date: unknown): date is string {
  return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
}