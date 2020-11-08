import React, { useState } from 'react';
import {
    RiMenuUnfoldFill,
    RiLogoutBoxRLine,
    RiSendPlane2Line,
    RiCloseLine,
    RiFileDownloadLine,
    RiUploadCloud2Line
} from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import { GiFemale, GiMale } from 'react-icons/gi';
import { FcSurvey } from 'react-icons/fc';
import { connect } from 'react-redux';
import moment from 'moment';
import { URL_BASE, URL_AUTH, URL_FILE } from '../config';
import * as actions from '../actions';
import '../styles/Home.css';

function DragAndDrop({uploadRecord}) {
    const [dragging, setDragging] = useState(false);
    const [data, setData] = useState(false);
    const [fileName, setFileName] = useState('');
    const [err, setErr] = useState(false);

    const onDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        const {
            dataTransfer: {files}
        } = e;
        
        const { length } = files;
        const reader = new FileReader();
        if(length === 0) return false;

        const fileTypes = ["image/jpeg", "image/jpg", "image/png"];
        const { size, type } = files[0];
        setData(false);

        if(!fileTypes.includes(type)) {
            setErr("File format must be either png or jpg");
            return false;
        }

        if(size / 1024 / 1024 > 2) {
            setErr("File size exceeded the limit of 2MB");
            return false;
        }
        setErr(false);

        reader.readAsDataURL(files[0]);
        reader.onload = loadEvt => {
            setData(loadEvt.target.result);
            setFileName(files[0].name);
        };
    }
    const onDragStart = e => {
        e.preventDefault();
        e.stopPropagation();
        if(e.dataTransfer.items && e.dataTransfer.items.length > 0)
            setDragging(true);
    }
    const onDragEnd = e => {
        e.preventDefault();
        e.stopPropagation();
        if(dragging)
            setDragging(false);
    }
    const onDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    }
    return (
        <div className='drag-drop'
            onDragEnter={e=>onDragStart(e)}
            onDragLeave={e=>onDragEnd(e)}
            onDrop={e=>onDrop(e)}
            onDragOver={e=>onDragOver(e)}>
            {!data &&
                <div className='dashed'>
                {dragging?
                    <div style={{fontSize: '30px'}}>Drop Here :)</div>:
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#a9a9a9'}}>
                        <RiFileDownloadLine size='40px'/>
                        File drag and drop
                    </div>
                }
                </div>
            }
            {err && <p>{err}</p>}
            {data &&
            <div className='dnd-img'>
                <img style={{borderRadius: 10, marginRight: 15}} src={data} alt='diagnosis' width="80" height="80" />
                <div>
                    {fileName}
                </div>
                <div className='dnd-upload cursor' onClick={()=>uploadRecord(fileName)}>
                    <RiUploadCloud2Line style={{marginRight: 3}} size='20px'/>
                    upload
                </div>
                <RiCloseLine className='dnd-close' size='20px' onClick={()=>{setData(false); setDragging(false); setFileName('')}}/>
            </div>
            }
        </div>
    );
}

function RecordModal({petName, records, closeModal}) {
    const checkBatchim = word => {
        if(typeof word !== 'string') return false;
        var lastLetter = word[word.length - 1];
        var uni = lastLetter.charCodeAt(0);

        if(uni < 44032 || uni > 55203) return false;

        return (uni - 44032) % 28 !== 0;
    }
    return (
        <div className='modal-container'>
            <div className='modal-head'>
                {petName + (checkBatchim(petName) && '이') + "의 지난 진료 기록들"}
            </div>
            <div className='modal-body'>
                {records.map((record, idx) =>
                    <div className='record-img' key={idx}>
                        <div>{moment(record.date).format('YYYY-MM-DD')}</div>
                        <img
                            style={{width: '100%'}}
                            src={URL_BASE + 'uploads/sejin4430@gmail.com/' + record.img}
                            alt='records'
                        />
                    </div>
                )}
            </div>
            <div className='modal-close cursor' onClick={closeModal}>
                닫기
            </div>
        </div>
    );
}

