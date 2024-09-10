import { FaStar, FaRegStar} from 'react-icons/fa';
import '../styles/StarRating.css';

export interface Props {
    rating: number;
}

export default function StarRating(props: Props) {
    const numStars = Math.round(props.rating/2);
   
    const fullStars = [];
    const emptyStart = [];
    for (let i =0; i < 5; i++) {
        if (i < numStars) {
            fullStars.push(i);
            continue;
        }
        emptyStart.push(i);
    }

    return (
        <div className='movie-rate'>
            {fullStars.map(index => 
                <FaStar key={index} />
            )}

            {emptyStart.map(index =>
                <FaRegStar key={index} />
            )}
        </div>
    );
}