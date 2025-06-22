import React, { useState } from "react";

const GroupCard = ({ group }) => {
  const [showMembers, setShowMembers] = useState(false);

  const toggleMembers = () => {
    setShowMembers((prev) => !prev);
  };

  return (
    <div className="bg-white p-4 mb-3 rounded-xl shadow-md">
      <h2
        onClick={toggleMembers}
        className="text-lg font-bold cursor-pointer hover:text-blue-600"
      >
        {group.name}
      </h2>

      {showMembers && (
        <ul className="mt-2 pl-4 text-sm text-gray-700 list-disc">
          {group.members.map((member) => (
            <li key={member._id}>{member.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupCard;
