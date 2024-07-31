import axios from 'axios';
// mode 값이 추가로 담겨져야 함!!!(1: 메인 이미지, 2: 서브, 3: 둘 다 교체, 0. 교체 안함)
export const myPostEdit = async (formData) => {
    try {
        const res = await axios.put('http://localhost:3001/post/put', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
              },
            withCredentials: true // 쿠키를 포함시키기 위해 필요
        });
        return res;
    } catch (e) {
        alert(e.response?.data?.message);
        console.log(e);
        return;
    }
};