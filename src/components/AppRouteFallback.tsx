import { LoaderCircle } from "lucide-react";

const AppRouteFallback = () => (
  <main
    className="min-h-[70vh] bg-background px-4 py-16 text-foreground"
    aria-busy="true"
    aria-live="polite"
  >
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <LoaderCircle className="h-7 w-7 animate-spin" aria-hidden="true" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight">Loading PartMatch</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Preparing this page for you…
      </p>
      <div className="mt-8 w-full space-y-3" aria-hidden="true">
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-3/5 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  </main>
);

export default AppRouteFallback;
