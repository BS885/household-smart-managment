import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RegistrationForm from "./RegistrationForm";
import BackgroundAuth from "./BackgroundAuth";


const Registr = () => {
    return (
        <BackgroundAuth
            title="הרשמה למערכת"
            subtitle="ברוך הבאה/ברוך הבא למערכת שלנו! אנא מלא/י את הפרטים שלך כדי להירשם."
            showLogo={true}
            logoIcon={<PersonAddIcon/>}
            maxWidth="sm"
        >
            <RegistrationForm></RegistrationForm>
        </BackgroundAuth>

    )
}

export default Registr