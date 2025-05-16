import React from "react";
import { LANGUAGE_TO_FLAG } from "../constants";
import { Link } from "react-router";

function FriendCard({ friend }) {

  return (
    <div className="bg-base-200 hover:shadow-md transition-shadow">
      <div className="p-4 card-body">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullname} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullname}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge bg-purple-400 text-xs text-white">
            {getFlag(friend.nativeLang)}
            Native: {friend.nativeLang}
          </span>
          <span className="badge badge-outline text-xs ">
            {getFlag(friend.learningLang)}
            Learning: {friend.learningLang}

          </span>

        </div>
        <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
        Send message</Link>
      </div>
    </div>
  );
}

export default FriendCard;
export const  getFlag=(lang)=> {
  if (!lang) return null
  const langLower = lang.toLowerCase()
  const countrycode = LANGUAGE_TO_FLAG[langLower]
  return (
  <img src={countrycode? `https://flagcdn.com/24x18/${countrycode}.png` : null} alt={`${langLower} flag`} className="h3 mr-1 inline-block"/>
  );
}
