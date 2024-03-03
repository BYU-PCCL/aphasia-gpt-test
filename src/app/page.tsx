import { redirect } from "next/navigation";

const Home: React.FC = () => {
  redirect("/cases");
};

export default Home;
