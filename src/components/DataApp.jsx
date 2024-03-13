import React from "react";
import {
  fetchSampleData,
  fetchFullData,
  saveCSV,
} from "../services/fetchData.js";

import { Table } from "@radix-ui/themes";
import InputRepo from "./InputRepo.jsx";

function DataApp() {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  function handleFetch(owner, repo) {
    setIsLoading(true);
    try {
      fetchSampleData(owner, repo).then((data) => {
        setData(data);
        setIsLoading(false);
      });
    } catch (error) {
      console.info(error);
    }
  }

  //TODO: refactor with input component, combine both fetch functions.
  function handleFetchAll(owner, repo) {
    setIsLoading(true);
    try {
      fetchFullData(owner, repo).then((data) => {
        setData(data);
        setIsLoading(false);
      });
    } catch (error) {
      console.info(error);
    }
  }

  function handleDownload() {
    saveCSV(data);
  }

  return (
    <>
      <InputRepo
        handleFetch={handleFetch}
        handleFetchAll={handleFetchAll}
        handleDownload={handleDownload}
        loadingStatus={isLoading}
      />
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Additions</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Deletions</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(
            ({ sha, author, email, date, additions, deletions, total }) => (
              <Table.Row key={sha}>
                <Table.RowHeaderCell>{author}</Table.RowHeaderCell>
                <Table.Cell>{email}</Table.Cell>
                <Table.Cell>{date}</Table.Cell>
                <Table.Cell>{additions}</Table.Cell>
                <Table.Cell>{deletions}</Table.Cell>
                <Table.Cell>{total}</Table.Cell>
              </Table.Row>
            ),
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
}

export default DataApp;
