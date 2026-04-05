import { ReactNode } from "react";

type AssistantLayoutProps = {
  children: ReactNode;
};

export default async function AssistantLayout({ children }: AssistantLayoutProps) {
  return <>{children}</>;
}
