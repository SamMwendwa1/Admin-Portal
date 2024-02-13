import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";

const printData = (columns, rows) => {
  let htmlContent = `
    <html>
    <head>
      <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 8px; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        th { background-color: #f1f1f1; color: black; }
      </style>
    </head>
    <body>
      <h2>Transactions Report</h2>
      <table>
        <thead>
          <tr>
  `;

  columns.forEach((column) => {
    htmlContent += `<th>${column.headerName}</th>`;
  });

  htmlContent += `
          </tr>
        </thead>
        <tbody>
  `;

  rows.forEach((row) => {
    htmlContent += '<tr>';
    columns.forEach((column) => {
      htmlContent += `<td>${row[column.field]}</td>`;
    });
    htmlContent += '</tr>';
  });

  htmlContent += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
};

const Transactions = () => {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetTransactionsQuery({
    page,
    sort: JSON.stringify(sort),
    search,
  });

  const columns = [
    {
      field: "index",
      headerName: "#",
      flex: 0.5,
      valueGetter: (params) => `${params.row.index + 1}`,
    },
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
    },
    {
      field: "user",
      headerName: "User",
      flex: 1,
    },
    {
      field: "file",
      headerName: "File",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString("en-US"),
    },
  ];

  const processedRows = data
    ? data.map((row, index) => {
        return { ...row, index };
      })
    : [];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={processedRows}
          columns={columns}
          pagination
          page={page}
          paginationMode="server"
          sortingMode="server"
          onSortModelChange={(newSortModel) => {
            if (newSortModel.length > 0) {
              const { field, sort } = newSortModel[0];
              setSort({ field, sort });
            } else {
              setSort({});
            }
          }}
          onPageChange={(newPage) => setPage(newPage)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: {
              setSearch,
              handlePrint: () => printData(columns, processedRows),
              search,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;

