import React from "react";

const AddressInformation = ({ data }) => {
  const { location } = data;
  return (
    <div>
      <h2 className="mb-2 font-semibold text-lg">Address Information</h2>
      <p className="text-gray-700">{location}</p>
    </div>
  );
};

export default AddressInformation;
