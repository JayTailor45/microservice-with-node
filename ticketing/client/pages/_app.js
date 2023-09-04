import "bootstrap/dist/css/bootstrap.min.css";
import buildClient from "../api/build-client";
import App from "next/app";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Header! {currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  return { ...data, ...appProps };
};

export default AppComponent;
