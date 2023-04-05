import { useRouter } from "next/router";
import React from "react";
import Main from "../../application/Main";

export default function SegmentId() {
  const router = useRouter();

  const { segmentId } = router.query;

  return <Main segmentId={segmentId} />;
}
