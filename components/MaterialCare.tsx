type MaterialCareProps = {
  material: string;
  care: string[];
};

export function MaterialCare({ material, care }: MaterialCareProps) {
  return (
    <details className="group border-t border-border py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
        Material and care
        <span
          aria-hidden
          className="text-foreground/50 transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-3 flex flex-col gap-2 text-sm text-foreground/70">
        <p>{material}</p>
        <ul className="list-inside list-disc">
          {care.map((instruction) => (
            <li key={instruction}>{instruction}</li>
          ))}
        </ul>
      </div>
    </details>
  );
}
