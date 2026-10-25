import { Search } from "lucide-react";
import Input from "../ui/Input";

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const SearchInput = ({
  value,
  placeholder = "Rechercher...",
  onChange
}: SearchInputProps) => {
  return (
    <div className="search-box">
      <Search />
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
};

export default SearchInput;
