const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50" dir="rtl">
      <div className="text-center">
        {/* סמן טעינה מסתובב */}
        <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>

        {/* כותרת */}
        <h2 className="text-xl font-medium text-gray-700 mb-2">טוען נתונים</h2>

        {/* תיאור */}
        <p className="text-gray-500">אנא המתן...</p>
      </div>
    </div>
  );
}
export default LoadingPage;