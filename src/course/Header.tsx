import Link from "next/link";

export const BASEPATH = "/french/pronunciation";
export function Header() {
  const isApp = false;
  return (
    <header className="md:flex justify-between items-center w-full pt-8 max-w-screen-lg border-b pb-4 border-gray-300">
      <div className="md:flex font-light">
        <Link href="/" className="flex justify-center pl-4 pb-4 md:pb-0">
          <img className="w-28" src={"/logo.svg"} />
        </Link>
        <Link
          href="/app"
          className={`flex justify-center pl-4 ${isApp && "font-semibold"}`}
        >
          Random phrase practice
        </Link>
        <Link
          href="/chamber"
          className={`flex justify-center pl-4 ${isApp && "font-semibold"}`}
        >
          Practice chamber
        </Link>
        <Link
          href="/french/pronunciation/intro"
          className={`flex justify-center pl-4 ${isApp && "font-semibold"}`}
        >
          Prononciation
        </Link>
      </div>

      <div className="flex justify-center pt-4 md:pt-0"></div>
    </header>
  );
}
