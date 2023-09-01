import axios from "axios";

const LandingPage = (props) => {
  console.log("In the component", props);
  return <h1>Landing Page</h1>;
};

export async function getServerSideProps() {
  if (typeof window === "undefined") {
    // we are on server
    // request should be made with http://ingress-nginx.ingress-nginx...
    console.log("On Server");

    try {
      const response = await axios.get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
        {
          headers: { Host: "ticketing.dev" }, // <- Require to provide Host
        }
      );

      const { data } = response;
      return { props: { ...data } };
    } catch (error) {
      console.log(error);
    }
  } else {
    // we are on browser
    // request can be made with a base url of ''
    console.log("On Browser");

    try {
      const response = await axios.get("/api/users/currentuser");
      const { data } = response;
      return { props: { ...data } };
    } catch (error) {
      console.log(error);
    }
  }

  return { props: {} };
}

export default LandingPage;
