import { useRouter } from "next/router";
import React from "react";
import CourseWrapper from "../../../../course/Course";

export default function Chapter() {
  const router = useRouter();
  const { chapter, subchapter } = router.query;
  return <CourseWrapper slug={chapter} subslug={subchapter} />;
}
