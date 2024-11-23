import React from "react";

const ProfileDescription = ({ data }) => {
  const { description } = data;
  return (
    <div>
      <h2 className="mb-2 font-semibold text-lg">Profile Description</h2>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default ProfileDescription;
