import { gql } from "@apollo/client";

export const DELETE_IMAGE_MUTATION = gql`
  mutation DeleteImage($imageId: ID!) {
    deleteImage(imageId: $imageId)
  }
`;
