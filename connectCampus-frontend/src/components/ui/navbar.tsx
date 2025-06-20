import { Link, useLocation } from 'react-router-dom';
import { Menu, User, LogOut, Settings, MessageSquare, Heart, Calendar, Home, Users, Info, Phone, BarChart3, UserCheck, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Badge } from '@app/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@app/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@app/components/ui/sheet';
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@app/store/hooks';
import { authStateSelector } from '@app/store/selectors/auth-selectors';
import { userSelector, userRoleSelector } from '@app/store/selectors/user-selectors';
import { profileStudentSelector, profileAssociationSelector } from '@app/store/selectors/profile-selectors';
import { AuthState } from '@app/types/auth/IAuthState';
import { Roles } from '@app/types/user/Role';
import { logoutActionAsync } from '@app/store/actions/auth/auth-async-actions';
import { useUnreadMessages } from '@app/hooks/useUnreadMessages';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const dispatch = useAppDispatch();

  // Redux state
  const authState = useAppSelector(authStateSelector);
  const user = useAppSelector(userSelector);
  const userRole = useAppSelector(userRoleSelector);
  const studentProfile = useAppSelector(profileStudentSelector);
  const associationProfile = useAppSelector(profileAssociationSelector);
  
  // Get unread messages count
  const { unreadCount } = useUnreadMessages();

  // Determine authentication status - simplified logic
  const isAuthenticated = authState === AuthState.LoggedIn && !!user;

  // Helper function to determine home route based on user role
  const getHomeRoute = (): string => {
    if (!isAuthenticated) return '/';

    if (userRole === Roles.STUDENT) {
      return '/events'; // Students go to events page
    }

    if (userRole === Roles.ASSOCIATION) {
      return '/association/dashboard'; // Associations go to dashboard
    }

    return '/'; // Fallback
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await dispatch(logoutActionAsync());
  };

  // Get primary navigation items (shown in main navbar)
  const getPrimaryNavItems = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
        { name: 'Events', path: '/events', icon: <Calendar className="h-4 w-4" /> },
        { name: 'Associations', path: '/associations', icon: <Users className="h-4 w-4" /> },
        { name: 'About', path: '/about', icon: <Info className="h-4 w-4" /> },
        { name: 'Contact', path: '/contact', icon: <Phone className="h-4 w-4" /> },
      ];
    }

    if (userRole === Roles.STUDENT) {
      return [
        { name: 'Events', path: '/events', icon: <Calendar className="h-4 w-4" /> },
        { name: 'Associations', path: '/associations', icon: <Users className="h-4 w-4" /> },
        { name: 'Announcements', path: '/announcements', icon: <MessageSquare className="h-4 w-4" /> },
        { name: 'Following', path: '/followed-associations', icon: <UserCheck className="h-4 w-4" /> },
      ];
    }

    if (userRole === Roles.ASSOCIATION) {
      return [
        { name: 'Dashboard', path: '/association/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
        { name: 'Events', path: '/association/events', icon: <Calendar className="h-4 w-4" /> },
        { name: 'Announcements', path: '/association/announcements', icon: <MessageSquare className="h-4 w-4" /> },
        { name: 'Followers', path: '/association/follows', icon: <Users className="h-4 w-4" /> },
      ];
    }

    return [
      { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
      { name: 'Events', path: '/events', icon: <Calendar className="h-4 w-4" /> },
      { name: 'Associations', path: '/associations', icon: <Users className="h-4 w-4" /> },
    ];
  };

  // Get secondary navigation items (no longer used for dropdown)
  const getSecondaryNavItems = (): any[] => {
    return [];
  };

  // Get all navigation items (for mobile menu)
  const getAllNavItems = () => {
    return [...getPrimaryNavItems(), ...getSecondaryNavItems()];
  };

  const primaryNavItems = getPrimaryNavItems();
  const secondaryNavItems = getSecondaryNavItems();
  const allNavItems = getAllNavItems();

  const getUserDisplayName = (): string => {
    if (!user) return 'Guest';

    // For students, use first and last name if available
    if (userRole === Roles.STUDENT && studentProfile) {
      return `${studentProfile.firstName} ${studentProfile.lastName}`;
    }

    // For associations, use association name if available
    if (userRole === Roles.ASSOCIATION && associationProfile) {
      return associationProfile.name;
    }

    // Fallback to email
    return user.email?.split('@')[0] || user.email || 'User';
  };

  const getUserInitials = (): string => {
    // For students, use first and last name initials
    if (userRole === Roles.STUDENT && studentProfile) {
      return `${studentProfile.firstName.charAt(0)}${studentProfile.lastName.charAt(0)}`.toUpperCase();
    }

    // For associations, use association name initials
    if (userRole === Roles.ASSOCIATION && associationProfile) {
      const words = associationProfile.name.split(' ');
      return words.length > 1 ? `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase() : associationProfile.name.substring(0, 2).toUpperCase();
    }

    // Fallback
    const displayName = getUserDisplayName();
    if (!displayName || displayName === 'Guest') return 'G';
    return displayName.substring(0, 2).toUpperCase();
  };

  const getUserAvatar = (): string | undefined => {
    // For students, use direct avatar URL with cache busting
    if (userRole === Roles.STUDENT && studentProfile?.avatarUrl) {
      const baseUrl = studentProfile.avatarUrl;
      // Add cache-busting parameter based on profile update time
      const cacheBuster = studentProfile.updatedAt ? `?t=${Date.parse(studentProfile.updatedAt)}` : `?t=${Date.now()}`;
      return `${baseUrl}${cacheBuster}`;
    }

    // For associations, use direct logo URL with cache busting
    if (userRole === Roles.ASSOCIATION && associationProfile?.logo) {
      const baseUrl = associationProfile.logo;
      // Add cache-busting parameter based on profile update time
      const cacheBuster = associationProfile.updatedAt ? `?t=${Date.parse(associationProfile.updatedAt)}` : `?t=${Date.now()}`;
      return `${baseUrl}${cacheBuster}`;
    }

    // No avatar/logo available
    return undefined;
  };

  // Check if any secondary nav item is active
  const isSecondaryNavActive = () => {
    return secondaryNavItems.some(item => isActive(item.path));
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-sm' : 'bg-background border-b border-border'
      }`}
    >
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to={getHomeRoute()} className="flex items-center gap-2">
              <img src="/CampusConnect.svg" alt="CampusConnect" className="w-24 h-24 md:w-28 md:h-28" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-2xl">
            {primaryNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-2 xl:px-3 py-2 text-xs xl:text-sm rounded-md transition-colors whitespace-nowrap ${
                  isActive(item.path) ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'
                }`}
              >
                {item.icon}
                <span className="ml-1.5 xl:ml-2">{item.name}</span>
              </Link>
            ))}

            {/* Secondary Navigation Dropdown (for students) */}
            {secondaryNavItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center px-2 xl:px-3 py-2 text-xs xl:text-sm rounded-md transition-colors ${
                      isSecondaryNavActive() ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="ml-1.5 xl:ml-2">More</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {secondaryNavItems.map(item => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} className={`flex items-center cursor-pointer ${isActive(item.path) ? 'bg-primary/10 text-primary font-medium' : ''}`}>
                        {item.icon}
                        <span className="ml-2">{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
            {isAuthenticated ? (
              <>
                {/* Messages - Hidden on small screens */}
                <Button variant="ghost" size="icon" className="relative hidden xl:flex h-9 w-9" asChild>
                  <Link to="/messages">
                    <MessageSquare className="h-4 w-4" />
                    {unreadCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                    )}
                  </Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 md:h-10 md:w-10 hidden md:flex">
                      <Avatar className="h-9 w-9 md:h-10 md:w-10">
                        <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
                        <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none truncate">{getUserDisplayName()}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">{user?.email || 'No email'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userRole === Roles.STUDENT ? 'Student' : userRole === Roles.ASSOCIATION ? 'Association' : 'User'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to={
                          userRole === Roles.ASSOCIATION && associationProfile
                            ? associationProfile.slug
                              ? `/associations/${associationProfile.slug}`
                              : `/associations/${associationProfile.id}`
                            : '/profile'
                        }
                        className="flex items-center cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>{userRole === Roles.ASSOCIATION ? 'Association Profile' : 'Profile'}</span>
                      </Link>
                    </DropdownMenuItem>
                    {/* Student-specific menu items */}
                    {userRole === Roles.STUDENT && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/favorites" className="flex items-center cursor-pointer">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Favorites</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/my-registrations" className="flex items-center cursor-pointer">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>My Registrations</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Login/Register buttons */}
                <Button variant="ghost" size="sm" className="hidden lg:inline-flex text-xs" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button size="sm" className="hidden lg:inline-flex text-xs" asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      {isAuthenticated ? (
                        <>
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
                            <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{getUserDisplayName()}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            <p className="text-xs text-muted-foreground">{userRole === Roles.STUDENT ? 'Student' : userRole === Roles.ASSOCIATION ? 'Association' : 'User'}</p>
                          </div>
                        </>
                      ) : (
                        <div className="font-bold text-lg">Menu</div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 overflow-auto p-4 space-y-1">
                    {allNavItems.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-3 py-2.5 text-sm rounded-md transition-colors ${
                          isActive(item.path) ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    ))}

                    {/* Messages in mobile menu */}
                    {isAuthenticated && (
                      <Link
                        to="/messages"
                        className={`flex items-center px-3 py-2.5 text-sm rounded-md transition-colors ${
                          isActive('/messages') ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="ml-3">Messages</span>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </Badge>
                        )}
                      </Link>
                    )}
                  </nav>

                  {/* Mobile Footer */}
                  <div className="p-4 border-t border-border space-y-2">
                    {isAuthenticated ? (
                      <>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link
                            to={
                              userRole === Roles.ASSOCIATION && associationProfile
                                ? associationProfile.slug
                                  ? `/associations/${associationProfile.slug}`
                                  : `/associations/${associationProfile.id}`
                                : '/profile'
                            }
                          >
                            <User className="mr-2 h-4 w-4" />
                            {userRole === Roles.ASSOCIATION ? 'Association Profile' : 'Profile'}
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <Link to="/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" className="w-full" asChild>
                          <Link to="/login">Log in</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to="/register">Sign up</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
