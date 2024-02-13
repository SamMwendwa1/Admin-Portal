import React, { useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, useTheme } from "@mui/material";
import { useGetDataQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";

const Data = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetDataQuery();
  const [selectedDataType, setSelectedDataType] = useState("");
  const [search, setSearch] = useState("");

  const handleChange = (event) => {
    setSelectedDataType(event.target.value);
  };

  const getDisplayFileType = (file) => {
    const fileMetadata = JSON.parse(file.value);
    const mimeType = fileMetadata.mimetype;

    if (mimeType.startsWith("image/")) {
      return "Image";
    } else if (mimeType.startsWith("video/")) {
      return "Video";
    } else if (mimeType === "application/pdf") {
      return "PDF";
    } else {
      return "Other";
    }
  };

  const columns = [
    {
      field: "index",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.5,
    },
    {
      field: "user",
      headerName: "User",
      flex: 1,
    },
    {
      field: "size",
      headerName: "Size",
      flex: 0.5,
    },
    {
      field: "date",
      headerName: "Date Modified",
      flex: 1,
    },
  ];

  const processedRows = selectedDataType
    ? data[selectedDataType].map((file, index) => {
        const fileMetadata = JSON.parse(file.value);
        return {
          id: file._id,
          index: index + 1,
          type: getDisplayFileType(file),
          user: file.user,
          size: `${fileMetadata.size} Bytes`,
          date: new Date(file.createdAt).toLocaleDateString(),
        };
      })
    : [];

  const handlePrint = () => {
    const htmlContent = `
      <html>
      <head>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { text-align: left; padding: 8px
          }
          </style>
        </head>
        <body>
          <h2>Data Report</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Type</th>
                <th>User</th>
                <th>Size</th>
                <th>Date Modified</th>
              </tr>
            </thead>
            <tbody>
              ${processedRows
                .filter((row) => {
                  const searchFields = ["type", "user", "size", "date"];
                  const searchValue = search.toLowerCase().trim();
                  return (
                    searchValue === "" ||
                    searchFields.some(
                      (field) =>
                        row[field].toString().toLowerCase().indexOf(searchValue) > -1
                    )
                  );
                })
                .map(
                  (row) => `
                    <tr>
                      <td>${row.index}</td>
                      <td>${row.id}</td>
                      <td>${row.type}</td>
                      <td>${row.user}</td>
                      <td>${row.size}</td>
                      <td>${row.date}</td>
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
    <Header title="DATA" subtitle="See all data." />
    <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Data Type</InputLabel>
        <Select label="Data Type" value={selectedDataType} onChange={handleChange}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="uploadedFilesData">Uploaded Files</MenuItem>
          <MenuItem value="filesInBinData">Files in Bin</MenuItem>
        </Select>
      </FormControl>
      {selectedDataType && (
    <Box
    mt="40px"
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
      )}
    </Box>
    );
    };
    
    export default Data;