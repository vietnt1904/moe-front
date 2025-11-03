import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { slugify } from "../utils";

const StoryCard = ({ story, title = true}) => {
  StoryCard.propTypes = {
    story: PropTypes.object.isRequired,
    title: PropTypes.bool,
    status: PropTypes.bool,
  };
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/story/${slugify(story?.title)}-${story?.id}`);
  };

  const isExternalImage =
    story?.image?.startsWith("http://") || story?.image?.startsWith("https://");
  const imageSrc = isExternalImage ? story?.image : `/upload/${story?.image}`;

  return (
    <div
      className="rounded-xl bg-white overflow-hidden relative group transition cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <div className="w-auto aspect-[3/4]">
          <img
            src={imageSrc || "/images/anh_bia_mac_dinh.png"}
            alt={story?.title}
            loading="lazy"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* {status && (
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
        )} */}
        {title && <div
          className="absolute bottom-0 w-full h-12 p-2 bg-gray-800 bg-opacity-50"
        >
          <h3 className="text-base font-semibold text-white truncate">
            {story?.title}
          </h3>
        </div>}
      </div>
    </div>
  );
};

export default StoryCard;
