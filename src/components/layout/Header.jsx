import {
  ActionIcon,
  Avatar,
  Menu,
  rem,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons-react";
import { IconList } from "@tabler/icons-react";
import { IconPencil } from "@tabler/icons-react";
import { IconMessage } from "@tabler/icons-react";
import { IconLogout } from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";
import { IconHelp } from "@tabler/icons-react";
import { IconBell } from "@tabler/icons-react";
import { IconHistory } from "@tabler/icons-react";
import { IconBookmark } from "@tabler/icons-react";
import { IconSwitchHorizontal } from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import { IconEdit } from "@tabler/icons-react";
import { IconChevronDown } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useTopic } from "../../hooks/useTopic";
import RequireLogin from "../RequireLogin";

const Header = () => {
  const navigate = useNavigate();
  const { data: topics } = useTopic();

  const textColor = "black";

  const checkUser = localStorage.getItem("user");
  let user = null;
  if (checkUser) {
    user = JSON.parse(checkUser);
  }
  const isAuthenticated = user !== null;
  // const user = {
  //   name: "Current User",
  //   avatarUrl:
  //     "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/anh-phong-canh-66-1.jpg",
  // };

  const [opened, { toggle }] = useDisclosure(false);
  const [opened2, { open, close }] = useDisclosure(false);

  const theme = useMantineTheme();

  const dropdownStyles = {
    dropdown: {
      background: "rgba(217, 217, 217, 0.5)",
      backdropFilter: "blur(30px)",
      borderRadius: rem(30),
      border: "none",
      padding: rem(8), // Adjust padding as needed
      // minWidth: rem(288), // w-72
    },
    item: {
      color: theme.white, // Default text color for items
      fontWeight: "bold",
      borderRadius: rem(24), // rounded-3xl equivalent
      paddingTop: rem(4), // py-1
      paddingBottom: rem(4), // py-1
      paddingLeft: rem(16), // px-4
      paddingRight: rem(16), // px-4
      margin: `${rem(4)} ${rem(8)}`, // my-1 mx-2 approximately
      width: `calc(100% - ${rem(16)})`, // custom_width_a equivalent
      "&[data-hovered]": {
        backgroundColor: theme.colors.blue[5], // hover:bg-blue-500
        color: theme.white, // Ensure text remains white on hover
      },
    },
    divider: {
      borderColor: "white",
      borderWidth: rem(2),
      margin: `${rem(8)} ${rem(8)}`, // my-2 mx-2 approx
      width: `calc(100% - ${rem(16)})`, // Match item width minus padding
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-[linear-gradient(141.39deg,_#9AFDF7_3.43%,_rgb(212,239,244)_86.18%)] shadow-[0px_4px_4px_rgba(0,0,0,0.5)]">
      <div className="w-9/12 mx-auto py-4 flex justify-between items-center align-bottom">
        <a
          href="/"
          className="text-3xl lg:text-4xl font-black italic flex text-gray-900 no-underline mr-12"
        >
          <img
            src="/images/home_image.png"
            alt="logo_image"
            className="w-12 h-12 mr-2"
          />
          Ganymede
        </a>

        <button
          onClick={toggle}
          className="lg:hidden p-2 rounded-md bg-gradient-to-r from-[#77d7ef] to-[#9AFDF7]"
        >
          <IconChevronDown size={24} />
        </button>

        <div className="hidden lg:flex flex-grow justify-between items-center">
          <div className="flex space-x-8">
            <Menu
              shadow="md"
              width={240}
              trigger="click"
              pointer="cursor"
              position="bottom-start"
            >
              <Menu.Target>
                <p className="text-lg lg:text-2xl font-extrabold text-gray-900 flex italic mx-4 items-center hover:cursor-pointer">
                  Thể loại
                </p>
              </Menu.Target>
              <Menu.Dropdown
                style={{
                  width: "auto",
                  background: "rgba(217, 217, 217, 0.5)",
                  backdropFilter: "blur(30px)",
                  borderRadius: "12px",
                }}
              >
                {topics?.map((topic) => (
                  <Menu.Item
                    key={topic?.id}
                    className="font-sans hover:bg-blue-300 rounded"
                  >
                    <Link
                      to={`/search?topic=${topic?.id}`}
                      className="text-dark no-underline lg:text-lg"
                    >
                      {topic?.name}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            {isAuthenticated ? (
              <Link
                to={"/writestory"}
                className="text-lg lg:text-2xl font-extrabold text-gray-900 no-underline italic"
              >
                Viết truyện
              </Link>
            ) : (
              <Link
                className="text-lg lg:text-2xl font-extrabold text-gray-900 no-underline italic"
                onClick={open}
              >
                Viết truyện
              </Link>
            )}
            <RequireLogin open={opened2} close={close} />

            {isAuthenticated ? (
              <Link
                to="/setting?tab=payment"
                className="text-lg lg:text-2xl font-extrabold text-gray-900 no-underline italic"
              >
                Nạp xu
              </Link>
            ) : (
              <Link
                to="/news"
                className="text-lg lg:text-2xl font-extrabold text-gray-900 no-underline italic"
              >
                Tin tức
              </Link>
            )}
          </div>

          {/* User Menu / Login */}
          <div className="flex items-center space-x-4">
            <ActionIcon
              component="a"
              href="/setting?tab=payment" // Replace with premium link
              variant="transparent"
              size="xl" // Corresponds to h-12 w-12 approx
            >
              <img
                className="object-contain h-8 w-8 lg:h-10 lg:w-10"
                src="/images/Premium.png"
                alt="Premium item"
              />
              {/* Or use IconPremiumRights */}
              {/* <IconPremiumRights size={32} stroke={1.5} /> */}
            </ActionIcon>

            {/* Search Dropdown */}
            <Menu
              shadow="md"
              width={240}
              position="bottom-end"
              closeOnClickOutside
              closeOnItemClick={false}
            >
              <Menu.Target>
                <ActionIcon variant="transparent" size="xl">
                  <img
                    className="object-contain h-8 w-8 lg:h-10 lg:w-10"
                    src="/images/Search.png"
                    alt="Search icon"
                  />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown
                p="xs"
                className="!bg-transparent !border-none !shadow-none"
              >
                <form action="/search" method="GET" className="flex">
                  <TextInput
                    placeholder="Tìm kiếm"
                    name="title"
                    className="flex-grow search-story"
                    rightSection={
                      <ActionIcon
                        type="submit"
                        variant="transparent"
                        aria-label="Submit search"
                      >
                        <IconSearch
                          className="bg-gray-200 rounded"
                          size={24}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    }
                  />
                </form>
              </Menu.Dropdown>
            </Menu>
            {isAuthenticated && user ? (
              <Menu
                shadow="md"
                width={288}
                position="bottom-end"
                styles={dropdownStyles}
              >
                <Menu.Target>
                  <UnstyledButton className="ml-4">
                    <Avatar
                      src={user?.avatar}
                      alt="Account item"
                      radius="xl" // rounded-full
                      size="lg" // h-12 w-12 approx
                      className="border-2 border-yellow-400"
                    />
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Link to="/profile">
                    <Menu.Item
                      className="!p-0 !m-0 !w-full !rounded-none !bg-transparent"
                      style={{ background: "transparent !important" }}
                    >
                      <div className="flex items-center gap-2 px-4 py-1 mx-2 rounded-3xl hover:bg-blue-500">
                        <Avatar
                          src={user?.avatar}
                          alt="Account item"
                          radius="xl"
                          size="md"
                          className="border-2 border-white"
                        />
                        <div>
                          <Text
                            size="sm"
                            fw={500}
                            className="flex items-center gap-1 text-gray"
                          >
                            <p className="text-black">{user?.fullName}</p>
                            <IconEdit
                              color={textColor}
                              size={14}
                              stroke={1.5}
                            />
                          </Text>
                          <Text
                            c="dimmed"
                            size="xs"
                            className="flex items-center gap-1 text-black"
                          >
                            <IconCheck
                              size={12}
                              stroke={1.5}
                              className="text-green-500"
                            />
                            Verified
                          </Text>
                        </div>
                      </div>
                    </Menu.Item>
                  </Link>

                  <Menu.Divider style={dropdownStyles.divider} />

                  <Menu.Item
                    leftSection={
                      <IconSwitchHorizontal
                        color={textColor}
                        size={18}
                        stroke={1.5}
                      />
                    }
                    component="a"
                    href="/"
                    color={textColor} // Apply color dynamically to the Menu item
                  >
                    <p className={`text-${textColor}`}>Đổi tài khoản</p>
                  </Menu.Item>
                  <Link to="setting">
                    <Menu.Item
                      leftSection={
                        <IconSettings
                          color={textColor}
                          size={18}
                          stroke={1.5}
                        />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Cài đặt</p>
                    </Menu.Item>
                  </Link>

                  <Menu.Divider style={dropdownStyles.divider} />

                  <Link to="saved">
                    <Menu.Item
                      leftSection={
                        <IconBookmark
                          color={textColor}
                          size={18}
                          stroke={1.5}
                        />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Đã lưu</p>
                    </Menu.Item>
                  </Link>
                  <Link to="profile?tab=myStories">
                    <Menu.Item
                      leftSection={
                        <IconList color={textColor} size={18} stroke={1.5} />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Danh sách của bạn</p>
                    </Menu.Item>
                  </Link>
                  <Link to="history">
                    <Menu.Item
                      leftSection={
                        <IconHistory color={textColor} size={18} stroke={1.5} />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Lịch sử</p>
                    </Menu.Item>
                  </Link>
                  <Link to="/writestory">
                    <Menu.Item
                      leftSection={
                        <IconPencil color={textColor} size={18} stroke={1.5} />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Viết truyện</p>
                    </Menu.Item>
                  </Link>

                  <Menu.Divider style={dropdownStyles.divider} />

                  <Link to="notification">
                    <Menu.Item
                      leftSection={
                        <IconBell color={textColor} size={18} stroke={1.5} />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Thông báo</p>
                    </Menu.Item>
                  </Link>
                  <Link to="message">
                    <Menu.Item
                      leftSection={
                        <IconMessage color={textColor} size={18} stroke={1.5} />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Nhắn tin</p>
                    </Menu.Item>
                  </Link>
                  <Link to="qa">
                    <Menu.Item
                      leftSection={
                        <IconHelp color={textColor} size={18} stroke={1.5} />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Q&A</p>
                    </Menu.Item>
                  </Link>

                  <Menu.Divider style={dropdownStyles.divider} />

                  {/* Logout - handle with a function */}
                  <Menu.Item
                    leftSection={
                      <IconLogout color={textColor} size={32} stroke={1.5} />
                    }
                    color={textColor}
                    onClick={() => handleLogout()}
                    className="my-4"
                  >
                    <p className={`text-${textColor}`}>Đăng xuất</p>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Menu
                shadow="md"
                width={288}
                position="bottom-end"
                styles={dropdownStyles}
              >
                <Menu.Target>
                  <ActionIcon variant="transparent" size="xl" className="ml-4">
                    <img
                      className="object-contain h-8 w-8 lg:h-10 lg:w-10 rounded-full"
                      src="/images/Account.png"
                      alt="Account icon"
                    />
                    {/* <IconUserCircle size={32} stroke={1.5} /> */}
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Link to="/signup">
                    <Menu.Item>
                      <Text size="lg" fw="bold" className="!text-black">
                        Tạo tài khoản
                      </Text>{" "}
                      {/* Use ! to force override */}
                      <Text
                        size="sm"
                        className="!text-yellow-500 font-extrabold"
                      >
                        Để có thể theo dõi những đầu truyện mới nhất
                      </Text>
                    </Menu.Item>
                  </Link>
                  <Link to="/login">
                    <Menu.Item>
                      <Text size="lg" fw="bold" className="!text-black">
                        Đăng nhập
                      </Text>
                      <Text
                        size="sm"
                        className="!text-yellow-500 font-extrabold"
                      >
                        Bạn đã có tài khoản rồi? Chào mừng trở lại
                      </Text>
                    </Menu.Item>
                  </Link>
                </Menu.Dropdown>
              </Menu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {opened && (
        <div className="lg:hidden flex flex-col justify-center pb-4 w-3/4 mx-auto">
          <div className="flex justify-between">
            <Menu
              shadow="md"
              width={240}
              trigger="click"
              pointer="cursor"
              position="bottom-start"
            >
              <Menu.Target>
                <p className="text-lg font-extrabold text-gray-900 flex items-center hover:cursor-pointer">
                  Thể loại
                </p>
              </Menu.Target>
              <Menu.Dropdown
                style={{
                  width: "auto",
                  background: "rgba(217, 217, 217, 0.5)",
                  backdropFilter: "blur(30px)",
                  borderRadius: "12px",
                }}
              >
                {topics?.map((topic) => (
                  <Menu.Item
                    key={topic?.id}
                    className="font-sans hover:bg-blue-300 rounded"
                  >
                    <a href="/" className="text-dark no-underline">
                      {topic?.name}
                    </a>
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            <Link
              to="/poststory"
              className="text-lg font-extrabold text-gray-900 no-underline italic"
            >
              Viết truyện
            </Link>
            {isAuthenticated ? (
              <Link
                to="/setting?tab=payment"
                className="text-lg font-extrabold text-gray-900 no-underline italic"
              >
                Nạp xu
              </Link>
            ) : (
              <a
                href="/news"
                className="text-lg font-extrabold text-gray-900 no-underline italic"
              >
                Tin tức
              </a>
            )}
          </div>

          {/* User Menu / Login */}
          <div className="flex items-center justify-between">
            <ActionIcon
              component="a"
              href="/premium" // Replace with premium link
              variant="transparent"
              size="xl" // Corresponds to h-12 w-12 approx
            >
              <img
                className="object-contain h-8 w-8 lg:h-10 lg:w-10"
                src="/images/Premium.png"
                alt="Premium item"
              />
              {/* Or use IconPremiumRights */}
              {/* <IconPremiumRights size={32} stroke={1.5} /> */}
            </ActionIcon>
            <Menu
              shadow="md"
              width={240}
              position="bottom-end"
              closeOnClickOutside
              closeOnItemClick={false}
            >
              <Menu.Target>
                <ActionIcon variant="transparent" size="xl">
                  <img
                    className="object-contain h-8 w-8 lg:h-10 lg:w-10"
                    src="/images/Search.png"
                    alt="Search icon"
                  />
                  {/* <IconSearch size={32} stroke={1.5} /> */}
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown
                p="xs"
                className="!bg-transparent !border-none !shadow-none"
              >
                {/* Prevent default dropdown styling */}
                <form action="/search" method="GET" className="flex">
                  <TextInput
                    placeholder="Tìm kiếm"
                    name="key_word"
                    className="flex-grow search-story" // Add search-story if needed for JS
                    rightSection={
                      <ActionIcon
                        type="submit"
                        variant="transparent"
                        aria-label="Submit search"
                      >
                        <IconSearch size={18} stroke={1.5} />
                      </ActionIcon>
                    }
                  />
                </form>
              </Menu.Dropdown>
            </Menu>
            {isAuthenticated && user ? (
              <Menu
                shadow="md"
                width={288}
                position="bottom-end"
                styles={dropdownStyles}
              >
                <Menu.Target>
                  <UnstyledButton className="ml-4">
                    <Avatar
                      src={user?.avatar}
                      alt="Account item"
                      radius="xl" // rounded-full
                      size="lg" // h-12 w-12 approx
                      className="border-2 border-yellow-400"
                    />
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  {/* Profile Link Item */}
                  <Menu.Item
                    component="a" // Or Link
                    href="/profile" // route('profile')
                    className="!p-0 !m-0 !w-full !rounded-none !bg-transparent"
                    style={{ background: "transparent !important" }}
                  >
                    <div className="flex items-center gap-2 px-4 py-1 mx-2 rounded-3xl hover:bg-blue-500">
                      <Avatar
                        src={user?.avatar}
                        alt="Account item"
                        radius="xl"
                        size="md" // Slightly smaller avatar inside dropdown
                        className="border-2 border-white"
                      />
                      <div>
                        <Text
                          size="sm"
                          fw={500}
                          className="flex items-center gap-1 text-gray"
                        >
                          <p className="text-black">{user?.name}</p>
                          <IconEdit color={textColor} size={14} stroke={1.5} />
                        </Text>
                        <Text
                          c="dimmed"
                          size="xs"
                          className="flex items-center gap-1 text-black"
                        >
                          <IconCheck
                            size={12}
                            stroke={1.5}
                            className="text-green-500"
                          />
                          Verified
                        </Text>
                      </div>
                    </div>
                  </Menu.Item>

                  <Menu.Divider style={dropdownStyles.divider} />

                  <Menu.Item
                    leftSection={
                      <IconSwitchHorizontal
                        color={textColor}
                        size={18}
                        stroke={1.5}
                      />
                    }
                    component="a"
                    href="/"
                    color={textColor} // Apply color dynamically to the Menu item
                  >
                    <p className={`text-${textColor}`}>Đổi tài khoản</p>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconSettings color={textColor} size={18} stroke={1.5} />
                    }
                    component="a"
                    href="/setting"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Cài đặt</p>
                  </Menu.Item>

                  <Menu.Divider style={dropdownStyles.divider} />

                  <Menu.Item
                    leftSection={
                      <IconBookmark color={textColor} size={18} stroke={1.5} />
                    }
                    component="a"
                    href="/saved"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Đã lưu</p>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconList color={textColor} size={18} stroke={1.5} />
                    }
                    component="a"
                    href="/mylists"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Danh sách của bạn</p>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconHistory color={textColor} size={18} stroke={1.5} />
                    }
                    component="a"
                    href="/history"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Lịch sử</p>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconPencil color={textColor} size={18} stroke={1.5} />
                    }
                    component="a"
                    href="/poststory"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Viết truyện</p>
                  </Menu.Item>

                  <Menu.Divider style={dropdownStyles.divider} />

                  <Menu.Item
                    leftSection={
                      <IconBell color={textColor} size={18} stroke={1.5} />
                    }
                    component="a"
                    href="/notifications"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Thông báo</p>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconMessage color={textColor} size={18} stroke={1.5} />
                    }
                    component="a"
                    href="/messages"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Nhắn tin</p>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconHelp color={textColor} size={18} stroke={1.5} />
                    }
                    component="a"
                    href="/qa"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Q&A</p>
                  </Menu.Item>

                  <Menu.Divider style={dropdownStyles.divider} />

                  {/* Logout - handle with a function */}
                  <Menu.Item
                    leftSection={
                      <IconLogout color={textColor} size={32} stroke={1.5} />
                    }
                    color={textColor}
                    onClick={() => handleLogout()}
                    className="my-4"
                  >
                    <p className={`text-${textColor}`}>Đăng xuất</p>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Menu
                shadow="md"
                width={288}
                position="bottom-end"
                styles={dropdownStyles}
              >
                <Menu.Target>
                  <ActionIcon variant="transparent" size="xl" className="ml-4">
                    <img
                      className="object-contain h-8 w-8 lg:h-10 lg:w-10"
                      src="/images/Account.png"
                      alt="Account icon"
                    />
                    {/* <IconUserCircle size={32} stroke={1.5} /> */}
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Link to="/signup">
                    <Menu.Item>
                      <Text size="lg" fw="bold" className="!text-black">
                        Tạo tài khoản
                      </Text>
                      <Text
                        size="sm"
                        className="!text-yellow-500 font-extrabold"
                      >
                        Để có thể theo dõi những đầu truyện mới nhất
                      </Text>
                    </Menu.Item>
                  </Link>
                  <Link to="login">
                    <Menu.Item>
                      <Text size="lg" fw="bold" className="!text-black">
                        Đăng nhập
                      </Text>
                      <Text
                        size="sm"
                        className="!text-yellow-500 font-extrabold"
                      >
                        Bạn đã có tài khoản rồi? Chào mừng trở lại
                      </Text>
                    </Menu.Item>
                  </Link>
                </Menu.Dropdown>
              </Menu>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
