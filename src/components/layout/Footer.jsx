const postStoryPath = "/poststory";
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
                <div className="lg:w-full lg:mx-0 text-xl">
                    <div className="flex flex-col lg:flex-row justify-between text-center">

                        <div className="w-full lg:w-1/4 space-y-2 mb-6 lg:mb-0">
                            <a href="#" className="block hover:underline">Tất cả</a>
                            <a href="#" className="block hover:underline">Tìm kiếm</a>
                            <a href={postStoryPath} className="block hover:underline">Viết truyện</a>
                            <a href="#" className="block hover:underline">Bộ lọc</a>
                            <a href={settingPath} className="block hover:underline">Nạp xu</a>
                        </div>

                        <div className="w-full lg:w-1/2 space-y-2 mb-6 lg:mb-0">
                            <a href={homePath} className="block text-5xl font-bold no-underline hover:opacity-80">
                                Moe novel
                            </a>
                            <a href={loginPath} className="block hover:underline">Đăng nhập</a>
                            <a href={registerPath} className="block hover:underline">Đăng ký</a>
                        </div>

                        <div className="w-full lg:w-1/4 space-y-2">
                            <p className="flex justify-center lg:justify-start">Kết nối với chúng tôi</p>
                            <div className="flex flex-col items-center lg:items-start space-y-1">
                                <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start no-underline hover:underline">
                                    <img src="/images/youtube.png" alt="Youtube" className="w-5 h-5 mr-2" />
                                    Youtube
                                </a>
                                <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start no-underline hover:underline">
                                    <img src="/images/facebook.png" alt="Facebook" className="w-5 h-5 mr-2" />
                                    Facebook
                                </a>
                                <a href={xLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start no-underline hover:underline">
                                    <img src="/images/x.png" alt="X" className="w-5 h-5 mr-2" />
                                    X
                                </a>
                                <a href={tiktokLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center lg:justify-start no-underline hover:underline">
                                    <img src="/images/tiktok.png" alt="Tiktok" className="w-5 h-5 mr-2" />
                                    Tiktok
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;