import { Link } from "react-router-dom";

const postStoryPath = "/writestory";
const settingPath = "/setting";
const loginPath = "/author/loginuser";
const registerPath = "/author/registeruser";
const homePath = "/";
const youtubeLink = "#";
const facebookLink = "#";
const xLink = "#";
const tiktokLink = "#";

const Footer = () => {
    const footerBackgroundClass = 'bg-[linear-gradient(141.39deg,_rgba(220,220,220,0.5)_3.43%,_rgba(233,233,233,0.5)_86.18%)]';
    const footerShadowClass = 'shadow-[inset_0px_4px_13.5px_1px_rgba(0,0,0,0.25)]';

    return (
        <footer className={`${footerBackgroundClass} ${footerShadowClass} mt-auto`}>
            <div className="container md:block lg:flex italic font-extrabold leading-7 text-gray-900 w-3/4 mx-auto py-10">
                <div className="lg:w-full lg:mx-0 text-sm md:text-md lg:text-xl">
                    <div className="flex flex-col md:flex-row justify-between text-center">

                        <div className="w-full lg:w-1/4 flex justify-between md:flex-col mb-2 md:mb-6 lg:mb-0">
                            <Link onClick={() => window.scrollTo(0, 0)} to="/" className="block hover:underline">Tất cả</Link>
                            <Link onClick={() => window.scrollTo(0, 0)} to="/" className="block hover:underline">Tìm kiếm</Link>
                            <Link onClick={() => window.scrollTo(0, 0)} to={postStoryPath} className="block hover:underline">Viết truyện</Link>
                            <Link onClick={() => window.scrollTo(0, 0)} to="/" className="block hover:underline">Bộ lọc</Link>
                            <Link onClick={() => window.scrollTo(0, 0)} to={settingPath} className="block hover:underline">Nạp xu</Link>
                        </div>

                        <div className="w-full lg:w-1/2 space-y-2 mb-6 lg:mb-0">
                            <Link onClick={() => window.scrollTo(0, 0)} to={homePath} className="block text-4xl md:text-5xl font-bold no-underline">
                                Moe novel
                            </Link>
                            <div className="flex  justify-around md:block">
                            <Link onClick={() => window.scrollTo(0, 0)} to={loginPath} className="block hover:underline">Đăng nhập</Link>
                            <Link onClick={() => window.scrollTo(0, 0)} to={registerPath} className="block hover:underline">Đăng ký</Link>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 space-y-2">
                            <p className="flex justify-center lg:justify-start text-lg md:text-xl">Kết nối với chúng tôi</p>
                            <div className="grid grid-cols-2 md:flex flex-col items-center justify-start lg:items-start space-y-1">
                                <Link to={youtubeLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start no-underline hover:underline">
                                    <img src="/images/youtube.png" alt="Youtube" className="w-5 h-5 mr-2" />
                                    Youtube
                                </Link>
                                <Link to={facebookLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start no-underline hover:underline">
                                    <img src="/images/facebook.png" alt="Facebook" className="w-5 h-5 mr-2" />
                                    Facebook
                                </Link>
                                <Link to={xLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start no-underline hover:underline">
                                    <img src="/images/x.png" alt="X" className="w-5 h-5 mr-2" />
                                    X
                                </Link>
                                <Link to={tiktokLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start no-underline hover:underline">
                                    <img src="/images/tiktok.png" alt="Tiktok" className="w-5 h-5 mr-2" />
                                    Tiktok
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;