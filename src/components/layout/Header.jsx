import {
  ActionIcon,
  Avatar,
  Indicator,
  Menu,
  rem,
  Text,
  TextInput,
  UnstyledButton,
  useMantineColorScheme,
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
import { IconCheck } from "@tabler/icons-react";
import { IconEdit } from "@tabler/icons-react";
import { IconChevronDown } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useTopic } from "../../hooks/useTopic";
import RequireLogin from "../RequireLogin";
import { IconMoon } from "@tabler/icons-react";
import { IconSun } from "@tabler/icons-react";
import { useUnreadNotifications } from "../../hooks/useNotification";
import { getUserId } from "../../utils";

const Header = () => {
  const navigate = useNavigate();
  const { data: topics } = useTopic();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const textColor = "black";

  const userId = getUserId();

  const checkUser = localStorage.getItem("user");
  let user = {};
  if (checkUser) {
    user = JSON.parse(checkUser);
  }
  const isAuthenticated = user?.id !== null && user?.id !== undefined && user?.id !== 1 && user?.id === userId;
  // const user = {
  //   name: "Current User",
  //   avatarUrl:
  //     "https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/anh-phong-canh-66-1.jpg",
  // };

  const [opened, { toggle }] = useDisclosure(false);
  const [opened2, { open, close }] = useDisclosure(false);
  const {data: unread } = useUnreadNotifications(userId);

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
      "&[dataHovered]": {
        backgroundColor: theme.colors.blue[5], // hover:bg-blue-500
        color: theme.white,
      },
    },
    divider: {
      borderColor: theme.white,
      borderWidth: rem(2),
      margin: `${rem(8)} ${rem(8)}`, // my-2 mx-2 approx
      width: `calc(100% - ${rem(16)})`, // Match item width minus padding
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const setDarkMode = () => {
    toggleColorScheme();
  };

  return (
    <div className="shadow-[0px_4px_4px_rgba(0,0,0,0.5)]">
      <div className="w-9/12 mx-auto py-4 flex justify-between items-center align-bottom">
        <Link
          to="/"
          className="text-3xl lg:text-4xl font-black italic flex no-underline mr-12"
        >
          <img
            src="/images/home_image.png"
            alt="logo_image"
            className="w-12 h-12"
          />
        </Link>

        <button
          onClick={toggle}
          className="lg:hidden p-2 rounded-md bg-gradient-to-r from-[#77d7ef] to-[#9AFDF7]"
        >
          <IconChevronDown size={24} />
        </button>

        <div className="hidden lg:flex flex-grow justify-between items-center">
          {/* tìm kiếm */}
          <div className="w-1/3 flex flex-col my-auto">
            <form action="/search" method="GET" className="w-full">
              <TextInput
                placeholder="Tìm kiếm"
                name="title"
                className="flex-grow search-story mr-4"
                classNames={
                  dark && {
                    input: {
                      outline: "1px solid red",
                    },
                  }
                }
                rightSection={
                  <ActionIcon
                    type="submit"
                    variant="transparent"
                    aria-label="Submit search"
                  >
                    <IconSearch
                      className="bg-gray-200 rounded"
                      size={24}
                      stroke={2.5}
                    />
                  </ActionIcon>
                }
              />
            </form>
          </div>
          <div className="flex gap-8">
            {/* thể loại */}
            <Menu
              shadow="md"
              width={240}
              trigger="click"
              pointer="cursor"
              position="bottom-start"
            >
              <Menu.Target>
                <p className="text-md lg:text-lg font-extrabold flex italic items-center hover:cursor-pointer">
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
                      className={`${
                        dark ? "text-black" : "text-dark"
                      } no-underline lg:text-lg`}
                    >
                      {topic?.name}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            {/* viết truyện */}
            {isAuthenticated ? (
              <Link
                to={"/writestory"}
                className="text-md lg:text-lg font-extrabold no-underline italic"
              >
                Viết truyện
              </Link>
            ) : (
              <Link
                className="text-md lg:text-lg font-extrabold no-underline italic"
                onClick={open}
              >
                Viết truyện
              </Link>
            )}
            <RequireLogin open={opened2} close={close} />
            {/* tin tức */}
            {isAuthenticated ? (
              <Link
                to="/setting?tab=payment"
                className="text-md lg:text-lg font-extrabold no-underline italic"
              >
                Nạp xu
              </Link>
            ) : (
              <Link
                to="/notification"
                className="text-md lg:text-lg font-extrabold no-underline italic"
              >
                Tin tức
              </Link>
            )}
          </div>

          {/* User Menu / Login */}
          <div className="flex items-center space-x-4">
            {/* <Link to={"/setting?tab=payment"}>
              <img
                className="object-contain h-8 w-8 lg:h-10 lg:w-10"
                src="/images/Premium.png"
                alt="Premium item"
              />
            </Link> */}
            <Menu
              shadow="md"
              width={240}
              position="bottom-end"
              closeOnClickOutside
              closeOnItemClick={false}
            >
              <Menu.Target>
                <Link to="notification">
                  {unread > 0 ? (
                    <Indicator inline size={20} offset={8} label={unread}>
                      <ActionIcon variant="transparent" size="xl">
                        <svg
                          width="38"
                          height="38"
                          viewBox="0 0 38 38"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.50065 30.083V15.833C9.50065 13.3135 10.5015 10.8971 12.2831 9.11549C14.0647 7.3339 16.4811 6.33301 19.0007 6.33301C21.5202 6.33301 23.9366 7.3339 25.7182 9.11549C27.4998 10.8971 28.5007 13.3135 28.5007 15.833V30.083M9.50065 30.083H28.5007M9.50065 30.083H6.33398M28.5007 30.083H31.6673M17.4173 34.833H20.584"
                            stroke={dark ? "white" : "black"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.0013 6.33317C19.8758 6.33317 20.5846 5.62429 20.5846 4.74984C20.5846 3.87539 19.8758 3.1665 19.0013 3.1665C18.1269 3.1665 17.418 3.87539 17.418 4.74984C17.418 5.62429 18.1269 6.33317 19.0013 6.33317Z"
                            stroke={dark ? "white" : "black"}
                            strokeWidth="2"
                          />
                        </svg>
                      </ActionIcon>
                    </Indicator>
                  ) : (
                    <ActionIcon variant="transparent" size="xl">
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 38 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.50065 30.083V15.833C9.50065 13.3135 10.5015 10.8971 12.2831 9.11549C14.0647 7.3339 16.4811 6.33301 19.0007 6.33301C21.5202 6.33301 23.9366 7.3339 25.7182 9.11549C27.4998 10.8971 28.5007 13.3135 28.5007 15.833V30.083M9.50065 30.083H28.5007M9.50065 30.083H6.33398M28.5007 30.083H31.6673M17.4173 34.833H20.584"
                          stroke={dark ? "white" : "black"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19.0013 6.33317C19.8758 6.33317 20.5846 5.62429 20.5846 4.74984C20.5846 3.87539 19.8758 3.1665 19.0013 3.1665C18.1269 3.1665 17.418 3.87539 17.418 4.74984C17.418 5.62429 18.1269 6.33317 19.0013 6.33317Z"
                          stroke={dark ? "white" : "black"}
                          strokeWidth="2"
                        />
                      </svg>
                    </ActionIcon>
                  )}
                </Link>
              </Menu.Target>
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
                      radius="xl"
                      size="lg"
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
                            <span className="text-black">{user?.fullName}</span>
                            <IconEdit
                              color={textColor}
                              size={14}
                              stroke={2.5}
                            />
                          </Text>
                          <Text
                            c="dimmed"
                            size="xs"
                            className="flex items-center gap-1 text-black"
                          >
                            <IconCheck
                              size={12}
                              stroke={2.5}
                              className="text-green-500"
                            />
                            Verified
                          </Text>
                        </div>
                      </div>
                    </Menu.Item>
                  </Link>
                  <Menu.Divider style={dropdownStyles.divider} />
                  <Link to="setting">
                    <Menu.Item
                      leftSection={
                        <IconSettings
                          color={textColor}
                          size={18}
                          stroke={2.5}
                        />
                      }
                      color={textColor}
                    >
                      <span className={`text-${textColor}`}>Cài đặt</span>
                    </Menu.Item>
                  </Link>

                  <Menu.Divider style={dropdownStyles.divider} />

                  <Menu.Item
                    leftSection={
                      dark ? (
                        <IconSun color={textColor} size={18} stroke={2.5} />
                      ) : (
                        <IconMoon color={textColor} size={18} stroke={2.5} />
                      )
                    }
                    color={textColor}
                    onClick={setDarkMode}
                  >
                    <p className={`text-${textColor}`}>
                      {dark ? "Chế độ sáng" : "Chế độ tối"}
                    </p>
                  </Menu.Item>
                  <Link to="profile?tab=myStories">
                    <Menu.Item
                      leftSection={
                        <IconList color={textColor} size={18} stroke={2.5} />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Danh sách của bạn</p>
                    </Menu.Item>
                  </Link>
                  <Link to="history">
                    <Menu.Item
                      leftSection={
                        <IconHistory color={textColor} size={18} stroke={2.5} />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Lịch sử</p>
                    </Menu.Item>
                  </Link>
                  <Link to="/writestory">
                    <Menu.Item
                      leftSection={
                        <IconPencil color={textColor} size={18} stroke={2.5} />
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
                        <IconBell color={textColor} size={18} stroke={2.5} />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Thông báo</p>
                    </Menu.Item>
                  </Link>
                  <Link to="message">
                    <Menu.Item
                      leftSection={
                        <IconMessage color={textColor} size={18} stroke={2.5} />
                      }
                      color={textColor}
                    >
                      <p className={`text-${textColor}`}>Nhắn tin</p>
                    </Menu.Item>
                  </Link>
                  <Link to="qa">
                    <Menu.Item
                      leftSection={
                        <IconHelp color={textColor} size={18} stroke={2.5} />
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
                      <IconLogout color={textColor} size={32} stroke={2.5} />
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
                      src="/account.svg"
                      alt="Account icon"
                    />
                    {/* <IconUserCircle size={32} stroke={2.5} /> */}
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
                <p className="text-lg font-extrabold flex items-center hover:cursor-pointer">
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
              className="text-lg font-extrabold no-underline italic"
            >
              Viết truyện
            </Link>
            {isAuthenticated ? (
              <Link
                to="/setting?tab=payment"
                className="text-lg font-extrabold no-underline italic"
              >
                Nạp xu
              </Link>
            ) : (
              <a
                href="/news"
                className="text-lg font-extrabold no-underline italic"
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
              {/* <IconPremiumRights size={32} stroke={2.5} /> */}
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
                  {/* <IconSearch size={32} stroke={2.5} /> */}
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
                        <IconSearch size={18} stroke={2.5} />
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
                          <IconEdit color={textColor} size={14} stroke={2.5} />
                        </Text>
                        <Text
                          c="dimmed"
                          size="xs"
                          className="flex items-center gap-1 text-black"
                        >
                          <IconCheck
                            size={12}
                            stroke={2.5}
                            className="text-green-500"
                          />
                          Verified
                        </Text>
                      </div>
                    </div>
                  </Menu.Item>

                  <Menu.Divider style={dropdownStyles.divider} />

                  {/* <Menu.Item
                    leftSection={
                      <IconSwitchHorizontal
                        color={textColor}
                        size={18}
                        stroke={2.5}
                      />
                    }
                    component="a"
                    href="/"
                    color={textColor} // Apply color dynamically to the Menu item
                  >
                    <p className={`text-${textColor}`}>Đổi tài khoản</p>
                  </Menu.Item> */}
                  <Menu.Item
                    leftSection={
                      <IconSettings color={textColor} size={18} stroke={2.5} />
                    }
                    component="a"
                    href="/setting"
                    color={textColor}
                  >
                    <span className={`text-${textColor}`}>Cài đặt</span>
                  </Menu.Item>

                  <Menu.Divider style={dropdownStyles.divider} />

                  <Menu.Item
                    leftSection={
                      <IconBookmark color={textColor} size={18} stroke={2.5} />
                    }
                    component="a"
                    href="/saved"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>
                      {dark ? "Chế độ sáng" : "Chế độ tối"}
                    </p>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconList color={textColor} size={18} stroke={2.5} />
                    }
                    component="a"
                    href="/mylists"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Danh sách của bạn</p>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconHistory color={textColor} size={18} stroke={2.5} />
                    }
                    component="a"
                    href="/history"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Lịch sử</p>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconPencil color={textColor} size={18} stroke={2.5} />
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
                      <IconBell color={textColor} size={18} stroke={2.5} />
                    }
                    component="a"
                    href="/notifications"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Thông báo</p>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconMessage color={textColor} size={18} stroke={2.5} />
                    }
                    component="a"
                    href="/messages"
                    color={textColor}
                  >
                    <p className={`text-${textColor}`}>Nhắn tin</p>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconHelp color={textColor} size={18} stroke={2.5} />
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
                      <IconLogout color={textColor} size={32} stroke={2.5} />
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
                    {/* <IconUserCircle size={32} stroke={2.5} /> */}
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
