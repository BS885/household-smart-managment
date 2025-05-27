import BackgroundAuth from "./BackgroundAuth"
import Login from "./Login"

const LoginNotInHomePage = () => {
    return (
        <BackgroundAuth
            // title="הרשמה למערכת"
            // subtitle="ברוך הבאה/ברוך הבא למערכת שלנו! אנא מלא/י את הפרטים שלך כדי להירשם."
            // showLogo={true}
            // maxWidth="sm"
        >
            <Login></Login>
        </BackgroundAuth>

    )
}

export default LoginNotInHomePage