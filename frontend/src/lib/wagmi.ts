import { chain, configureChains, createClient } from "wagmi";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";

export const { chains, provider } = configureChains(
  [chain.goerli],
  [publicProvider()]
);

export const { connectors } = getDefaultWallets({
  appName: "Library Dapp",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
