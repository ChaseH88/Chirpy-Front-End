import { useMutation } from "@apollo/client";
import { useAppData } from "../../hooks/useAppData";
import { UPLOAD_IMAGE_MUTATION } from "../../graphql/mutations/upload-image";
import { useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { CURRENT_USER_QUERY } from "../../graphql/queries/current-user";

interface ImageManagerProps {}

export const ImageManager = (_: ImageManagerProps) => {
  const [uploadImage] = useMutation(UPLOAD_IMAGE_MUTATION);
  const { currentUser } = useAppData();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const images = useMemo(() => currentUser?.images || [], [currentUser]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage({
        variables: {
          file,
        },
        refetchQueries: [{ query: CURRENT_USER_QUERY }],
      });
    }
  };

  const handleSetProfilePhoto = async (id: string) => {
    console.log("Setting profile photo to", id);
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting image with id", id);
  };

  console.log(selectedImage);
  return (
    <Box>
      <Box className="container" minWidth={"500px"}>
        <Box className="title" borderBottom="1px solid #ccc" pb={2} mb={2}>
          <Typography variant="h4">Image Manager</Typography>
        </Box>
        {!showUpload ? (
          <Box className="images" mt={4}>
            {images.map((image) => (
              <Box
                key={image.id}
                className="image"
                p={1}
                onClick={() => {
                  setSelectedImage(image.id);
                }}
                display="inline-block"
                sx={{
                  ...(selectedImage === image.id && {
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: "5px",
                  }),
                }}
              >
                <img
                  src={image.thumbnailUrl}
                  alt={image.name}
                  style={{ maxWidth: "100%", height: "100px" }}
                />
                <Box className="name">{image.name}</Box>
              </Box>
            ))}
          </Box>
        ) : (
          <>
            <Box border="2px dashed #ccc" p={3} mb={2} textAlign="center">
              <input
                type="file"
                id="image-upload"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
              <Button component="label" htmlFor="image-upload">
                Click to upload
              </Button>
            </Box>
            <Box
              className="controls"
              display="flex"
              justifyContent="flex-end"
              gap={2}
              width="100%"
            >
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  setShowUpload(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          </>
        )}
        <Box
          className="controls"
          display="flex"
          justifyContent="flex-end"
          mt={4}
          gap={2}
          width="100%"
        >
          {selectedImage?.length ? (
            <>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => {
                  handleDelete(selectedImage);
                }}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  setSelectedImage(null);
                  setShowUpload(false);
                }}
              >
                Deselect
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  handleSetProfilePhoto(selectedImage);
                }}
              >
                Set as Profile Photo
              </Button>
            </>
          ) : (
            !showUpload && (
              <Button
                variant="contained"
                color="primary"
                component="label"
                size="small"
                htmlFor="image-upload"
                onClick={() => {
                  setShowUpload(true);
                }}
              >
                Upload
              </Button>
            )
          )}
        </Box>
      </Box>
    </Box>
  );
};
