import AsyncSelect from "react-select/async";

export default function ScrollableDropDown({ repositories, loadingStatus }) {
  const filterOptions = (inputValue) => {
    const repos = handleExtractNameOfOptions();
    const selectedOption = repos.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    return selectedOption;
  };

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
  };

  const handleExtractNameOfOptions = () => {
    return repositories.forEeach((repository) =>
      repository.map((repo) => repo.name)
    );
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      loadingStatus={loadingStatus}
    />
  );
}
