import { useRouter } from "next/router";
import React from "react";
import Main from "../../app/Main";

export default function SegmentId() {
  const router = useRouter();

  const { segmentId } = router.query;

  return <Main segmentId={segmentId} />;
}
