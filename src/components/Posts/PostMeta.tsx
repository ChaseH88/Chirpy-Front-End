import { Box, Typography } from "@mui/material";
import moment from "moment";
import { PostModelInterface, UserModelInterface } from "../../types/interfaces";

interface PostMetadataProps
  extends Pick<PostModelInterface, "createdAt">,
    Pick<UserModelInterface, "username"> {}

export const PostMetadata = ({ username, createdAt }: PostMetadataProps) => (
  <Box className="postedBy" display="flex" justifyContent="flex-end" p={2}>
    <Typography variant="body2" fontStyle={"italic"} fontWeight={700} mr={1}>
      {username}
    </Typography>{" "}
    -
    <Typography variant="body2" ml={1}>
      {moment(createdAt).format("MMMM Do YYYY, h:mm:ss a")}
    </Typography>
  </Box>
);
