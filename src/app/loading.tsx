export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
      <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
        Loading...
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Please wait while we fetch the latest data
      </p>
    </div>
  );
}