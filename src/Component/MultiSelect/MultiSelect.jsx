import React, { useEffect, useState } from "react";
import Select from "react-select";

export default function MultiSelectDropdown({
  data,
  placeholderName,
  selectedSKU,
  isEmpty,
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Function triggered on selection
  function handleSelect(data) {
    setSelectedOptions(data);
    selectedSKU(data);
  }

  useEffect(() => {
    if (isEmpty) {
      setSelectedOptions([]);
    }
  }, [isEmpty]);
  return (
    <div>
      <Select
        options={data}
        placeholder={placeholderName}
        value={selectedOptions}
        onChange={handleSelect}
        isSearchable={true}
        isMulti
      />
    </div>
  );
}
