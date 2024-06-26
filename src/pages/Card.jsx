import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { UserAuth } from '../context/AuthContext';
import { db } from '../Firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';

const IMG_API = 'https://image.tmdb.org/t/p/w1280';
const defaultImage = 'https://images.unsplash.com/photo-1581905764498-f1b60bae941a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80';

const Card = ({ media, onDelete, showDeleteButton }) => {
    const [like, setLike] = useState(false);
    const [saved, setSaved] = useState(false);
    const { user } = UserAuth();

    const movieID = doc(db, 'users', `${user?.email}`);

    const saveShow = async () => {
        if (user?.email) {
            setLike(!like);
            setSaved(true);
            await updateDoc(movieID, {
                savedShows: arrayUnion({
                    id: media.id,
                    title: media.title || media.name,
                    img: media.poster_path,
                    overview: media.overview,
                    vote_average: media.vote_average,
                }),
            });
        } else {
            alert('Please log in to save a movie');
        }
    };

    const setVoteClass = vote => {
        if (vote >= 8) {
            return 'text-yellow-500';
        } else if (vote >= 6) {
            return 'text-white';
        } else {
            return 'text-red-500';
        }
    };

    const posterPath = media.poster_path ? `${IMG_API}/${media.poster_path}` : defaultImage;

    return (
        <div className="group overflow-hidden flex flex-col justify-between w-96 h-[41rem] bg-gray-700 rounded-2xl cursor-pointer relative">
            {showDeleteButton && (
                <button onClick={onDelete} className="absolute top-2 right-2 text-amber-300 text-3xl rounded px-2 py-1 text-center">
                    X
                </button>
            )}
            <p onClick={saveShow}>{like ? <FaHeart className="absolute top-5 left-5 text-yellow-500 text-3xl" /> : <FaRegHeart className="absolute top-5 left-5 text-yellow-500 text-3xl" />}</p>
            <img className="w-full rounded-t-2xl" src={posterPath} alt={media.title || media.name} />
            <p className="p-5 text-lg text-white absolute bottom-0 left-0 translate-x-full group-hover:translate-x-0 transition duration-500 ease-in-out delay-150 bg-gray-700 rounded-b-2xl">
                {media.overview}
            </p>
            <div className="flex justify-between px-3 my-auto items-center">
                <h1 className="text-lg text-white text-center">{media.title || media.name}</h1>
                <div className="flex items-center gap-1 bg-black p-1 pr-2 rounded-md">
                    <AiFillStar color="#F5C518" fontSize={20} />
                    <p className={`${setVoteClass(media.vote_average)} font-bold`}>{media.vote_average}</p>
                </div>
            </div>
        </div>
    );
};

export default Card;
