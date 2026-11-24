
"use client";

import {
  Autocomplete,
  Checkbox,
  TextField,
} from "@mui/material";

type Option = {
  id: string;
  name: string;
};

type Props<T extends Option> = {
  data: T[];
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  label?: string;
  error?: string;
};

const AutoCompleteCheckBox = <T extends Option,>({
  data,
  value,
  onChange,
  onBlur,
  label,
  error,
}: Props<T>) => {
  return (
    <Autocomplete<T, true, false, false>
      multiple
      disableCloseOnSelect
      options={data}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, selected) =>
        option.id === selected.id
      }
      value={data.filter((item) =>
        value.includes(item.id)
      )}
      onChange={(_, selectedOptions) => {
        onChange(selectedOptions.map((item) => item.id));
      }}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;

        return (
          <li key={key} {...optionProps}>
            <Checkbox
              checked={selected}
              sx={{ mr: 1 }}
            />
            {option.name}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="選択してください"
          onBlur={onBlur}
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};

export default AutoCompleteCheckBox;
