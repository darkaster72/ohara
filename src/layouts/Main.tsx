import Head from "next/head";
import { useRouter } from "next/router";
import Header from "~/components/header";

type LayoutType = {
  title?: string;
  children?: React.ReactNode;
};

const Layout = ({ children, title = "Ohara" }: LayoutType) => {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <div className="app-main">
      <Head>
        <title>{title}</title>
      </Head>

      <Header />

      <main className={pathname !== "/" ? "main-page" : ""}>{children}</main>
    </div>
  );
};

export default Layout;
