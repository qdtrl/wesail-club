import { auth } from "../../services/firebase"

const Club = () => {
    const user = auth.currentUser;
    console.log(user);
    return (
        <div>
            Club
        </div>
    )
}

export default Club
