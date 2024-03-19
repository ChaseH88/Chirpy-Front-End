import { gql } from "@apollo/client";

export const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadFile($file: Upload!) {
    uploadImage(file: $file)
  }
`;
