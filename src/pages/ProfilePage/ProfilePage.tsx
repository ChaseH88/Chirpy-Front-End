import { useAppData } from "../../hooks/useAppData";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Avatar } from "../../components/Avatar";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_BY_USERNAME_QUERY } from "./queries";
import { UserProfilePhoto } from "../../components/UserProfilePhoto";
import { Posts } from "../../components/Posts/Posts";
import { useMemo } from "react";
import { FOLLOW_USER } from "./mutations";
import { useSnackbar } from "notistack";
import { CURRENT_USER_QUERY } from "../../providers/AppData/queries";
import { GET_DASHBOARD_POSTS } from "../DashboardPage/queries";

const ProfilePage = () => {
  const { currentUser } = useAppData();
  const { username } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { data, loading } = useQuery(GET_USER_BY_USERNAME_QUERY, {
    variables: {
      username,
    },
  });
  const [followUser, { loading: followUserLoad }] = useMutation(FOLLOW_USER);

  const handleFollowUser = async (id: string) => {
    const res = await followUser({
      variables: {
        userId: id,
      },
      refetchQueries: [
        { query: GET_USER_BY_USERNAME_QUERY, variables: { username } },
        { query: CURRENT_USER_QUERY },
        { query: GET_DASHBOARD_POSTS },
      ],
    });
    if (res?.data?.followUser) {
      enqueueSnackbar(res?.data?.followUser, {
        variant: "info",
      });
    }
  };

  const isCurrentUser = useMemo(
    () => currentUser?.username === username,
    [currentUser, username]
  );

  const isFollowing = useMemo(
    () => currentUser?.following?.some((f) => f.username === username),
    [currentUser, username]
  );

  return (
    <DashboardLayout
      PostsComponent={() => (
        <>
          <Box
            p={6}
            borderRadius={3}
            sx={{
              backgroundColor: "white",
            }}
          >
            {loading && !data?.findUserByUsername ? (
              <CircularProgress />
            ) : (
              <Box>
                <Box>
                  <Box
                    className="header"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexWrap="wrap"
                    borderBottom="1px solid #eee"
                    pb={2}
                  >
                    <Box
                      flex={"1 1 100%"}
                      display="flex"
                      justifyContent="center"
                    >
                      <UserProfilePhoto icon={data?.findUserByUsername.photo} />
                    </Box>
                    <Box
                      flex={"1 1 100%"}
                      display="flex"
                      justifyContent="center"
                      mt={2}
                    >
                      <Typography variant="h6" fontWeight="bold" fontSize={30}>
                        {data?.findUserByUsername.username}
                      </Typography>
                    </Box>
                    <Box
                      flex={"1 1 100%"}
                      display="flex"
                      justifyContent="center"
                      mt={2}
                      gap={2}
                    >
                      <Typography variant="body2">
                        {data?.findUserByUsername.followers?.length || 0}{" "}
                        follower
                        {data?.findUserByUsername.followers?.length !== 1
                          ? "s"
                          : ""}
                      </Typography>
                      <Typography variant="body2">
                        {data?.findUserByUsername.following?.length || 0}{" "}
                        following
                      </Typography>
                    </Box>
                    {currentUser?.id !== data?.findUserByUsername.id && (
                      <Box
                        flex={"1 1 100%"}
                        display="flex"
                        justifyContent="center"
                        mt={2}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleFollowUser(data?.findUserByUsername.id)
                          }
                          disabled={followUserLoad}
                        >
                          {!isCurrentUser && isFollowing
                            ? "Following"
                            : "Not Following"}
                        </Button>
                      </Box>
                    )}
                  </Box>
                  <Box className="content" mt={2} p={2}>
                    <Typography variant="body1">
                      {data?.findUserByUsername.bio}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          {!loading && data?.findUserByUsername && (
            <Box className="posts" mt={4}>
              <Posts
                posts={data?.findUserByUsername.posts}
                commentsToShow={2}
              />
            </Box>
          )}
        </>
      )}
      AvatarComponent={() => (
        <Box>
          <Avatar user={currentUser!} />
        </Box>
      )}
    />
  );
};

export { ProfilePage };
