import React from "react";

const ProfileDescription = ({ data }) => {
  const { description } = data;

  return (
    <div className="mt-6">
      <h2 className="mb-2 font-bold text-xl">Profile Description</h2>
      <p>{description || "No Description Available"}</p>
    </div>
  );
};

export default ProfileDescription;
