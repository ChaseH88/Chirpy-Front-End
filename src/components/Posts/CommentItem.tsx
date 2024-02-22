import { Box, Typography } from "@mui/material";
import moment from "moment";
import { CommentInterface } from "../../types/interfaces";

interface CommentItemProps extends CommentInterface {}

export const CommentItem = ({
  comment,
  createdAt,
  user: { username },
}: CommentItemProps) => (
  <Box
    className="comment"
    mb={2}
    mx={2}
    p={2}
    borderBottom={1}
    borderColor={"primary.main"}
    bgcolor={"#f3f3f3"}
    borderRadius={3}
  >
    <Box>
      <Typography variant="body1">{comment}</Typography>
    </Box>
    <Box
      display={"flex"}
      justifyContent={"flex-start"}
      mt={1}
      alignItems={"center"}
    >
      <Typography
        variant="body2"
        fontSize={12}
        mr={0.5}
        fontWeight={700}
        fontStyle={"italic"}
      >
        {`${username} -`}
      </Typography>
      <Typography
        fontSize={12}
        variant="body2"
        fontStyle={"italic"}
        title={moment(createdAt).format("MMMM Do YYYY, h:mm:ss a")}
      >
        {moment(createdAt).fromNow()}
      </Typography>
    </Box>
  </Box>
);
