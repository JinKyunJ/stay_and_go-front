import React, { useEffect, useState } from "react";
import SubHeader from "../components/layout/SubHeader";
import Footer from "../components/layout/MainFooter";
import styled from "styled-components";
import addImg from '../assets/icons/addImg.png';
import Select from 'react-select';
import {Checkbox} from 'antd';

const Container = styled.div`
    width: 100%;
`

const ImageUploadForm = styled.form`
    width: 100%;
    //
    height: 10000px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`
// input element 를 숨기고 label 로 대신 기능을 받음 (id <=> for)
// 파일 선택, 선택된 파일 없음 숨기기 위함
const ImageUploadLabel = styled.label.attrs(props => ({
    style: {
        backgroundImage: props.$isUpload === true ? `url(${props.$newImg})` : `url(${addImg})`,
        backgroundSize: props.$isUpload === true ? "cover" : "auto",
        cursor: props.$isUpload === true ? "none" : "pointer",
    }
}))`
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color:#D9D9D9;
    background-position: center;
    background-repeat: no-repeat;

    position: relative;
`
const MainImageSpan = styled.span.attrs(props => ({
    style: {
        display: props.$isUpload === true ? "none" : "block"
    }
}))`
    position: absolute;
    margin-top: 200px;
    color: #E61E51;
    opacity: 0.6;
    font-size: 22px;
    font-weight: bold;
`
const SubImageUploadLabel = styled.label`
    width: 90%;
    height: 50px;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    background-color: #f87878;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 1s;

    &:hover{
        background-color: #F0586F;
    }

    &:focus {
        outline: none;
    }
`

const ShortInputText = styled.input`
    width: 92%;
    height: 50px;
    border: 1px solid #EBEBEB;
    border-radius: 20px;
    padding-left: 20px;
    font-size: 14px;
    // 텍스트가 input 길이 초과 시 숨기기 / 줄바꿈을 사용 안 함 / ... 표시
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:focus{
        outline: none;
    }
`
const OutlineDiv = styled.div`
    width: 90%;
    margin-top: 10px;
    border-bottom: 2px solid #EBEBEB;
`
const InputDiv = styled.div`
    width: 100%;
    padding-left: 5%;
    display: flex;
    flex-direction: column;
    gap: 12px;
`
const InputTitle = styled.span`
    font-size: 21px;
    font-weight: 500;
`
const InputSubTitle = styled.span`
    font-size: 16px;
    font-weight: 400;
`
// react-select css
const selectCustom = {
    option: (provided, state) => {
        let backgroundColor = 'white';
        let color = '#333';
        if(state.isSelected){
            backgroundColor = '#F0586F';
            color = 'white';
        } else if(state.isFocused){
            backgroundColor = '#F07C8C';
            color = 'white';
        }
    return {
      ...provided,
      backgroundColor,
      color,
      padding: 20,
      border: "none" 
    }},
    control: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: 'none',
      width: "95%",
      fontSize: "14px"
    }),
    menu: (provided) => ({
      ...provided,
      border: "none",
      width: "90%"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333',
    }),
};

// antd 체크박스 그룹 css style 정의
const CategoryCheckbox = styled(Checkbox.Group)`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;

    // 체크박스에 아이콘 붙이기 위한 css
    .ant-checkbox-wrapper {
        display: flex;
        align-items: center;
        text-align: center;
    }
    
    // 체크박스 안 icon css
    .icon {
        width: 20px;
        height: 20px;
        background-size: cover;
        background-position: center;
    }
`
const CategoryCheckboxOption = styled(Checkbox)`
    // 체크'박스' css 
    .ant-checkbox-input:checked + .ant-checkbox-inner {
        background-color: #E61E51;
        border: 1px solid #F0586F;
    }
`
const InputTextArea = styled.textarea`
    width: 95%;
    height: 350px;

`

const SubmitButton = styled.button`
    width: 90%;
    height: 50px;
    border: none;
    border-radius: 15px;
    cursor: pointer;

    background-color: #f87878;
    color: white;
    transition: background-color 1s;

    &:hover{
        background-color: #F0586F;
    }
`

