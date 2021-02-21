
export const progressToColor = (progress) => {
  if (progress == 0) {
    return "bg-gray-200";
  }
  if (progress < 40) {
    return "bg-yellow-200";
  }
  if (progress < 100) {
    return "bg-yellow-400";
  }
  return "bg-green-300";
};
