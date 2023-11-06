import React from "react";
import axios from 'axios';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { getAuthToken } from '~/utils/utils';

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File | null>();

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
    if (!file) {
      return console.error('No file uploaded!');
    }
    console.log("uploadFile to", url);

    // Get the pre-signed URL
    let preSignedUrlResponse;
    try {
      preSignedUrlResponse = await axios({
        method: "GET",
        headers: {
          Authorization: `Basic ${getAuthToken()}`
        },
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
      });
    } catch (error: any) {
      if (error?.status === 401) {
        return console.error('Not authorized', error);
      }
      if (error?.status === 403) {
        return console.error('Access denied', error);
      }
    }
    if (!preSignedUrlResponse?.data) {
      return console.error('Signed URL is undefined');
    }
    console.log("File to upload: ", file.name);
    console.log("Uploading to: ", preSignedUrlResponse.data);
    const result = await fetch(preSignedUrlResponse.data, {
      method: "PUT",
      body: file,
    });
    console.log("Result: ", result);
    setFile(null);
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
