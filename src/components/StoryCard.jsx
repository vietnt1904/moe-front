import { Badge } from '@mantine/core';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const StoryCard = ({ story}) => {
    StoryCard.propTypes = {
        story: PropTypes.object.isRequired,
      };
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/story/${story?.title}`);
  };

  const isExternalImage = story?.image?.startsWith('http://') || story?.image?.startsWith('https://');
  const imageSrc = isExternalImage
    ? story?.image
    : `/upload/${story?.image}`;

  return (
    <div
      className="rounded-xl bg-white overflow-hidden relative group transition cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={imageSrc || '/images/anh_bia_mac_dinh.png'}
          alt={story?.title}
          loading="lazy"
          className="w-full h-full object-cover rounded-xl"
        />

        <div className="absolute top-0 left-0 m-2 space-y-1 z-10">
          {story?.trangthai && (
            <Badge color="green" size="sm">
              {story?.trangthai}
            </Badge>
          )}
          <Badge color="red" size="sm">
            Hot
          </Badge>
          <Badge color="blue" size="sm">
            New
          </Badge>
        </div>
      </div>

      <div className="p-2 bg-white">
        <h3 className="text-base font-semibold text-gray-800 truncate">{story?.title}</h3>
      </div>
    </div>
  );
};

export default StoryCard;