function HomeBase({logout}) {
    const [otp, setOTP] = useState(0);
    const [isContact, setIsContact] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [info, setInfo] = useState({});
    const [showModal, setShowModal] = useState(false);
    const uploadRecord = image => {
        fetch(URL_FILE + 'uploadRecord', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: info.userId,
                petId: info.petId,
                image: image
            })
        })
        .then(response => response.json())
        .then(res => {
            if(res.result) setIsContact(false);
            else setErrMsg('잠시후 다시 시도해주십시오.');
        })
        .catch(e => console.log(e));
    }
    const accessOTP = () => {
        fetch(URL_AUTH + 'otpResponse', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number: otp,
                value: 1
            })
        })
        .then(response => response.json())
        .then(res => {
            if(res.result) {
                setInfo(res.info);
                setIsContact(true);
            } else {
                console.log(res.errorMsg);
                setErrMsg(res.errorMsg);
            }
        })
    }
    return (
        <div className='home-container'>
            <div className='home-header'>
                <div className='cursor'>
                <RiMenuUnfoldFill />
                </div>
                <div className='home-title'>PetBlock</div>
                <div className='cursor' onClick={()=>logout()}>
                    <RiLogoutBoxRLine />
                </div>
            </div>
            {isContact?
            <div className='main-body'>
                {showModal &&
                    <RecordModal
                        petName={info.petName}
                        records={info.records}
                        closeModal={()=>setShowModal(false)}
                    />
                }
                <div className='main-close cursor' onClick={()=>setIsContact(false)}>
                    <RiCloseLine />
                </div>
                <div className='petInfo'>
                    <div className='petHead'>
                        Client Infomation
                    </div>
                    <div className='petRow'>
                        <div className='petCol'>
                            <FaUserCircle style={{marginBottom: 10}} size='50px' color='#708090'/>
                            {info.userName}
                            <div className='type'>
                                고객 이름
                            </div>
                        </div>
                        <div className='petCol'>
                            {info.img !== '' &&
                                <img
                                    style={{borderRadius: 40}}
                                    src={URL_BASE + 'uploads/sejin4430@gmail.com/'+info.img}
                                    width='60px' height='60px' alt={info.petName} />
                            }
                            {info.petName}
                            <div className='type'>
                                펫 이름
                            </div>
                        </div>
                        <div className='petCol'>
                            <div style={{fontSize: 18, marginBottom: 10}}>{info.species}</div>
                        {info.breed !== '' &&
                            <div style={{fontSize: 15}}>
                                {info.breed}
                            </div>
                        }
                            <div className='type'>
                                종류
                            </div>
                        </div>
                        <div className='petCol'>
                            {info.sex? <GiFemale size='30px' color='#C96D6B'/>: <GiMale size='30px' color='#779ECB'/>}
                        {info.neuter &&
                            <div style={{fontSize: 10, color: '#696969', marginTop: 7}}>
                                Got neutered
                            </div>
                        }
                            <div className='type'>
                                성별
                            </div>
                        </div>
                    </div>
                    <div className='petRow'>
                        <div className='petCol'>
                            {info.bloodType === ''? '-': info.bloodType}
                            <div className='type'>
                                혈액형
                            </div>
                        </div>
                        <div className='petCol'>
                            {info.birth.substring(2, 4) + ' . ' + parseInt(info.birth.substring(4, 6)) + ' . ' + parseInt(info.birth.substring(6, 8))}
                            <div className='type'>
                                생일
                            </div>
                        </div>
                        <div className='petCol'>
                            {info.weight === 0? '-': info.weight + 'kg'}
                            <div className='type'>
                                몸무게
                            </div>
                        </div>
                        <div className='petCol'>
                            <FcSurvey className='cursor' size='35px' onClick={()=>setShowModal(true)}/>
                            <div className='type'>
                                진료 기록
                            </div>
                        </div>
                    </div>
                </div>
                <div className='files'>
                    <DragAndDrop uploadRecord={uploadRecord}/>
                </div>
            </div>:
            <div className='home-body'>
                <div className='otp-box'>
                    OTP Number
                    <div className='otp-input'>
                        <input
                            type='number'
                            value={otp > 0? otp: ''}
                            onChange={e=>setOTP(e.target.value)}
                        />
                    </div>
                    {errMsg !== '' &&
                    <div style={{fontSize: 12, color: 'red'}}>{errMsg}</div>
                    }
                    <div className='otp-form'>
                        <div className='cursor' onClick={()=>{accessOTP(); setOTP(0)}}>
                            <RiSendPlane2Line />
                        </div>
                    </div>
                </div>
            </div>
        }
        </div>
    );
}

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(actions.logout())
});

const Home = connect(
    null,
    mapDispatchToProps
)(HomeBase);

export default Home;