const PostUpload = () => {
    // 등록 데이터 state
    const [data, setData] = useState({
        main_image: "",
        sub_images: [], // [string]
        title: "",
        room_num: 0, // number
        max_adult: 0, // number
        max_child: 0, // number
        max_baby: 0, // number
        price: 0, // number
        main_location: "",
        sub_location: "",
        contents: "",
        category: [], // [string]
        host_intro: ""
    });
    
    // 첨부된 images 이름 state
    const [imageName, setImageName] = useState({
        main_image: "",
        sub_images: ""
    });
    // main_image 가 업로드 된 상태, 라벨에 넣을 배경 이미지 상태, URL 해제
    const [isUpload, setIsUpload] = useState(false);
    const [labelBackground, setLabelBackground] = useState('');
    useEffect(() => {
        return () => {
            if(labelBackground){
                URL.revokeObjectURL(labelBackground);
            }
        };
    }, [labelBackground]);
    
    
    // 방 갯수 state
    // 방 갯수 옵션 상태 정의
    const optionsRoomArr = ["1개", "2개", "3개", "4개", "5개", "6개", "7개", "8개", "9개 이상"];
    const optionsRoom = optionsRoomArr.map((v) => {
        return {value: v, label: v};
    });
    const [optionRoom, setOptionRoom] = useState(optionsRoom[0]);

    // 어른/어린이/아기 state
    // 인원 수 옵션 상태 정의
    const personArr = ["1명", "2명", "4명", "6명", "9명", "12명", "15명", "20명 이상"];
    const childArr = ["1명", "2명", "3명", "4명", "5명(최대)"];
    const optionsPerson = personArr.map((v) => {
        return {value: v, label: v};
    });
    const optionsChild = childArr.map((v) => {
        return {value: v, label: v};
    });
    const optionsBaby = childArr.map((v) => {
        return {value: v, label: v};
    });
    const [optionPerson, setOptionPerson] = useState(optionsPerson[0]);
    const [optionChild, setOptionChild] = useState(optionsChild[0]);
    const [optionBaby, setOptionBaby] = useState(optionsBaby[0]);


    // 메인이미지 file input 변경 시 적용
    const onChangeFiles = (e) => {
        // 모든 파일이 이미지 파일이 아닐 때 오류 반환 및 종료
        if(e.target.files && e.target.files.length > 0){
            const filesNameArray = Array.from(e.target.files);
            const notImages = filesNameArray.filter(
                v => {
                    const extension = v.name.split('.').pop().toLowerCase();
                    return !['jpg', 'png', 'jpeg'].includes(extension);
            });
            if(notImages && notImages.length > 0){
                alert("이미지 파일만(jpg, png, jpeg) 첨부할 수 있습니다.");
                return;
            }
            if(filesNameArray.length > 1){
                alert("메인 이미지는 한 장만 첨부할 수 있습니다!");
                return;
            }
    
            setImageName((current) => {
                const newName = {...current};
                newName.main_image = filesNameArray[0].name;
                return newName;
            });

            // label 배경 입히기 선작업
            setIsUpload(true);
            const labelUrl = URL.createObjectURL(e.target.files[0]);
            setLabelBackground(labelUrl);
            
            setData((current) => {
                const newData = {...current};
                newData.main_image = e.target.files;
                return newData;
            });
        }
        return;
    };
    // 서브이미지 변경 시 적용
    const onChangeSubFiles = (e) => {
        if(e.target.files && e.target.files.length > 0){
            const filesNameArray = Array.from(e.target.files);
            const notImages = filesNameArray.filter(
                v => {
                    const extension = v.name.split('.').pop().toLowerCase();
                    return !['jpg', 'png', 'jpeg'].includes(extension);
            });
            if(notImages && notImages.length > 0){
                alert("이미지 파일만(jpg, png, jpeg) 첨부할 수 있습니다.");
                return;
            }
            if(filesNameArray.length >= 10){
                alert("서브 이미지는 10장 이내로 첨부할 수 있습니다!");
                return;
            }
    
            setImageName((current) => {
                const newName = {...current};
                const subImagesNames = filesNameArray.map(v => v.name);
                newName.sub_images = subImagesNames;
                return newName;
            });
            
            setData((current) => {
                const newData = {...current};
                newData.sub_images = e.target.files;
                return newData;
            });
        }
        return;
    }
    

    // 방 갯수 상태 및 data 상태 변경
    const onChangeSelectRoom = (e) => {
        setOptionRoom(() => {
            return optionsRoom.filter(v => v.value === e.value);
        });
        console.log("Asdf")
        setData((current) => {
            const newData = {...current};
            newData.room_num = Number(e.value[0]);
            return newData;
        });
    };

    // 어른 옵션 상태 및 data 상태 변경
    const onChangeSelectPerson = (e) => {
        setOptionPerson(() => {
            return optionsPerson.filter(v => v.value === e.value);
        });

        setData((current) => {
            const newData = {...current};
            newData.max_adult = Number(e.value.slice(0, e.value.indexOf("명")));
            return newData;
        });
    };
    // 어린이 옵션 상태 및 data 상태 변경
    const onChangeSelectChild = (e) => {
        setOptionChild(() => {
            return optionsChild.filter(v => v.value === e.value);
        });

        setData((current) => {
            const newData = {...current};
            newData.max_child = Number(e.value.slice(0, e.value.indexOf("명")));
            return newData;
        });
    };
    // 유아 옵션 상태 및 data 상태 변경
    const onChangeSelectBaby = (e) => {
        setOptionBaby(() => {
            return optionsBaby.filter(v => v.value === e.value);
        });

        setData((current) => {
            const newData = {...current};
            newData.max_baby = Number(e.value.slice(0, e.value.indexOf("명")));
            return newData;
        });
    }

    
    // 카테고리 상태 값 및 data 상태 변경
    const onChangeCategory = (e) => {
        setData((current) => {
            const newData = {...current};
            newData.category = e;
            return newData;
        });
    };
    // mainCatetory 디렉토리 이미지 가져오기
    const importAllImages = (v) => {
        return v.keys().map((key) => ({
            src: v(key),
            name: key.match(/[^/]+$/)[0], // 파일 이름만 추출
          }));
    };
    const images = importAllImages(require.context('../assets/icons/mainCategory', false, /\.(png|jpe?g)$/));
    // 파일 이름 순으로 정렬
    const sortedImages = images.sort((a, b) => {
        const aNumber = parseInt(a.name.split('_')[0], 10);
        const bNumber = parseInt(b.name.split('_')[0], 10);
        return aNumber - bNumber;
    });
    const notAllSortedImages = sortedImages.slice(1, sortedImages.length);
    const optionValues = ['멋진 수영장', '한적한 시골', '해변 근처', '캠핑장', '한옥', '최고의 전망', '산 근처', '방', '호수 근처'
        ,'통나무집', '캠핑카', '특이한 숙소', '농장', '디자인', '섬', '예술 공간'];
    const optionIcons = notAllSortedImages;
    const optionWithIcon = optionValues.map((v, i) => ({label: v, value: v, icon: optionIcons[i].src}));

    


    // form submit 시 formData 생성해서 formData에 입력 정보를 대입 후 백엔드로 전송 및 응답 요청
    const onSubmitPost = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        

        // 파일들을 'images'라는 필드 이름으로 추가
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
            // formData test 필드에 value 추가
            
        }
        formData.append('test', 'value');
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            
        } catch (e) {
            console.log(e);
        }
        
    }
    // enter 클릭 시에는 폼이 제출되지 않음.
    const onHandleEnter = (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
        }
    }
    console.log()
    console.log(data, imageName)

    return (
        <Container>
            <SubHeader/>
                <ImageUploadForm onSubmit={onSubmitPost} onKeyDown={onHandleEnter}>
                    <ImageUploadLabel htmlFor="inputFileOne" $isUpload={isUpload} $newImg={labelBackground}>
                        <MainImageSpan $isUpload={isUpload}>숙소 대표 이미지를 추가하세요 !</MainImageSpan>
                    </ImageUploadLabel>
                    <input type="file" id="inputFileOne" style={{display:"none"}} onChange={onChangeFiles} />
                    <ShortInputText placeholder="숙소 대표 이미지를 첨부해주세요." value={imageName.main_image} disabled></ShortInputText>
                    <OutlineDiv />
                    <SubImageUploadLabel htmlFor="inputFiles">추가 숙소 이미지 등록</SubImageUploadLabel>
                    <input type="file" id="inputFiles" style={{display:"none"}} multiple onChange={onChangeSubFiles} />
                    <ShortInputText placeholder="추가 숙소 이미지 파일들을 첨부해주세요." value={imageName.sub_images} disabled></ShortInputText>
                    
                    <OutlineDiv />
                    <InputDiv>
                        <InputTitle>숙소 이름</InputTitle>
                        <ShortInputText placeholder="숙소 이름을 작성해주세요."></ShortInputText>
                    </InputDiv>    
                    <OutlineDiv />
                    <InputDiv>
                        <InputTitle>옵션</InputTitle>
                        <InputSubTitle>객실 갯수</InputSubTitle>
                        <Select styles={selectCustom} options={optionsRoom} onChange={onChangeSelectRoom} value={optionRoom} />
                        <InputSubTitle>최대 인원(어른 - 17세 이상)</InputSubTitle>
                        <Select styles={selectCustom} options={optionsPerson} onChange={onChangeSelectPerson} value={optionPerson} />
                        <InputSubTitle>최대 인원(어린이 - 7~16세)</InputSubTitle>
                        <Select styles={selectCustom} options={optionsChild} onChange={onChangeSelectChild} value={optionChild} />
                        <InputSubTitle>최대 인원(유아 - ~ 6세)</InputSubTitle>
                        <Select styles={selectCustom} options={optionsBaby} onChange={onChangeSelectBaby} value={optionBaby} />
                        <InputSubTitle>숙소 카테고리 선택</InputSubTitle>
                        <CategoryCheckbox value={data.category} onChange={onChangeCategory}>
                            {optionWithIcon.map((v, i) => (
                                <CategoryCheckboxOption key={i} value={v.value}>
                                <div className="icon" style={{ backgroundImage: `url(${v.icon})` }} />
                                {v.label}
                                </CategoryCheckboxOption>
                            ))}
                        </CategoryCheckbox>
                    </InputDiv>
                    <OutlineDiv />
                    <InputDiv>
                            <InputTitle>숙소 소개</InputTitle>
                            <InputTextArea></InputTextArea>
                    </InputDiv>

                   
                    <OutlineDiv />
                    <SubmitButton>등록</SubmitButton>
                </ImageUploadForm>
            <Footer/>
        </Container>
    );
};

export default PostUpload;