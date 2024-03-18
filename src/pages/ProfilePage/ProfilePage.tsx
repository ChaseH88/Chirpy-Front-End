import { useAppData } from "../../hooks/useAppData";
import { DashboardLayout } from "../../components/DashboardLayout";
import {
  Box,
  Button,
  CircularProgress,
  Input,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { UserProfilePhoto } from "../../components/UserProfilePhoto";
import { Posts } from "../../components/Posts/Posts";
import { useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { GET_USER_BY_USERNAME_QUERY } from "../../graphql/queries/get-user-by-username";
import { FOLLOW_USER } from "../../graphql/mutations/follow-user";
import { EDIT_USER_MUTATION } from "../../graphql/mutations/edit-user";
import { CURRENT_USER_QUERY } from "../../graphql/queries/current-user";
import { GET_DASHBOARD_POSTS } from "../../graphql/queries/get-dashboard-posts";

const ProfilePage = () => {
  const { currentUser } = useAppData();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { username } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { data, loading } = useQuery(GET_USER_BY_USERNAME_QUERY, {
    variables: {
      username,
    },
  });
  const editProfileFormHook = useForm({
    reValidateMode: "onChange",
  });

  const [followUser, { loading: followUserLoad }] = useMutation(FOLLOW_USER);
  const [editUser] = useMutation(EDIT_USER_MUTATION);

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

  const handleSubmit = async () => {
    setShowEditProfile(false);
    try {
      if (!Object.values(editProfileFormHook.getValues()).every(Boolean)) {
        return;
      }

      await editUser({
        variables: {
          id: currentUser!.id,
          data: editProfileFormHook.getValues(),
        },
        refetchQueries: [CURRENT_USER_QUERY],
      });
      editProfileFormHook.reset();
      enqueueSnackbar("Profile updated", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
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
                      {!showEditProfile ? (
                        <Typography variant="body2">
                          {`
                          ${data?.findUserByUsername.firstName || ""} 
                          ${data?.findUserByUsername.lastName || ""}
                        `}
                        </Typography>
                      ) : (
                        <>
                          <Input
                            placeholder="First Name"
                            defaultValue={data?.findUserByUsername.firstName}
                            onChange={(e) => {
                              editProfileFormHook.setValue(
                                "firstName",
                                e.target.value
                              );
                            }}
                            sx={{
                              fontSize: 12,
                              maxWidth: 100,
                            }}
                          />
                          <Input
                            placeholder="Last Name"
                            defaultValue={data?.findUserByUsername.lastName}
                            onChange={(e) => {
                              editProfileFormHook.setValue(
                                "lastName",
                                e.target.value
                              );
                            }}
                            sx={{
                              fontSize: 12,
                              maxWidth: 100,
                            }}
                          />
                        </>
                      )}
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
                    {isCurrentUser && (
                      <Box mt={1} display="flex" gap={2}>
                        <Button
                          variant={showEditProfile ? "outlined" : "contained"}
                          color="primary"
                          onClick={() => setShowEditProfile(!showEditProfile)}
                        >
                          {showEditProfile ? "Cancel" : "Edit Profile"}
                        </Button>
                        {showEditProfile && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                          >
                            Save
                          </Button>
                        )}
                      </Box>
                    )}
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
                    {showEditProfile ? (
                      <Input
                        fullWidth
                        type="textarea"
                        defaultValue={data?.findUserByUsername.bio}
                        onChange={(e) => {
                          editProfileFormHook.setValue("bio", e.target.value);
                        }}
                      />
                    ) : (
                      <Typography variant="body1">
                        {data?.findUserByUsername.bio}
                      </Typography>
                    )}
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
    />
  );
};

export { ProfilePage };
