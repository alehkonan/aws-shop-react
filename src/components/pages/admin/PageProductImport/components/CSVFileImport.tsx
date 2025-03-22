import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { HttpStatusCode, isAxiosError } from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      const token = localStorage.getItem("authorization_token");
      // Get the presigned URL
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          Authorization: token && `Basic ${token}`,
        },
      });
      const result = await fetch(response.data, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      setFile(undefined);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          window.dispatchEvent(
            new CustomEvent<AlertDetail>("alert", {
              detail: {
                message:
                  "Can not upload file. Status code is 401 Unauthorized. Please, check if token exists",
              },
            })
          );
          return;
        }
        if (error.response?.status === HttpStatusCode.Forbidden) {
          window.dispatchEvent(
            new CustomEvent<AlertDetail>("alert", {
              detail: {
                message:
                  "Can not upload file. Status code is 403 Forbidden. Please, check if token is valid",
              },
            })
          );
          return;
        }
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
