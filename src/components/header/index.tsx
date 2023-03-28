import { useAtom } from "jotai";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useOnClickOutside from "use-onclickoutside";
import { searchQueryAtom } from "~/atoms/searchAtom";
import Logo from "../../assets/icons/logo";

type HeaderType = {
  isErrorPage?: Boolean;
};

const Header = ({ isErrorPage }: HeaderType) => {
  const router = useRouter();
  const cartItems = [];
  const arrayPaths = ["/"];

  const [onTop, setOnTop] = useState(
    !arrayPaths.includes(router.pathname) || isErrorPage ? false : true
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const searchRef = useRef(null);
  const { data: session } = useSession();

  const headerClass = () => {
    if (window.pageYOffset === 0) {
      setOnTop(true);
    } else {
      setOnTop(false);
    }
  };

  useEffect(() => {
    if (!arrayPaths.includes(router.pathname) || isErrorPage) {
      return;
    }

    headerClass();
    window.onscroll = function () {
      headerClass();
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // on click outside
  useOnClickOutside(navRef, closeMenu);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

  const { register, handleSubmit } = useForm<{ search: string }>({
    defaultValues: { search: searchQuery },
  });

  const onSubmit = (value: { search: string }) => {
    setSearchQuery(value.search);
  };

  return (
    <header className={`site-header ${!onTop ? "site-header--fixed" : ""}`}>
      <div className="container">
        <Link href="/">
          <h1 className="site-logo">
            <Logo />
            Ohara
          </h1>
        </Link>
        <nav
          ref={navRef}
          className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}
        >
          <Link href="/products">Products</Link>
          <button className="site-nav__btn">
            <p>Account</p>
          </button>
        </nav>

        <div className="site-header__actions">
          <button
            ref={searchRef}
            className={`search-form-wrapper search-form--active`}
          >
            <form className={`search-form`} onSubmit={handleSubmit(onSubmit)}>
              <i className="icon-cancel"></i>
              <input
                placeholder="Enter the book you are looking for"
                {...register("search")}
              />
            </form>
            <i className="icon-search"></i>
          </button>
          <Link href="/cart">
            <button className="btn-cart">
              <i className="icon-cart"></i>
              {cartItems.length > 0 && (
                <span className="btn-cart__count">{cartItems.length}</span>
              )}
            </button>
          </Link>
          {session?.user.image && (
            <Image
              className="ml-2 inline-block rounded-full ring-2 ring-white"
              src={session.user.image}
              title={session.user.name ?? ""}
              width="32"
              height="32"
              alt={session.user.name ?? "User Profile image"}
            />
          )}
          <button onClick={() => (session?.user ? signOut() : signIn())}>
            {session?.user ? "Logout" : "Login"}
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            className="site-header__btn-menu"
          >
            <i className="btn-hamburger">
              <span></span>
            </i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
