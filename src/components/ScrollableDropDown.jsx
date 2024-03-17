import AsyncSelect from "react-select/async";

function ScrollableDropDown({ options, loadingStatus }) {
  const filterOptions = (inputValue) => {
    return options.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'black',
      color: 'white',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'black',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'grey' : 'black',
      color: 'white',
      '&:hover': {
        backgroundColor: 'grey',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions={options}
      defaultValue={options[0]}
      loadingStatus={loadingStatus}
      styles={customStyles}
    />
  );
}

export default ScrollableDropDown;
