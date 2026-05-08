export function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Loading</p>
        <p className="mt-3 text-lg font-medium text-slate-700">{message}</p>
      </div>
    </div>
  )
}
