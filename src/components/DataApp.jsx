import React from "react";
import fetchData from "../fetchData.js";
import {Button, Table} from "@radix-ui/themes";
import InputRepo from "./InputRepo.jsx";
import { downloadCSV, convertArrayToCSV } from "../formatCSV.js";

function DataApp() {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  function handleFetch(owner, repo) {
    setIsLoading(true);
    try {
      fetchData(owner, repo).then((data) => {
        setData(data);
        setIsLoading(false);
      });
    } catch (error) {
      console.info(error);
   }
  }


  function handleDownload() {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Not sure if there is a cleaner way to do this in React.
      link.href = url;
      link.download = 'Maakaf-Data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

  return (
    <>
      <InputRepo
        handleFetch={handleFetch}
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
          {data.map(({ sha, author, email, date, additions, deletions }) => (
            <Table.Row key={sha}>
              <Table.RowHeaderCell>{author}</Table.RowHeaderCell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>{date}</Table.Cell>
              <Table.Cell>{additions}</Table.Cell>
              <Table.Cell>{deletions}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}

export default DataApp;