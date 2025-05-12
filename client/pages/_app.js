import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { ThemeProvider } from "next-themes";
import { RecoilRoot } from 'recoil'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ThemeProvider enableSystem={false} attribute="class">
        <ChakraProvider>
          <Layout>
            <NextNProgress
              color="#FF7A19"
              startPosition={0.3}
              stopDelayMs={200}
              height={3}
              showOnShallow={true}
              options={{ showSpinner: false }}
            />

            <Component {...pageProps} />
            <ToastContainer />
          </Layout>
        </ChakraProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default MyApp;
