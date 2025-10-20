
import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import SendCode from './Sendcodevalid'
import ValidCode from './ValidCode'
import Recover from './recover-password'
import Home from './UserAccess/Home/Home';
import UserInform from './UserAccess/User-inform/UserInformation'
import Medical from './UserAccess/Medical/Medical'
import Agenda from './UserAccess/Agenda/Agenda'
import Exam from './UserAccess/Exam/Exam'
import Menu from './UserAccess/Menu/Menu';
import MoreOption from "./UserAccess/MoreOption/MoreOption"
import './make-access/Form.css'
function App(){
  return(

      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/SendCode' element={<SendCode />}/>
        <Route path='/ValidCode' element ={<ValidCode />} />
        <Route path='/Recover' element={<Recover />}/>
        <Route path='/Home' element={<Home />}/>
        <Route path='/UserInform' element={<UserInform />}/>
        <Route path='/Medical' element={<Medical />}/>
        <Route path='/Agenda' element={<Agenda />}/>
        <Route path='/Exam' element={<Exam />}/>
        <Route path='/Menu' element={<Menu />} />
        <Route path='/MoreOption' element={<MoreOption />} />
        <Route path='*' element={<h1>Not Found</h1>}/>
      </Routes>
 
  );
  
}

export default App
