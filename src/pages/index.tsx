import Head from "next/head";
import { useRouter } from "next/router";
import { useRef } from "react";
import { request } from "../application/utils/request";
import { SheetPicker } from "../application/SheetPicker";

const showEmailBox = false;
export default function Index() {
  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen">
      <SheetPicker />
    </div>
  );
}
