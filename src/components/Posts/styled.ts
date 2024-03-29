import { Paper } from "@mui/material";
import styled from "styled-components";

export const Container = styled(Paper)`
  padding: 3em;
  margin: 0 auto;
  max-width: 95%;
  min-width: 500px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

export const PostContainer = styled(Paper)`
  padding: 1em;
  margin: 0 0 3em;
  border-radius: 10px !important;
  background-color: #fff !important;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3) !important;
  position: relative;
`;
