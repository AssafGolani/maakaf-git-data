import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

export default function ScrollableDropDown({ repositories, loadingStatus }) {
  const [reposName, setReposName] = useState([]);
  const filterOptions = (inputValue) => {
    const repos = reposName;
    const selectedOption = repos.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    return selectedOption;
  };

  useEffect(() => {
    let repositoriesArray = [];
    if (repositories && repositories.length > 0) {
      repositoriesArray = repositories.map((repository) => {
        return { value: repository.name, label: repository.name };
      });
      console.log(
        "ReposName: " +
          JSON.stringify(repositoriesArray) +
          " " +
          repositoriesArray.length
      );
      setReposName(repositoriesArray);
    }
  }, [repositories]);

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue));
    }, 1000);
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions={reposName}
      defaultValue={reposName[0]}
      loadingStatus={loadingStatus}
    />
  );
}
