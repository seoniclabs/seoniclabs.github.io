import { getMetadata } from "./site-copy";
import { LandingPage } from "./components/LandingPage";

export const metadata = getMetadata("en");

export default function Home() {
  return <LandingPage locale="en" />;
}
