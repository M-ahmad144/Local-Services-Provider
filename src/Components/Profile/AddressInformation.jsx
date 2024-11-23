import React from "react";

const AddressInformation = ({ data }) => {
  const { location } = data;

  return (
    <div className="mt-6">
      <h2 className="mb-2 font-bold text-xl">Address Information</h2>
      <p>{location || "No Address Provided"}</p>
    </div>
  );
};

export default AddressInformation;
