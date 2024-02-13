import React, { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetCustomersQuery } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";

const Customers = () => {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetCustomersQuery({
    page,
    sort: JSON.stringify(sort),
    search,
  });

  const columns = [    {      field: "index",      headerName: "#",      flex: 0.5,      valueGetter: (params) => `${params.row.index + 1}`,    },    { field: "id", headerName: "ID", flex: 1 },    { field: "firstName", headerName: "First Name", flex: 1 },    { field: "lastName", headerName: "Last Name", flex: 1 },    { field: "email", headerName: "Email", flex: 1 },    { field: "location", headerName: "Location", flex: 1 },    { field: "occupation", headerName: "Occupation", flex: 1 },    {      field: "signUpDate",      headerName: "Sign Up Date",      flex: 1,      valueFormatter: (params) =>        new Date(params.value).toLocaleDateString("en-US"),    },  ];

  const processedRows = data
    ? data.map((row, index) => {
        return { ...row, index, id: row._id };
      })
    : [];

  const handlePrint = () => {
    const htmlContent = `
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
        <h2>Customers Report</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Occupation</th>
              <th>Sign Up Date</th>
            </tr>
          </thead>
          <tbody>
            ${processedRows
              .map(
                (row) => `
                  <tr>
                    <td>${row.index + 1}</td>
                    <td>${row.id}</td>
                    <td>${row.firstName}</td>
                    <td>${row.lastName}</td>
                    <td>${row.email}</td>
                    <td>${row.location}</td>
                    <td>${row.occupation}</td>
                    <td>${new Date(row.signUpDate).toLocaleDateString(
                      "en-US"
                      )}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
          </html>
        `;
        
        const printWindow = window.open("", "_blank");
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
      };

      return (
      <Box m="1.5rem 2.5rem">
      <Header title="CUSTOMERS" subtitle="See all customers." />
      <Box
      height="75vh"
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
      getRowId={(row) => row.id}
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
      handlePrint,
      search,
      },
      }}
      />
      </Box>
      </Box>
      );
      };
      
      export default Customers;
