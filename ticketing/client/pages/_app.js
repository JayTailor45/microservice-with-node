import "bootstrap/dist/css/bootstrap.min.css";
import buildClient from "../api/build-client";
import App from "next/app";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} />
      </div>
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
