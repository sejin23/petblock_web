import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { TiSortNumerically, TiLockClosed, TiStar, TiStarOutline } from 'react-icons/ti';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import '../styles/Login.css';

function LoginBase({info, fetchLogin}) {
    const [id, setID] = useState('');
    const [pw, setPW] = useState('');
    const [auto, setAuto] = useState(true);
    const [eye, setEye] = useState(false);

    return (
        <div className='login-container'>
            <div className='login-body'>
                <div className='login-header'>
                    PetBlock
                </div>
                <div>
                    <div className='input'>
                        <TiSortNumerically size='20px' />
                        <input
                            className='input-text'
                            type='number'
                            value={id}
                            onChange={e=>setID(e.target.value)}
                        />
                    {auto?
                        <TiStar size='20px' onClick={()=>setAuto(false)} />:
                        <TiStarOutline size='17px' onClick={()=>setAuto(true)} />
                    }
                    </div>
                    <div className='input'>
                        <TiLockClosed size='20px' />
                        <input
                            className='input-text'
                            type={eye? 'text':'password'}
                            value={pw}
                            onChange={e=>setPW(e.target.value)}
                        />
                    {eye?
                        <IoMdEye size='20px' onClick={()=>setEye(false)} />:
                        <IoMdEyeOff size='20px' onClick={()=>setEye(true)} />
                    }
                    </div>
                </div>
                <button className='button' onClick={()=>fetchLogin(id, pw)}>
                    Login
                </button>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    info: state.user.info
})

const mapDispatchToProps = dispatch => ({
    fetchLogin: (id, pw) => dispatch(actions.fetch_signin(id, pw))
})

const Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginBase);

export default Login;