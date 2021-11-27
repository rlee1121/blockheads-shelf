import { useEthers } from "@usedapp/core";
import Connect from "./Connect";

export default function UnconnectedContent() {
  const { account } = useEthers();
  if (account) return null;
  return <Connect />;
}
