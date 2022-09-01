import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../App';

interface params {
    user : User,
    setUser : (user : User) => void
}

const Home: React.FC<params> = (params : params) => {
    // console.log('Home Component Called');
    return (
        <>
            <div>
                Hello {params.user.userID}
            </div>
            <div>
              {params.user.userID !== '' &&

              <button onClick={() => params.setUser({userID: '', email: '', password: '', firstname: '', lastname: '', company: '', number: ''})}>Logout</button>}

            </div>
            <div>
              {params.user.userID === '' &&
              <div>
                <Link to='/signup'><button type='button'>Signup</button></Link>
                <Link to='/signin'><button type='button'>Signin</button></Link>
              </div>}
            </div>
        </>
    );
}

export default Home;