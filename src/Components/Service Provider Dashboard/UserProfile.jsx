import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dummyimg from "../../assets/dummy.png";
import axios from "axios";

const UserProfile = () => {
  // Sample user details (replace with real data or props)
  const { currentUser } = useSelector((state) => state.user);
  const getRatings = async () => {
      const ratings = await axios.get(
          "http://localhost:8080/serviceProvider/ratings/" + currentUser._id
        );
        console.log(ratings)
        return ratings.data;
    };
    const [ratings, setRatings] = useState();
    useEffect(() => {
        getRatings().then((res) => {
          setRatings(res.avgRating);
        });
    }, []);

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center space-x-4">
          {/* User image */}
          <img
            src={currentUser?.profile_image || dummyimg}
            alt="User Avatar"
            className="w-16 h-16 rounded-full object-cover"
          />

          {/* User info */}
          <div>
            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            {currentUser?.user_type == "service provider" && (
              <div className="flex items-center text-yellow-500">
                {/* Display rating */}
                <p className="text-lg font-semibold">{ratings} / 5</p>
                <svg
                  className="w-5 h-5 fill-current text-yellow-500 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 3a1 1 0 011.902 0l1.025 3.157h3.299a1 1 0 01.592 1.81l-2.68 1.947 1.025 3.156a1 1 0 01-1.538 1.1L10 12.347l-2.672 1.923a1 1 0 01-1.537-1.1l1.024-3.156-2.68-1.947a1 1 0 01.593-1.81h3.298L9.049 3z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
