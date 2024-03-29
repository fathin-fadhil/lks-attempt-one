import {useEffect, createElement, useState} from "react";
import {
    Navbar,
    Collapse,
    Typography,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    IconButton,
  } from "@material-tailwind/react";

  import {
    ChevronDownIcon,
    PowerIcon,
    UserGroupIcon,
    DocumentChartBarIcon
  } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

 
export default function NavbarComp() {
  const {auth} = useAuth()
  const navigate = useNavigate()

  const [openNav, setOpenNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
 
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
    
    if(auth?.accessToken){
      setIsLoggedIn(true)
      console.log(auth)
    } else {
      setIsLoggedIn(false)
    }

    setTimeout(() => {
      console.log(auth)
    }, 1000)

  }, [auth]);
 
  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="" onClick={() => {navigate('/')}} className="flex items-center cursor-pointer" tabIndex="0">
          Home
        </a>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="" onClick={() => {navigate('/myform')}} className="flex items-center cursor-pointer" tabIndex="0">
          Kuesionerku
        </a>
      </Typography>
      
    </ul>
  );
 
  return (
    <>
      <Navbar className="sticky inset-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4 ">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="p"
            onClick={() => navigate('/')}
            className="mr-4 cursor-pointer py-1.5 font-extrabold text-xl"
            textGradient
            color={'blue'}
          >
            WebQuestionnaire
          </Typography>

          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>

            <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block"
              onClick={() => navigate('/form/new')}
            >
              <span>Buat kuis</span>
            </Button>

            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
            { isLoggedIn  
                ? <ProfileMenu />
                : <Button size="sm" variant='outlined' onClick={() => navigate('/auth')}>Sign In</Button>
            }
          </div>
        </div>
        <Collapse open={openNav}>
          {navList}
          <Button variant="gradient" size="sm" fullWidth className="mb-2" onClick={() => navigate('/form/new')}>
            <span>Buat Kuis</span>
          </Button>
        </Collapse>
      </Navbar>
    </>
  );
}


function ProfileMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);
    const navigate = useNavigate();
    const { auth } = useAuth()
    const [greetings, setGreetings] = useState('Hello,');
    const [userName, setUserName] = useState('')

    useEffect(() => {
      var curHr = new Date().getHours()
      if (curHr < 12) {
        setGreetings('Good Morning, ')
      } else if (curHr < 18) {
        setGreetings('Good Afternoon, ')
      } else {
        setGreetings('Good Evening, ')
      } 

      setUserName(auth?.name)
    })


    const profileMenuItems = [
        {
          label: "Kuesionerku",
          icon: DocumentChartBarIcon,
          link:'/myform'
        },        
        {
          label: "Sign Out",
          icon: PowerIcon,
          link:'/signout'
        },
      ];

      if (auth?.isAdmin ) {
        profileMenuItems.splice(profileMenuItems.length - 1, 0, {
          label: 'Admin Page',
          icon: UserGroupIcon ,
          link: '/admin'
        })
      }
   
    return (
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
          >
            <Avatar
              variant="circular"
              size="sm"
              className="border border-blue-500 p-0.5"
              
              src='/resources/images/profilepic.png'
            />

            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </MenuHandler>
        <MenuList className="p-1">
          <MenuItem>
              <Typography variant='small' >
                {greetings}
              </Typography>
              <Typography variant='small' >
                {userName}
              </Typography>
          </MenuItem>
          {profileMenuItems.map(({ label, icon,  link }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={() => {closeMenu(); navigate(link)}}
                className={`flex items-center gap-2 rounded ${
                  isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
              >
                {createElement(icon, {
                  className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={isLastItem ? "red" : "inherit"}
                >
                  {label}
                </Typography>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    );
  }