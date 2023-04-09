import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

import { Provider } from "jotai";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "~/styles/globals.css";
import "../assets/css/styles.scss";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <Provider>
      <SessionProvider session={session}>
        <ToastContainer />
        <main className={poppins.className}>
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </Provider>
  );
};

export default api.withTRPC(MyApp);
