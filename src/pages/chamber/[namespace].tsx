import { useRouter } from "next/router";
import { Chamber } from "../../application/Chamber";

export default function ChamberIndex() {
  const router = useRouter();
  const { namespace } = router.query;
if(!namespace) return null;
  return <Chamber namespace={namespace as string} />;
}
