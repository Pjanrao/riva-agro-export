import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 50"
      width="260"
      height="40"
      {...props}
    >
      <g className="font-headline">
        {/* Riva */}
        <text
          x="0"
          y="35"
          className="text-4xl font-bold fill-primary"
        >
          Riva
        </text>

        {/* Agro */}
        <text
          x="90"
          y="35"
          className="text-4xl font-semibold fill-foreground"
        >
          Agro Exports
        </text>

       
      </g>
    </svg>
  );
}
