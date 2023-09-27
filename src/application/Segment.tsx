import axios from "axios";
import EventEmitter from "eventemitter3";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { AiFillYoutube, AiOutlinePlayCircle } from "react-icons/ai";
import YouTube from "react-youtube";
import PlaybackBoat from "./PlaybackBoat";
import RecordBoat from "./RecordBoat";

let timer;

const YTEventEmitter = new EventEmitter();

export default function SegmentLoader({ loading, segmentId, newSegment }) {
  return null
}
