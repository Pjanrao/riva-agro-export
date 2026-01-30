import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 50"
      className="w-40 h-auto sm:w-48 md:w-64"
      {...props}
    >
      <g className="font-headline">
        {/* Riva */}
        <text
          x="0"
          y="35"
          className="text-4xl font-extrabold"
          fill="#2F4F2F"
        >
          Riva
        </text>

        {/* Agro Exports */}
        <text
          x="90"
          y="35"
          className="text-4xl font-bold fill-foreground"
        >
          Agro Exports
        </text>
      </g>
    </svg>
  );
}
