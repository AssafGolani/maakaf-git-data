import AsyncSelect from "react-select/async";

export default function ScrollableDropDown({ options, loadingStatus }) {
  const filterOptions = (inputValue) => {
    const mOptions = options;
    const selectedOption = mOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    return selectedOption;
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions={options}
      defaultValue={options[0]}
      loadingStatus={loadingStatus}
    />
  );
}
