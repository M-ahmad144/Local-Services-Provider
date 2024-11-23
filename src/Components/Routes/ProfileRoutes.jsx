import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Loader from "../loader";
import AboutSection from "../Profile/AboutSection";
import SkillsSection from "../Profile/SkillsSection";
import LanguagesSection from "../Profile/LanguagesSection";
import AddressInformation from "../Profile/AddressInformation";
import ProfileDescription from "../Profile/ProfileDescription";
import ProfileHeader from "../Profile/ProfileHeader";
import axios from "axios";

const getUser = async (user_id) => {
  const response = await fetch(
    `https://backend-qyb4mybn.b4a.run/profile/user/${user_id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
};

const ProfileRoutes = () => {
  const { currentUser } = useSelector((state) => state.user);
  const user_id = currentUser?._id;
  const location = useLocation();

  const { updated, userId } = location.state || {};
  const idToUse = userId || user_id;

  const {
    data: userData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user", user_id],
    queryFn: () => getUser(idToUse),
  });

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [error]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return null;
  }

  const profileData = {
    name: userData?.name || "No Name Provided",
    email: userData?.email || "No Email Provided",
    profile_image: userData?.profile_image || "",
    profile_description:
      userData?.profile_description || "No Description Provided",
    skills: userData?.skills || [],
    languages: userData?.language || [],
    location: userData?.location || "No Address Provided",
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-[#F7F9FC] p-6 min-h-screen text-[#333] transition-colors duration-300">
        <div className="border-[#E1E4E8] bg-white shadow-lg mx-auto p-6 border rounded-lg max-w-4xl">
          <ProfileHeader
            data={{
              name: profileData.name,
              email: profileData.email,
              profile_image: profileData.profile_image,
              updated: updated,
              user_type: currentUser?.user_type || "User",
            }}
          />
          <AboutSection data={{ about: profileData.profile_description }} />
          <SkillsSection data={{ skills: profileData.skills }} />
          <LanguagesSection data={{ languages: profileData.languages }} />
          <AddressInformation data={{ location: profileData.location }} />
          <ProfileDescription
            data={{ description: profileData.profile_description }}
          />
        </div>
      </div>
    </>
  );
};

export default ProfileRoutes;
