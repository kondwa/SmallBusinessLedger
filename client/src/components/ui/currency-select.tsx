import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@shared/schema";
import { FormControl } from "./form";

interface CurrencySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  defaultCurrency?: string;
}

export function CurrencySelect({ value, onValueChange, defaultCurrency = "USD" }: CurrencySelectProps) {
  return (
    <Select onValueChange={onValueChange} value={value || defaultCurrency}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {SUPPORTED_CURRENCIES.map((currency) => (
          <SelectItem key={currency} value={currency}>
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
