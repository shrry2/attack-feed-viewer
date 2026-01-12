import { fetchAttackData } from "@/lib/attack-data";
import { AttackBrowser } from "@/components/attack-browser";

export default async function Home() {
  const { techniques, tactics } = await fetchAttackData();

  return <AttackBrowser techniques={techniques} tactics={tactics} />;
}
