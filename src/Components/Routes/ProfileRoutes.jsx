import React from "react";
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
import axios from "axios";
import ProfileHeader from "../Profile/ProfileHeader";

const getUser = async (user_id) => {
  const response = await fetch(
    `https://backend-qyb4mybn.b4a.run/profile/user/${user_id}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const getServices = async (user_id) => {
  const response = await axios.get(
    `https://backend-qyb4mybn.b4a.run/serviceProvider/get-user-services/${user_id}`
  );
  return response.data;
};

const ProfileRoutes = () => {
  const { currentUser } = useSelector((state) => state.user);
  const user_id = currentUser?._id;
  const location = useLocation();

  const { updated, userId } = location.state || {};
  const idToUse = userId || user_id;

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["user", user_id],
    queryFn: () => getUser(idToUse),
  });

  const {
    data: servicesData,
    error: servicesError,
    isLoading: servicesLoading,
  } = useQuery({
    queryKey: ["services", user_id],
    queryFn: () => getServices(idToUse),
  });

  if (userLoading || servicesLoading) {
    return <Loader />;
  }

  if (userError || servicesError) {
    return <div>Error: {userError?.message || servicesError?.message}</div>;
  }

  // Data Validation
  const profileData = {
    name: userData?.name || "No Name Provided",
    email: userData?.email || "No Email Provided",
    profile_image: userData?.profile_image || "",
    about: userData?.profile_description || "No Description Provided",
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
              user_type: currentUser.user_type,
            }}
          />
          <AboutSection data={{ about: profileData.about }} />
          <SkillsSection data={{ skills: profileData.skills }} />
          <LanguagesSection data={{ languages: profileData.languages }} />
          <AddressInformation data={{ location: profileData.location }} />
          <ProfileDescription data={{ description: profileData.about }} />
        </div>
      </div>
    </>
  );
};

export default ProfileRoutes;
