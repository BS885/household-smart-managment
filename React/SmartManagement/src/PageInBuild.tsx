import { ConstructionOutlined } from '@mui/icons-material';

const PageInBuild = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-8 text-center transform transition-all hover:scale-105">
                
                <div className="flex justify-center items-center mb-4">
                    <ConstructionOutlined 
                        className="text-yellow-500 mr-2" 
                        style={{ fontSize: 40 }}
                    />
                    <h1 className="text-3xl font-bold text-gray-800">
                        הדף בבנייה
                    </h1>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                    העמוד שאליו ניסית להגיע עדיין בתהליך פיתוח. 
                    צוות המומחים שלנו עובד במרץ כדי להביא לך חווית משתמש מושלמת! 
                    😊🛠️
                </p>
                
                <div className="flex justify-center space-x-4">
                    <button 
                        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center"
                        onClick={() => window.history.back()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                        </svg>
                        חזור אחורה
                    </button>
                    <button 
                        className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center"
                        onClick={() => window.location.href = '/'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        דף הבית
                    </button>
                </div>
                
                <div className="mt-8 border-t pt-4 text-sm text-gray-500">
                    <p className="animate-pulse">
                        בקרוב אצלכם! 🚧✨
                        <br />
                        תודה על הסבלנות והבנה
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PageInBuild;